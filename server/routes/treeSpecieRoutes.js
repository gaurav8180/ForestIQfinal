const express = require('express');
const { detectTreeSpecies } = require('../controllers/treeSpecieController');

const router = express.Router();

router.post('/detect', detectTreeSpecies);

module.exports = router;