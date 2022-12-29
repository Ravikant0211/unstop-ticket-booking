const mongoose = require("mongoose");

//2D array represents the seats in the coach
//0 represents available seat and 1 represents reserved seat
const trainCoachSchema = new mongoose.Schema({
  seats: {
    type: [[Number]],
    default: function () {
      let coach = [];
      for (let r = 0; r < 12; r++) {
        coach.push([]);
        if (r !== 11) {
          for (c = 0; c < 7; c++) {
            coach[r].push(Math.round(Math.random()));
          }
        } else {
          for (c = 0; c < 3; c++) {
            coach[r].push(Math.round(Math.random()));
          }
        }
      }
      return coach;
    },
  },
});

const TrainCoach = mongoose.model("TrainCoach", trainCoachSchema);
module.exports = TrainCoach;
