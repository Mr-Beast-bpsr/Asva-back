import { Response, Request, response } from "express";
import db from "../models";
import commonController from "./common/common.controller";
import { Sequelize, QueryTypes, Op, json, where, DATE } from "sequelize";
import { Encrypt } from "./common/encryptpassword";
const MyQuery = db.sequelize;
const jwt = require("jsonwebtoken");
const csvParser = require('csv-parser');
import emailServices from "../emailServices/emailServices"
require('dotenv').config();
const moment = require('moment');
import adminCodeController from "./service/admin.code.controller";

class cronJobs {

    async checkAllMatchingTrades() {
        try {
            const fee = await getFee();
            if (!fee) throw new Error("Fee not found");

            const { buy: buyFee, sell: sellFee } = fee;

            let foundArr: any[] = [];
            let hasMoreMatches = true;

            const processTrade = async (buyTrades: any, sellTrades: any, tradingQuantity: number, ) => {
                const totalAmount = buyTrades.amount * tradingQuantity;
                const buyAmountFee = (totalAmount * parseFloat(buyFee)) / 100;
                const sellAmountFee = (totalAmount * parseFloat(sellFee)) / 100;

                const calBuyAmtWithFee = totalAmount + buyAmountFee;
                const calSellAmtWithFee = totalAmount - sellAmountFee;

                foundArr.push({
                    buyTrades,
                    sellTrades,
                    tradingQuantity,
                    totalAmount,
                    calBuyAmtWithFee,
                    calSellAmtWithFee
                });

                const checkSellReq = await db.sell_trades.findOne({
                    where: { id: sellTrades.id }
                });

                const checkBuyReq = await db.buy_trades.findOne({
                    where: { id: buyTrades.id }
                });

                if (checkSellReq.quantity === 0) {
                    console.warn("Sell req balance already 0");
                    return;
                }

                if (checkBuyReq.quantity === 0) {
                    console.warn("Buy req balance already 0");
                    return;
                }

                const updateBuyQuantity =
                    Number(tradingQuantity) === Number(buyTrades.quantity)
                        ? 0
                        : checkBuyReq.quantity - tradingQuantity;

                const updateSellQuantity =
                    Number(tradingQuantity) === Number(sellTrades.quantity)
                        ? 0
                        : checkSellReq.quantity - tradingQuantity;

                console.warn(updateBuyQuantity, "updateBuyQuantity");
                console.warn(updateSellQuantity, "updateSellQuantity");

                await Promise.all([
                    db.buy_trades.update({ quantity: updateBuyQuantity }, { where: { id: buyTrades.id } }),
                    db.sell_trades.update({ quantity: updateSellQuantity }, { where: { id: sellTrades.id } }),

                ]);
                const createdId = await db.trades_masters.create({
                    userIdBuyer: buyTrades.userId,
                    userIdSeller: sellTrades.userId,
                    sellId: sellTrades.id,
                    buyId: buyTrades.id,
                    product_id: buyTrades.product_id,
                    quantityBuy: updateBuyQuantity,
                    amountBuy: calBuyAmtWithFee,
                    quantitySell: updateSellQuantity,
                    amountSell: calSellAmtWithFee,
                    active: 0,
                    quantityToTrade: tradingQuantity,
                    totalAmount,
                    sellQuantityAfterSub: updateSellQuantity,
                    action: 0
                })
                const check = await db.products.findOne({
                    where:{
                        id: createdId.product_id
                    }
                })
                if(check && check.isAutoApprove){
                    await adminCodeController.approve_trade_direct({ id: createdId.id })
                }

            };

            while (hasMoreMatches) {
                const [checkSellTrade, checkBuyTrade] = await Promise.all([
                    MyQuery.query(`SELECT * FROM sell_trades WHERE quantity != 0`, { type: QueryTypes.SELECT }),
                    MyQuery.query(`SELECT * FROM buy_trades WHERE quantity != 0`, { type: QueryTypes.SELECT })
                ]);

                hasMoreMatches = false;

                for (const sellTrades of checkSellTrade) {
                    const buyTrades = checkBuyTrade.find(
                        (buyTrade: any) =>
                            buyTrade.product_id === sellTrades.product_id &&
                            Number(buyTrade.amount) === Number(sellTrades.amount)
                    );

                    if (buyTrades) {
                        const buyingQuantity = Number(buyTrades.quantity);
                        const sellingQuantity = Number(sellTrades.quantity);
                        const tradingQuantity = Math.min(buyingQuantity, sellingQuantity);

                        console.log(tradingQuantity, "tradingQuantity");

                        await processTrade(buyTrades, sellTrades, tradingQuantity);

                        // Since a match was found and processed, re-check the trades
                        hasMoreMatches = true;
                        break;
                    }
                }
            }


            console.log(foundArr.length > 0 ? foundArr : "No matching trades found");
        } catch (e: any) {
            console.error(e.message || e);
        }
    }

