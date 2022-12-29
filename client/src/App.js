import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [numberOfSeats, setNumberOfSeats] = useState("");
  const [availableSeats, setAvailableSeats] = useState(0);
  const [reservedSeats, setReservedSeats] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/seats/availableseats")
      .then((res) => res.json())
      .then((data) => {
        setAvailableSeats(data.totalAvailableSeats);
        if (!data.success) {
          setError(data.message);
          setNumberOfSeats("");
        }
      });
  }, []);

  const searchSeat = async () => {
    const response = await fetch("/api/seats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ seats: numberOfSeats }),
    });

    const data = await response.json();
    if (!data.success) {
      setError(data.message);
      setNumberOfSeats("");
    } else {
      const availableSeats = data.data.availableSeats;
      const reservedSeats = data.data.reservedSeats;
      setAvailableSeats(availableSeats);
      setReservedSeats(reservedSeats);
      setError(false);
      setNumberOfSeats("");
    }
  };

  return (
    <div className="app">
      <div className="ticketBooking">
        <div className="tbContainer">
          <h2 className="tbTitle">Ticket Booking</h2>
          <input
            onChange={(e) => setNumberOfSeats(e.target.value)}
            type="Number"
            placeholder="Enter the number of seats to be reserved"
            className="tbInput"
            value={numberOfSeats}
            disabled={!availableSeats}
          />
          {!error && (
            <div className="tbSeatsContainer">
              {reservedSeats.length > 0 && (
                <h2 className="tbSeats">
                  Reserved seats{` `}
                  {reservedSeats.map((el, index) => (
                    <span key={index}>{el} </span>
                  ))}
                </h2>
              )}
              <h2 className="tbSeats">Seat availability {availableSeats}</h2>
            </div>
          )}
          {(error || !availableSeats) && <small className="err">{error}</small>}
          <button
            disabled={!availableSeats}
            onClick={searchSeat}
            className="tbButton"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
