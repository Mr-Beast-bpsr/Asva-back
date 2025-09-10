"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  email: string;
  password: string;
  mobile: string;
  name: string;
  token: string;
  active: boolean;
  admin:number;
  accountNumber: string;

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    email!: string;
    password!: string;
    name!: string;
    mobile!: string;
    token!: string;
    active!: boolean;
    admin!:number;
    accountNumber!: string;

    static associate(models: any) {
      // Define associations here
      // Users.belongsTo(models.packages, { foreignKey: 'packageId' });
      // Users.belongsTo(models.company_registrations, { foreignKey: 'companyId' });
      // Users.belongsTo(models.roles, { foreignKey: 'roleId' });
    }
  }

  Users.init(
    {
      email: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      name: { type: DataTypes.STRING },
      mobile: { type: DataTypes.STRING },
      token: { type: DataTypes.STRING },
      active: { type: DataTypes.BOOLEAN },
      admin: { type: DataTypes.INTEGER },
      accountNumber: { type: DataTypes.STRING,  unique: true, },

    },
    {
      sequelize,
      modelName: "users",
    }
  );

  return Users;
};