    async clearIpoAfterFinish() {
        try {
            const checkIpo = await db.products.findAll({ where: { currentQuantity: 0 } });

            for (const product of checkIpo) {
                const checkAllBuyRequest = await db.buys.findAll({
                    where: {
                        product_id: product.id,
                        active: 0
                    }
                });

                if (checkAllBuyRequest.length === 0) continue;

                const productPrice = parseFloat(product.initial_price);

                await Promise.all(checkAllBuyRequest.map(async (buyRequest: any) => {
                    const { fee, approvedAmount, amount, userId, product_id } = buyRequest;

                    if (!fee || !approvedAmount) {
                        console.warn(`Error: Missing fee or approved amount for buy request ID ${buyRequest.id}`);
                        return;
                    }

                    const amountFee = (parseFloat(amount) * parseFloat(fee)) / 100;
                    const newAmount = parseFloat(amount) + amountFee;

                    const wallet = await db.wallets.findOne({ where: { userId } });
                    if (wallet) {
                        await wallet.update({
                            amount: newAmount + parseFloat(wallet.amount),
                            freezeAmount: parseFloat(wallet.freezeAmount) - newAmount
                        });
                    }

                    // const newSupplyCal = parseFloat(amount) / productPrice;
                    // await product.update({
                    //     currentQuantity: parseFloat(product.currentQuantity) + newSupplyCal
                    // });

                    await db.buys.update({
                        active: 2,
                        reason: "IPO over"
                    }, {
                        where: { id: buyRequest.id }
                    });
                    const getUser = await db.users.findOne({
                        where: {
                            id: buyRequest.userId
                        }
                    })
                    const email = await emailServices.ipoReject(product.name)
                    commonController.sendEmail(getUser.email, "ITO Rejection", email)
                }));


            }
        } catch (e) {
            console.warn(e);
        }
    }

    // async checkAllMatchingTrades() {
    //     try {
    //         const checkSellTrade = await MyQuery.query(`SELECT * FROM sell_trades where quantity != 0 `, { type: QueryTypes.SELECT });
    //         const checkBuyTrade = await MyQuery.query(`SELECT * FROM buy_trades where quantity != 0 `, { type: QueryTypes.SELECT });

    //         let foundArr: any[] = []


    //         const fee = await getFee()
    //         if (fee === null) {
    //             throw Error("Fee not found")
    //             return
    //         }

    //         const buyFee = fee.buy
    //         const sellFee = fee.sell


    //         // Iterate over each sell trade and compare with buy trades
    //         for (const sellTrades of checkSellTrade) {
    //             const buyTrades = checkBuyTrade.find((buyTrade: any) =>
    //                 sellTrades.product_id === buyTrade.product_id
    //                 && sellTrades.amount === buyTrade.amount);


    //             if (buyTrades) {
    //                 console.log(buyTrades, "found");
    //                 console.log(sellTrades, "sellTrades");
    //                 const buyingQuantity = parseFloat(buyTrades.quantity);
    //                 const sellingQuantity = parseFloat(sellTrades.quantity);


