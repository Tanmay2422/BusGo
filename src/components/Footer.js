import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">🚌 BusGo</div>
        <p>Your trusted partner for comfortable and affordable bus travel across India.</p>
      </div>

      <div className="footer-links">
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/search">Find Buses</Link>
          <Link to="/my-bookings">My Bookings</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Cancellation Policy</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Popular Routes</h4>
          <a href="#">Mumbai → Pune</a>
          <a href="#">Delhi → Agra</a>
          <a href="#">Bangalore → Chennai</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div className="container">
        <p>© {new Date().getFullYear()} BusGo. All rights reserved. Built with ❤️ for travellers.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
