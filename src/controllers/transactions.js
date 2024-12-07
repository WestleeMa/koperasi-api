const db = require("../connect.js");

async function tambahSimpanan(req, res) {
  try {
    const { idanggota, jumlah, kategori } = req.body;
    if (!idanggota || !kategori) {
      res.status(400).send("Request tidak lengkap");
    } else {
      const dataUser = await db("tbl_anggota")
        .where("idanggota", idanggota)
        .first();
      if (kategori == "Wajib") {
        console.log(dataUser.simpanan);
        if (dataUser.simpanan) {
          await db("tbl_simpan").insert({
            idanggota,
            jumlah: 25000,
            keterangan: "Setoran bulanan",
            kategori: "Wajib",
          });
          await db("tbl_anggota")
            .where({ idanggota })
            .update({
              simpanan: dataUser.simpanan + 25000,
            });
          res.status(200).send("Berhasil membayar simpanan bulanan");
        }
      } else if (kategori == "Sukarela") {
        if (jumlah < 10000) {
          res.status(400).send("minimal Rp. 10.000,-");
        } else {
          await db("tbl_simpan").insert({
            idanggota,
            jumlah,
            keterangan: "Setoran sukarela",
            kategori: "Sukarela",
          });
          await db("tbl_anggota")
            .where({ idanggota })
            .update({
              simpanan: dataUser.simpanan + parseInt(jumlah),
            });
          res.status(200).send("Berhasil membayar simpanan sukarela");
        }
      } else {
        res.status(400).send("kategori tidak valid");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { tambahSimpanan };
