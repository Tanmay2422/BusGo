import React from 'react';
import './SeatGrid.css';

const SeatGrid = ({ totalSeats, bookedSeats, selectedSeats, onSeatToggle, maxSelectable = 6 }) => {
  const rows = Math.ceil(totalSeats / 4);

  const getSeatStatus = (num) => {
    if (bookedSeats.includes(num)) return 'booked';
    if (selectedSeats.includes(num)) return 'selected';
    return 'available';
  };

  const handleClick = (num) => {
    const status = getSeatStatus(num);
    if (status === 'booked') return;
    if (status === 'selected') {
      onSeatToggle(selectedSeats.filter(s => s !== num));
    } else {
      if (selectedSeats.length >= maxSelectable) {
        alert(`You can select a maximum of ${maxSelectable} seats.`);
        return;
      }
      onSeatToggle([...selectedSeats, num]);
    }
  };

  return (
    <div className="seat-grid-wrapper">
      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available-demo" />
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected-demo" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked-demo" />
          <span>Booked</span>
        </div>
      </div>

      {/* Bus Layout */}
      <div className="bus-layout">
        <div className="bus-front">
          <span className="driver-icon">🚗</span>
          <span className="driver-label">Driver</span>
        </div>

        <div className="seats-container">
          {Array.from({ length: rows }, (_, rowIdx) => (
            <div key={rowIdx} className="seat-row">
              {/* Left side: 2 seats */}
              <div className="seat-pair">
                {[1, 2].map(col => {
                  const seatNum = rowIdx * 4 + col;
                  if (seatNum > totalSeats) return <div key={col} className="seat-placeholder" />;
                  const status = getSeatStatus(seatNum);
                  return (
                    <button
                      key={col}
                      className={`seat seat-${status}`}
                      onClick={() => handleClick(seatNum)}
                      disabled={status === 'booked'}
                      title={status === 'booked' ? `Seat ${seatNum} - Booked` : `Seat ${seatNum}`}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>

              <div className="aisle">
                <span className="row-label">{String.fromCharCode(65 + rowIdx)}</span>
              </div>

              {/* Right side: 2 seats */}
              <div className="seat-pair">
                {[3, 4].map(col => {
                  const seatNum = rowIdx * 4 + col;
                  if (seatNum > totalSeats) return <div key={col} className="seat-placeholder" />;
                  const status = getSeatStatus(seatNum);
                  return (
                    <button
                      key={col}
                      className={`seat seat-${status}`}
                      onClick={() => handleClick(seatNum)}
                      disabled={status === 'booked'}
                      title={status === 'booked' ? `Seat ${seatNum} - Booked` : `Seat ${seatNum}`}
                    >
                      {seatNum}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bus-rear">🚪 Rear Exit</div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="selected-summary">
          <span className="selected-label">Selected:</span>
          {selectedSeats.sort((a, b) => a - b).map(s => (
            <span key={s} className="selected-chip">Seat {s}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeatGrid;
