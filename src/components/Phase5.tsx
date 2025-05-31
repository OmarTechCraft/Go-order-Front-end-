import React from "react";
import "./Phase5.css"; // Ensure styles are updated
import GetStartedButton from "./GetStartedButton"; // Ensure this component is correctly imported

const Phase5: React.FC = () => {
  return (
    <div className="phase5-container">
      {/* Left Side: Image */}
      <div className="phase5-image">
        <div className="truck-background"></div> {/* Semi-transparent background */}
        <img src="/public/images/truck.png" alt="Delivery Truck" />
        
        {/* Flying Dots */}
        <div className="dot yellow" style={{ top: "10%", left: "5%" }}></div>
        <div className="dot purple" style={{ top: "-13%", left: "70%" }}></div>
        <div className="dot purple" style={{ top: "30%", left: "70%" }}></div>
        <div className="dot yellow" style={{ top: "85%", left: "10%" }}></div>
        <div className="dot yellow" style={{ top: "10%", left: "70%" }}></div>
        <div className="dot purple" style={{ top: "-10%", left: "0%" }}></div>
      </div>

      {/* Right Side: Text Content */}
      <div className="phase5-content">
        <h2 className="phase5-title">We Deliver</h2>
        <p className="phase5-text">
          A GoOrder rider will be along shortly to pick<br></br> up the order and deliver it to the customer.<br></br>
          We highly recommend other restaurants to<br></br> work with Talabat and experience the<br></br> benefits of 
          their joint partnership.<br></br> Delivery that is always on time, even faster.
        </p>
        <div className="phase5-cta">
          <span className="join-text" >Join as Deliver</span>
          <GetStartedButton  /> 
        </div>
      </div>
    </div>
  );
};

export default Phase5;