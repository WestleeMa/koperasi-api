const { login, register } = require("../controllers/auth");
const { getUser, editUser, deleteUser } = require("../controllers/user");
const { getSimpanPinjam } = require("../controllers/simpanpinjam");
const {
  tambahSimpanan,
  tambahPinjaman,
  pelunasanPinjaman,
  deleteSimpanPinjam,
} = require("../controllers/transactions");
const express = require("express");
const router = express.Router();

router.get("/user", getUser);
router.post("/simpanpinjam", getSimpanPinjam);
router.post("/login", login);
router.post("/regist", register);
router.post("/simpan", tambahSimpanan);
router.post("/pinjam", tambahPinjaman);
router.post("/pelunasan", pelunasanPinjaman);
router.post("/editUser", editUser);
router.post("/deleteUser", deleteUser);
router.post("/deleteSimpanPinjam", deleteSimpanPinjam);

module.exports = router;
