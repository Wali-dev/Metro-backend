const express = require('express');
const router = express.Router();
const stepController = require('../controlllers/stepController');

router.post('/', stepController.createStep);
router.put('/:id', stepController.updateStep);
router.delete('/:id', stepController.deleteStep);

module.exports = router;
