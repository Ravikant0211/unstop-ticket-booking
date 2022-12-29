const express = require("express");
const {
  reserveSeats,
  createSeats,
  getAvailableSeats,
} = require("../controllers/Seats");
const router = express.Router();

router.post("/", reserveSeats);
router.get("/", createSeats);
router.get("/availableseats", getAvailableSeats);

module.exports = router;
