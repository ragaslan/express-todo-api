const express = require("express");
const auth = require("./auth");
const todo = require("./todo");
const router = express.Router();



router.use("/auth",auth);
router.use("/todo",todo);

module.exports = router;