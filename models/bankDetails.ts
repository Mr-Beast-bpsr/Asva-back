"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  name: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
  bankName: string;
  bankBranch: string;
  active: boolean;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userId!: number;
    name!: string;
    accountNumber!: string;
    ifscCode!: string;
    accountType!: string;
    bankName!: string;
    bankBranch!: string;
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
      name: { type: DataTypes.STRING },
      accountNumber: { type: DataTypes.STRING },
      ifscCode: { type: DataTypes.STRING },
      accountType: { type: DataTypes.STRING },
      bankName: { type: DataTypes.STRING },
      bankBranch: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN, defaultValue: '0' },
    },
    {
      sequelize,
      modelName: "bankdetails",
    }
  );

  return Users;
};
