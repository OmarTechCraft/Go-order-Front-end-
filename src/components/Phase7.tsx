import React from "react";
import { Link } from "react-router-dom";
import "./Phase7.css";

const Phase7: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-section goorder-section">
        <h2 className="title goorder">GoOrder</h2>
        <p className="description">
          Our job is to fill your tummy with delicious food and with fast and free delivery.
        </p>
        <div className="social-section">
          <h3 className="social-title">You can find us there</h3>
          <div className="separator"></div>
          <div className="social-icons">
            <a className="google" href="https://www.google.com" target="_blank" rel="noopener noreferrer">
              <img src="/public/images/gog.png" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src="/public/images/fac.png" />
            </a>
            <a href="https://www.apple.com" target="_blank" rel="noopener noreferrer">
              <img src="/public/images/appl.png" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-section contact-section">
        <h3 className="title contact">Contact info</h3>
        <p><strong>Phone number :</strong> +(20) 1111111111</p>
        <p><strong>Address :</strong> Egypt - Cairo</p>
      </div>

      <div className="footer-section help-section">
        <h3 className="title get-help">Get Help</h3>
        <p><Link to="/privacy-notice">Privacy Notice</Link></p>
        <p><Link to="/privacy-notice">Terms & Conditions</Link></p>
      </div>
    </div>
  );
};

export default Phase7;
