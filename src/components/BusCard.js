import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BusCard.css';

const amenityIcon = (a) => {
  const map = { WiFi: '📶', AC: '❄️', Blanket: '🛏️', Pillow: '💤', Snacks: '🍱', 'Charging Point': '🔌', 'Water Bottle': '💧' };
  return map[a] || '✓';
};

const BusCard = ({ bus, searchDate }) => {
  const navigate = useNavigate();

  const availableSeats = bus.availableSeats !== undefined
    ? bus.availableSeats
    : bus.totalSeats;

  const handleBook = () => {
    const params = new URLSearchParams();
    if (searchDate) params.set('date', searchDate);
    navigate(`/buses/${bus._id}/seats?${params.toString()}`);
  };

  const busTypeColor = {
    'AC Sleeper': '#6366f1', 'AC Seater': '#0891b2',
    'Semi-Sleeper': '#059669', 'Sleeper': '#7c3aed', 'Seater': '#d97706'
  };

  return (
    <div className="bus-card fade-in">
      <div className="bus-card-header">
        <div className="bus-info">
          <div className="bus-name-row">
            <h3 className="bus-name">{bus.busName}</h3>
            <span className="bus-type-badge" style={{ background: `${busTypeColor[bus.busType] || '#6b7280'}20`, color: busTypeColor[bus.busType] || '#6b7280' }}>
              {bus.busType}
            </span>
          </div>
          <p className="bus-number">Bus No: {bus.busNumber}</p>
        </div>
        <div className="bus-rating">
          <span className="star">★</span>
          <span>{bus.rating?.toFixed(1)}</span>
        </div>
      </div>

      <div className="bus-card-body">
        <div className="route-section">
          <div className="time-location">
            <span className="time">{bus.departureTime}</span>
            <span className="city">{bus.source}</span>
          </div>

          <div className="route-line">
            <div className="route-dot" />
            <div className="route-track">
              <span className="duration-badge">{bus.duration}</span>
            </div>
            <div className="route-dot dest" />
          </div>

          <div className="time-location dest-align">
            <span className="time">{bus.arrivalTime}</span>
            <span className="city">{bus.destination}</span>
          </div>
        </div>

        {bus.amenities?.length > 0 && (
          <div className="amenities">
            {bus.amenities.slice(0, 5).map((a, i) => (
              <span key={i} className="amenity-tag">
                {amenityIcon(a)} {a}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="bus-card-footer">
        <div className="seats-info">
          <span className={`seats-badge ${availableSeats <= 5 ? 'low' : availableSeats === 0 ? 'none' : ''}`}>
            {availableSeats === 0 ? '❌ Sold Out' : `🪑 ${availableSeats} seats left`}
          </span>
        </div>
        <div className="price-book">
          <div className="price-section">
            <span className="price-label">per seat</span>
            <span className="price">₹{bus.price?.toLocaleString()}</span>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleBook}
            disabled={availableSeats === 0}
          >
            {availableSeats === 0 ? 'Sold Out' : 'Select Seats →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusCard;
