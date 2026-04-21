import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getBookingById } from '../utils/api';
import Spinner from '../components/Spinner';
import './BookingConfirmPage.css';

const BookingConfirmPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!location.state?.booking);

  useEffect(() => {
    if (!booking) {
      getBookingById(id)
        .then(({ data }) => setBooking(data.booking))
        .catch(() => navigate('/my-bookings'))
        .finally(() => setLoading(false));
    }
  }, [id, booking, navigate]);

  if (loading) return <Spinner text="Loading your booking..." />;
  if (!booking) return null;

  const bus = booking.bus;
  const travelDate = new Date(booking.travelDate).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
  const bookedOn = new Date(booking.createdAt).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="confirm-page">
      <div className="container">
        {/* Success Banner */}
        <div className="success-banner fade-in">
          <div className="success-icon-ring">
            <span className="success-icon">✓</span>
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your seats have been reserved successfully. Have a wonderful journey! 🎉</p>
          <div className="booking-ref">
            <span className="ref-label">Booking Reference</span>
            <span className="ref-value">{booking.bookingReference}</span>
          </div>
        </div>

        <div className="confirm-layout">
          {/* Ticket Card */}
          <div className="ticket-card scale-in">
            <div className="ticket-header">
              <div className="ticket-logo">🚌 BusGo</div>
              <div className="ticket-status">
                <span className="badge badge-success">✓ Confirmed</span>
              </div>
            </div>

            {/* Tear Line */}
            <div className="tear-line">
              <div className="tear-circle left" />
              <div className="tear-dashes" />
              <div className="tear-circle right" />
            </div>

            <div className="ticket-body">
              {/* Route */}
              <div className="ticket-route">
                <div className="ticket-city">
                  <span className="tc-time">{bus.departureTime}</span>
                  <span className="tc-name">{bus.source}</span>
                </div>
                <div className="ticket-route-line">
                  <div className="trl-dot" />
                  <div className="trl-track">
                    <span className="trl-duration">{bus.duration}</span>
                  </div>
                  <div className="trl-dot dest" />
                </div>
                <div className="ticket-city right">
                  <span className="tc-time">{bus.arrivalTime}</span>
                  <span className="tc-name">{bus.destination}</span>
                </div>
              </div>

              {/* Info Grid */}
              <div className="ticket-info-grid">
                <div className="ticket-info-item">
                  <span className="ti-label">Bus Name</span>
                  <span className="ti-value">{bus.busName}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ti-label">Bus Type</span>
                  <span className="ti-value">{bus.busType}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ti-label">Travel Date</span>
                  <span className="ti-value">{travelDate}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ti-label">Seat Numbers</span>
                  <span className="ti-value seats-list">
                    {booking.seats.map(s => (
                      <span key={s.seatNumber} className="seat-chip">Seat {s.seatNumber}</span>
                    ))}
                  </span>
                </div>
                <div className="ticket-info-item">
                  <span className="ti-label">Booked On</span>
                  <span className="ti-value">{bookedOn}</span>
                </div>
                <div className="ticket-info-item">
                  <span className="ti-label">Payment</span>
                  <span className="ti-value">
                    <span className="badge badge-success">{booking.paymentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Passengers */}
              <div className="ticket-passengers">
                <h4>Passengers</h4>
                <div className="passenger-list">
                  {booking.seats.map((s, i) => (
                    <div key={i} className="ticket-passenger-row">
                      <div className="tpr-left">
                        <div className="tpr-avatar">{s.passengerName?.charAt(0)}</div>
                        <div>
                          <div className="tpr-name">{s.passengerName}</div>
                          <div className="tpr-meta">{s.passengerAge} yrs · {s.passengerGender}</div>
                        </div>
                      </div>
                      <span className="tpr-seat">Seat {s.seatNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="ticket-total">
                <span>Total Amount Paid</span>
                <span className="ticket-amount">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions Sidebar */}
          <div className="confirm-actions">
            <div className="card action-card">
              <h3>What's Next?</h3>
              <div className="action-steps">
                <div className="action-step">
                  <span className="as-icon">📱</span>
                  <div>
                    <div className="as-title">Save your booking</div>
                    <div className="as-desc">Take a screenshot of your booking reference.</div>
                  </div>
                </div>
                <div className="action-step">
                  <span className="as-icon">🕐</span>
                  <div>
                    <div className="as-title">Arrive on time</div>
                    <div className="as-desc">Be at the boarding point at least 15 minutes early.</div>
                  </div>
                </div>
                <div className="action-step">
                  <span className="as-icon">🪪</span>
                  <div>
                    <div className="as-title">Carry your ID</div>
                    <div className="as-desc">Bring a valid government photo ID for boarding.</div>
                  </div>
                </div>
              </div>
              <div className="action-buttons">
                <Link to="/my-bookings" className="btn btn-primary btn-full">View My Bookings</Link>
                <Link to="/" className="btn btn-outline btn-full">Book Another Trip</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmPage;
