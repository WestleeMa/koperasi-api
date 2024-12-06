const { login, register } = require("../controllers/auth");
const { getUser, editUser, deleteUser } = require("../controllers/user");
const { getSimpanan } = require("../controllers/simpan");
const {
  tambahSimpanan,
  tambahPinjaman,
  pelunasanPinjaman,
} = require("../controllers/transactions");
const express = require("express");
const router = express.Router();

router.get("/user", getUser);
router.get("/simpanan", getSimpanan);
router.post("/login", login);
router.post("/regist", register);
router.post("/simpan", tambahSimpanan);
router.post("/pinjam", tambahPinjaman);
router.post("/pelunasan", pelunasanPinjaman);
router.post("/editUser", editUser);
router.delete("/deleteUser", deleteUser);

module.exports = router;
