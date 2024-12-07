const db = require("../connect.js");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await db("tbl_anggota").where(`email`, email).first();
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send("Invalid email or password");
      }
      res.json({
        idanggota: user.idanggota,
        nama: user.nama,
        role: user.role,
        simpanan: user.simpanan,
      });
    } else {
      res.status(400).send("Uncomplete request");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function register(req, res) {
  try {
    const { nama, role, password, email } = req.body;
    if (!nama || !role || !password || !email) {
      res.status(400).send("Tolong penuhi semua kolom registrasi");
    } else {
      const checkUser = await db("tbl_anggota").where("email", email).first();
      if (checkUser) {
        res.status(409).send("User dengan email tersebut sudah terdaftar");
      } else {
        bcrypt.hash(password, 12, async function (err, hash) {
          if (err) {
            res.status(500).send("Error: " + err);
          } else {
            await db("tbl_anggota").insert({
              nama,
              role,
              simpanan: 50000,
              password: hash,
              email,
            });

            const idanggota = await db("tbl_anggota").where({ email }).first();
            if (idanggota.idanggota) {
              await db("tbl_simpan").insert({
                idanggota: idanggota.idanggota,
                jumlah: 50000,
                keterangan: "Simpanan pokok",
                kategori: "Wajib",
              });
            }

            const totalsimpan = await db("tbl_simpan")
              .sum("jumlah as TotalSimpan")
              .first();
            await db("tbl_total_transaksi").where({ idtransaksi: 1 }).update({
              totalsimpan: totalsimpan.TotalSimpan,
            });
            res.status(200).send("Berhasil terdaftar");
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

module.exports = {
  login,
  register,
};