    //                 const buyAmount = parseFloat(buyTrades.amount) * buyingQuantity
    //                 const sellAmount = parseFloat(sellTrades.amount) * sellingQuantity

    //                 console.log(buyAmount, "buyAmount");
    //                 console.log(sellAmount, "sellAmount");

    //                 // return

    //                 if (buyingQuantity > sellingQuantity) {
    //                     // const minQuantity = Math.min(buyingQuantity, sellingQuantity);
    //                     // const maxQuantity = Math.max(buyingQuantity, sellingQuantity);



    //                     const remainingQuantity = buyingQuantity - sellingQuantity;
    //                     console.log(remainingQuantity, "remaining");

    //                     const totalAmount = buyTrades.amount * sellingQuantity;
    //                     console.log(totalAmount, "Total amount");

    //                     // cal Fees

    //                     const buyAmountFee = (totalAmount * parseFloat(buyFee)) / 100;
    //                     const sellAmountFee = (totalAmount * parseFloat(sellFee)) / 100;

    //                     console.log(buyAmountFee, "buyAmountFee");
    //                     console.log(sellAmountFee, "sellAmountFee");

    //                     const calBuyAmtWithFee = sellAmount + buyAmountFee
    //                     const calSellAmtWithFee = sellAmount - sellAmountFee

    //                     console.log(calBuyAmtWithFee, "calBuyAmtWithFee");
    //                     console.log(calSellAmtWithFee, "calSellAmtWithFee");

    //                     foundArr.push({ buyTrades, sellTrades, sellingQuantity, totalAmount, sellQuantity: remainingQuantity, calBuyAmtWithFee, calSellAmtWithFee });

    //                     console.log(foundArr, "foundArr");

    //                     const check = await db.trades_masters.findOne({
    //                         where: {
    //                             buyId: buyTrades.id,
    //                             sellId: sellTrades.id,
    //                             active: 0
    //                         }
    //                     })
    //                     if (!check) {
    //                         const updateRemainingQuantity = await db.buy_trades.update({
    //                             quantity: remainingQuantity
    //                         }, { where: { id: buyTrades.id } })

    //                         const updateBuyQuantity = await db.sell_trades.update({
    //                             quantity: 0
    //                         }, { where: { id: sellTrades.id } })

    //                         console.log(updateRemainingQuantity, "updateRemainingQuantity");

    //                         await db.trades_masters.create({
    //                             userIdBuyer: buyTrades.userId,
    //                             userIdSeller: sellTrades.userId,
    //                             sellId: sellTrades.id,
    //                             buyId: buyTrades.id,
    //                             product_id: buyTrades.product_id,
    //                             quantityBuy: remainingQuantity,
    //                             amountBuy: calBuyAmtWithFee,
    //                             quantitySell: sellTrades.quantity,
    //                             amountSell: calSellAmtWithFee,
    //                             active: 0,
    //                             quantityToTrade: sellingQuantity,
    //                             totalAmount,
    //                             sellQuantityAfterSub: remainingQuantity,
    //                             action: 0
    //                         })
    //                     }
    //                 } else if (sellingQuantity > buyingQuantity) {

    //                     const remainingQuantity = sellingQuantity - buyingQuantity;
    //                     console.log(remainingQuantity, "remaining");

    //                     const totalAmount = buyTrades.amount * buyingQuantity;
    //                     console.log(totalAmount, "Total amount");

    //                     // cal Fees

    //                     const buyAmountFee = (totalAmount * parseFloat(buyFee)) / 100;
    //                     const sellAmountFee = (totalAmount * parseFloat(sellFee)) / 100;

    //                     console.log(buyAmountFee, "buyAmountFee");
    //                     console.log(sellAmountFee, "sellAmountFee");

    //                     const calBuyAmtWithFee = buyAmount + buyAmountFee
    //                     const calSellAmtWithFee = buyAmount - sellAmountFee

