"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  catName: string;
  details: string;
  image: string;
  views: number;
  active: boolean;
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {

    userId!: number;
    catName!: string;
    details!: string;
    image!: string;
    views!: number;
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
      catName: { type: DataTypes.STRING },
      details: { type: DataTypes.STRING },
      image: { type: DataTypes.STRING },
      views: { type: DataTypes.INTEGER },
      active: { type: DataTypes.BOOLEAN },
    },
    {
      sequelize,
      modelName: "categories",
    }
  );

  return Users;
};
