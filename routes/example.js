const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example');

router.get('/', exampleController.getExamples);
router.post('/', exampleController.addExample);

// Add other routes as needed

module.exports = router;