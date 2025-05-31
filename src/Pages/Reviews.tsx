import React from "react";
import Sidebar_2 from "../components/Sidebar_2/Sidebar_2";
import { FaStar } from "react-icons/fa";
import "../styles/Reviews.css";
import Navbar from "../components/navbar copy/Navbar";

const Reviews: React.FC = () => {
  // Example review data
  const reviews = [
    {
      name: "Rachel pastel",
      date: "June 5, 2025",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
      avatar: "/avatar.jpg",
    },
    {
      name: "Rachel pastel",
      date: "June 5, 2025",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
      avatar: "/avatar.jpg",
    },
    {
      name: "Rachel pastel",
      date: "June 5, 2025",
      rating: 5,
      text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...",
      avatar: "/avatar.jpg",
    },
  ];

  return (
    <div className="reviews-page">
      <Sidebar_2
        name="Yaqeen"
        email="yaq24@gmail.com"
        avatarUrl="/avatar.jpg"
      />

      <div className="reviews-content">
        <Navbar />

        <h2 className="reviews-title">Reviews</h2>

        {/* Reviews Container */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div className="review-card" key={index}>
              <div className="review-card-header">
                <div className="review-card-left">
                  <img
                    src={review.avatar}
                    alt={`${review.name} avatar`}
                    className="reviewer-avatar"
                  />
                  <div>
                    <h3 className="reviewer-name">{review.name}</h3>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
                <div className="review-stars">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-right image */}
      <img
        src="/Component 1.png"
        alt="Component 1"
        className="bottom-right-image"
      />
    </div>
  );
};

export default Reviews;
