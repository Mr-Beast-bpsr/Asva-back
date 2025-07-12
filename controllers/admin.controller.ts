import { Response, Request, NextFunction } from "express";
import db from "../models";
import commonController from "./common/common.controller";
import codeController from "./service/admin.code.controller";
const fs = require("fs");
import { checkAdmin,checkAdminNew } from "../middleware/admin";
// import event from "./service/event";

class userController {

  async createAdmin(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.createAdmin(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async all_buy_requests(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { page, search } = req.body;
    // console.log(checkAdmin(userId,res,next), "checkAdmin(userId)"); 
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      await codeController.all_buy_requests(
        { userId, page, search },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async approve_buy_request(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, amount} = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      if(!amount){
        return commonController.errorMessage("Please enter amount", res)
      }

      if(!id){
        return commonController.errorMessage("Id is missing", res)
      }
      await codeController.approve_buy_request(
        { userId, id, amount },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async reject_buy_request(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, reason } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.reject_buy_request(
        { userId, id, reason },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }


  async add_balance_to_user(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, amount } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.add_balance_to_user(
        { userId, id, amount },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async approve_product(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.approve_product(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_all_kyc(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, page, search } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_all_kyc(
        { userId, id, page, search },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }


  async get_kyc_by_id(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_kyc_by_id(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async approve_kyc(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.approve_kyc(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async reject_kyc(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, reason } = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.reject_kyc(
        { userId, id, reason },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async all_product_admin(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { page, search} = req.body;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.all_product_admin(
        { userId, page,search },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async update_product_admin(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user.id;
    const {
      id,sku_code,
      name,
      description,
      issue_year,
      item_condition,
      category,
      varities,
      city,
      ruler,
      denomination,
      signatory,
      rarity,
      specification,
      metal,
      remarks,
      quantity,
      custom_url,
      video,
      current_price,
      initial_price,
      note,
      sold,
      type_series,
      instock,
      keyword,
      hidden,
      cover_pic, contactNumber, currentQuantity,
      img // Accept the images array from the request body
    } = req.body;

    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      const imageUrls: string[] = [];
      const random_number = commonController.generateOtp();

      // Process the images array
      for (let i = 0; i < img.length; i++) {
        const _image = img[i];
        if (_image) {
          
          const check = isBase64DataURI(_image)

          if (check) {
            const imageFilename = `productimage/image${i + 1}_${userId}_${random_number}.png`;
            const image64Data = _image.replace(/^data:([A-Za-z-+/]+);base64,/, "");
            fs.writeFileSync(imageFilename, image64Data, { encoding: "base64" });
            imageUrls.push(`https://api.asvatok.com/${imageFilename}`);
          } else {
            imageUrls.push(_image)
          }
        } else {
          imageUrls.push(""); // Push an empty string if the image is not present
        }
      }


      let videoUrl = "";
      if (video) {
        const check = isBase64DataURI(video)
        if (check) {
          const videoFilename = `productvideo/video_${userId}_${random_number}.mp4`;
          const videoBase64Data = video.replace(/^data:([A-Za-z-+/]+);base64,/, "");
          fs.writeFileSync(videoFilename, videoBase64Data, { encoding: "base64" });
          videoUrl = `https://api.asvatok.com/${videoFilename}`;
        } else {
          videoUrl = video
        }
      }

      let cover_pic_ = "";
      if (cover_pic) {
        const check = isBase64DataURI(cover_pic)
        if (check) {
          const coverFilename = `productimage/cover_pic_${userId}_${random_number}.png`;
          const coverBase64Data = cover_pic.replace(/^data:([A-Za-z-+/]+);base64,/, "");
          fs.writeFileSync(coverFilename, coverBase64Data, { encoding: "base64" });
          cover_pic_ = `https://api.asvatok.com/${coverFilename}`;
        } else {
          cover_pic_ = cover_pic;
        }
      }

      await codeController.update_product_admin({
        id,userId,
        sku_code,
        name,
        description,
        issue_year,
        item_condition,
        category,
        varities,
        city,
        ruler,
        denomination,
        signatory,
        rarity,
        specification,
        metal,
        remarks,
        quantity,
        custom_url,
        video: videoUrl,
        current_price,
        initial_price,
        note,
        sold,
        type_series,
        instock,
        keyword,
        hidden,
        images: imageUrls, // Use the processed image URLs
        cover_pic: cover_pic_, contactNumber, currentQuantity
      }, res);
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_product_admin_by_id(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_product_admin_by_id(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async update_product_quantity(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, currentQuantity } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.update_product_quantity(
        { userId, id, currentQuantity },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async update_product_price(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, price } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.update_product_price(
        { userId, id, price },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_all_users(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, search, page } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_all_users(
        { userId, id, search, page },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_user_by_id(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_user_by_id(
        { userId, id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  // async approve_sell_trade(req: Request, res: Response, next: NextFunction) {
  //   const userId = (req as any).user?.id;
  //   const { id } = req.body
  //   try {
  //     const isAdmin = await checkAdmin(userId, res)
  //     if (isAdmin) {
  //       return isAdmin
  //     }
  //     await codeController.approve_sell_trade(
  //       { userId, id },
  //       res
  //     );
  //   } catch (e) {
  //     console.warn(e);
  //     commonController.errorMessage(`${e}`, res);
  //   }
  // }

  // async reject_sell_trade(req: Request, res: Response, next: NextFunction) {
  //   const userId = (req as any).user?.id;
  //   const { id } = req.body
  //   try {
  //     const isAdmin = await checkAdmin(userId, res)
  //     if (isAdmin) {
  //       return isAdmin
  //     }
  //     await codeController.reject_sell_trade(
  //       { userId, id },
  //       res
  //     );
  //   } catch (e) {
  //     console.warn(e);
  //     commonController.errorMessage(`${e}`, res);
  //   }
  // }

  async approve_trade(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, userIdBuyer, userIdSeller, sellId, buyId
      , product_id, quantityBuy, amountBuy, quantitySell, amountSell,
      quantityToTrade, totalAmount, sellQuantityAfterSub } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.approve_trade(
        {
          id ,userId, userIdBuyer, userIdSeller, sellId, buyId
          , product_id, quantityBuy, amountBuy, quantitySell, amountSell,
          quantityToTrade, totalAmount, sellQuantityAfterSub
        },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async reject_trade(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, sellId, buyId, } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.reject_trade(
        { id ,sellId, buyId, },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_all_trades(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { page, search } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_all_trades(
        { userId, page, search },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_user_assets(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { page } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_user_assets(
        { userId, page },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_all_transactions(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { page, search } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.get_all_transactions(
        { userId, page, search },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async deductBalance(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { id, amount } = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.deductBalance(
        { userId, id, amount },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async bulk_product_data(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const filePath = (req as any).file.path;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.bulk_product_data(
        { filePath},
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async adminDashboard(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.adminDashboard(
        { userId},
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }
  async updateFees(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {razorPay, buy, sell, ipo, withdraw} = req.body
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.updateFees(
        { userId, razorPay, buy, sell, ipo, withdraw},
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async getAllWithdrawReq(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.getAllWithdrawReq(
        {  userId},
        res
      );
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async approveWithdrawReq(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {id} = req.body
    
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.approveWithdrawReq(
        {  userId,id},
        res
      );
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async rejectWithdrawReq(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {id} = req.body
    
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }
      await codeController.rejectWithdrawReq(
        {  userId,id},
        res
      );
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async totalFreezedAmountIpo(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {id} = req.body
    
    try {

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid request: 'id' is required.",
        });
      }
  
      const isCreater = await checkCreater(userId, id)
      const isAdmin = await checkAdmin(userId, res)
      if (!isAdmin || isCreater) {
        await codeController.totalFreezedAmountIpo(
          {  userId,id},
          res
        );
      }else{
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Admin or Product creater access required',
        });
      }
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async closeIpo(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {id} = req.body
    
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid request: 'id' is required.",
        });
      }
  
      const isCreater = await checkCreater(userId, id)
      const isAdmin = await checkAdminNew(userId, res)
      if (isAdmin || isCreater) {
        await codeController.closeIpo(
          {  userId,id},
          res
        );
      }else{
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Admin or Product creater access required',
        });
      }
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async tradeOpen(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    const {id, amount} = req.body
    
    try {
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid request: 'id' is required.",
        });
      }
  
      const isCreater = await checkCreater(userId, id)
      const isAdmin = await checkAdminNew(userId, res)
      if (isAdmin || isCreater) {
        await codeController.tradeOpen(
          {  userId,id, amount},
          res
        );
      }else{
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: Admin or Product creater access required',
        });
      }
    } catch (e) {
      console.warn(e);
      return commonController.errorMessage(`${e}`, res);
    }
  }

  

  async all_buy_requests_pdf(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { startDate, endDate } = req.body;
    // console.log(checkAdmin(userId,res,next), "checkAdmin(userId)"); 
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      await codeController.all_buy_requests_pdf(
        { userId, startDate, endDate },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async get_all_trades_pdf(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { startDate, endDate } = req.body;
    // console.log(checkAdmin(userId,res,next), "checkAdmin(userId)"); 
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      await codeController.get_all_trades_pdf(
        { userId, startDate, endDate },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async updateProductTradeApproval(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    const { product_id } = req.body;
    // console.log(checkAdmin(userId,res,next), "checkAdmin(userId)"); 
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      await codeController.updateProductTradeApproval(
        { userId, product_id },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async getAutoTradeProductsAdmin(req: Request, res: Response, next: NextFunction) {
    const userId = (req as any).user?.id;
    // console.log(checkAdmin(userId,res,next), "checkAdmin(userId)"); 
    try {
      const isAdmin = await checkAdmin(userId, res)
      if (isAdmin) {
        return isAdmin
      }

      await codeController.getAutoTradeProductsAdmin(
        { userId },
        res
      );
    } catch (e) {
      console.warn(e);
      commonController.errorMessage(`${e}`, res);
    }
  }


  
}



function isBase64DataURI(str:string) {
  const regex = /^data:([A-Za-z-+/]+);base64,/;
  return regex.test(str);
}

async function checkCreater(userId: number, productId: number){
  try {
    const product = await db.products.findOne({
      where: { id: productId },
    });

    // Check if the product exists and if the userId matches the creatorId
    if (product && product.userId === userId) {
      return true;
    }

    return false; // Product doesn't exist or user is not the creator
  } catch (error) {
    console.error("Error in checkCreater:", error);
    return false; // Return false in case of an error
  }
}

export default new userController();
