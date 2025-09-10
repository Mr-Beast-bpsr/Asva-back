"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {

  userId: number;
  product_id: string;
  quantity: string;
  amount: string;
  fee: string;
  totalQuantity: string;
  active: number;
  hash: string;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    product_id!: string;
    quantity!: string;
    amount!: string;
    fee!: string;
  totalQuantity!: string;

    active!: number;
    hash!: string;

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
      amount: { type: DataTypes.TEXT },
      fee: { type: DataTypes.TEXT },
    totalQuantity: { type: DataTypes.TEXT },
      active: { type: DataTypes.INTEGER },
      hash: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "buy_trades",
    }
  );

  return Users;
};
