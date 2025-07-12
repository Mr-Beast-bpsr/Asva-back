"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  address: string;
  amount: string;
  wallet: string;
  freezeAmount: string;
  active: boolean;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userId!: number;
    address!: string;
    amount!: string;
    wallet!: string;
    freezeAmount!: string;
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
      address: { type: DataTypes.STRING },
      amount: { type: DataTypes.STRING },
      wallet: { type: DataTypes.STRING },
      freezeAmount: { type: DataTypes.STRING,defaultValue: '0' },
      active: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: "wallets",
    }
  );

  return Users;
};
