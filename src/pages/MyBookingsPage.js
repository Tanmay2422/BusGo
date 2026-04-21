import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import './MyBookingsPage.css';

const statusColors = {
  Confirmed: { bg: '#dcfce7', color: '#15803d' },
  Cancelled: { bg: '#fee2e2', color: '#b91c1c' },
  Pending: { bg: '#fef9c3', color: '#854d0e' }
};

const MyBookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [success, setSuccess] = useState('');

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? You will receive a full refund.')) return;
    setCancelling(bookingId);
    setError('');
    try {
      await cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully. Refund will be processed within 3-5 business days.');
      fetchBookings();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.bookingStatus.toLowerCase() === filter);

  const counts = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === 'Confirmed').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'Cancelled').length
  };

  const isFuture = (date) => new Date(date) > new Date();

  if (loading) return <Spinner text="Loading your bookings..." />;

  return (
    <div className="my-bookings-page">
      <div className="container">
        {/* Header */}
        <div className="bookings-header">
          <div>
            <h1>My Bookings</h1>
            <p className="text-muted">Welcome back, <strong>{user?.name}</strong>. Here are all your trips.</p>
          </div>
          <Link to="/" className="btn btn-primary">+ Book New Trip</Link>
        </div>

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {[
            { key: 'all', label: 'All Trips' },
            { key: 'confirmed', label: 'Upcoming' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map(tab => (
            <button
              key={tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
              <span className="tab-count">{counts[tab.key]}</span>
            </button>
          ))}
        </div>

        {/* Booking Cards */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <h3>No bookings found</h3>
            <p>{filter === 'all' ? "You haven't booked any trips yet. Start your journey!" : `No ${filter} bookings found.`}</p>
            <Link to="/" className="btn btn-primary">Search Buses</Link>
          </div>
        ) : (
          <div className="bookings-list">
            {filtered.map((booking, i) => {
              const bus = booking.bus;
              const travelDate = new Date(booking.travelDate).toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
              });
              const upcoming = isFuture(booking.travelDate) && booking.bookingStatus === 'Confirmed';
              const statusStyle = statusColors[booking.bookingStatus] || {};

              return (
                <div key={booking._id} className="booking-card fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  {upcoming && <div className="upcoming-ribbon">Upcoming</div>}

                  <div className="booking-card-header">
                    <div className="booking-ref-block">
                      <span className="bref-label">Booking Ref</span>
                      <span className="bref-value">{booking.bookingReference}</span>
                    </div>
                    <div className="booking-header-right">
                      <span
                        className="booking-status-badge"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                      >
                        {booking.bookingStatus === 'Confirmed' ? '✓ ' : booking.bookingStatus === 'Cancelled' ? '✗ ' : '⏳ '}
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  <div className="booking-card-body">
                    {/* Bus + Route */}
                    <div className="booking-route-section">
                      <div className="booking-bus-name">{bus?.busName}</div>
                      <div className="booking-bus-sub">{bus?.busType} · {bus?.busNumber}</div>
                      <div className="booking-route-display">
                        <div className="brd-city">
                          <span className="brd-time">{bus?.departureTime}</span>
                          <span className="brd-name">{bus?.source}</span>
                        </div>
                        <div className="brd-line">
                          <div className="brd-dot" />
                          <div className="brd-track" />
                          <div className="brd-dot" />
                        </div>
                        <div className="brd-city">
                          <span className="brd-time">{bus?.arrivalTime}</span>
                          <span className="brd-name">{bus?.destination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details-grid">
                      <div className="bd-item">
                        <span className="bd-label">Travel Date</span>
                        <span className="bd-value">📅 {travelDate}</span>
                      </div>
                      <div className="bd-item">
                        <span className="bd-label">Seats</span>
                        <span className="bd-value">
                          {booking.seats.map(s => (
                            <span key={s.seatNumber} className="mini-seat-chip">S{s.seatNumber}</span>
                          ))}
                        </span>
                      </div>
                      <div className="bd-item">
                        <span className="bd-label">Passengers</span>
                        <span className="bd-value">{booking.seats.length} person{booking.seats.length !== 1 ? 's' : ''}</span>
                      </div>
                      <div className="bd-item">
                        <span className="bd-label">Payment</span>
                        <span className="bd-value">
                          <span className={`badge ${booking.paymentStatus === 'Paid' ? 'badge-success' : booking.paymentStatus === 'Refunded' ? 'badge-gold' : 'badge-gray'}`}>
                            {booking.paymentStatus}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Passenger Names */}
                    <div className="passenger-names">
                      {booking.seats.map((s, i) => (
                        <span key={i} className="pname-tag">
                          👤 {s.passengerName} (S{s.seatNumber})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="booking-card-footer">
                    <div className="booking-amount">
                      <span className="ba-label">Total Paid</span>
                      <span className="ba-value">₹{booking.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="booking-actions">
                      <Link to={`/booking-confirm/${booking._id}`} className="btn btn-outline btn-sm">
                        View Details
                      </Link>
                      {upcoming && (
                        <button
                          className="btn btn-sm"
                          style={{ background: '#fee2e2', color: '#b91c1c', border: 'none' }}
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelling === booking._id}
                        >
                          {cancelling === booking._id ? <><div className="spinner spinner-sm" /> Cancelling</> : '✗ Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
