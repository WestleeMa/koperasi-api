const db = require("../connect.js");

async function getSimpanPinjam(req, res) {
  try {
    const { tbl, id, idanggota } = req.body;
    if (!tbl) {
      res.status(400).send("Salah tabel");
    } else {
      if (tbl == "simpan") {
        if (id && idanggota) {
          const dataSimpanan = await db("tbl_simpan").where({
            idanggota,
            idsimpan: id,
          });
          if (dataSimpanan) {
            res.status(200).send(dataSimpanan);
          } else {
            res.status(400).send("Data simpanan tersebut tidak ada");
          }
        } else if (id) {
          const dataSimpanan = await db("tbl_simpan").where({ idsimpan: id });
          if (dataSimpanan) {
            res.status(200).send(dataSimpanan);
          } else {
            res.status(400).send("Data simpanan tersebut tidak ada");
          }
        } else if (idanggota) {
          const dataSimpanan = await db("tbl_simpan").where({ idanggota });
          if (dataSimpanan) {
            res.status(200).send(dataSimpanan);
          } else {
            res.status(400).send("Data simpanan tersebut tidak ada");
          }
        } else {
          const response = await db("tbl_simpan");
          res.status(200).send(response);
        }
      } else if (tbl == "pinjam") {
        if (id && idanggota) {
          const dataPinjaman = await db("tbl_pinjam").where({
            idanggota,
            idpinjam: id,
          });
          if (dataPinjaman) {
            res.status(200).send(dataPinjaman);
          } else {
            res.status(400).send("Data pinjaman tersebut tidak ada");
          }
        } else if (id) {
          const dataPinjaman = await db("tbl_pinjam").where({ idpinjam: id });
          if (dataPinjaman) {
            res.status(200).send(dataPinjaman);
          } else {
            res.status(400).send("Data pinjaman tersebut tidak ada");
          }
        } else if (idanggota) {
          const dataPinjaman = await db("tbl_pinjam").where({ idanggota });
          if (dataPinjaman) {
            res.status(200).send(dataPinjaman);
          } else {
            res.status(400).send("Data pinjaman tersebut tidak ada");
          }
        } else {
          const response = await db("tbl_pinjam");
          res.status(200).send(response);
        }
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { getSimpanPinjam };
