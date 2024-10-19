const express = require("express");
const { treeCount } = require("../controllers/treeCountController");

const router = express.Router();

router.post('/detect', treeCount);

module.exports = router;