    //                     console.log(calBuyAmtWithFee, "calBuyAmtWithFee");
    //                     console.log(calSellAmtWithFee, "calSellAmtWithFee");

    //                     foundArr.push({ buyTrades, sellTrades, sellingQuantity, totalAmount, sellQuantity: remainingQuantity, calBuyAmtWithFee, calSellAmtWithFee });

    //                     console.log(foundArr, "foundArr");

    //                     const check = await db.trades_masters.findOne({
    //                         where: {
    //                             buyId: buyTrades.id,
    //                             sellId: sellTrades.id,
    //                             active: 0

    //                         }
    //                     })
    //                     if (!check) {
    //                         const updateRemainingQuantity = await db.sell_trades.update({
    //                             quantity: remainingQuantity
    //                         }, { where: { id: sellTrades.id } })

    //                         const updateSellQuantity = await db.buy_trades.update({
    //                             quantity: 0
    //                         }, { where: { id: buyTrades.id } })

    //                         console.log(updateRemainingQuantity, "updateRemainingQuantity");

    //                         await db.trades_masters.create({
    //                             userIdBuyer: buyTrades.userId,
    //                             userIdSeller: sellTrades.userId,
    //                             sellId: sellTrades.id,
    //                             buyId: buyTrades.id,
    //                             product_id: buyTrades.product_id,
    //                             quantityBuy: buyTrades.quantity,
    //                             amountBuy: calBuyAmtWithFee,
    //                             quantitySell: remainingQuantity,
    //                             amountSell: calSellAmtWithFee,
    //                             active: 0,
    //                             quantityToTrade: buyingQuantity,
    //                             totalAmount: totalAmount,
    //                             sellQuantityAfterSub: remainingQuantity,
    //                             action: 0
    //                         })
    //                     }
    //                 } else {
    //                     const sellQuantity = sellingQuantity - sellingQuantity;
    //                     const totalAmount = buyTrades.amount * sellingQuantity;
    //                     // cal Fees

    //                     const buyAmountFee = (totalAmount * parseFloat(buyFee)) / 100;
    //                     const sellAmountFee = (totalAmount * parseFloat(sellFee)) / 100;

    //                     console.log(buyAmountFee, "buyAmountFee");
    //                     console.log(sellAmountFee, "sellAmountFee");

    //                     const calBuyAmtWithFee = buyAmount + buyAmountFee
    //                     const calSellAmtWithFee = sellAmount - sellAmountFee

    //                     console.log(calBuyAmtWithFee, "calBuyAmtWithFee");
    //                     console.log(calSellAmtWithFee, "calSellAmtWithFee");

    //                     foundArr.push({ buyTrades, sellTrades, sellingQuantity, totalAmount, sellQuantity, calBuyAmtWithFee, calSellAmtWithFee });


    //                     foundArr.push({ buyTrades, sellTrades, sellingQuantity, totalAmount, sellQuantity });
    //                     const check = await db.trades_masters.findOne({
    //                         where: {
    //                             buyId: buyTrades.id,
    //                             sellId: sellTrades.id,
    //                             active: 0

    //                         }
    //                     })
    //                     if (!check) {
    //                         const updateRemainingQuantity = await db.sell_trades.update({
    //                             quantity: sellQuantity
    //                         }, { where: { id: sellTrades.id } })

    //                         const updateSellQuantity = await db.buy_trades.update({
    //                             quantity: sellQuantity
    //                         }, { where: { id: buyTrades.id } })

    //                         await db.trades_masters.create({
    //                             userIdBuyer: buyTrades.userId,
    //                             userIdSeller: sellTrades.userId,
    //                             sellId: sellTrades.id,
    //                             buyId: buyTrades.id,
    //                             product_id: buyTrades.product_id,
    //                             quantityBuy: buyTrades.quantity,
    //                             amountBuy: calBuyAmtWithFee,
    //                             quantitySell: sellTrades.quantity,
    //                             amountSell: calSellAmtWithFee,
    //                             active: 0,
    //                             quantityToTrade: sellingQuantity,
    //                             totalAmount: totalAmount,
    //                             sellQuantityAfterSub: sellQuantity, 
    //                             action: 0
    //                         })
    //                     }
    //                 }
    //             }

