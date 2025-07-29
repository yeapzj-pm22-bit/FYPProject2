 import React, { useState, useRef, useEffect } from 'react';
 import {
   User,
   Settings,
   LogOut,
   Bell,
   Search,
   Calendar,
   FileText,
   Heart,
   Shield,
   Phone,
   Mail,
   MapPin,
   ChevronDown,
   Menu,
   X
 } from 'lucide-react';

 function Footer() {
 return (

<footer className="footer">

          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>HealthCare+</h3>
                <p style={{ color: '#d1d5db', marginBottom: '20px' }}>
                  Your trusted partner in healthcare management. Providing quality care
                  and convenient access to medical services.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Heart size={24} color="#667eea" />
                </div>
              </div>

              <div className="footer-section">
                <h3>Quick Links</h3>
                <ul className="footer-links">
                  <li><a href="#">Book Appointment</a></li>
                  <li><a href="#">Find Doctor</a></li>
                  <li><a href="#">Medical Records</a></li>
                  <li><a href="#">Prescriptions</a></li>
                  <li><a href="#">Lab Results</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Services</h3>
                <ul className="footer-links">
                  <li><a href="#">General Medicine</a></li>
                  <li><a href="#">Cardiology</a></li>
                  <li><a href="#">Dermatology</a></li>
                  <li><a href="#">Pediatrics</a></li>
                  <li><a href="#">Emergency Care</a></li>
                </ul>
              </div>

              <div className="footer-section">
                <h3>Contact Us</h3>
                <div className="contact-info">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-info">
                  <Mail size={16} />
                  <span>support@healthcare.com</span>
                </div>
                <div className="contact-info">
                  <MapPin size={16} />
                  <span>123 Health St, Medical City, MC 12345</span>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2024 HealthCare+. All rights reserved. | Privacy Policy | Terms of Service</p>
            </div>
          </div>
        </footer>
);
}

export default Footer;