const { login, register } = require("../controllers/auth");
const { getUser } = require("../controllers/user");
const { tambahSimpanan } = require("../controllers/transactions");
const express = require("express");
const router = express.Router();

router.post("/login", login);
router.post("/regist", register);
router.get("/user", getUser);
router.post("/simpan", tambahSimpanan);

module.exports = router;
