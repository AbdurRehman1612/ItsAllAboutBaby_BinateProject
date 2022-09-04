const express = require("express");
const router = express.Router();
const requireToken = require("../auth/auth");

const {
  setpreferences,
  editpreferences,
  mypreferences,
  checkproductingredients,
  otherinfo,
  updatePreferences,
} = require("../controller/ScannedProducts");

// CORE APIS

router.get("/mypreferences", requireToken, mypreferences);
router.post("/setpreferences", setpreferences);
router.post("/editpreferences", requireToken, editpreferences);
router.post("/otherinfo", otherinfo);
router.post("/updatepreferences", requireToken, updatePreferences);
router.post("/checkproductingredients", requireToken, checkproductingredients);

module.exports = router;
