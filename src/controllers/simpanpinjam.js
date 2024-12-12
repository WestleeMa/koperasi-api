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
        } else if (idanggota && idanggota !== null) {
          const dataSimpanan = await db("tbl_simpan").where({ idanggota });
          const dataTotal = await db("tbl_anggota")
            .where({ idanggota })
            .first();
          if (dataSimpanan) {
            res
              .status(200)
              .send({ Total: dataTotal.simpanan, List: dataSimpanan });
          } else {
            res.status(400).send("Data simpanan tersebut tidak ada");
          }
        } else {
          const responseTotal = await db("tbl_total_transaksi")
            .select("totalsimpan")
            .where({ idtransaksi: 1 })
            .first();
          const response = await db("tbl_simpan")
            .join(
              "tbl_anggota",
              "tbl_simpan.idanggota",
              "=",
              "tbl_anggota.idanggota"
            )
            .select("tbl_simpan.*", "tbl_anggota.nama");
          res
            .status(200)
            .send({ Total: responseTotal.totalsimpan, List: response });
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
        } else if (idanggota && idanggota !== null) {
          const dataPinjaman = await db("tbl_pinjam").where({ idanggota });
          if (dataPinjaman) {
            res.status(200).send({ List: dataPinjaman });
          } else {
            res.status(400).send("Data pinjaman tersebut tidak ada");
          }
        } else {
          const responseTotal = await db("tbl_total_transaksi")
            .select("totalpinjam")
            .where({ idtransaksi: 1 })
            .first();
          const response = await db("tbl_pinjam")
            .join(
              "tbl_anggota",
              "tbl_pinjam.idanggota",
              "=",
              "tbl_anggota.idanggota"
            )
            .select("tbl_pinjam.*", "tbl_anggota.nama");
          res
            .status(200)
            .send({ Total: responseTotal.totalpinjam, List: response });
        }
      } else {
        res.status(400).send("Tidak ada tabel tersebut");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = { getSimpanPinjam };
