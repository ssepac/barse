require("dotenv").config();
const mysql = require("mysql2");
const createZeroTime = require("./api");

console.log(process.env);

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

(async () => {
  //addFromCsv(connection, "file.csv");

  /*     const barse = await createBarse(connection, "pet")
    console.log(await barse.getAllNames()) */

  const barse = await createZeroTime(connection, "pet");

  /*   console.log(await barse.describe()); */

  console.log(await barse.whereSpecies("lion").find());

  barse.kill();
})();
