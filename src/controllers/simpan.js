const db = require("../connect.js");

async function getSimpanan(req, res) {
  try {
    const { idsimpan } = req.body;

    if (idsimpan) {
      const dataSimpanan = await db("tbl_simpan").where({ idsimpan }).first();
      if (dataSimpanan) {
        res.status(200).send(dataSimpanan);
      } else {
        res.status(400).send("Data simpanan tersebut tidak ada");
      }
    } else {
      const response = await db("tbl_simpan");
      res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { getSimpanan };
