import { Request, Response, NextFunction, } from "express";
import { json } from "sequelize/types";
const jwt=require('jsonwebtoken');


const {TOKEN_SECRET} =require('../appconfig');
declare global {
    namespace Express {
        interface Request {
            user? : Record<string,any>
        }
    }
}
export default module.exports=(req:Request,res:Response,next:NextFunction)=>{
    const authHeader=req.headers.authorization;
    const error=new Error();

    //error.status=403;

    if(authHeader){
        const token=authHeader.split('Bearer ')[1];
        if(token){
            try{
                    const user=jwt.verify(token,TOKEN_SECRET);
                    console.log("header user",user);
                    req.user=user;
                    return next();
            }catch(e){
                res.status(403);
                error.message="invalid/expired token";
                return next(error);
            }
        }
        res.status(403);
        error.message='authorization token must be Bearer [token]';
        return next(error);
    }
    res.status(403);
    error.message='authorization header must be provided';
    return next(error);
};