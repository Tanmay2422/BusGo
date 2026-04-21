import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'admin@busbook.com', password: 'admin123' });

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-gradient" />
        <div className="auth-pattern" />
      </div>

      <div className="auth-container">
        <div className="auth-card scale-in">
          <div className="auth-header">
            <Link to="/" className="auth-brand">🚌 BusGo</Link>
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue your journey</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <div className="divider">or</div>

          <button className="demo-btn" onClick={fillDemo}>
            🧪 Fill Demo Credentials
          </button>

          <p className="auth-footer-text">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create account →</Link>
          </p>
        </div>

        <div className="auth-info-panel">
          <h2>Travel Smarter with BusGo</h2>
          <ul className="auth-features">
            {[
              { icon: '🎫', text: 'Instant booking confirmation' },
              { icon: '💺', text: 'Choose your preferred seats' },
              { icon: '💸', text: 'Best prices guaranteed' },
              { icon: '🔄', text: 'Easy cancellation & refunds' },
              { icon: '📱', text: 'Track your bookings anytime' }
            ].map((f, i) => (
              <li key={i}><span>{f.icon}</span> {f.text}</li>
            ))}
          </ul>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="as-number">50L+</span>
              <span className="as-label">Happy Travellers</span>
            </div>
            <div className="auth-stat">
              <span className="as-number">500+</span>
              <span className="as-label">Routes</span>
            </div>
            <div className="auth-stat">
              <span className="as-number">4.8★</span>
              <span className="as-label">App Rating</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
