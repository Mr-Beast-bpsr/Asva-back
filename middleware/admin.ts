import { Request, Response, NextFunction } from 'express';
import db from "../models";

export const checkAdmin = async (userId: number, res: Response) => {
  // const adminId = [1,2,3,5]

  const adminIds = await findAdmin()

  // Map over the results to extract just the 'id' values
  const adminId = adminIds.map((user: { id: number; }) => user.id);

  // console.log(adminId); 

  const found = adminId.find((element: number) => element === userId);
  if (!found) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Admin access required',
    });
  }
};

export const checkAdminNew = async (userId: number, res: Response) => {
  // const adminId = [1,2,3,5]
  const adminIds = await findAdmin()

  // Map over the results to extract just the 'id' values
  const adminId = adminIds.map((user: { id: number; }) => user.id);


  const found = adminId.find((element: number) => element === userId);
  if (found) {
    return true
  } else {
    return false
  }
};

async function findAdmin(){
 const data =  await db.users.findAll({
    where: {
      admin: 1
    },
    attributes: ['id'] // Only select the 'id' column
  });
  return data
}


