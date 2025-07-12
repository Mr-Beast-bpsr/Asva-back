"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  razorPay: string;
  buy: string;
  sell: string;
  ipo: string;
  withdraw: string;
  active: boolean;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userId!: number;
    razorPay!: string;
    buy!: string;
    sell!: string;
    ipo!: string;
    withdraw!: string;
    active!: boolean;

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
      razorPay: { type: DataTypes.STRING },
      buy: { type: DataTypes.STRING },
      sell: { type: DataTypes.STRING },
      ipo: { type: DataTypes.STRING },
      withdraw: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: "fees",
    }
  );

  return Users;
};
