require('dotenv').config();
console.log(process.env.DB_NAME)
// const swaggerJSDocs = require('../swagger_example.json');
const swaggerUI = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yamljs");


const swaggerJSDocs = YAML.load("api.yaml");
const options = {
  customCss: `img {content:url(\'../logo.svg\'); height:auto;} `,
  customfavIcon: "../favicon.ico",
  customSiteTitle: "Code Improve API Doc",

};
module.exports = {
  swaggerServe: swaggerUI.serve, swaggerSetup: swaggerUI.setup(swaggerJSDocs, options),

  "development": {
    "username": process.env.DB_USER,
    "port": process.env.DB_PORT,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    // "ssl": 'true', 
  //   "ssl": {
  //   "ca": fs.readFileSync("ca.pem") // Adjust the path as needed
  // },
    // logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // You can change this based on your requirements
      }
    }
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "ssl": 'true',

   
  }, 
}