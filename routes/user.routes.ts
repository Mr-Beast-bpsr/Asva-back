import { verify } from "crypto";
import express from "express";
import userController from "../controllers/user.controller";
import adminController from "../controllers/admin.controller";

const router = express.Router();

router.post("/registration", userController.registration);
router.post("/resend_email", userController.resend_email);
router.post("/login", userController.login);
router.post("/all_products_public",userController.all_products_public)
router.post("/get_all_categories_public",userController.get_all_categories_public)

router.post("/tickerprice",userController.tickerPrice)


router.post("/top_gainers",userController.top_gainers)
router.post("/top_losers",userController.top_losers)

router.post("/get_products_by_cat_id",userController.get_products_by_cat_id)
// forget password
router.post("/forget_password",userController.forgetPassword)

router.post("/articles/all", userController.getAllArticles);
router.post("/articles/id", userController.getArticleById); 
router.post("/articles/id", userController.getArticleById); 
router.post("/get_fees", userController.getFees); 
router.post("/get_all_holders_of_assets", userController.getAssetPercentage); 
// article
router.post("/articles/active", userController.getAllActiveArticles);


export default router;
