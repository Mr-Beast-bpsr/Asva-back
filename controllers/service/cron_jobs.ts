import db from "../../models";
const axios = require("axios");

let base_url = process.env.PERFIOS_API_URL_KYC || ''
const perfiosKey = process.env.PERFIOS_AUTH_KEY || process.env.PERFIOS_X_AUTH_KEY || ''

type AadhaarResp = { result?: { validId?: string; isMobileLinked?: string; isVerified?: string } }
type PanResp = { result?: { name?: string } }
type BankResp = { result?: { data?: { source?: Array<{ isValid?: boolean; data?: any }> }, comparisionData?: { inputVsSource?: { flags?: { accountHolderName?: { score?: number; result?: boolean } } } } } }

async function postPerfios(url: string, body: any) {
    const headers: any = { 'content-type': 'application/json' };
    if (perfiosKey) headers['x-auth-key'] = perfiosKey;
    const { data } = await axios.post(url, body, { headers, timeout: 15000 });
    return data;
}

function normalizeName(n: string = '') {
    return (n || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export async function kyc_auto_verification(){
    console.log("KYC Auto Verification Cron Job Started")

    if (!base_url) {
        console.warn("PERFIOS_API_URL_KYC not configured; skipping KYC auto verification");
        return;
    }

    const aadhar_url = base_url + 'v3/aadhaar-mobilelink'
    const pan_url = base_url + 'v2/pan'
    const bank_url = base_url + 'v3/bankacc-verification'

    const pendingKycs = await db.kycs.findAll({ where: { accepted: 0 } });
    console.log(`Found ${pendingKycs.length} pending KYC record(s)`)

    for (const kyc of pendingKycs) {
        const userId = kyc.userId;
        const aadhaar = kyc.id_num;
        const mobile = kyc.number;
        const pan = kyc.pan;
        const kycName = kyc.name;
        const bank = await db.bankdetails.findOne({ where: { userId } });

        let reasons: string[] = [];
        let aadhaarOk = false, panOk = false, bankOk = false;

        try {
            if (!mobile || !aadhaar) {
                reasons.push('Missing Aadhaar or mobile');
            } else {
                const adBody = { mobile, aadhaar, consent: 'Y', clientData: { caseId: String(userId) } };
                const adResp = await postPerfios(aadhar_url, adBody) as AadhaarResp;
                const r = adResp?.result || {};
                aadhaarOk = (r.validId === 'Yes') && (r.isVerified === 'Yes');
                if (!aadhaarOk) reasons.push('Aadhaar-mobile verification failed');
            }
        } catch (e) {
            console.warn('Aadhaar verification error', userId, (e as any)?.message || e);
            reasons.push('Aadhaar-mobile API error');
        }

        try {
            if (!pan) {
                reasons.push('Missing PAN');
            } else {
                const panBody = { consent: 'Y', pan, clientData: { caseId: String(userId) } };
                const panResp = await postPerfios(pan_url, panBody) as PanResp;
                const apiName = normalizeName(panResp?.result?.name || '');
                const inputName = normalizeName(kycName);
                panOk = !!apiName && (apiName === inputName || apiName.includes(inputName) || inputName.includes(apiName));
                if (!panOk) reasons.push('PAN name mismatch');
            }
        } catch (e) {
            console.warn('PAN verification error', userId, (e as any)?.message || e);
            reasons.push('PAN API error');
        }

        try {
            if (!bank || !bank.accountNumber || !bank.ifscCode || !bank.name) {
                reasons.push('Missing bank details');
            } else {
                const nameMatchType = 'Individual';
                const bankBody = {
                    accountNumber: bank.accountNumber,
                    accountHolderName: bank.name,
                    ifsc: bank.ifscCode,
                    consent: 'Y',
                    nameMatchType,
                    useCombinedSolution: 'Y',
                    allowPartialMatch: true,
                    preset: 'G',
                    suppressReorderPenalty: true,
                    clientData: { caseId: String(userId) },
                };
                const bankResp = await postPerfios(bank_url, bankBody) as BankResp;
                const isValid = !!bankResp?.result?.data?.source?.some(s => s?.isValid === true);
                const nameFlag = bankResp?.result?.comparisionData?.inputVsSource?.flags?.accountHolderName;
                const nameScore = nameFlag?.score || 0;
                const nameMatch = nameFlag?.result === true || nameScore >= 0.8;
                bankOk = isValid && nameMatch;
                if (!bankOk) reasons.push('Bank verification failed');
                // Flip bankdetails active on result
                await bank.update({ active: bankOk });
            }
        } catch (e) {
            console.warn('Bank verification error', userId, (e as any)?.message || e);
            reasons.push('Bank API error');
        }

        const overallOk = aadhaarOk && panOk && bankOk;
        const reasonText = overallOk ? '' : reasons.join('; ');
        await kyc.update({ accepted: overallOk ? 1 : 2, reason: reasonText });
        console.log(`KYC ${kyc.id} for user ${userId} => ${overallOk ? 'ACCEPTED' : 'REJECTED'} ${reasonText ? '(' + reasonText + ')' : ''}`)
    }

    console.log("KYC Auto Verification Cron Job Ended") 

}