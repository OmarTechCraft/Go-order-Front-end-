import React from "react";
import { Link } from "react-router-dom";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import "../../styles/Home.css"; // Consolidated CSS file
import Navbar from "../../components/HomNav/HomeNav"; // Assuming this is your Navbar component path

// Dummy GetStartedButton component since its code wasn't provided
// If you have a separate GetStartedButton.tsx, import it instead
const GetStartedButton: React.FC = () => {
  return <button className="get-started">Get Started</button>;
};

const Home: React.FC = () => {
  return (
    <>
      {/* Navbar - Now included */}
      <div className="try">
        <Navbar />
      </div>

      {/* First Section - OfferSection */}
      <div className="offer-container">
        <img
          className="background-image"
          src="images/main.jpg"
          alt="Offer Background"
        />
        <div className="offer-text">
          <div className="offer-title">
            <h1 className="offer-heading">Claim Best Offer</h1>
            <div className="on-order-container">
              <span className="on-text">on</span>
              <span className="highlight">
                <span className="special-o">O</span>rder
              </span>
            </div>
          </div>
          <p className="tagline">“Dare to Be Different, Shop With Us”</p>
          <div className="cta-reviews">
            <Link to="/register">
              <GetStartedButton />
            </Link>
            <div className="collab-images">
              <img src="/images/girl1.jpg" alt="Customer 1" />
              <img src="/images/girl2.jpg" alt="Customer 2" />
              <img src="/images/boy11.jpg" alt="Customer 3" />
            </div>
            <div className="customer-reviews">
              <span>Our Happy Customer</span>
              <div className="stars">⭐ 4.8 (12.5k Reviews)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section - What We Serve */}
      <div className="what-we-serve-container">
        <p className="what-we-serve-title">WHAT WE SERVE</p>
        <h2 className="delivery-partner-heading">
          Your Favourite Delivery Partner
        </h2>
        <div className="services-container">
          <div className="service">
            <img src="/public/images/req.png" alt="Easy to Order" />
            <h3 className="service-title">Easy To Order</h3>
            <p className="service-description">
              You only need a few steps in ordering
            </p>
          </div>
          <div className="service">
            <img src="/public/images/take.png" alt="Fastest Delivery" />
            <h3 className="service-title">Fastest Delivery</h3>
            <p className="service-description">
              Delivery that is always on time, even faster
            </p>
          </div>
          <div className="service">
            <img src="/public/images/serve.png" alt="Best Quality" />
            <h3 className="service-title">Best Quality</h3>
            <p className="service-description">
              Not only fast, our quality is also number one
            </p>
          </div>
        </div>
      </div>

      {/* Third Section - Two Images Side by Side */}
      <div className="image-split-container">
        <img
          src="/public/images/chch.jpg"
          alt="Chef Serving Food"
          className="left-image"
        />
        <img
          src="/public/images/chch2.jpg"
          alt="Customer Review Section"
          className="right-image"
        />
      </div>

      {/* Fourth Phase - Who We Are Section */}
      <div className="phase4-content">
        <div className="phase4-text">
          <p className="about-us">About Us</p>
          <h2 className="who-we-are">Who We Are</h2>
          <p className="description1">
            GoOrder, the leading on-demand food and Q-<br></br>commerce app for
            everyday deliveries, has been<br></br> offering convenience and
            reliability to its<br></br>
            customers. We harness innovative technology<br></br> and knowledge
            to simplify everyday life for our<br></br> customers, optimize
            operations for our<br></br>
            restaurants and local shops, and provide our<br></br> riders with
            reliable earning opportunities daily.
          </p>
          <div className="cta-container">
            <p className="join-us">Join As Partner</p>
            <Link to="/register">
              <GetStartedButton />
            </Link>
          </div>
        </div>
        <div className="phase4-image-container">
          <div className="purple-background"></div>
          <img
            src="/public/images/ccare.jpg"
            alt="Customer Care"
            className="ccare-image"
          />
        </div>
      </div>

      {/* Fifth Phase - We Deliver Section */}
      <div className="phase5-container">
        <div className="phase5-image">
          <div className="truck-background"></div>
          <img src="/public/images/truck.png" alt="Delivery Truck" />
          <div className="dot yellow" style={{ top: "10%", left: "5%" }}></div>
          <div
            className="dot purple"
            style={{ top: "-13%", left: "70%" }}
          ></div>
          <div className="dot purple" style={{ top: "30%", left: "70%" }}></div>
          <div className="dot yellow" style={{ top: "85%", left: "10%" }}></div>
          <div className="dot yellow" style={{ top: "10%", left: "70%" }}></div>
          <div className="dot purple" style={{ top: "-10%", left: "0%" }}></div>
        </div>
        <div className="phase5-content">
          <h2 className="phase5-title">We Deliver</h2>
          <p className="phase5-text">
            A GoOrder rider will be along shortly to pick<br></br> up the order
            and deliver it to the customer.<br></br>
            We highly recommend other restaurants to<br></br> work with Talabat
            and experience the<br></br> benefits of their joint partnership.
            <br></br> Delivery that is always on time, even faster.
          </p>
          <div className="phase5-cta">
            <p className="join-text">Join as Deliver</p>
            <Link to="/deliver-with-us">
              <GetStartedButton />
            </Link>
          </div>
        </div>
      </div>

      {/* Sixth Phase - Download Our Application */}
      <div className="phase6-container">
        <div className="content-wrapper">
          <div className="phase6-content">
            <p className="download-app">DOWNLOAD APP</p>
            <h2 className="phase6-title">Download Our Application Now!</h2>
            <p className="phase6-text">
              Discover order wherever and whenever and get<br></br> your order
              delivered quickly.
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

      {/* Seventh Phase - Footer */}
      <div className="footer">
        <div className="footer-section goorder-section">
          <h2 className="title goorder">GoOrder</h2>
          <p className="description">
            Our job is to fill your tummy with delicious food and with fast and
            free delivery.
          </p>
          <div className="social-section">
            <h3 className="social-title">You can find us there</h3>
            <div className="separator"></div>
            <div className="social-icons">
              <a
                className="google"
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/public/images/gog.png" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/public/images/fac.png" />
              </a>
              <a
                href="https://www.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/public/images/appl.png" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-section contact-section">
          <h3 className="title contact">Contact info</h3>
          <p>
            <strong>Phone number :</strong> +(20) 1111111111
          </p>
          <p>
            <strong>Address :</strong> Egypt - Cairo
          </p>
        </div>
        <div className="footer-section help-section">
          <h3 className="title get-help">Get Help</h3>
          <p>
            <Link to="/privacy-notice">Privacy Notice</Link>
          </p>
          <p>
            <Link to="/term-condition">Terms & Conditions</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
