require("../loadenv");
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    define: { underscored: true }
  });

  console.log("Using PRODUCTION database (Render)");
} 
else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
      define: { underscored: true }
    }
  );

  console.log("Using LOCAL database");
}

async function connectwithDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect Database:", error);
  }
}

module.exports = { sequelize, connectwithDB };


// require('dotenv').config();
// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false
//     }
//   },
//   logging: false,
//   define: { underscored: true }
// });

// async function connectwithDB() {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connected successfully');
//     await sequelize.sync();
//   } catch (error) {
//     console.error("Unable to connect Database:", error);
//   }
// }

// module.exports = { sequelize, connectwithDB };



// require('dotenv').config();
// const {Sequelize} = require('sequelize')

// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         port: process.env.DB_PORT,
//         dialect: 'postgres',
//         logging: false,
//         define: { underscored: true }
//     }
// )


// async function connectwithDB() {
//  try{
//     await sequelize.authenticate()
//     console.log('Database connected successfully')
//  }  catch(error){
//     console.log("Unable to connect Database:", error)
//  } 
// }

// module.exports = {sequelize, connectwithDB}