const express = require('express');
const router = express.Router();
const analyticsController = require("../controlllers/analyticsController");

router.post("/", analyticsController.createEvent);
router.get("/", analyticsController.getEvents);
router.get("/instruction/:instruction_id", analyticsController.getByInstruction);
router.get("/user/:user_id", analyticsController.getByUser);

// Aggregate stats (views, likes, shares, step_complete count) for an instruction
router.get("/instruction/:instruction_id/stats", analyticsController.getInstructionStats);


module.exports = router;