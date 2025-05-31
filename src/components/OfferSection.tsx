import React from "react";
import "./OfferSection.css";
import GetStartedButton from "./GetStartedButton";


const OfferSection: React.FC = () => {
  return (
    <>
      {/* First Section */}
      <div className="offer-container">
        <img className="background-image" src="images/main.jpg" alt="Offer Background" />

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
            <GetStartedButton />
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
        <h2 className="delivery-partner-heading">Your Favourite Delivery Partner</h2>

        <div className="services-container">
          <div className="service">
            <img src="/public/images/req.png" alt="Easy to Order" />
            <h3 className="service-title">Easy To Order</h3>
            <p className="service-description">You only need a few steps in ordering</p>
          </div>
          <div className="service">
            <img src="/public/images/take.png" alt="Fastest Delivery" />
            <h3 className="service-title">Fastest Delivery</h3>
            <p className="service-description">Delivery that is always on time, even faster</p>
          </div>
          <div className="service">
            <img src="/public/images/serve.png" alt="Best Quality" />
            <h3 className="service-title">Best Quality</h3>
            <p className="service-description">Not only fast, our quality is also number one</p>
          </div>
        </div>
      </div>

      {/* Third Section - Two Images Side by Side */}
      <div className="phase3">
        <div className="image-container">
          <img src="/public/images/chch.png" alt="Chef Serving Food" className="phase3-image" />
          <img src="/public/images/chch2.png" alt="Customer Review Section" className="phase3-image" />
        </div>
      </div>

  {/* Fourth Phase - Who We Are Section */}
 {/* Fourth Phase - Who We Are Section */}
 <div className="phase4-content">
  {/* Left Side (Text) */}
  <div className="phase4-text">
    <p className="about-us">About Us</p>
    <h2 className="who-we-are">Who We Are</h2>
    <p className="description1">
      GoOrder, the leading on-demand food and Q-<br></br>commerce app for everyday
      deliveries, has been<br></br> offering convenience and reliability to its<br></br>
      customers. We harness innovative technology<br></br> and knowledge to simplify
      everyday life for our<br></br> customers, optimize operations for our<br></br>
      restaurants and local shops, and provide our<br></br> riders with reliable
      earning opportunities daily.
    </p>
    <div className="cta-container">
      <p className="join-us">Join As Partner</p>
      <GetStartedButton />
      </div>
  </div>

  {/* Right Side (Image with Background) */}
  <div className="phase4-image-container">
    <div className="purple-background"></div>
    <img src="/public/images/ccare.png" alt="Customer Care" className="ccare-image" />
  </div>
</div>


    </>
  );
};

export default OfferSection;