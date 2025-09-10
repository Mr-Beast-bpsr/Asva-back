"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  history_type: string;
  amount: string;
  action: number;
  item: string;
  order_id: string;
  receipt: string;
  order_created_at: string;
  txnHash: string;


}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    history_type!: string;
    amount!: string;
    action!: number;
    item!: string;
    order_id!: string
    receipt!: string;
    order_created_at!: string;
    txnHash!: string;

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
      history_type: { type: DataTypes.STRING }, // type 1 - oder history, type 2 - admin add, type 3 - admin deduct
      amount: { type: DataTypes.STRING },
      action: { type: DataTypes.INTEGER },
      item: { type: DataTypes.STRING },
      order_id: { type: DataTypes.STRING },
      receipt: { type: DataTypes.STRING },
      order_created_at: { type: DataTypes.STRING },
      txnHash: { type: DataTypes.STRING },

    },
    {
      sequelize,
      modelName: "wallets_histories",
    }
  );

  return Users;
};
