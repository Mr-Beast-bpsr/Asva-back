"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userIdBuyer: number;
  userIdSeller: number;
  sellId: number;
  buyId: number;
  product_id: string;
  quantityBuy: string;
  amountBuy: string;
  quantitySell: string;
  amountSell: string;
  active: number
  quantityToTrade: string
  totalAmount: number
  sellQuantityAfterSub: number;
  action: boolean;

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userIdBuyer!: number;
    userIdSeller!: number;
    sellId!: number;
    buyId!: number;
    product_id!: string;
    quantityBuy!: string;
    amountBuy!: string;
    quantitySell!: string;
    amountSell!: string;
    active!: number
    quantityToTrade!: string
    totalAmount!: number
    sellQuantityAfterSub!: number
    action!: boolean;

    static associate(models: any) {
      // Define associations here
      // Users.belongsTo(models.packages, { foreignKey: 'packageId' });
      // Users.belongsTo(models.company_registrations, { foreignKey: 'companyId' });
      // Users.belongsTo(models.roles, { foreignKey: 'roleId' });
    }
  }

  Users.init(
    {
      userIdBuyer: { type: DataTypes.INTEGER },
      userIdSeller: { type: DataTypes.INTEGER },
      sellId: { type: DataTypes.INTEGER },
      buyId: { type: DataTypes.INTEGER },
      product_id: { type: DataTypes.STRING },
      quantityBuy: { type: DataTypes.TEXT },
      amountBuy: { type: DataTypes.TEXT },
      quantitySell: { type: DataTypes.TEXT },
      amountSell: { type: DataTypes.TEXT },
      active: { type: DataTypes.INTEGER },
      quantityToTrade: { type: DataTypes.TEXT },
      totalAmount: { type: DataTypes.INTEGER },
      sellQuantityAfterSub: { type: DataTypes.INTEGER },
      action: { type: DataTypes.BOOLEAN },


    },
    {
      sequelize,
      modelName: "trades_masters",
    }
  );

  return Users;
};