    //         }

    //         console.log(foundArr ? foundArr : "No matching trade found");
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // async chartFormationDays() {
    //     try {
    //         const date = new Date();
    //         const formattedDate = moment(date).format('YYYY-MM-DD');
    //         console.log(`Formatted Date: ${formattedDate}`); // Output: '2024-09-06'

    //         // Query for the specific date
    //         let getData = await MyQuery.query(`
    //             SELECT MAX(amount) AS amount 
    //             FROM sell_trades 
    //             WHERE active = 1 
    //               AND DATE(updatedAt) = '${formattedDate}'
    //         `, { type: QueryTypes.SELECT });

    //         console.log('Initial getData:', getData);

    //         // If no data is found, query for the most recent date with data
    //         if (getData[0].amount === null) {
    //             getData = await MyQuery.query(`
    //                 SELECT MAX(amount) AS amount
    //                 FROM sell_trades
    //                 WHERE active = 1 
    //                   AND updatedAt < '${formattedDate}'
    //             `, { type: QueryTypes.SELECT });

    //             console.log('Fallback getData:', getData);
    //         }

    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    // async clearIpoAfterFinish() {
    //     try {
    //         const checkIpo = await db.products.findAll()
    //         for (const checkAllIpo of checkIpo) {
    //             const productCurrentQuantity = checkAllIpo.currentQuantity
    //             const productId = checkAllIpo.id
    //             if (productCurrentQuantity == 0) {
    //                 const checkAllBuyRequest = await db.buys.findAll({
    //                     where: {
    //                         product_id: productId,
    //                         active: 0
    //                     }
    //                 })

    //                 if (checkAllBuyRequest.length > 0) {

    //                     for (const get_data of checkAllBuyRequest) { 
    //                         const fee = get_data.fee
    //                         const approvedAmount = get_data.approvedAmount
    //                         if(!fee){
    //                             console.warn("Error in fees");
    //                             break
    //                         }

    //                         if(!approvedAmount){
    //                             console.warn("Error in approved amount");
    //                             break
    //                         }


    //                         const amountFee = (parseFloat(get_data.amount) * parseFloat(get_data.fee)) / 100;
    //                         console.log(amountFee, "amountFee");

    //                         const newAmount = parseFloat(get_data.amount) + amountFee
    //                         console.log(newAmount, "newAmount");
    //                         const get_wallet = await db.wallets.findOne({
    //                             where: {
    //                                 userId: get_data.userId
    //                             }
    //                         })
    //                         get_wallet.update({
    //                             amount: newAmount + parseFloat(get_wallet.amount),
    //                             freezeAmount: parseFloat(get_wallet.freezeAmount) - newAmount
    //                         })

    //                         const check_product = await db.products.findOne({
    //                             where: {
    //                                 id: get_data.product_id
    //                             }
    //                         })

    //                         const newSupplyCal = parseFloat(get_data.amount) / parseFloat(check_product.initial_price)
    //                         const newSupply = parseFloat(check_product.currentQuantity) + newSupplyCal

    //                         // if (check_product) {
    //                         //   const update_supply = check_product.update({
    //                         //     currentQuantity: newSupply
    //                         //   })
    //                         // }

    //                         await db.buys.update({
    //                             active: 2,
    //                             reason: "IPO over"
    //                         }, {
    //                             where: {
    //                                 id: get_data.id
    //                             }
    //                         })
    //                     }

    //                 }

    //             }

    //         }
    //     } catch (e) {
    //         console.warn(e);
    //     }
    // }



}

async function getFee() {
    const getFee = await db.fees.findOne({
        where: {
            id: 1
        }
    })

    return getFee ? getFee : null
}

export default new cronJobs()