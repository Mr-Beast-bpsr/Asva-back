import db from "../models";



const feeController = async()=>{
    const check = await db.fees.findAll()
    if(check.length<1){

      await db.fees.create({
        razorPay: 1, buy: 1, sell:1, ipo:1, withdraw: 1
      })
      console.log("Fees Created");
      return 
    }
    console.log("Fees already there");
    return 
}


export default feeController