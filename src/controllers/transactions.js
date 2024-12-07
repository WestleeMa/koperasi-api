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
          const totalsimpan = await db("tbl_simpan")
            .sum("jumlah as TotalSimpan")
            .first();
          await db("tbl_total_transaksi").where({ idtransaksi: 1 }).update({
            totalsimpan: totalsimpan.TotalSimpan,
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
          const totalsimpan = await db("tbl_simpan")
            .sum("jumlah as TotalSimpan")
            .first();
          await db("tbl_total_transaksi").where({ idtransaksi: 1 }).update({
            totalsimpan: totalsimpan.TotalSimpan,
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

async function tambahPinjaman(req, res) {
  try {
    const { idanggota, jumlah } = req.body;
    if (!idanggota || !jumlah) {
      res.status(400).send("Request tidak lengkap");
    } else {
      const total = await db("tbl_total_transaksi").first();
      if (total.totalsimpan < jumlah) {
        res.status(400).send("Simpanan koperasi tidak mencukupi");
      } else {
        await db("tbl_pinjam").insert({
          idanggota,
          jumlah,
          status: "Belum Lunas",
        });

        const totalpinjam = await db("tbl_pinjam")
          .sum("jumlah as TotalPinjam")
          .first();
        await db("tbl_total_transaksi")
          .where({ idtransaksi: 1 })
          .update({
            totalsimpan: total.totalsimpan - jumlah,
            totalpinjam: totalpinjam.TotalPinjam,
          });

        res.status(200).send("Peminjaman berhasil");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
async function pelunasanPinjaman(req, res) {
  try {
    const { idpinjam } = req.body;
    if (!idpinjam) {
      res.status(400).send("Request tidak lengkap");
    } else {
      const dataPinjam = await db("tbl_pinjam").where({ idpinjam }).first();
      if (dataPinjam) {
        await db("tbl_pinjam").where({ idpinjam }).update({
          status: "Lunas",
        });

        const jumlahPinjam = dataPinjam.jumlah;

        const tabelTotal = await db("tbl_total_transaksi")
          .where({ idtransaksi: 1 })
          .first();
        await db("tbl_total_transaksi")
          .where({ idtransaksi: 1 })
          .update({
            totalsimpan: tabelTotal.totalsimpan + jumlahPinjam,
            totalpinjam: tabelTotal.totalpinjam - jumlahPinjam,
          });
        res.status(200).send("Pelunasan Berhasil");
      } else {
        res.status(400).send("Tidak ada pinjaman dengan id tersebut");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = { tambahSimpanan, tambahPinjaman, pelunasanPinjaman };
