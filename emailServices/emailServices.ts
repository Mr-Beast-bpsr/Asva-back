

class EmailService {

    async otp(otp: string) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="    width: 32% "
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center"><span style="font-size:24px;    font-size: 30px;
                                                margin-top: 20px;
                                                float: left;
                                                width: 100%;"><strong>Welcome to Asvatok</strong></span></div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center"><span
                                                style="font-size:18px">Your confirmation code is:</span></div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;"><span
                                                style="font-size:24px"><strong>${otp}</strong></span></div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">

                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`
        } catch (e) {
            console.log(e);
        }

    }

    async verificationLink(link: any) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </span>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for signing up!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                                We are excited to have you on board. Click the button below to verify your email address and complete your registration.
                                            </span>
                                            <br><br>
                                            <a href="${link}" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Verify Email
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    async forgetPassword(link: any) {
        try {
            return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <body>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
                <tbody>
                    <tr>
                        <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                            bgcolor="#FFFFFF" width="100%" align="left">
                            <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                                cellspacing="0" width="100%"
                                style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                                <tbody>
                                    <tr>
                                        <td role="module-content">
                                            <p></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                <tbody>
                                    <tr>
                                        <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                            align="center"
                                            style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                                <tbody>
                                                    <tr>
                                                        <td class="m_-7879380101884870350header-image" align="center"
                                                            style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                            <a href=""><img style="width: 32%;"
                                                                    src="https://asvatok.com/img/asvatok-logo.png"
                                                                    alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="table-layout:fixed">
                                <tbody>
                                    <tr>
                                        <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                            valign="top" bgcolor="" role="module-content">
                                            <div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                        <strong>Reset Your Password</strong>
                                                    </span>
                                                </div>
                                                <div></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="table-layout:fixed">
                                <tbody>
                                    <tr>
                                        <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                            valign="top" bgcolor="" role="module-content">
                                            <div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:18px">It seems like you requested a password reset.</span>
                                                </div>
                                                <div style="font-family:inherit;text-align:center"><br></div>
                                                <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                                    <span style="font-size:18px">
                                                        Click the button below to reset your password.
                                                    </span>
                                                    <br><br>
                                                    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                        Reset Password
                                                    </a>
                                                </div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:18px">
                                                        If you did not request a password reset, please ignore this email or contact support.
                                                    </span>
                                                </div>
                                                <div></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                <tbody>
                                    <tr>
                                        <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                            align="left"
                                            style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                            <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                                    style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                                    2024 <a
                                                        style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                        href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                                    All rights are reserved</span></p>
                                            <br>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        
        </html>
        `
        } catch (e) {
            console.log(e);
        }
    }

    async redirectToHome() {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <a  style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for signing up!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                                We are excited to have you on board. Click the button below to start your journey.<br> Thriving Unconventionally
                                            </span>
                                            <br><br>
                                            <a href="https://asvatok.com/auth/signin" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Continue
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>

`
        } catch (e) {
            console.log(e);
        }
    }

    async kycApprovalMail(customerName: string) {
        try {
            return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        
        <body>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
                <tbody>
                    <tr>
                        <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                            bgcolor="#FFFFFF" width="100%" align="left">
                            <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                                cellspacing="0" width="100%"
                                style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                                <tbody>
                                    <tr>
                                        <td role="module-content">
                                            <p></p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                <tbody>
                                    <tr>
                                        <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                            align="center"
                                            style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                            <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                                <tbody>
                                                    <tr>
                                                        <td class="m_-7879380101884870350header-image" align="center"
                                                            style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                            <a href=""><img style="width: 32%;"
                                                                    src="https://asvatok.com/img/asvatok-logo.png"
                                                                    alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="table-layout:fixed">
                                <tbody>
                                    <tr>
                                        <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                            valign="top" bgcolor="" role="module-content">
                                            <div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                        <strong>KYC Status Update</strong>
                                                    </span>
                                                </div>
                                                <div></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="table-layout:fixed">
                                <tbody>
                                    <tr>
                                        <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                            valign="top" bgcolor="" role="module-content">
                                            <div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:18px">Dear ${customerName},</span>
                                                </div>
                                                <div style="font-family:inherit;text-align:center"><br></div>
                                                <div style="font-family:inherit;text-align:center">
                                                    <span style="font-size:18px">
                                                        We are pleased to inform you that your KYC verification has been successfully completed.
                                                    </span>
                                                    <br><br>
                                                    <span style="font-size:18px">
                                                        You can now enjoy uninterrupted access to all our services.
                                                    </span>
                                                    <br><br>
                                                    <span style="font-size:18px">
                                                        If you have any questions, please feel free to contact our support team.
                                                    </span>
                                                    <br><br>
                                                    <span style="font-size:18px">
                                                        Thank you for choosing Asvatok!
                                                    </span>
                                                </div>
                                                <div></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                                <tbody>
                                    <tr>
                                        <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                            align="left"
                                            style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                            <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                                    style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                                    2024 <a
                                                        style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                        href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                                    All rights are reserved</span></p>
                                            <br>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
        
        </html>
        `
        } catch (e) {
            console.log(e);
        }
    }

    async kycRejectedMail(customerName: string) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>KYC Status Update</strong>
                                            </span>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Dear ${customerName},</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">
                                                We are pleased to inform you that your KYC verification has been Rejected.
                                            </span>
                                            <br><br>
                                            <span style="font-size:18px">
                                                If you have any questions, please feel free to contact our support team.
                                            </span>
                                            <br><br>
                                            <span style="font-size:18px">
                                                Thank you for choosing Asvatok!
                                            </span>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    async ipoApprove(productName: string, quantity: number) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
