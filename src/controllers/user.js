const db = require("../connect.js");
const bcrypt = require("bcryptjs");

async function getUser(req, res) {
  try {
    const { idanggota } = req.body;

    if (idanggota) {
      const dataUser = await db("tbl_anggota").where({ idanggota }).first();
      if (dataUser) {
        res.status(200).send(dataUser);
      } else {
        res.status(400).send("Anggota tersebut tidak terdaftar");
      }
    } else {
      const response = await db("tbl_anggota");
      res.status(200).send(response);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function editUser(req, res) {
  try {
    const { idanggota, nama, simpanan, role, email, password } = req.body;
    if (!idanggota) {
      res.status(400).send("Request tidak lengkap");
    } else if (!nama && !simpanan && !role && !email && !password) {
      res.status(201).send("Tidak ada perubahan");
    } else if (role !== "pengurus" || role !== "anggota") {
      res.status(400).send("role harus pengurus atau anggota");
    } else {
      if (password) {
        bcrypt.hash(password, 12, async function (err, hash) {
          await db("tbl_anggota").where({ idanggota }).update({
            password: hash,
            simpanan,
            role,
            email,
          });
          res.status(200).send("Berhasil mengubah data anggota");
        });
      } else {
        await db("tbl_anggota").where({ idanggota }).update({
          simpanan,
          role,
          email,
        });
        res.status(200).send("Berhasil mengubah data anggota");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function deleteUser(req, res) {
  try {
    const { idanggota } = req.body;
    if (idanggota) {
      const checkUser = await db("tbl_anggota").where({ idanggota }).first();
      const checkPinjaman = await db("tbl_pinjam").where({ idanggota }).first();
      if (checkUser && !checkPinjaman) {
        await db("tbl_simpan").where({ idanggota }).delete();
        await db("tbl_pinjam").where({ idanggota }).delete();
        const total = await db("tbl_total_transaksi")
          .where({ idtransaksi: 1 })
          .first();
        const totalsimpanan = total.totalsimpan;
        await db("tbl_total_transaksi")
          .where({ idtransaksi: 1 })
          .update({
            totalsimpan: totalsimpanan - checkUser.simpanan,
          });
        await db("tbl_anggota").where({ idanggota }).delete();
        res.status(200).send("Berhasil menghapus user");
      } else {
        res
          .status(400)
          .send("User tidak terdaftar atau belum melunasi pinjaman");
      }
    } else {
      res.status(400).send("ID?");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}
module.exports = { getUser, editUser, deleteUser };
