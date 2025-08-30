const express = require('express');
const router = express.Router();
const instructionController = require('../controlllers/instructionController')

router.post('/', instructionController.createInstruction);
router.put('/:id', instructionController.updateInstruction);
router.delete('/:id', instructionController.deleteInstruction);
router.get('/user/:userId', instructionController.getInstructionsByUser);

module.exports = router;