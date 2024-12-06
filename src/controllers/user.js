const db = require("../connect.js");

async function getUser(req, res) {
  try {
    const response = await db("tbl_anggota");
    res.status(200).send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { getUser };
