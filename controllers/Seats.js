const TrainCoach = require("../models/trainCoach");
const { createError } = require("../utils/createError");

exports.getAvailableSeats = async (req, res, next) => {
  try {
    let coach = await TrainCoach.findOne({});
    let seats = coach.seats;
    let totalAvailableSeats = countAllAvailableSeatsInCoach(seats);
    if (totalAvailableSeats === 0)
      return next(createError(400, "Seats are full. Window Closed!"));
    res.status(200).json({
      totalAvailableSeats,
    });
  } catch (err) {
    next(createError(400, `${err.message}`));
  }
};

exports.createSeats = async (req, res, next) => {
  try {
    let newCoach = new TrainCoach();
    await newCoach.save();

    res.status(201).json({
      success: true,
      data: {
        newCoach,
      },
    });
  } catch (err) {
    next(createError(400, `${err.message}`));
  }
};

exports.reserveSeats = async (req, res, next) => {
  try {
    let seatsToBeBooked = req.body.seats * 1 || 0;

    if (seatsToBeBooked === 0)
      return next(createError(400, "Please provide a valid number of seats!"));
    else if (seatsToBeBooked > 7)
      return next(createError(400, "You can't book more than 7 seats!"));

    let coach = await TrainCoach.findOne({});
    let seats = coach.seats;

    //If user try to book seats more than available seats
    let totalAvailableSeats = countAllAvailableSeatsInCoach(seats);
    if (seatsToBeBooked > totalAvailableSeats) {
      return next(
        createError(
          404,
          `You can book only ${totalAvailableSeats} seats or less!`
        )
      );
    }
    // If seats are full
    if (totalAvailableSeats === 0) {
      return next(createError(400, "Seats are full. Window Closed!"));
    }

    let bookedSeats = seatsToBeBooked;
    let yourReservedSeats = []; //stores reserved seat numbers

    //loop through the row of seats in the coach
    for (let row = 0; row < 12; row++) {
      //try to find a row with enough of available seats
      //book the available seats in that row
      if (seatsToBeBooked <= countAvailableSeatsInRow(seats[row])) {
        for (let seat = 0; seat < seats[row].length; seat++) {
          if (seats[row][seat] === 0 && seatsToBeBooked > 0) {
            if (row === 11) {
              let seatNumber = 11 * 7 + seat + 1;
              yourReservedSeats.push(seatNumber);
            } else {
              let seatNumber = row * 7 + seat + 1;
              yourReservedSeats.push(seatNumber);
            }
            seats[row][seat] = 1;
            seatsToBeBooked--;
          }
        }
        break;
      }
    }

    //If you still could't find all the available seats in one row
    //then, book them in random rows
    if (seatsToBeBooked > 0) {
      for (let row = 0; row < 12; row++) {
        for (let seat = 0; seat < seats[row].length; seat++) {
          if (seats[row][seat] === 0 && seatsToBeBooked > 0) {
            if (row === 11) {
              let seatNumber = 11 * 7 + seat + 1;
              yourReservedSeats.push(seatNumber);
            } else {
              let seatNumber = row * 7 + seat + 1;
              yourReservedSeats.push(seatNumber);
            }
            seats[row][seat] = 1;
            seatsToBeBooked--;
          }
        }
      }
    }

    //available seats after reservation
    let availableSeats = totalAvailableSeats - bookedSeats;
    //update the reserved seats in the database
    await TrainCoach.findOneAndUpdate({}, { seats });
    res.status(200).json({
      success: true,
      data: {
        reservedSeats: yourReservedSeats,
        availableSeats,
      },
    });
  } catch (err) {
    next(createError(400, `${err.message}`));
  }
};

//counts total available seats in a particular row
let countAvailableSeatsInRow = (row) => {
  return row.filter((seat) => seat === 0).length;
};

//counts total available seats in the coach
let countAllAvailableSeatsInCoach = (seats) => {
  let count = 0;
  seats.forEach((row) => {
    row.forEach((seat) => {
      if (seat === 0) count++;
    });
  });
  return count;
};