<!--                                             <a  style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </a> -->
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for participating!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                           Your buy request for ${productName} ITO has been approved for ${quantity}. 

                                            </span>
                                            <br>  Any remaining ASVA will be refunded to your wallet.<br>
                                            <a href="https://asvatok.com/auth/signin" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Visit Asvatok
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    async ipoReject(productName: string) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
<!--                                             <a  style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </a> -->
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for participating!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                            We regret to inform you that you have not been allocated for ${productName} ITO. 

                                            </span>
                                            <br> Your ASVA will be refunded to yout wallet, as soon as possible.<br>
                                            <a href="https://asvatok.com/auth/signin" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Visit Asvatok
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    async tradeApprove(productName: string, quantity: number, trade: string) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
<!--                                             <a  style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </a> -->
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for Trading!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                           Your ${trade} trade for ${productName} has been approved. 

                                            </span>
                                            <br> 
                                            <a href="https://asvatok.com/auth/signin" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Visit Asvatok
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    async tradeReject(productName: string, trade: string) {
        try {
            return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center">
        <tbody>
            <tr>
                <td role="modules-container" style="padding:0px 0px 0px 0px;color:#000000;text-align:left"
                    bgcolor="#FFFFFF" width="100%" align="left">
                    <table class="m_-7773505879206249852preheader" role="module" border="0" cellpadding="0"
                        cellspacing="0" width="100%"
                        style="display:none!important;opacity:0;color:transparent;height:0;width:0">
                        <tbody>
                            <tr>
                                <td role="module-content">
                                    <p></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350header"
                                    align="center"
                                    style="border-collapse:collapse;padding-left:24px;padding-right:24px;background:#000080;color:#ffffff;font-family:Georgia,Times New Roman,serif;font-size:48px;font-style:normal;font-weight:normal;line-height:1.2;padding:10px 0px 2px 0px;text-align:center!important;text-decoration:none;text-transform:uppercase">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
                                        <tbody>
                                            <tr>
                                                <td class="m_-7879380101884870350header-image" align="center"
                                                    style="border-collapse:collapse;border:none;height:auto;vertical-align:top;text-align:center">
                                                    <a href=""><img style="width: 32%;"
                                                            src="https://asvatok.com/img/asvatok-logo.png"
                                                            alt="image-2024-04-05-T06-56-25-153-Z" border="0" /></a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="line-height:22px;text-align:inherit; padding-top: 40px;" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
<!--                                             <a  style="font-size:24px;font-size:30px;margin-top:20px;float:left;width:100%;">
                                                <strong>Welcome to Asvatok</strong>
                                            </a> -->
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table role="module" border="0" cellpadding="0" cellspacing="0" width="100%"
                        style="table-layout:fixed">
                        <tbody>
                            <tr>
                                <td style="padding:18px 0px 18px 0px;line-height:22px;text-align:inherit" height="100%"
                                    valign="top" bgcolor="" role="module-content">
                                    <div>
                                        <div style="font-family:inherit;text-align:center">
                                            <span style="font-size:18px">Thank you for participating!</span>
                                        </div>
                                        <div style="font-family:inherit;text-align:center"><br></div>
                                        <div style="font-family:inherit;text-align:center; padding-bottom: 40px;">
                                            <span style="font-size:18px">
                                            We regret to inform you that your ${trade} trade has rejected for ${productName}. 

                                            </span>
                                            <br> 
                                            <a href="https://asvatok.com/auth/signin" style="display:inline-block;padding:10px 20px;background:#000080;color:#ffffff;text-decoration:none;border-radius:5px;font-size:18px;">
                                                Visit Asvatok
                                            </a>
                                        </div>
                                        <div></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-spacing:0">
                        <tbody>
                            <tr>
                                <td class="m_-7879380101884870350container-padding m_-7879380101884870350footer-text"
                                    align="left"
                                    style="border-collapse:collapse;font-family:Helvetica,Arial,sans-serif;padding-left:24px;padding-right:24px;background:#000080;color:#aaaaaa;font-size:12px;line-height:16px">
                                    <p style="text-align:center"><span style="color:#fff">&nbsp;</span><span
                                            style="font-size:12px;font-family:Helvetica,Arial,sans-serif;color:#fff">©
                                            2024 <a
                                                style="font-style:normal;font-weight:normal;text-decoration:underline;text-transform:none;color:#fff"
                                                href="" target="_blank" data-saferedirecturl="">Asvatok</a>
                                            All rights are reserved</span></p>
                                    <br>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
        } catch (e) {
            console.log(e);
        }
    }

    
}


export default new EmailService()