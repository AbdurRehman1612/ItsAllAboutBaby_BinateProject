const multer = require("multer");
const mongoose = require("mongoose");
const db = require("../models");
const nodemailer = require("nodemailer");

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "./upload/");
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: async (req, file, cb) => {
    const { email, username, phone, password, cPassword } = req.body;
    const userex = await db.User.findOne({ email: email });
    if (
      userex ||
      email == "" ||
      password == "" ||
      username == "" ||
      phone == "" ||
      cPassword == "" ||
      password !== cPassword ||
      !file
    ) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = { upload };
