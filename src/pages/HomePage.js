import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import BusCard from '../components/BusCard';
import Spinner from '../components/Spinner';
import { getAllBuses } from '../utils/api';
import './HomePage.css';

const STATS = [
  { label: 'Cities Connected', value: '500+', icon: '🗺️' },
  { label: 'Daily Trips', value: '2000+', icon: '🚌' },
  { label: 'Happy Travellers', value: '50L+', icon: '😊' },
  { label: 'Bus Partners', value: '200+', icon: '🤝' },
];

const FEATURES = [
  { icon: '🔐', title: 'Safe & Secure', desc: 'Encrypted payments and verified bus operators for your safety.' },
  { icon: '💸', title: 'Best Prices', desc: 'Compare prices and get the best deals on every route.' },
  { icon: '🎫', title: 'Instant Booking', desc: 'Book your seat in seconds and get instant confirmation.' },
  { icon: '📞', title: '24/7 Support', desc: 'Our support team is always ready to help you.' },
];

const HomePage = () => {
  const [featuredBuses, setFeaturedBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const { data } = await getAllBuses();
        setFeaturedBuses(data.buses.slice(0, 3));
      } catch (err) {
        console.error('Failed to load buses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-gradient" />
          <div className="hero-pattern" />
        </div>
        <div className="container hero-content">
          <div className="hero-text slide-down">
            <span className="hero-tag">🚌 India's Most Trusted Bus Booking</span>
            <h1 className="hero-title">
              Travel Smarter,<br />
              <span className="highlight">Book Faster</span>
            </h1>
            <p className="hero-subtitle">
              Discover hundreds of routes, compare prices, and book your perfect seat — all in one place.
            </p>
          </div>

          <div className="search-box fade-in">
            <SearchForm />
          </div>

          <div className="popular-routes">
            <span className="popular-label">Popular:</span>
            {['Mumbai → Pune', 'Delhi → Agra', 'Bangalore → Chennai', 'Mumbai → Goa'].map((r, i) => (
              <span key={i} className="route-tag">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} className="stat-item fade-in">
                <span className="stat-icon">{s.icon}</span>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose Us</span>
            <h2 className="section-title">Travel with Confidence</h2>
            <p className="section-desc">Everything you need for a comfortable journey</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card fade-in">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Buses */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top Picks</span>
            <h2 className="section-title">Featured Buses</h2>
            <p className="section-desc">Handpicked buses with the best ratings and amenities</p>
          </div>
          {loading ? <Spinner text="Loading featured buses..." /> : (
            <>
              <div className="featured-grid">
                {featuredBuses.map(bus => <BusCard key={bus._id} bus={bus} />)}
              </div>
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <Link to="/search" className="btn btn-outline btn-lg">View All Buses →</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Book Your Next Trip?</h2>
              <p>Join thousands of satisfied travellers who trust BusGo for their journeys.</p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/search" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Browse Routes</Link>
              </div>
            </div>
            <div className="cta-deco">🚌</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
