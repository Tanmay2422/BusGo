import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid';
import Spinner from '../components/Spinner';
import { getBusById, createBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import './SeatSelectionPage.css';

const GENDERS = ['Male', 'Female', 'Other'];

const SeatSelectionPage = () => {
  const { id } = useParams();
  const [urlParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const travelDate = urlParams.get('date') || new Date().toISOString().split('T')[0];

  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [step, setStep] = useState(1); // 1: seats, 2: passengers, 3: review
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const { data } = await getBusById(id, travelDate);
        setBus(data.bus);
        setBookedSeats(data.bus.bookedSeats || []);
      } catch (err) {
        setError('Failed to load bus details. Please go back and try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBus();
  }, [id, travelDate]);

  // Sync passengers array with selected seats
  useEffect(() => {
    setPassengers(prev => {
      return selectedSeats.map((seatNum, idx) => ({
        seatNumber: seatNum,
        passengerName: prev[idx]?.passengerName || (idx === 0 ? user?.name || '' : ''),
        passengerAge: prev[idx]?.passengerAge || '',
        passengerGender: prev[idx]?.passengerGender || 'Male'
      }));
    });
  }, [selectedSeats, user]);

  const handlePassengerChange = (idx, field, value) => {
    setPassengers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  };

  const handleProceedToPassengers = () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }
    setError('');
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReview = () => {
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.passengerName.trim()) { setError(`Please enter name for passenger ${i + 1}.`); return; }
      if (!p.passengerAge || p.passengerAge < 1 || p.passengerAge > 120) { setError(`Please enter valid age for passenger ${i + 1}.`); return; }
    }
    setError('');
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBooking = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await createBooking({
        busId: id,
        travelDate,
        seats: passengers
      });
      navigate(`/booking-confirm/${data.booking._id}`, { state: { booking: data.booking } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
      setStep(1);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading seat map..." />;
  if (!bus) return (
    <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
      <p className="alert alert-error">{error || 'Bus not found.'}</p>
      <button className="btn btn-primary mt-2" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  const totalAmount = selectedSeats.length * bus.price;
  const formattedDate = new Date(travelDate + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div className="seat-selection-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <button className="back-btn" onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)}>
            ← {step > 1 ? 'Back' : 'Change Bus'}
          </button>
          <div className="route-display">
            <span className="route-city">{bus.source}</span>
            <span className="route-arrow">→</span>
            <span className="route-city">{bus.destination}</span>
          </div>
          <span className="date-display">📅 {formattedDate}</span>
        </div>

        {/* Steps */}
        <div className="steps-indicator">
          {['Select Seats', 'Passenger Details', 'Review & Pay'].map((label, i) => (
            <div key={i} className={`step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span className="step-label">{label}</span>
              {i < 2 && <div className="step-line" />}
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="selection-layout">
          {/* Left: Dynamic content per step */}
          <div className="selection-main">

            {/* Step 1: Seat Map */}
            {step === 1 && (
              <div className="card step-card fade-in">
                <div className="card-header-custom">
                  <h3>Choose Your Seats</h3>
                  <span className="seat-count-badge">
                    {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <div className="seat-grid-section">
                  <SeatGrid
                    totalSeats={bus.totalSeats}
                    bookedSeats={bookedSeats}
                    selectedSeats={selectedSeats}
                    onSeatToggle={setSelectedSeats}
                    maxSelectable={6}
                  />
                </div>
                <div className="step-footer">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleProceedToPassengers}
                    disabled={selectedSeats.length === 0}
                  >
                    Continue with {selectedSeats.length} Seat{selectedSeats.length !== 1 ? 's' : ''} →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Passenger Details */}
            {step === 2 && (
              <div className="card step-card fade-in">
                <div className="card-header-custom">
                  <h3>Passenger Details</h3>
                  <span className="text-muted text-sm">Fill in details for each passenger</span>
                </div>
                <div className="passengers-form">
                  {passengers.map((p, idx) => (
                    <div key={idx} className="passenger-card">
                      <div className="passenger-header">
                        <div className="passenger-badge">Passenger {idx + 1}</div>
                        <div className="seat-tag">Seat {p.seatNumber}</div>
                      </div>
                      <div className="passenger-fields">
                        <div className="form-group">
                          <label className="form-label">Full Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Enter full name"
                            value={p.passengerName}
                            onChange={e => handlePassengerChange(idx, 'passengerName', e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label className="form-label">Age *</label>
                            <input
                              type="number"
                              className="form-input"
                              placeholder="Age"
                              value={p.passengerAge}
                              onChange={e => handlePassengerChange(idx, 'passengerAge', e.target.value)}
                              min="1" max="120"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Gender *</label>
                            <select
                              className="form-select"
                              value={p.passengerGender}
                              onChange={e => handlePassengerChange(idx, 'passengerGender', e.target.value)}
                            >
                              {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="step-footer">
                  <button className="btn btn-primary btn-lg" onClick={handleProceedToReview}>
                    Review Booking →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card step-card fade-in">
                <div className="card-header-custom">
                  <h3>Review Your Booking</h3>
                  <span className="text-muted text-sm">Please verify all details before confirming</span>
                </div>
                <div className="review-section">
                  <div className="review-bus-info">
                    <h4>{bus.busName}</h4>
                    <p className="text-muted text-sm">{bus.busType} · {bus.busNumber}</p>
                    <div className="review-route">
                      <div className="review-time-city">
                        <span className="rv-time">{bus.departureTime}</span>
                        <span className="rv-city">{bus.source}</span>
                      </div>
                      <div className="rv-line">
                        <span className="rv-duration">{bus.duration}</span>
                      </div>
                      <div className="review-time-city">
                        <span className="rv-time">{bus.arrivalTime}</span>
                        <span className="rv-city">{bus.destination}</span>
                      </div>
                    </div>
                    <p className="review-date">📅 {formattedDate}</p>
                  </div>

                  <div className="review-passengers">
                    <h4>Passengers</h4>
                    {passengers.map((p, i) => (
                      <div key={i} className="review-passenger-row">
                        <div className="rp-left">
                          <span className="rp-num">{i + 1}</span>
                          <div>
                            <div className="rp-name">{p.passengerName}</div>
                            <div className="rp-details">{p.passengerAge} yrs · {p.passengerGender}</div>
                          </div>
                        </div>
                        <span className="rp-seat">Seat {p.seatNumber}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="step-footer">
                  <div className="booking-total">
                    <span className="total-label">Total Amount</span>
                    <span className="total-value">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <button
                    className="btn btn-success btn-lg"
                    onClick={handleBooking}
                    disabled={submitting}
                  >
                    {submitting ? <><div className="spinner spinner-sm" /> Confirming...</> : '✅ Confirm & Pay ₹' + totalAmount.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Summary Card */}
          <aside className="booking-summary">
            <div className="card summary-card">
              <div className="summary-header">Booking Summary</div>
              <div className="summary-body">
                <div className="summary-bus">
                  <div className="summary-bus-name">{bus.busName}</div>
                  <div className="summary-bus-type">{bus.busType}</div>
                </div>
                <div className="summary-row">
                  <span>Route</span>
                  <span>{bus.source} → {bus.destination}</span>
                </div>
                <div className="summary-row">
                  <span>Departure</span>
                  <span>{bus.departureTime}</span>
                </div>
                <div className="summary-row">
                  <span>Date</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="summary-row">
                  <span>Seats</span>
                  <span>{selectedSeats.length > 0 ? selectedSeats.sort((a,b)=>a-b).join(', ') : '—'}</span>
                </div>
                <div className="summary-row">
                  <span>Price/Seat</span>
                  <span>₹{bus.price}</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
