const db = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    port: "3308",
    password: "",
    database: "koperasi_db",
  },
});
module.exports = db;
