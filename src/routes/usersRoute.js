const express = require('express');
const router = express.Router();
const userController = require('../controlllers/userController')

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);


module.exports = router;