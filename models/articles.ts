"use strict";
import { Model, Sequelize, DataTypes } from "sequelize";

interface ArticleAttributes {
  title: string;
  writer: string;
  timestamp: string;
  category: string;
  content: string;
  cover_image: string;
  active: boolean;
}

module.exports = (sequelize: Sequelize) => {
  class Article extends Model<ArticleAttributes> implements ArticleAttributes {
    title!: string;
    writer!: string;
    timestamp!: string;
    category!: string;
    content!: string;
    cover_image!: string;
    active!: boolean;

    static associate(models: any) {
      // Define associations here if needed
    }
  }

  Article.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      writer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cover_image: {
        type: DataTypes.STRING,
        allowNull: true, // Assuming cover_image can be optional
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // Assuming articles are active by default
      },
    },
    {
      sequelize,
      modelName: "articles",
      tableName: "articles", // Specify the table name
      timestamps: true, // Disable automatic timestamps (createdAt, updatedAt)
    }

  );

  return Article;
};
