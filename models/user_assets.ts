"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {

  userId: number;
  product_id: string;
  quantity: string;
  active: number
  latestId: number
  buyAmount: string;
  avgBuy: string;
  lastSumAmount: string;

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    product_id!: string;
    quantity!: string;
    active!: number
    latestId!: number
    buyAmount!: string;
    avgBuy!: string;
    lastSumAmount!: string;

    static associate(models: any) {
      // Define associations here
      // Users.belongsTo(models.packages, { foreignKey: 'packageId' });
      // Users.belongsTo(models.company_registrations, { foreignKey: 'companyId' });
      // Users.belongsTo(models.roles, { foreignKey: 'roleId' });
    }
  }

  Users.init(
    {
      userId: { type: DataTypes.INTEGER },
      product_id: { type: DataTypes.STRING },
      quantity: { type: DataTypes.TEXT },
      active: { type: DataTypes.INTEGER },
      latestId: { type: DataTypes.INTEGER },
      buyAmount: { type: DataTypes.STRING },
      avgBuy: { type: DataTypes.STRING },
      lastSumAmount: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "user_assets",
    }
  );

  return Users;
};
