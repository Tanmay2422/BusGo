import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { strength: 0, label: '', color: '' };
    if (p.length < 6) return { strength: 1, label: 'Too short', color: '#e74c3c' };
    if (p.length < 8 || !/[0-9]/.test(p)) return { strength: 2, label: 'Weak', color: '#e67e22' };
    if (!/[A-Z]/.test(p) || !/[^a-zA-Z0-9]/.test(p)) return { strength: 3, label: 'Good', color: '#f1c40f' };
    return { strength: 4, label: 'Strong', color: '#2ecc71' };
  };

  const pwStrength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Please enter your name.'); return; }
    if (!form.email) { setError('Please enter your email.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');
    try {
      await register({ name: form.name.trim(), email: form.email, password: form.password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1>Create account</h1>
            <p>Join thousands of travellers booking with BusGo</p>
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                maxLength={50}
                required
              />
            </div>

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
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1,2,3,4].map(n => (
                      <div key={n} className="strength-bar" style={{ background: n <= pwStrength.strength ? pwStrength.color : '#e5e7eb' }} />
                    ))}
                  </div>
                  <span className="strength-label" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="field-error">⚠️ Passwords don't match</p>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? <><div className="spinner spinner-sm" /> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <p className="auth-terms">
            By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>

          <p className="auth-footer-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in →</Link>
          </p>
        </div>

        <div className="auth-info-panel">
          <h2>Why join BusGo?</h2>
          <ul className="auth-features">
            {[
              { icon: '🎫', text: 'Book tickets in under 60 seconds' },
              { icon: '💰', text: 'Exclusive member discounts & offers' },
              { icon: '📋', text: 'Track all your bookings in one place' },
              { icon: '🔔', text: 'Get real-time trip notifications' },
              { icon: '⚡', text: 'Priority customer support' }
            ].map((f, i) => (
              <li key={i}><span>{f.icon}</span> {f.text}</li>
            ))}
          </ul>
          <div className="auth-stat-row">
            <div className="auth-stat">
              <span className="as-number">Free</span>
              <span className="as-label">Membership</span>
            </div>
            <div className="auth-stat">
              <span className="as-number">60s</span>
              <span className="as-label">Avg Booking Time</span>
            </div>
            <div className="auth-stat">
              <span className="as-number">100%</span>
              <span className="as-label">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
