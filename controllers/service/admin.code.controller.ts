import { Response, Request, response } from "express";
import db from "../../models";
import commonController from "../common/common.controller";
import { Sequelize, QueryTypes, Op, json, where, DATE } from "sequelize";
import { Encrypt } from "../common/encryptpassword";
const MyQuery = db.sequelize;
const jwt = require("jsonwebtoken");
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
import { promisify } from 'util';
import emailServices from "../../emailServices/emailServices";
import TradesController from "../TradesController";
import puppeteer from "puppeteer";
import { callContractFunction, callTokenContractFunction, fundBuyerAndBuildTokenTransfer } from "../common/web3.controller";
import { emitKeypressEvents } from "readline";
import { Contract, ethers } from "ethers";

const unlinkAsync = promisify(fs.unlink);

class codeController {

  async createAdmin(payload: any, res: Response) {
    try {
      const { userId, id } = payload
      if (!id) {
        commonController.errorMessage(`Provide id of users`, res);
        return
      }

      await db.users.update({
        admin: 1,
      }, {
        where: {
          id
        }
      })

      const check = await db.users.findOne({
        where: {
          id
        }
      })
      commonController.successMessage(check, `Admin created success`, res);

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async all_buy_requests(payload: any, res: Response) {
    try {
      const { page, search } = payload; // Default values for page and search
      // const limit = 10; // Define a limit for pagination
      // const offset = page * limit;

      // // Base query to count total buy requests with optional search
      // let total_count_query = `
      //   SELECT COUNT(*) as count FROM buys x
      //   LEFT JOIN products p ON p.id = x.product_id
      //   LEFT JOIN users up ON up.id = p.userId
      //   LEFT JOIN users u ON u.id = x.userId
      // `;

      // // Add search condition if search term is provided
      // if (search) {
      //   total_count_query += `
      //     WHERE p.name LIKE :search
      //     OR u.email LIKE :search
      //     OR x.product_id LIKE :search

      //   `;
      // }

      // // Execute count query
      // const total_count_result = await MyQuery.query(total_count_query, {
      //   replacements: { search: `%${search}%` },
      //   type: QueryTypes.SELECT,
      // });

      // const total_count = total_count_result[0].count;
      // const total_pages = Math.ceil(total_count / limit);

      // Base query to fetch buy requests with optional pagination and search
      let fetch_query = `
        SELECT 
          x.id,
          x.product_id,
          x.quantity,
          x.amount,
          p.name as product_name,
          p.initial_price as product_price,
          u.name as BuyerName,
          u.email as buyerEmail,
          u.id as BuyerId,
          up.name as productOwnerName,
          up.email as productOwnerEmail,
          up.id as productOwnerId,
          x.active,
          x.createdAt
        FROM buys x
        LEFT JOIN products p ON p.id = x.product_id
        LEFT JOIN users up ON up.id = p.userId
        LEFT JOIN users u ON u.id = x.userId
      `;

      // Add search condition to fetch query
      if (search) {
        fetch_query += `
          WHERE p.name LIKE :search
          OR u.email LIKE :search
          OR x.product_id LIKE :search

        `;
      }

      // Add limit and offset for pagination
      // fetch_query += ` LIMIT :limit OFFSET :offset`;

      // Execute fetch query with replacements for pagination and search
      const get_buy = await MyQuery.query(fetch_query, {
        replacements: {
          search: `%${search}%`,
          // limit,
          // offset,
        },
        type: QueryTypes.SELECT,
      });

      // Formatting results
      const formattedResults = get_buy.map((result: {
        buyerEmail: any;
        id: any;
        product_id: any;
        quantity: any;
        amount: any;
        product_name: any;
        product_price: any;
        BuyerName: any;
        BuyerId: any;
        productOwnerName: any;
        productOwnerId: any;
        productOwnerEmail: any;
        active: any;
        createdAt: any;
        approvedAmount: any;
      }) => ({
        id: result.id,
        product_id: result.product_id,
        quantity: result.quantity,
        amount: result.amount,
        approvedAmount: result.approvedAmount,
        product_name: result.product_name,
        product_price: result.product_price,
        userFrom: {
          userName: result.BuyerName,
          userId: result.BuyerId,
          email: result.buyerEmail,
        },
        userTo: {
          userName: result.productOwnerName,
          userId: result.productOwnerId,
          email: result.productOwnerEmail,
        },
        active: result.active,
        createdAt: result.createdAt,
      }));

      // Return the formatted results with total pages
      commonController.successMessage({ get_buy: formattedResults, total_pages: 1 }, "All buy requests", res);
    } catch (e: any) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async approve_buy_request(payload: any, res: Response) {
    const { userId, id, amount } = payload;
    try {
      // Validate request
      if (!id) return commonController.errorMessage("Buy request id is required", res);

      // Fetch the buy request data
      const get_data = await db.buys.findOne({ where: { id } });
      if (!get_data) {
        return commonController.errorMessage("Buy request not found or invalid Id", res);
      }

      if (get_data.active === 2) {
        return commonController.errorMessage("Buy request already rejected", res);
      }
      if (get_data.active === 1) {
        return commonController.errorMessage("Buy request already accepted", res);
      }

      // Fetch product and user
      const check_product = await db.products.findOne({ where: { id: get_data.product_id } });
      if (!check_product) {
        return commonController.errorMessage("Product not found", res);
      }

      if (parseFloat(check_product.currentQuantity) <= 0 || check_product.isIpoOver === true) {
        return commonController.errorMessage("IPO ended for this product", res);
      }

      // Ensure expiry not passed (if present)
      if (check_product.ipoExpiryDate) {
        const now = new Date();
        const exp = new Date(check_product.ipoExpiryDate);
        if (exp < now) {
          return commonController.errorMessage("IPO has ended", res);
        }
      }

      // Determine final approved amount
      const requestedAmount = parseFloat(get_data.amount);
      const approvedAmount = amount !== undefined && amount !== null
        ? parseFloat(amount)
        : requestedAmount;
      if (isNaN(approvedAmount) || approvedAmount <= 0) {
        return commonController.errorMessage("Approved amount must be greater than 0", res);
      }
      if (approvedAmount > requestedAmount) {
        return commonController.errorMessage("Approved amount cannot exceed requested amount", res);
      }

      // Compute approved token quantity w.r.t product price (must be whole NFTs)
      const unitPrice = parseFloat(check_product.initial_price);
      const rawQty = approvedAmount / unitPrice;
      const qtyToMint = Math.floor(rawQty); // enforce whole units
      if (qtyToMint <= 0) {
        return commonController.errorMessage("Approved amount is too low for at least 1 whole token", res);
      }
      if (qtyToMint > Math.floor(parseFloat(check_product.currentQuantity))) {
        return commonController.errorMessage("Approved quantity exceeds available IPO quantity", res);
      }

      // Wallets and addresses
      const buyerWallet = await db.wallets.findOne({ where: { userId: get_data.userId } });
      if (!buyerWallet) {
        return commonController.errorMessage("Buyer wallet not found", res);
      }
      const buyerAddress = await db.wallet_addresses.findOne({ where: { userId: get_data.userId } });
      if (!buyerAddress) {
        return commonController.errorMessage("Buyer blockchain address not found", res);
      }

      const productOwnerWallet = await db.wallets.findOne({ where: { userId: check_product.userId } });
      if (!productOwnerWallet) {
        return commonController.errorMessage("Product owner wallet not found", res);
      }

      // Old freeze and new totals
      const feePercent = parseFloat(get_data.fee || '0');
      const oldFee = (requestedAmount * feePercent) / 100;
      const oldTotal = requestedAmount + oldFee; // frozen earlier

  // Clamp approved amount to whole tokens only
  const approvedAmountUsed = qtyToMint * unitPrice;
  const newFee = (approvedAmountUsed * feePercent) / 100;
  const newTotal = approvedAmountUsed + newFee;
      const refund = oldTotal - newTotal; // may be 0 or positive

      // Sanity: enough freeze
      if (parseFloat(buyerWallet.freezeAmount) < oldTotal) {
        return commonController.errorMessage("Insufficient frozen balance to approve this request", res);
      }

      // First, mint tokens on-chain. Only proceed with DB updates if successful.
  const qtyForChainNum = qtyToMint;
  const mintTx = await callContractFunction("mintToken", [buyerAddress.address, get_data.product_id, qtyForChainNum.toString()]);
      if (!mintTx || mintTx.status === 0) {
        return commonController.errorMessage("Blockchain transaction failed while minting tokens", res);
      }

      // Apply all DB changes in a transaction for atomicity
      await db.sequelize.transaction(async (t: any) => {
        // Release full old freeze and add refund to available balance
        await buyerWallet.update({
          amount: parseFloat(buyerWallet.amount) + refund,
          freezeAmount: parseFloat(buyerWallet.freezeAmount) - oldTotal,
        }, { transaction: t });

        // Credit product owner with approved amount (IPO proceeds)
        await productOwnerWallet.update({
          amount: parseFloat(productOwnerWallet.amount) + approvedAmountUsed,
        }, { transaction: t });


        let productOwner =db.wallet_addresses.findOne({
          where:{
            userId:check_product.userId
          }
        })
        await fundBuyerAndBuildTokenTransfer(
           buyerAddress.address,
           approvedAmountUsed.toString(),
           check_product.userId,
           productOwner.address,
        );
        await fundBuyerAndBuildTokenTransfer(
          buyerAddress.address,
          check_product.userId,
          newFee.toString(),
        );
        // Credit admin wallet with fee only (inside same DB txn)
        await adminWallet(newFee, t);

        // Reduce product IPO supply
        await check_product.update({
          currentQuantity: (parseFloat(check_product.currentQuantity) - qtyToMint).toString(),
        }, { transaction: t });

        // Update buy request
        await get_data.update({
          active: 1,
          approvedAmount: approvedAmountUsed,
          quantity: qtyToMint, // store approved whole quantity
          txnHash: mintTx.txHash
        }, { transaction: t });

        // Update user assets
        const findUserAssets = await db.user_assets.findOne({
          where: { userId: get_data.userId, product_id: get_data.product_id },
          transaction: t,
        });
    if (findUserAssets) {
          await findUserAssets.update({
      quantity: parseFloat(findUserAssets.quantity) + qtyToMint,
          }, { transaction: t });
        } else {
          await db.user_assets.create({
            userId: get_data.userId,
            product_id: get_data.product_id,
      quantity: qtyToMint,
            active: 0,
          }, { transaction: t });
        }
      });

      // Email + response
      const getUser = await db.users.findOne({ where: { id: get_data.userId } });
  const email = await emailServices.ipoApprove(check_product.name, qtyToMint);
      if (getUser) {
        commonController.sendEmail(getUser.email, "ITO Approval", email);
      }

      const getRecheckReq = await db.buys.findOne({ where: { id } });
      commonController.successMessage(getRecheckReq, "Buy request approved", res);

      // Post-approval: check if IPO finished and clear remainders
      TradesController.clearIpoAfterFinish();

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
    }
  }

  async reject_buy_request(payload: any, res: Response) {
    const { userId, id, reason } = payload
    try {
      const get_data = await db.buys.findOne({
        where: {
          id
        }
      })

      const getUser = await db.users.findOne({
        where: {
          id: get_data.userId,
        },
      });


      if (get_data) {
        const amountFee = (parseFloat(get_data.amount) * parseFloat(get_data.fee)) / 100;
        console.log(amountFee, "amountFee");
        const newAmount = parseFloat(get_data.amount) + amountFee
        console.log(newAmount, "newAmount");
        const get_wallet = await db.wallets.findOne({
          where: {
            userId: get_data.userId
          }
        })
        get_wallet.update({
          amount: newAmount + parseFloat(get_wallet.amount),
          freezeAmount: parseFloat(get_wallet.freezeAmount) - newAmount

        })

        const check_product = await db.products.findOne({
          where: {
            id: get_data.product_id
          }
        })

        const newSupplyCal = parseFloat(get_data.amount) / parseFloat(check_product.initial_price)
        const newSupply = parseFloat(check_product.currentQuantity) + newSupplyCal

        // if (check_product) {
        //   const update_supply = check_product.update({
        //     currentQuantity: newSupply
        //   })
        // }

        const email = await emailServices.ipoReject(check_product.name)
        commonController.sendEmail(getUser.email, "ITO Rejection", email)

      }
      get_data.update({
        active: 2,
        reason
      })



      commonController.successMessage(get_data, "products Data", res)

    } catch (e) {
      commonController.errorMessage(`${e}`, res)
    }
  }

  async add_balance_to_user(payload: any, res: Response) {
    try {
      const { userId, id, amount } = payload

      let get_wallet_balance = await db.wallets.findOne({
        where: {
          userId: id
        }
      })

let wallet_address = await db.wallet_addresses.findOne({
        where: {
          userId: id
        }
      })
      let amountInWei = ethers.parseUnits(amount.toString(), 18);
let txn = await callTokenContractFunction("mint", [wallet_address.address, amountInWei])

    if(txn.status = 0){
          return commonController.errorMessage("Blockchain Transaction failed", res);
    }

      const updated_balance = parseFloat(get_wallet_balance.amount) + parseFloat(amount)

      console.log(updated_balance, "updated_balance");

      await get_wallet_balance.update({
        amount: updated_balance
      }, {
        where: {
          userId: id
        }
      })

      const create_order = await db.wallets_histories.create({
        userId,
        order_id: null,
        amount,
        receipt: null,
        order_created_at: null,
        history_type: 2,
        action: 0,
        item: "none",
        txnHash: txn?.txHash
      })

      const wallet_balance = await MyQuery.query(`select w.*, u.email from wallets w left join users u on w.userId = u.id where w.userId = ${id}`, { type: QueryTypes.SELECT })
      const newData = wallet_balance[0]
      commonController.successMessage(newData, "Added balance by public", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async approve_product(payload: any, res: Response) {
    try {
      const { userId, id } = payload

      let get_Product = await db.products.findOne({
        where: {
          id
        }
      })

      const calDate = Date.now() + get_Product.ipoExpDays * 24 * 60 * 60 * 1000;
      const ipoExpiryDate = new Date(calDate).toISOString()



      let wallet:any = await db.wallet_addresses.findOne({
        where: {
          userId: get_Product.userId
        }
      }
    )


    let txn = await callContractFunction("createToken", [get_Product.quantity, get_Product.currentQuantity,wallet.address,""])

    if(txn.status = 0){
          return commonController.errorMessage("Blockchain Transaction failed", res);
    }


      const get_buy = await db.products.update({
        hidden: 0, approved: 1, ipoExpiryDate, creationHash: txn.txHash
      }, {
        where: {
          id
        }
      })

      const getData = await db.products.findOne({
        where: {
          id
        }
      })

      const addDummy = await db.sell_trades.create({
        amount: getData.initial_price,
        active: 3,
        product_id: getData.id,
        quantity: 0
      })



       const get_Product_new = await db.products.findOne({
        where: {
          id
        }
      })



      commonController.successMessage(get_Product_new, "approved product", res)

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }


  async get_all_kyc(payload: any, res: Response) {
    try {
      const { userId, id, page, search } = payload; // Default values for page and search
      const limit = 10; // Define a limit for pagination
      const offset = page * limit;

      // Base query to count total KYC records with optional search
      let total_count_query = `
        SELECT COUNT(*) as count 
        FROM kycs k 
        LEFT JOIN users u ON k.userId = u.id
      `;

      // Add search condition if provided
      if (search) {
        total_count_query += `
          WHERE u.email LIKE :search
          or u.name LIKE :search
        `;
      }

      // Execute count query
      const total_count_result = await MyQuery.query(total_count_query, {
        replacements: { search: `%${search}%` },
        type: QueryTypes.SELECT,
      });

      const total_count = total_count_result[0].count;
      const total_pages = Math.ceil(total_count / limit);

      // Base query to fetch KYC records with optional pagination and search
      let fetch_query = `
        SELECT k.*, u.email 
        FROM kycs k 
        LEFT JOIN users u ON k.userId = u.id
      `;

      // Add search condition to fetch query
      if (search) {
        fetch_query += `
          WHERE u.email LIKE :search
          or u.name LIKE :search
        `;
      }

      // Add limit and offset for pagination
      fetch_query += ` LIMIT :limit OFFSET :offset`;

      // Execute fetch query with parameter replacements
      const data = await MyQuery.query(fetch_query, {
        replacements: {
          search: `%${search}%`,
          limit,
          offset,
        },
        type: QueryTypes.SELECT,
      });

      // Return the data with total pages
      commonController.successMessage({ data, total_pages }, "Approved asset", res);
    } catch (e) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async get_kyc_by_id(payload: any, res: Response) {
    try {
      const { userId, id } = payload;

      // Using parameterized query to avoid SQL injection
      const newData = await MyQuery.query(
        `SELECT k.*, u.email 
         FROM kycs k 
         LEFT JOIN users u ON k.userId = u.id 
         WHERE k.id = :id`,
        { replacements: { id }, type: QueryTypes.SELECT }
      );

      // Ensure data exists before proceeding
      if (newData.length > 0) {
        const data = newData[0];
        return commonController.successMessage(data, "approved asset", res);
      } else {
        return commonController.errorMessage("KYC record not found", res);
      }
    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }


  async approve_kyc(payload: any, res: Response) {
    try {
      const { userId, id } = payload

      let data = await db.kycs.findOne({
        where: {
          id
        }
      })
      if (data) {
        data.update({
          accepted: 1
        })
        const getName = await db.users.findOne({
          where: {
            id: data.userId
          }
        })
        const email = await emailServices.kycApprovalMail(getName.name)
        commonController.sendEmail(getName.email, "KYC Status Update", email)
      }
      commonController.successMessage(data, "approved asset", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async reject_kyc(payload: any, res: Response) {
    try {
      const { userId, id, reason } = payload

      let data = await db.kycs.findOne({
        where: {
          id
        }
      })
      if (data) {
        data.update({
          accepted: 2,
          reason
        })

        const getName = await db.users.findOne({
          where: {
            id: data.userId
          }
        })
        const email = await emailServices.kycRejectedMail(getName.name)
        commonController.sendEmail(getName.email, "KYC Status Update", email)
      }
      commonController.successMessage(data, "approved asset", res)

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async all_product_admin(payload: any, res: Response) {
    const { userId, page, search } = payload; // Default values for page and search
    const limit = 10; // Define a limit for pagination
    const offset = page * limit;

    try {
      // Base query to count total products with optional search
      let total_count_query = `
        SELECT COUNT(*) as count 
        FROM products p
        left join 
        users u on u.id = p.userId
        left join 
        categories c on c.id = p.category
      `;

      // Add search condition if provided
      if (search) {
        total_count_query += `
          WHERE p.name LIKE :search OR p.sku_code LIKE :search or u.name LIKE :search or u.email LIKE :search
        `;
      }

      // Execute count query
      const total_count_result = await MyQuery.query(total_count_query, {
        replacements: { search: `%${search}%` },
        type: QueryTypes.SELECT,
      });

      const total_count = total_count_result[0].count;
      const total_pages = Math.ceil(total_count / limit);

      // Base query to fetch product data with optional pagination and search
      let fetch_query = `
        SELECT 
          p.id,
          p.userId,
          p.sku_code,
          p.name,
          p.description,
          p.issue_year,
          p.item_condition,
           u.name  AS user_name,
          u.email  AS user_email,
          c.catName AS category,
          p.varities,
          p.city,
          p.ruler,
          p.denomination,
          p.signatory,
          p.rarity,
          p.specification,
          p.metal,
          p.remarks,
          p.quantity,
          p.images,
          p.custom_url,
          p.video,
          p.current_price,
          p.initial_price,
          p.note,
          p.sold,
          p.type_series,
          p.instock,
          p.keyword,
          p.cover_pic,
          p.hidden,
          p.approved,
          p.createdAt,
          p.updatedAt,
          p.currentQuantity,
          p.ipoQuantity
        FROM products p
        left join 
        users u on u.id = p.userId
        left join 
        categories c on c.id = p.category
      `;

      // Add search condition to fetch query
      if (search) {
        fetch_query += `
          WHERE p.name LIKE :search OR p.sku_code LIKE :search or u.name LIKE :search or u.email LIKE :search
        `;
      }

      // Add limit and offset for pagination
      fetch_query += ` LIMIT :limit OFFSET :offset`;

      // Execute fetch query with parameter replacements
      const get_data = await MyQuery.query(fetch_query, {
        replacements: {
          search: `%${search}%`,
          limit,
          offset,
        },
        type: QueryTypes.SELECT,
      });

      // Return the data with total pages
      commonController.successMessage({ get_data, total_pages }, "All Products Data Admin", res);
    } catch (e) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
    }
  }

  async update_product_admin(payload: any, res: Response) {
    try {
      const { id, userId,
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
        // quantity,
        custom_url,
        video,
        // current_price,
        // initial_price,
        note,
        sold,
        type_series,
        instock,
        keyword, images, cover_pic } = payload

      let proId = 0

      // const getPro = await MyQuery.query(`select id from products order by id desc limit 1`, { type: QueryTypes.SELECT })
      // if (getPro.length > 0) {
      //   proId = getPro[0].id
      // }else{
      //   proId = 1
      // }

      // const get_catname = await db.categories.findOne({
      //   where: {
      //     id: category
      //   }
      // })
      // const catName = (get_catname.catName).replace(" ", "")
      // const auto_sku = `${catName}/${name}/${Number(proId) + 1}`
      const check = await db.products.findOne({
        where: {
          id
        }
      })
      if (check) {
        const add_pro = await check.update({
          userId,
          //  sku_code: auto_sku,
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
          // quantity,
          custom_url,
          video,
          // current_price,
          // initial_price,
          note,
          sold,
          type_series,
          instock,
          keyword,
          // hidden: 0,
          images,
          // approved: 1, 
          cover_pic
        })

      }
      const updated = await db.products.findOne({
        where: {
          id
        }
      })
      commonController.successMessage(updated, "product updated", res)

    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async get_product_admin_by_id(payload: any, res: Response) {
    const { userId, id } = payload
    try {
      const get_data = await MyQuery.query(`select id,
      userId,
      sku_code,
      name,
      description,
      issue_year,
      item_condition, category,
      (select a.catName from categories a where id = category ) as category_name,
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
      images as img,
      custom_url,
      video,
      current_price,
      initial_price,
      note,
      sold,
      type_series,
      instock,
      keyword,
      cover_pic,
      hidden,
      approved,
      createdAt,contactNumber,currentQuantity,ipoQuantity,ipoExpDays,ipoExpiryDate,
      updatedAt from products where id=${id} `, { type: QueryTypes.SELECT })
      commonController.successMessage(get_data, "products Data", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async update_product_quantity(payload: any, res: Response) {
    const { userId, id, currentQuantity } = payload
    try {
      let pro_data = await db.products.findOne({
        where: {
          id
        }
      })
      if (pro_data) {
        pro_data.update({
          currentQuantity
        })
      }

      pro_data = await db.products.findOne({
        where: {
          id
        }
      })

      commonController.successMessage(pro_data, "products Data", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async update_product_price(payload: any, res: Response) {
    const { userId, id, price } = payload
    try {
      let pro_data = await db.products.findOne({
        where: {
          id
        }
      })
      if (pro_data) {
        pro_data.update({
          current_price: price
        })
      }

      pro_data = await db.products.findOne({
        where: {
          id
        }
      })

      commonController.successMessage(pro_data, "products Data", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async getAllActiveArticles(payload: any, res: Response) {
    try {
      const articles = await db.articles.findAll({ where: { active: true } });

      if (articles.length > 0) {
        commonController.successMessage(articles, "All active articles", res);
      } else {
        commonController.errorMessage("No active articles found", res);
      }
    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async get_all_users(payload: any, res: Response) {
    try {
      const { page, search } = payload;
      let data: any = "";

      if (search) {
        data = await MyQuery.query(`
          select u.id, u.email, u.name, u.mobile, u.active, u.createdAt,
          w.amount, w.active as wallet_active
          from users u 
          left join wallets w on u.id = w.userId
          where u.email like :search or u.name like :search
          order by u.id desc`,
          {
            replacements: { search: `%${search}%` },
            type: QueryTypes.SELECT,
          }
        );
      } else {
        data = await MyQuery.query(`
          select u.id, u.email, u.name, u.mobile, u.active, u.createdAt,
          w.amount, w.active as wallet_active
          from users u 
          left join wallets w on u.id = w.userId
          order by u.id desc`,
          { type: QueryTypes.SELECT }
        );
      }

      commonController.successMessage(data, "All users data", res);
    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async get_user_by_id(payload: any, res: Response) {
    try {
      const { id } = payload
      const data = await MyQuery.query(`select u.id, u.email, u.name, u.mobile, u.active,u.createdAt, w.amount, w.active as wallet_active 
from users u 
left join
wallets w on u.id = w.userId
where u.id = ${id}
order by u.id desc`, { type: QueryTypes.SELECT })

      const userData = data[0]

      commonController.successMessage(userData, " users data", res);

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  // async approve_sell_trade(payload: any, res: Response) {
  //   try {
  //     const { id, userIdBuyer } = payload;

  //     // await checkSellTrade.update({ active: 1 });

  //     // Fetch buyer and seller wallets
  //     const buyerWallet = await db.wallets.findOne({
  //       where: { userId: checkBuyTrade.userId },
  //     });

  //     const sellerWallet = await db.wallets.findOne({
  //       where: { userId: checkSellTrade.userId },
  //     });

  //     if (!buyerWallet || !sellerWallet) {
  //       return commonController.errorMessage("Wallets not found", res);
  //     }

  //     // Update buyer's assets
  //     const userProductAsset = await db.user_assets.findOne({
  //       where: {
  //         userId: checkBuyTrade.userId,
  //         product_id: checkBuyTrade.product_id,
  //       },
  //     });

  //     if (userProductAsset) {
  //       await userProductAsset.update({
  //         quantity: parseFloat(userProductAsset.quantity) + quantityToTrade,
  //         latestId: checkBuyTrade.id

  //       });
  //     } else {
  //       await db.user_assets.create({
  //         userId: checkBuyTrade.userId,
  //         product_id: checkBuyTrade.product_id,
  //         quantity: quantityToTrade,
  //         latestId: checkBuyTrade.id

  //       });
  //     }

  //     // Adjust wallet balances (assuming amount is price per unit quantity)
  //     // const totalAmount = checkSellTrade.amount * quantityToTrade;
  //     // await buyerWallet.update({ balance: buyerWallet.balance - totalAmount });
  //     // await sellerWallet.update({ balance: sellerWallet.balance + totalAmount });

  //     // Return success message
  //     commonController.successMessage(checkSellTrade, "Sell trade approved", res);

  //   } catch (e) {
  //     commonController.errorMessage(`${e}`, res);
  //     console.warn(e, "error");
  //   }
  // }

  // async reject_sell_trade(payload: any, res: Response) {
  //   try {
  //     const { id } = payload

  //     const checkSellTrade = await db.sell_trades.findOne({
  //       where: {
  //         id,
  //       }
  //     })

  //     const findUserAssets = await db.user_assets.findOne({
  //       where: {
  //         userId: checkSellTrade.userId,
  //         product_id: checkSellTrade.product_id
  //       }
  //     })

  //     const newQuantity = parseFloat(findUserAssets.quantity) + parseFloat(checkSellTrade.quantity)

  //     findUserAssets.update({
  //       quantity: newQuantity
  //     })

  //     checkSellTrade.update({
  //       active: 2
  //     })

  //     commonController.successMessage(checkSellTrade, "sell trade rejected", res)


  //   } catch (e) {
  //     commonController.errorMessage(`${e}`, res);
  //     console.warn(e, "error");
  //   }
  // }

  async approve_trade(payload: any, res: Response) {
    try {
      const {
        id,
      } = payload;



      const check_master = await db.trades_masters.findOne({
        where: { id },
      });


      if (!check_master) {
        return commonController.errorMessage("Trades not found", res);
      }

      const { userIdBuyer, userIdSeller, sellId, buyId,
        product_id, quantityBuy, amountBuy, quantitySell, amountSell,
        quantityToTrade, totalAmount, sellQuantityAfterSub } = check_master
      // Fetch the product details

      const check_product = await db.products.findOne({
        where: { id: product_id, },
      });

      // Fetch buyer and seller wallets
      const buyerWallet = await db.wallets.findOne({
        where: { userId: userIdBuyer },
      });

      const sellerWallet = await db.wallets.findOne({
        where: { userId: userIdSeller },
      });

      let buyTrade = await db.buy_trades.findOne({
        where: { id: buyId },
      });

      let sellTrade = await db.sell_trades.findOne({
        where: { id: sellId },
      });

      const getBuyer = await db.users.findOne({
        where: {
          id: userIdBuyer
        }
      })

      const getSeller = await db.users.findOne({
        where: {
          id: userIdSeller
        }
      })

      if (!buyerWallet || !sellerWallet) {
        return commonController.errorMessage("Wallets not found", res);
      }

      if (!buyTrade || !sellTrade) {
        return commonController.errorMessage("trades not found", res);
      }

      // Calculate the total amount to be traded if not provided
      const calculatedTotalAmount = amountSell

      // Update the seller's wallet balance
      await sellerWallet.update({ amount: parseFloat(sellerWallet.amount) + parseFloat(calculatedTotalAmount) });

      const calAmountToProduct = parseFloat(totalAmount) / parseFloat(quantityToTrade)

      // Update the product's current price
      await check_product.update({ current_price: calAmountToProduct });

      // Update or create the buyer's asset
      const userProductAsset = await db.user_assets.findOne({
        where: {
          userId: userIdBuyer,
          product_id: product_id,
        },
      });
      
      const previousAllAmountSumBuyArr = await MyQuery.query(
        `SELECT ifnull(sum(amount),0) as amount from buy_trades where userId = ${userIdBuyer} and product_id = ${product_id} and totalQuantity != quantity`, { type: QueryTypes.SELECT }
      );

      const totalTokenArr = await MyQuery.query(
        `SELECT ifnull(sum(totalQuantity),0) as totalQuantity from buy_trades where userId = ${userIdBuyer} and product_id = ${product_id} and totalQuantity != quantity`, { type: QueryTypes.SELECT }
      );

      const sumAllBuy = previousAllAmountSumBuyArr[0].amount
      const totalToken = totalTokenArr[0].totalQuantity

      const avgBuyPrice = sumAllBuy / totalToken

      if (userProductAsset) {
        await userProductAsset.update({
          quantity: parseFloat(userProductAsset.quantity) + parseFloat(quantityToTrade),
          latestId: buyId,
          avgBuy: avgBuyPrice,
        });
      } else {
        await db.user_assets.create({
          userId: userIdBuyer,
          product_id: product_id,
          quantity: quantityBuy,
          latestId: buyId,
          lastSumAmount: sumAllBuy,
          avgBuy: avgBuyPrice,
          buyAmount: buyTrade.amount
        });
      }



      // Update trade statuses based on quantities
       if (buyTrade.quantity == 0 && sellTrade.quantity != 0) {
        await buyTrade.update(
          { active: 1 ,txnStatus: 1}, // Update buy trade as active and processing
        );

      } else if (buyTrade.quantity != 0 && sellTrade.quantity == 0) {
        await sellTrade.update(
          { active: 1 ,txnStatus: 1},
        );

      } else {
        await buyTrade.update(
          { active: 1 ,txnStatus: 1},
        );
        await sellTrade.update(
          { active: 1 ,txnStatus: 1},
        );
      }


      await check_master.update({
        active: 1
      });

      const emailBuy = await emailServices.tradeApprove(check_product.name, buyTrade.total_quantityuantity, "Buy")
      const emailSell = await emailServices.tradeApprove(check_product.name, sellTrade.quantity, "Sell")

      commonController.sendEmail(getBuyer.email, "Trade Approval", emailBuy)
        commonController.sendEmail(getSeller.email, "Trade Approval", emailSell)
      let fromAddress = process.env.adminAddress
        let toAddress = await db.wallet_addresses.findOne({
          where: {
            userId: userIdBuyer
          }
        })
    let txn =  await callContractFunction("safeTransferFrom",[fromAddress,toAddress.address,product_id, quantityToTrade,"0x00"])
     if(txn.status == 0){
        buyTrade.update({ txnStatus: 3 }) // Mark as failed
        sellTrade.update({  txnStatus: 3 }) // Mark as
      }else{
        buyTrade.update({ txnStatus: 2,hash:txn.txHash }) // Mark as successful
        sellTrade.update({  txnStatus: 2 ,hash:txn.txHash}) // Mark as successful
      }
      // Return success message
      // commonController.successMessage({}, "Trade approved", res);

      // Return success message
      commonController.successMessage({}, "Trade approved", res);

    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async approve_trade_direct(payload: any) {
    try {
      const {
        id,
      } = payload;



      const check_master = await db.trades_masters.findOne({
        where: { id },
      });


      if (!check_master) {
        return
        // return commonController.errorMessage("Trades not found", res);
      }

      const { userIdBuyer, userIdSeller, sellId, buyId,
        product_id, quantityBuy, amountBuy, quantitySell, amountSell,
        quantityToTrade, totalAmount, sellQuantityAfterSub } = check_master
      // Fetch the product details

      const check_product = await db.products.findOne({
        where: { id: product_id },
      });

      // Fetch buyer and seller wallets
      const buyerWallet = await db.wallets.findOne({
        where: { userId: userIdBuyer },
      });

      const sellerWallet = await db.wallets.findOne({
        where: { userId: userIdSeller },
      });

      let buyTrade = await db.buy_trades.findOne({
        where: { id: buyId },
      });

      let sellTrade = await db.sell_trades.findOne({
        where: { id: sellId },
      });

      const getBuyer = await db.users.findOne({
        where: {
          id: userIdBuyer
        }
      })

      const getSeller = await db.users.findOne({
        where: {
          id: userIdSeller
        }
      })

      if (!buyerWallet || !sellerWallet) {
        return
        // return commonController.errorMessage("Wallets not found", res);
      }

      if (!buyTrade || !sellTrade) {
        return
        // return commonController.errorMessage("trades not found", res);
      }

      // Calculate the total amount to be traded if not provided
      const calculatedTotalAmount = amountSell

      // Update the seller's wallet balance
      await sellerWallet.update({ amount: parseFloat(sellerWallet.amount) + parseFloat(calculatedTotalAmount) });

      const calAmountToProduct = parseFloat(totalAmount) / parseFloat(quantityToTrade)

      // Update the product's current price
      await check_product.update({ current_price: calAmountToProduct });

      // Update or create the buyer's asset
      const userProductAsset = await db.user_assets.findOne({
        where: {
          userId: userIdBuyer,
          product_id: product_id,
        },
      });

      const previousAllAmountSumBuyArr = await MyQuery.query(
        `SELECT ifnull(sum(amount),0) as amount from buy_trades where userId = ${userIdBuyer} and product_id = ${product_id} and totalQuantity != quantity`, { type: QueryTypes.SELECT }
      );

      const totalTokenArr = await MyQuery.query(
        `SELECT ifnull(sum(totalQuantity),0) as totalQuantity from buy_trades where userId = ${userIdBuyer} and product_id = ${product_id} and totalQuantity != quantity`, { type: QueryTypes.SELECT }
      );

      const sumAllBuy = previousAllAmountSumBuyArr[0].amount
      const totalToken = totalTokenArr[0].totalQuantity

      const avgBuyPrice = sumAllBuy / totalToken

      if (userProductAsset) {
        await userProductAsset.update({
          quantity: parseFloat(userProductAsset.quantity) + parseFloat(quantityToTrade),
          latestId: buyId,
          avgBuy: avgBuyPrice,
        });
      } else {
        await db.user_assets.create({
          userId: userIdBuyer,
          product_id: product_id,
          quantity: quantityBuy,
          latestId: buyId,
          lastSumAmount: sumAllBuy,
          avgBuy: avgBuyPrice,
          buyAmount: buyTrade.amount
        });
      }



      // Update trade statuses based on quantities
      if (buyTrade.quantity == 0 && sellTrade.quantity != 0) {
        await buyTrade.update(
          { active: 1 ,txnStatus: 1}, // Update buy trade as active and processing
        );

      } else if (buyTrade.quantity != 0 && sellTrade.quantity == 0) {
        await sellTrade.update(
          { active: 1 ,txnStatus: 1},
        );

      } else {
        await buyTrade.update(
          { active: 1 ,txnStatus: 1},
        );
        await sellTrade.update(
          { active: 1 ,txnStatus: 1},
        );
      }

      await check_master.update({
        active: 1
      });

      const emailBuy = await emailServices.tradeApprove(check_product.name, buyTrade.total_quantityuantity, "Buy")
      const emailSell = await emailServices.tradeApprove(check_product.name, sellTrade.quantity, "Sell")



      commonController.sendEmail(getBuyer.email, "Trade Approval", emailBuy)
      commonController.sendEmail(getSeller.email, "Trade Approval", emailSell)
      let fromAddress = process.env.adminAddress
      let toAddress = await db.wallet_addresses.findOne({
        where: {
          userId: userIdBuyer
        }
      })
    
     let txn=  await callContractFunction("safeTransferFrom",[fromAddress,toAddress.address,product_id, quantityToTrade,"0x00"])
      if(txn.status == 0){
        buyTrade.update({ txnStatus: 3 }) // Mark as failed
        sellTrade.update({  txnStatus: 3 }) // Mark as
      }else{
        buyTrade.update({ txnStatus: 2,hash:txn.txHash }) // Mark as successful
        sellTrade.update({  txnStatus: 2 ,hash:txn.txHash}) // Mark as successful
      }


    
     // Return success message
      // commonController.successMessage({}, "Trade approved", res);

    } catch (e) {
      // commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async reject_trade(payload: any, res: Response) {
    try {
      const { id } = payload


      const check_master = await db.trades_masters.findOne({
        where: { id },
      });

      if (!check_master) {
        return commonController.errorMessage("Trades not found", res);
      }

      const { userIdBuyer, userIdSeller, sellId, buyId,
        product_id, quantityBuy, amountBuy, quantitySell, amountSell,
        quantityToTrade, totalAmount, sellQuantityAfterSub } = check_master

      let checkBuyTrade = await db.buy_trades.findOne({
        where: {
          id: buyId,
        }
      })

      let checkSellTrade = await db.sell_trades.findOne({
        where: {
          id: sellId,
        }
      })

      // const calBuyAmount = parseFloat(findUserAssetsBuy.amount) + (parseFloat(checkBuyTrade.amount) * parseFloat(check_master.quantityBuy))
      const calSellQuantity = parseFloat(check_master.quantitySell)
      const calBuyQuantity = parseFloat(check_master.quantityBuy)

      await checkBuyTrade.update({
        quantity: parseFloat(checkBuyTrade.quantity) + calBuyQuantity,
        active: 0
      })

      await checkSellTrade.update({
        quantity: parseFloat(checkSellTrade.quantity) + calSellQuantity,
        active: 0
      })

      checkBuyTrade = await db.buy_trades.findOne({
        where: {
          id: buyId,
        }
      })

      checkSellTrade = await db.sell_trades.findOne({
        where: {
          id: sellId,
        }
      })

      await check_master.update({
        active: 2
      })

      const check_product = await db.products.findOne({
        where: {
          id: product_id
        }
      })

      const getBuyer = await db.users.findOne({
        where: {
          id: userIdBuyer
        }
      })

      const getSeller = await db.users.findOne({
        where: {
          id: userIdSeller
        }
      })

      const emailBuy = await emailServices.tradeReject(check_product.name, "Buy")
      const emailSell = await emailServices.tradeReject(check_product.name, "Sell")

      commonController.sendEmail(getBuyer.email, "Trade Rejected", emailBuy)
      commonController.sendEmail(getSeller.email, "Trade Rejected", emailSell)

      commonController.successMessage({ checkBuyTrade, checkSellTrade }, " trade rejected", res)


    } catch (e) {
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  //   async get_all_trades(payload: any, res: Response) {
  //     const { userId, page } = payload
  //     try {

  //       const offset = page * 10
  //       const total_count = await MyQuery.query(`
  //         SELECT (SELECT COUNT(*) FROM buy_trades) + (SELECT COUNT(*) FROM sell_trades) AS totalCount;`, { type: QueryTypes.SELECT });
  //       const new_count = total_count[0].totalCount
  //       const total_pages = Math.ceil(new_count / 10);
  //       let get_data: any[] = []
  //       if (page) {
  //         get_data = await MyQuery.query(`SELECT b.id,
  //           b.userId,
  //           b.product_id,
  //            p.name as product_name,
  //            p.initial_price as product_price,
  //            u.name as userName,
  //             up.name as productOwnerName,
  //             up.id as productOwnerId,
  //           b.quantity,
  //           b.amount,
  //           b.active,
  //           b.createdAt,
  //           '1' AS type
  //      FROM buy_trades b
  //      left join
  //         products p on p.id =b.product_id
  //         left join
  //         users up on up.id =p.userId
  //         left join
  //         users u on u.id =b.userId
  //    UNION
  //    SELECT s.id,
  //           s.userId,
  //           s.product_id,
  //            p.name as product_name,
  //            p.initial_price as product_price,
  //            u.name as userName,
  //             up.name as productOwnerName,
  //             up.id as productOwnerId,
  //           s.quantity,
  //           s.amount,
  //           s.active,
  //           s.createdAt,
  //           '2' AS type
  //      FROM sell_trades s left join
  //         products p on p.id =s.product_id
  //         left join
  //         users up on up.id =p.userId
  //         left join
  //         users u on u.id =s.userId
  //  limit 10 offset ${offset}  
  //     `, { type: QueryTypes.SELECT })
  //       } else {
  //         get_data = await MyQuery.query(`SELECT b.id,
  //           b.userId,
  //           b.product_id,
  //            p.name as product_name,
  //            p.initial_price as product_price,
  //            u.name as userName,
  //             up.name as productOwnerName,
  //             up.id as productOwnerId,
  //           b.quantity,
  //           b.amount,
  //           b.active,
  //           b.createdAt,
  //           '1' AS type
  //      FROM buy_trades b
  //      left join
  //         products p on p.id =b.product_id
  //         left join
  //         users up on up.id =p.userId
  //         left join
  //         users u on u.id =b.userId
  //    UNION
  //    SELECT s.id,
  //           s.userId,
  //           s.product_id,
  //            p.name as product_name,
  //            p.initial_price as product_price,
  //            u.name as userName,
  //             up.name as productOwnerName,
  //             up.id as productOwnerId,
  //           s.quantity,
  //           s.amount,
  //           s.active,
  //           s.createdAt,
  //           '2' AS type
  //      FROM sell_trades s left join
  //         products p on p.id =s.product_id
  //         left join
  //         users up on up.id =p.userId
  //         left join
  //         users u on u.id =s.userId

  //     `, { type: QueryTypes.SELECT })
  //       }


  //       commonController.successMessage({ total_pages, get_data }, "All trades Data", res)
  //     } catch (e) {
  //       commonController.errorMessage(`${e}`, res)

  //     }
  //   }

  async get_all_trades(payload: any, res: Response) {
    const { userId, page, search } = payload; // Default values for page and search
    // const limit = 10; // Define a limit for pagination
    // const offset = page * limit;

    try {
      // Base query to count total trades with optional search filtering
      // let totalQuery = `
      //   SELECT COUNT(*) as totalCount FROM trades_masters tm
      //   LEFT JOIN products p ON p.id = tm.product_id
      //   LEFT JOIN users bu ON bu.id = tm.userIdBuyer
      //   LEFT JOIN users su ON su.id = tm.userIdSeller
      //   LEFT JOIN users pu ON pu.id = p.userId
      // `;

      // if (search) {
      //   totalQuery += `
      //     WHERE tm.product_id LIKE :search
      //     OR bu.email LIKE :search
      //     OR su.email LIKE :search
      //     OR p.name LIKE :search
      //   `;
      // }

      // const total_count_result = await MyQuery.query(totalQuery, {
      //   replacements: { search: `%${search}%` },
      //   type: QueryTypes.SELECT,
      // });

      // const total_count = total_count_result[0].totalCount;
      // const total_pages = Math.ceil(total_count / limit);

      // Base query to fetch trade data with optional search filtering
      let query = `
        SELECT tm.id,
               tm.userIdBuyer,
               tm.userIdSeller,
               tm.sellId,
               tm.buyId,
               pu.name as productOwnerName,
               bu.name as userNameBuyer,
               bu.email as buyerEmail,
               su.email as sellerEmail,
               su.name as userNameSeller,
               p.current_price as product_price,
               p.name as product_name,
               tm.product_id,
               tm.quantityBuy,
               tm.amountBuy,
               tm.quantitySell,
               tm.amountSell,
               tm.active,
               tm.quantityToTrade,
               tm.totalAmount,
               tm.sellQuantityAfterSub,
               tm.createdAt
        FROM trades_masters tm
        LEFT JOIN products p ON p.id = tm.product_id
        LEFT JOIN users bu ON bu.id = tm.userIdBuyer
        LEFT JOIN users su ON su.id = tm.userIdSeller
        LEFT JOIN users pu ON pu.id = p.userId
      `;

      // Append search condition if present
      if (search) {
        query += `
          WHERE tm.product_id LIKE :search
          OR bu.email LIKE :search
          OR su.email LIKE :search
          OR p.name LIKE :search
        `;
      }

      // Add limit and offset for pagination
      // query += ` LIMIT :limit OFFSET :offset;`;

      // Fetch data with parameterized queries to avoid SQL injection
      const get_data = await MyQuery.query(query, {
        replacements: {
          search: `%${search}%`,
          // limit,
          // offset,
        },
        type: QueryTypes.SELECT,
      });

      // Return the data with total pages
      commonController.successMessage( get_data , "All trades data", res);
    } catch (e) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
    }
  }
  async get_user_assets(payload: any, res: Response) {
    const { userId, page } = payload
    try {

      const offset = page * 10
      const total_count = await MyQuery.query(`
      SELECT count(*) as totalCount FROM user_assets ;`, { type: QueryTypes.SELECT });
      const new_count = total_count[0].totalCount
      const total_pages = Math.ceil(new_count / 10);
      let get_data: any[] = []
      if (page) {
        get_data = await MyQuery.query(`SELECT tm.id,
          tm.userId,
          tm.quantity,
          u.email,
          u.name as userName,
          tm.product_id,
     pu.name as productOwnerName,
    p.name as product_name,
    tm.createdAt
FROM user_assets tm
left join
        products p on p.id =tm.product_id
left join
        users pu on pu.id =p.userId
left join
        users u on u.id =tm.userId
limit 10 offset ${offset}  
  `, { type: QueryTypes.SELECT })
      } else {
        get_data = await MyQuery.query(`SELECT tm.id,
          tm.userId,
          tm.quantity,
          tm.product_id,
          u.email,
          u.name as userName,
     pu.name as productOwnerName,
    p.name as product_name,
    tm.createdAt
FROM user_assets tm
left join
        products p on p.id =tm.product_id
left join
        users pu on pu.id =p.userId
left join
        users u on u.id =tm.userId
  `, { type: QueryTypes.SELECT })
      }
      commonController.successMessage({ total_pages, get_data }, "All trades Data", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async get_all_transactions(payload: any, res: Response) {
    const { userId, page, search } = payload
    try {

      const offset = page * 10
      const total_count = await MyQuery.query(`
        SELECT COUNT(*) as totalCount
        FROM (
            SELECT id FROM sell_trades
            UNION ALL
            SELECT id FROM buy_trades
            UNION ALL
            SELECT id FROM wallets_histories
        ) AS combined_result;`,
        { type: QueryTypes.SELECT }
      );
      const new_count = total_count[0].totalCount;
      const total_pages = Math.ceil(new_count / 10);

      let get_data: any[] = []
      if (page) {
        get_data = await MyQuery.query(`
SELECT * FROM (
    SELECT 
        'sell' AS trade_type, 
        st.id, 
        st.userId, 
        st.product_id, 
        p.name AS product_name,
        st.quantity, 
        st.amount, 
        st.active, 
        NULL AS history_type, 
        NULL AS action, 
        NULL AS item, 
        NULL AS order_id, 
        NULL AS receipt, 
        NULL AS order_created_at, 
        st.createdAt, 
        st.updatedAt
    FROM 
        sell_trades st
    LEFT JOIN 
        products p ON p.id = st.product_id

    UNION ALL

    SELECT 
        'buy' AS trade_type, 
        bt.id, 
        bt.userId, 
        bt.product_id, 
        p.name AS product_name,
        bt.quantity, 
        bt.amount, 
        bt.active, 
        NULL AS history_type, 
        NULL AS action, 
        NULL AS item, 
        NULL AS order_id, 
        NULL AS receipt, 
        NULL AS order_created_at, 
        bt.createdAt, 
        bt.updatedAt
    FROM 
        buy_trades bt
    LEFT JOIN 
        products p ON p.id = bt.product_id

    UNION ALL

    SELECT 
        'wallet' AS trade_type, 
        wh.id, 
        wh.userId, 
        NULL AS product_id, 
        NULL AS product_name,
        NULL AS quantity, 
        wh.amount, 
        NULL AS active, 
        wh.history_type, 
        wh.action, 
        wh.item, 
        wh.order_id, 
        wh.receipt, 
        wh.order_created_at, 
        wh.createdAt, 
        wh.updatedAt
    FROM 
        wallets_histories wh
) AS combined_result
ORDER BY createdAt DESC
    limit 10 offset ${offset}  
  `, { type: QueryTypes.SELECT })
      } else {
        get_data = await MyQuery.query(`

SELECT 
    'sell' AS trade_type, 
    st.id, 
    st.userId, 
    st.product_id, 
    p.name AS product_name,
    st.quantity, 
    st.amount, 
    st.active, 
    NULL AS history_type, 
    NULL AS action, 
    NULL AS item, 
    NULL AS order_id, 
    NULL AS receipt, 
    NULL AS order_created_at, 
    st.createdAt, 
    st.updatedAt
FROM 
    sell_trades st
LEFT JOIN 
    products p ON p.id = st.product_id

UNION ALL

SELECT 
    'buy' AS trade_type, 
    bt.id, 
    bt.userId, 
    bt.product_id, 
    p.name AS product_name,
    bt.quantity, 
    bt.amount, 
    bt.active, 
    NULL AS history_type, 
    NULL AS action, 
    NULL AS item, 
    NULL AS order_id, 
    NULL AS receipt, 
    NULL AS order_created_at, 
    bt.createdAt, 
    bt.updatedAt
FROM 
    buy_trades bt
LEFT JOIN 
    products p ON p.id = bt.product_id

UNION ALL

SELECT 
    'wallet' AS trade_type, 
    wh.id, 
    wh.userId, 
    NULL AS product_id, 
    NULL AS product_name,
    NULL AS quantity, 
    wh.amount, 
    NULL AS active, 
    wh.history_type, 
    wh.action, 
    wh.item, 
    wh.order_id, 
    wh.receipt, 
    wh.order_created_at, 
    wh.createdAt, 
    wh.updatedAt
FROM 
    wallets_histories wh;

  `, { type: QueryTypes.SELECT })
      }
      commonController.successMessage({ total_pages, get_data }, "All trades Data", res)
    } catch (e) {
      commonController.errorMessage(`${e}`, res)

    }
  }

  async deductBalance(payload: any, res: Response) {
    const { userId, amount, id } = payload;

    try {
      // Fetch user's wallet data
      const walletData = await db.wallets.findOne({ where: { id } });

      if (!walletData) {
        return commonController.errorMessage("User wallet not found", res);
      }

      const userBalance = parseFloat(walletData.amount);
      console.log(userBalance);

      // Check if the user has sufficient balance
      const deductAmount = parseFloat(amount);
      console.log(deductAmount);

      if (userBalance < deductAmount) {
        return commonController.errorMessage("Entered amount is greater than user's balance", res);
      }

      // Update balance after deduction
      const updatedBalance = userBalance - deductAmount;
      await walletData.update({ amount: updatedBalance });

      const wallet_balance = await MyQuery.query(`select w.*, u.email from wallets w left join users u on w.userId = u.id where w.userId = ${id}`, { type: QueryTypes.SELECT })
      const newData = wallet_balance[0]

      const create_order = await db.wallets_histories.create({
        userId,
        order_id: null,
        amount,
        receipt: null,
        order_created_at: null,
        history_type: 3,
        action: 0,
        item: "none"
      })

      // Return success with updated balance data
      return commonController.successMessage(
        newData,
        "Balance updated successfully",
        res
      );
    } catch (error) {
      // Handle any errors
      return commonController.errorMessage(`${error}`, res);
    }
  }

  async bulk_product_data(payload: any, res: Response) {
    const { filePath } = payload;

    try {
      interface CsvData {
        [key: string]: string;
      }

      const results: CsvData[] = [];

      await new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('data', (data: CsvData) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      if (results.length === 0) {
        throw new Error('CSV file is empty or incorrectly formatted');
      }
      const keys = Object.keys(results[0]).map(key => key.trim());
      const escapedKeys = keys.map(key => `\`${key}\``).join(', ');

      const values = results.map(row => `(${Object.values(row).map(value => MyQuery.escape(value)).join(', ')})`);
      const valuesString = values.join(', ');

      const query = `INSERT INTO products (${escapedKeys}) VALUES ${valuesString}`;

      console.log("Generated SQL Query: ", query);

      await MyQuery.query(query, { type: QueryTypes.INSERT });

      await unlinkAsync(filePath);

      commonController.successMessage({ data: results.length }, "CSV data successfully stored in the database.", res);
    } catch (error) {
      try {
        if (fs.existsSync(filePath)) {
          await unlinkAsync(filePath);
        }
      } catch (unlinkError) {
        console.error('Error cleaning up file:', unlinkError);
      }
      commonController.errorMessage(`${error}`, res);
    }
  }

  async adminDashboard(payload: any, res: Response) {
    const { userId } = payload;
    try {
      const getDate = new Date();

      // Format today's date and next day's date
      const todayDate = `${getDate.getFullYear()}-${String(getDate.getMonth() + 1).padStart(2, '0')}-${String(getDate.getDate()).padStart(2, '0')} 00:00:00`;

      getDate.setDate(getDate.getDate() + 1); // Move to the next day
      const nextDaydate = `${getDate.getFullYear()}-${String(getDate.getMonth() + 1).padStart(2, '0')}-${String(getDate.getDate()).padStart(2, '0')} 00:00:00`;

      // Combine queries where possible
      const results = await MyQuery.query(`
        SELECT 
          (SELECT COUNT(*) FROM users) AS totalUser,
          (SELECT IFNULL(SUM(amount), 0) FROM wallets) AS totalAsva,
          (SELECT COUNT(*) FROM products WHERE currentQuantity != 0) AS totalIpo,
          (SELECT COUNT(*) FROM products WHERE currentQuantity = 0) AS totalNonIpo,
          (SELECT IFNULL(SUM(amount), 0) FROM wallets_histories WHERE action = 1 AND createdAt BETWEEN '${todayDate}' AND '${nextDaydate}') AS dailyAsvaPurchase,
          (SELECT IFNULL(SUM(amount), 0) FROM wallets_histories WHERE action = 1) AS totalAsvaPurchase,
          (SELECT IFNULL(COUNT(*), 0) FROM buy_trades WHERE active = 1 AND createdAt BETWEEN '${todayDate}' AND '${nextDaydate}') 
            + (SELECT IFNULL(COUNT(*), 0) FROM sell_trades WHERE active = 1 AND createdAt BETWEEN '${todayDate}' AND '${nextDaydate}') AS dailyTrade,
          (SELECT COUNT(*) FROM buy_trades WHERE active = 1) 
            + (SELECT COUNT(*) FROM sell_trades WHERE active = 1) AS totalTrade
      `, { type: QueryTypes.SELECT });

      // Destructure results for clarity
      const {
        totalUser, totalAsva, totalIpo, totalNonIpo, dailyAsvaPurchase,
        totalAsvaPurchase, dailyTrade, totalTrade
      } = results[0];

      // Send the response
      commonController.successMessage({
        totalUser, totalAsva, totalIpo, totalNonIpo,
        dailyAsvaPurchase, totalAsvaPurchase, dailyTrade, totalTrade
      }, "Dashboard data", res);

    } catch (e) {
      console.log(e);
      commonController.errorMessage(`${e}`, res);
    }
  }

  async updateFees(payload: any, res: Response) {
    try {
      const { razorPay, buy, sell, ipo, withdraw } = payload;

      // Fetch the existing fees data
      const feesData = await db.fees.findOne({ where: { id: 1 } });
      if (!feesData) {
        return commonController.errorMessage("Fees data not found", res);
      }

      // Update fees with new values or fallback to existing values
      await feesData.update({
        razorPay: razorPay ?? feesData.razorPay,
        buy: buy ?? feesData.buy,
        sell: sell ?? feesData.sell,
        ipo: ipo ?? feesData.ipo,
        withdraw: withdraw ?? feesData.withdraw
      });

      return commonController.successMessage(feesData, "Fees updated successfully", res);
    } catch (e) {
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async getAllWithdrawReq(payload: any, res: Response) {
    try {
      const { userId } = payload

      const checkBank = await db.withdraws.findAll()
      return commonController.successMessage(checkBank, `All withdraw req`, res);

    } catch (e) {
      return commonController.errorMessage(`${e}`, res);

    }
  }

  async approveWithdrawReq(payload: any, res: Response) {
    try {
      const { userId, id } = payload

      const checkBank = await db.withdraws.findOne(
        {
          where: {
            id
          }
        }
      )
      if (!checkBank) {
        return commonController.errorMessage(`Request not found`, res);

      }
      checkBank.update({
        action: 1
      })

      const check = await db.withdraws.findOne(
        {
          where: {
            id
          }
        }
      )

      return commonController.successMessage(check, `withdraw request is approved`, res);

    } catch (e) {
      return commonController.errorMessage(`${e}`, res);

    }
  }

  async rejectWithdrawReq(payload: any, res: Response) {
    try {
      const { userId, id } = payload

      const checkBank = await db.withdraws.findOne(
        {
          where: {
            id
          }
        }
      )
      if (!checkBank) {
        return commonController.errorMessage(`Request not found`, res);

      }
      checkBank.update({
        action: 2
      })
      const check_balance = await db.wallets.findOne({
        where: {
          userId: checkBank.userId
        }
      })

      check_balance.update({
        amount: parseFloat(checkBank.amount) + parseFloat(check_balance.amount),
        freezeAmount: check_balance.freezeAmount - checkBank.freezeAmt
      })

      const check = await db.withdraws.findOne(
        {
          where: {
            id
          }
        }
      )

      return commonController.successMessage(check, `withdraw request is rejected`, res);

    } catch (e) {
      return commonController.errorMessage(`${e}`, res);

    }
  }

  async totalFreezedAmountIpo(payload: any, res: Response) {
    try {
      const { id } = payload;

      // Combined query for aggregated data
      const aggregatedDataQuery = `
        SELECT 
          IFNULL(SUM(CASE WHEN active = 0 THEN amount END), 0) AS freezedAmount,
          COUNT(*) AS allBuyReq,
          COUNT(CASE WHEN active = 0 THEN 1 END) AS activeReqs,
          COUNT(CASE WHEN active = 1 THEN 1 END) AS completedReqs,
          IFNULL(SUM(CASE WHEN active = 1 THEN quantity END), 0) AS totalSoldAssets,
          IFNULL(SUM(CASE WHEN active = 1 THEN approvedAmount END), 0) AS totalSoldAsva,
          IFNULL(SUM(quantity), 0) AS totalAssetsQuantityReq
        FROM buys 
        WHERE product_id = :productId;
      `;

      const [aggregatedData] = await MyQuery.query(aggregatedDataQuery, {
        replacements: { productId: id },
        type: QueryTypes.SELECT,
      });

      // Fetch all transactions
      const allTransactions = await MyQuery.query(
        `SELECT a.*, b.email FROM buys a 
        left join users b on a.userId = b.id
        WHERE product_id = :productId`,
        { replacements: { productId: id }, type: QueryTypes.SELECT }
      );

      // Fetch asset details
      const assetQuery = `
        SELECT 
          id, 
          userId, 
          name, 
          initial_price, 
          current_price, 
          cover_pic, 
          (current_price - initial_price) AS price_change, 
          (SELECT a.name FROM users a WHERE a.id = userId) AS creator, 
          CASE WHEN currentQuantity = 0 THEN true ELSE false END AS ipoOverByQuantity, 
          CASE WHEN isIpoOver = 0 THEN false ELSE true END AS isIpoOver,
          CASE WHEN isTradable = 0 THEN false ELSE true END AS isTradable,
          
          currentQuantity, 
          ipoQuantity, 
          quantity AS totalQuantity,
          isIpoOver, 
          isTradable,
          ipoExpiryDate
        FROM products 
        WHERE id = :productId;
      `;

      const [asset] = await MyQuery.query(assetQuery, {
        replacements: { productId: id },
        type: QueryTypes.SELECT,
      });

      // Prepare the response
      const responseData = {
        freezedAmount: aggregatedData.freezedAmount,
        totalSoldAsva: aggregatedData.totalSoldAsva,
        totalBuyReqs: {
          allBuyReq: aggregatedData.allBuyReq,
          activeReqs: aggregatedData.activeReqs,
          completedReqs: aggregatedData.completedReqs,
        },
        totalSoldAssets: aggregatedData.totalSoldAssets,
        totalAssetsQuantityReq: aggregatedData.totalAssetsQuantityReq,
        all_transactions: allTransactions,
        asset,
      };

      // Send success response
      commonController.successMessage(responseData, "All IPO Data", res);
    } catch (e) {
      // Send error response
      return commonController.errorMessage(`${e}`, res);
    }
  }

  async closeIpo(payload: any, res: Response) {
    try {
      const { userId, id } = payload

      const check = await db.products.findOne({
        where: {
          id
        }
      })

      if (!check) {
        return commonController.errorMessage(`Invalid Products request`, res);
      }

      let wallet = await db.wallets.findOne({
        where: {
          userId: check.userId
        }
      })

      let txn = await callContractFunction("mintToken", [wallet.address,id, check.ipoQuantity])
      if (txn.status== 0) {
        return commonController.errorMessage(`Transaction failed`, res);
      }
      await check.update({
        isIpoOver: 1
      })
      const checkAgain = await db.products.findOne({
        where: {
          id
        }
      })
      commonController.successMessage(checkAgain, "All IPO Data", res)

    } catch (e) {
      return commonController.errorMessage(`${e}`, res);

    }
  }

  async tradeOpen(payload: any, res: Response) {
    try {
      const { userId, id, amount } = payload

      const check = await db.products.findOne({
        where: {
          id
        }
      })


      if (!check) {
        return commonController.errorMessage(`Invalid Products request`, res);
      }

      var dateN = new Date(check?.ipoExpiryDate);

      if (check.isIpoOver == 0 && dateN>new Date()) {
        return commonController.errorMessage(`IPO is not over yet`, res);
      }

      const findOwnerAssets = await db.user_assets.findOne({
        userId,
        product_id: check.id,
      });

      await findOwnerAssets.update({
        quantity: parseFloat(findOwnerAssets.quantity)+parseFloat(check.currentQuantity),
      });
      await check.update({
        isTradable: 1,
        isIpoOver:1,
        currentQuantity:0,
        amount: amount ? amount : check.current_price
      })

     


      const checkAgain = await db.products.findOne({
        where: {
          id
        }
      })
      commonController.successMessage(checkAgain, "Started successfuly", res)

    } catch (e) {
      return commonController.errorMessage(`${e}`, res);

    }
  }

  async all_buy_requests_pdf(payload: any, res: Response) {
    try {

      const { startDate, endDate } = payload

      let fetch_query = `
        SELECT 
          x.id,
          x.product_id,
          x.quantity,
          x.amount,
          p.name as product_name,
          p.initial_price as product_price,
          u.name as BuyerName,
          u.email as buyerEmail,
          u.id as BuyerId,
          up.name as productOwnerName,
          up.email as productOwnerEmail,
          up.id as productOwnerId,
          x.active,
          x.createdAt
        FROM buys x 
        LEFT JOIN products p ON p.id = x.product_id
        LEFT JOIN users up ON up.id = p.userId
        LEFT JOIN users u ON u.id = x.userId
        where x.createdAt BETWEEN "${startDate}" AND "${endDate}"
      `;

     
      // Execute fetch query with replacements for pagination and search
      const get_buy = await MyQuery.query(fetch_query, {
        type: QueryTypes.SELECT,
      });


      if (get_buy.length == 0) {
        return commonController.errorMessage("No Data in this Range", res)
      }


      // Formatting results
      const formattedResults = get_buy.map((result: {
        buyerEmail: any;
        id: any;
        product_id: any;
        quantity: any;
        amount: any;
        product_name: any;
        product_price: any;
        BuyerName: any;
        BuyerId: any;
        productOwnerName: any;
        productOwnerId: any;
        productOwnerEmail: any;
        active: any;
        createdAt: any;
        approvedAmount: any;
      }) => ({
        id: result.id,
        product_id: result.product_id,
        quantity: result.quantity,
        amount: result.amount,
        approvedAmount: result.approvedAmount,
        product_name: result.product_name,
        product_price: result.product_price,
        userFrom: {
          userName: result.BuyerName,
          userId: result.BuyerId,
          email: result.buyerEmail,
        },
        userTo: {
          userName: result.productOwnerName,
          userId: result.productOwnerId,
          email: result.productOwnerEmail,
        },
        active: result.active,
        createdAt: result.createdAt,
      }));


      const mapData = formattedResults.map((item: any) => {
        return `<tr style="
              transition: background-color 0.3s ease;
            " onmouseover="this.style.backgroundColor='#f1f1f1';" onmouseout="this.style.backgroundColor='';">
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
                      ${item.product_name}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              From: 
              ${item.userFrom.userName} </br>
              ${item.userFrom.email}</br>
              To: 
              ${item.userTo.userName}</br>
              ${item.userTo.email}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${formatNumber(Number(item.quantity))}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.product_price}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${formatNumber(Number(item.amount))}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
               ${new Date(item.createdAt).toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.status == 0 ? "Active" : item.status == 1 ? "Accepted" : "Rejected"}
                  </td>

              </tr>`
      })

      const mapDataString = mapData.join("");


      const htmlContent = `
            <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bank Statement</title>
          <style type="text/css">
              @media print {
                  body {
                      background-color: #FFFFFF;
                      background-image: none;
                      color: #000000;

                  }

                  #ad {
                      display: none;
                  }

                  #leftbar {
                      display: none;
                  }

                  #contentarea {
                      width: 100%;
                  }
              }

              @page {
                  margin: 0px 20px;
                  size: letter;
                  /*or width then height 150mm 50mm*/
              }

              .pdf-bg {
                  position: relative;
              }

              .bottom-bg img {
                  width: 100%;
              }

              .set-bg {
                  position: absolute;
                  bottom: -3%;
                  right: -1px;
              }

              .logo-divi {
                  background: #19007c;
              }

              .bottom-bg {
                  position: absolute;
                  top: 0;
                  left: 0;
                  /* width: 5%; */
              }

              .set-bg img {
                  width: 100%;
              }


              .sub-heading .billto {
                  padding: 10px 0;
                  line-height: 28px;
                  font-size: 15px;
                  color: #3d3d3d;
              }
          </style>
      </head>

      <body style="
          font-family: Inter, sans-serif !important;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          ">
          <div style="
              width: 80%;
              margin: 20px auto;
              background: #fff;
              background-size: cover;
              background-position: center;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              position: relative;
            ">
              <div class="pdf-bg" style="text-align: center; margin-bottom: 20px;">
                  <div class="set-bg">
                      <img src="https://i.ibb.co/bjhCQwv/Group-54.png" alt="" />
                  </div>
                  <div class="bottom-bg">
                      <img src="https://i.ibb.co/m9j2rT1/Group-55.png" alt="" />
                  </div>
                  <div class="logo-divi">
                      <img src="https://asvatok.com/img/asvatok-logo.png" alt="Bank Logo" style="max-width: 300px;" />
                  </div>
                  <h1 style="margin: 38px 0px 7px;
              font-size: 35px;
              font-weight: 700;
              color: #ff6533;">
                      Asvatok Prosperity
                  </h1>
                  <h2 style="margin: 0; font-size: 22px; color: #222222; font-weight: 400;">
                      Transaction Statement
                  </h2>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;     box-shadow: 5px 5px 0 #00008042;">
                  <thead>
                      <tr>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade Item
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade </br>
                              Quantity
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Asset Price
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade Amount
                          </th>

                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                             Trade Time
                          </th>
                          <th style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: center;
                          font-size: 7px;
                          background-color: #fe6023;
                          color: #fff;
                        ">
                                 Status
                              </th>
                      </tr>
                  </thead>
                  <tbody>
                      ${mapDataString}
                  </tbody>
              </table>

          </div>
      </body>

      </html>

            `;

      const pdfBuffer = await generatePDF(htmlContent);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition", `attachment; filename="${Date.now()}.pdf"`
      );

      return res.send(pdfBuffer);


    } catch (e: any) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
      console.warn(e, "error");
    }
  }

  async get_all_trades_pdf(payload: any, res: Response) {
    const { startDate, endDate } = payload; // Default values for page and search
    // const limit = 10; // Define a limit for pagination
    // const offset = page * limit;

    try {

      let query = `
        SELECT tm.id,
               tm.userIdBuyer,
               tm.userIdSeller,
               tm.sellId,
               tm.buyId,
               pu.name as productOwnerName,
               bu.name as userNameBuyer,
               bu.email as buyerEmail,
               su.email as sellerEmail,
               su.name as userNameSeller,
               p.current_price as product_price,
               p.name as product_name,
               tm.product_id,
               tm.quantityBuy,
               tm.amountBuy,
               tm.quantitySell,
               tm.amountSell,
               tm.active,
               tm.quantityToTrade,
               tm.totalAmount,
               tm.sellQuantityAfterSub,
               tm.createdAt
        FROM trades_masters tm
        LEFT JOIN products p ON p.id = tm.product_id
        LEFT JOIN users bu ON bu.id = tm.userIdBuyer
        LEFT JOIN users su ON su.id = tm.userIdSeller
        LEFT JOIN users pu ON pu.id = p.userId
        where tm.createdAt BETWEEN "${startDate}" AND "${endDate}"
      `;


      const get_data = await MyQuery.query(query, {
        type: QueryTypes.SELECT,
      });


      const mapData = get_data.map((item: any) => {
        return `<tr style="
              transition: background-color 0.3s ease;
            " onmouseover="this.style.backgroundColor='#f1f1f1';" onmouseout="this.style.backgroundColor='';">
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
                      ${item.product_name}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.userNameBuyer} 
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.userNameSeller}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.quantityToTrade}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.product_price}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
             ${item.totalAmount}
                  </td>
                    
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
             ${item.amountBuy}
                  </td>

                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
             ${formatNumber(Number(item.amountSell))}
                  </td>

              <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${new Date(item.createdAt).toLocaleString('en-GB', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })}
                  </td>
                  <td style="
                border: 1px solid #ddd;
                padding: 8px;
                text-align: center;
                font-size: 7px;
              ">
              ${item.active == 0 ? "Active" : item.active == 1 ? "Accepted" : "Rejected"}
                  </td>

              </tr>`
      })

      const mapDataString = mapData.join("");


      const htmlContent = `
            <!DOCTYPE html>
      <html lang="en">

      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Bank Statement</title>
          <style type="text/css">
              @media print {
                  body {
                      background-color: #FFFFFF;
                      background-image: none;
                      color: #000000;

                  }

                  #ad {
                      display: none;
                  }

                  #leftbar {
                      display: none;
                  }

                  #contentarea {
                      width: 100%;
                  }
              }

              @page {
                  margin: 0px 20px;
                  size: letter;
                  /*or width then height 150mm 50mm*/
              }

              .pdf-bg {
                  position: relative;
              }

              .bottom-bg img {
                  width: 100%;
              }

              .set-bg {
                  position: absolute;
                  bottom: -3%;
                  right: -1px;
              }

              .logo-divi {
                  background: #19007c;
              }

              .bottom-bg {
                  position: absolute;
                  top: 0;
                  left: 0;
                  /* width: 5%; */
              }

              .set-bg img {
                  width: 100%;
              }


              .sub-heading .billto {
                  padding: 10px 0;
                  line-height: 28px;
                  font-size: 15px;
                  color: #3d3d3d;
              }
          </style>
      </head>

      <body style="
          font-family: Inter, sans-serif !important;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          ">
          <div style="
              width: 80%;
              margin: 20px auto;
              background: #fff;
              background-size: cover;
              background-position: center;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
              position: relative;
            ">
              <div class="pdf-bg" style="text-align: center; margin-bottom: 20px;">
                  <div class="set-bg">
                      <img src="https://i.ibb.co/bjhCQwv/Group-54.png" alt="" />
                  </div>
                  <div class="bottom-bg">
                      <img src="https://i.ibb.co/m9j2rT1/Group-55.png" alt="" />
                  </div>
                  <div class="logo-divi">
                      <img src="https://asvatok.com/img/asvatok-logo.png" alt="Bank Logo" style="max-width: 300px;" />
                  </div>
                  <h1 style="margin: 38px 0px 7px;
              font-size: 35px;
              font-weight: 700;
              color: #ff6533;">
                      Asvatok Prosperity
                  </h1>
                  <h2 style="margin: 0; font-size: 22px; color: #222222; font-weight: 400;">
                      Transaction Statement
                  </h2>
              </div>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0;     box-shadow: 5px 5px 0 #00008042;">
                  <thead>
                      <tr>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade Item
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Buyer
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                             Seller
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Trade </br> 
                              Quantity
                          </th>
                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                              Asset Price
                          </th>

                          <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                            Trade price
                          </th>
                          <th style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: center;
                          font-size: 7px;
                          background-color: #fe6023;
                          color: #fff;
                        ">
                                 Buyer price
                              </th>
                              
                          <th style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: center;
                          font-size: 7px;
                          background-color: #fe6023;
                          color: #fff;
                        ">
                                 Seller Receive
                              </th>
                              <th style="
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                      font-size: 7px;
                      background-color: #fe6023;
                      color: #fff;
                    ">
                            Trade Time
                          </th>
                         
                              
                          <th style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          text-align: center;
                          font-size: 7px;
                          background-color: #fe6023;
                          color: #fff;
                        ">
                                 Status
                              </th>
                      </tr>
                  </thead>
                  <tbody>
                      ${mapDataString}
                  </tbody>
              </table>

          </div>
      </body>

      </html>

            `;


      const pdfBuffer = await generatePDF(htmlContent);


      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${Date.now()}.pdf"`
      );

      return res.send(pdfBuffer);

    } catch (e) {
      // Handle any errors
      commonController.errorMessage(`${e}`, res);
    }
  }

async updateProductTradeApproval(payload:any, res:Response){
  const {userId, product_id} = payload
  try {
      const getProduct = await db.products.findOne({
        where:{
          id:product_id
        }
      })
      if(getProduct.isAutoApprove==1){
        getProduct.update({
          isAutoApprove: 0
        })
      }else{
        getProduct.update({
          isAutoApprove: 1
        })
      }
      const response = await db.products.findOne({
        where:{
          id:product_id
        }
      })
      commonController.successMessage(response, "Auto approve apdated", res)

  } catch (e) {
    commonController.errorMessage(`${e}`, res);
    
  }
}

async getAutoTradeProductsAdmin(payload:any, res:Response){
  const {userId} = payload
  try {
      let fetch_query = `
      SELECT 
        p.id,
        p.userId,
        p.name,
         u.name  AS user_name,
        u.email  AS user_email,
        p.isAutoApprove
      FROM products p
      left join 
      users u on u.id = p.userId
    `;
      const response = await MyQuery.query(fetch_query, {
        type: QueryTypes.SELECT,
      });
      commonController.successMessage(response, "Auto approve apdated", res)

  } catch (e) {
    commonController.errorMessage(`${e}`, res);
    
  }
}



}

async function getFee() {
  const getFee = await db.fees.findOne({
    where: {
      id: 1
    }
  })

  return getFee ? getFee : null
}

async function adminWallet(amount: number, transaction?: any) {
  const findUserWallet = await db.wallets.findOne({
    where: { userId: 1 },
    transaction,
  });
  if (!findUserWallet) return;

  await findUserWallet.update(
    { amount: parseFloat(findUserWallet.amount) + amount },
    { transaction }
  );
}

async function generatePDF(html: string) {
  const browser = await puppeteer.launch({
    // executablePath: "/Users/gulshansharma/.cache/puppeteer/chrome/mac_arm-131.0.6778.108/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
    // headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(html);

  const pdfBuffer = await page.pdf({ format: "A4" });

  // Close the browser
  await browser.close();

  return pdfBuffer;
}

function formatNumber(num = 0) {

  if (Number.isInteger(num)) {
    return num.toString();
  } else {
    return num.toFixed(4);
  }
}



export default new codeController();
