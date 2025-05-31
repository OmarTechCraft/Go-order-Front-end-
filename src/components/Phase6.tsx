import React from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import "./Phase6.css";

const Phase6: React.FC = () => {
  return (
    <div className="phase6-container">
      <div className="content-wrapper">
        <div className="phase6-content">
          <p className="download-app">DOWNLOAD APP</p>
          <h2 className="phase6-title">Download Our Application Now!</h2>
          <p className="phase6-text">
            Discover order wherever and whenever and get<br></br> your order delivered quickly.
          </p>
          <div className="download-links">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn google-play"
            >
              <FaGooglePlay className="icon" />
              <span>
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </span>
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
              className="download-btn app-store"
            >
              <FaApple className="icon" />
              <span>
                <small>Download on the</small>
                <strong>App Store</strong>
              </span>
            </a>
          </div>
        </div>
        <div className="phase6-image">
          <img src="/public/images/apps.png" alt="App Preview" />
        </div>
      </div>
    </div>
  );
};

export default Phase6;