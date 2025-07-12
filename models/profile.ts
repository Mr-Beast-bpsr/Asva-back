"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {

  userId: number;
  aboutMe: string;
  wallet: string;
  pic: string;

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    aboutMe!: string;
    wallet!: string;
    pic!: string;

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
      aboutMe: { type: DataTypes.STRING },
      wallet: { type: DataTypes.STRING },
      pic: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "profiles",
    }
  );

  return Users;
};
