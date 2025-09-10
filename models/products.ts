"use strict";
import { Model, Sequelize } from "sequelize";

interface UsersAttributes {
  userId: number;
  sku_code: string;
  name: string;
  description: string;
  issue_year: string;
  item_condition: string;
  category: number;
  varities: string;
  city: string;
  ruler: string;
  denomination: string;
  signatory: string;
  rarity: string;
  specification: string;
  metal: string;
  remarks: string;
  quantity: string;
  images: string[];
  custom_url: string;
  video: string;
  current_price: string;
  initial_price: string;
  note: string;
  sold: string;
  type_series: string;
  instock: string;
  keyword: string;
  cover_pic: string;
  hidden: boolean;
  approved: boolean;
  contactNumber: string;
  currentQuantity: string;
  ipoQuantity: string;
  ipoExpiryDate: string;
  isIpoOver: boolean;
  isTradable: boolean;
  amount: string;
  ipoExpDays: string;
  isAutoApprove: boolean
    creationHash: string;

  lotSize?: number; // Optional field for lot size

}

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class Users extends Model<UsersAttributes> implements UsersAttributes {
    userId!: number;
    sku_code!: string;
    name!: string;
    description!: string;
    issue_year!: string;
    item_condition!: string;
    category!: number;
    varities!: string;
    city!: string;
    ruler!: string;
    denomination!: string;
    signatory!: string;
    rarity!: string;
    specification!: string;
    metal!: string;
    remarks!: string;
    quantity!: string;
    images!: string[];
    custom_url!: string;
    video!: string;
    current_price!: string;
    initial_price!: string;
    note!: string;
    sold!: string;
    type_series!: string;
    instock!: string;
    keyword!: string;
    cover_pic!: string;
    hidden!: boolean;
    approved!: boolean;
    contactNumber!: string;
    currentQuantity!: string
    ipoQuantity!: string;
    ipoExpiryDate!: string;
    isIpoOver!: boolean
    isTradable!: boolean
    amount!: string;
    ipoExpDays!: string;
    isAutoApprove!: boolean
    creationHash!: string;
    static associate(models: any) {
      // Define associations here
    }
    lotSize?: number;
  }

  Users.init(
    {
      userId: { type: DataTypes.INTEGER },
      sku_code: { type: DataTypes.TEXT },
      name: { type: DataTypes.TEXT },
      description: { type: DataTypes.TEXT },
      issue_year: { type: DataTypes.TEXT },
      item_condition: { type: DataTypes.TEXT },
      category: { type: DataTypes.INTEGER },
      varities: { type: DataTypes.TEXT },
      city: { type: DataTypes.TEXT },
      ruler: { type: DataTypes.TEXT },
      denomination: { type: DataTypes.TEXT },
      signatory: { type: DataTypes.TEXT },
      rarity: { type: DataTypes.TEXT },
      specification: { type: DataTypes.TEXT },
      metal: { type: DataTypes.TEXT },
      remarks: { type: DataTypes.TEXT },
      quantity: { type: DataTypes.TEXT },
      images: { type: DataTypes.JSON }, // Changed to JSON
      custom_url: { type: DataTypes.TEXT },
      video: { type: DataTypes.TEXT },
      current_price: { type: DataTypes.TEXT },
      initial_price: { type: DataTypes.TEXT },
      note: { type: DataTypes.TEXT },
      sold: { type: DataTypes.TEXT },
      type_series: { type: DataTypes.TEXT },
      instock: { type: DataTypes.TEXT },
      keyword: { type: DataTypes.TEXT },
      cover_pic: { type: DataTypes.TEXT },
      hidden: { type: DataTypes.BOOLEAN },
      approved: { type: DataTypes.BOOLEAN },
      contactNumber: { type: DataTypes.STRING },
      currentQuantity: { type: DataTypes.STRING },
      ipoQuantity: { type: DataTypes.STRING },
      ipoExpiryDate: { type: DataTypes.STRING, allowNull: false, },
      isIpoOver: { type: DataTypes.BOOLEAN,  defaultValue: false  },
      isTradable: { type: DataTypes.BOOLEAN , defaultValue: false },
      amount: { type: DataTypes.STRING },
      ipoExpDays: { type: DataTypes.STRING },
      isAutoApprove: { type: DataTypes.BOOLEAN, defaultValue: true },
      lotSize: { type: DataTypes.INTEGER },
      creationHash: { type: DataTypes.STRING },
      

    },
    {
      sequelize,
      modelName: "products",
    }
  );

  return Users;
};
