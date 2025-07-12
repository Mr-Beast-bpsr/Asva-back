"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  amount: string;
  fee: string;
  transferAmount: string;
  freezeAmt: string;
  action: number;
  bankId: number

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userId!: number;
    amount!: string;
    fee!: string;
    transferAmount!: string;
    freezeAmt!: string;
    bankId!: number

    action!: number;

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
      amount: { type: DataTypes.STRING },
      fee: { type: DataTypes.STRING },
      transferAmount: { type: DataTypes.STRING },
      freezeAmt: { type: DataTypes.STRING },
      bankId: { type: DataTypes.INTEGER },
      action: { type: DataTypes.INTEGER, defaultValue: '0' },
    },
    {
      sequelize,
      modelName: "withdraws",
    }
  );

  return Users;
};
