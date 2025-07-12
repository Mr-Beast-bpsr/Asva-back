"use strict";
import { DateDataType, Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  name: string;
  number: string;
  address: string;
  id_num: string;
  type: string;
  a_front: string;
  a_back: string;
  pan: string;
  pan_back: string;
  self_pic: string;
  sign: string;
  accepted: number;
  reason: string;
  bankAccNo: string;
  passBookPic: string;
  
}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    name!: string;
    number!: string;
    address!: string;
    id_num!: string;
    type!: string;
    a_front!: string;
    a_back!: string;
    pan!: string;
    pan_back!: string;
    self_pic!: string;
    sign!: string;
    accepted!: number;
    reason!: string;
    bankAccNo!: string;
  passBookPic!: string;

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
      number: { type: DataTypes.STRING },
      address: { type: DataTypes.STRING },
      id_num: { type: DataTypes.STRING },
      type: { type: DataTypes.STRING },
      a_front: { type: DataTypes.STRING },
      a_back: { type: DataTypes.STRING },
      pan: { type: DataTypes.STRING },
      pan_back: { type: DataTypes.STRING },
      self_pic: { type: DataTypes.STRING },
      sign: { type: DataTypes.STRING },
      accepted: { type: DataTypes.INTEGER },
      reason: { type: DataTypes.STRING },
      bankAccNo: { type: DataTypes.STRING },
      passBookPic: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "kycs",
    }
  );

  return Users;
};
