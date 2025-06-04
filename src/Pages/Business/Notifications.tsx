import React from "react";
import "./Notifications.css"; // adjust if your CSS path is different
import Navbar from "../../components/navbar copy/Navbar";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";

const notifications = [
  { name: "body ahmed", action: "Placed a new order", date: "22/5/2011" },
  { name: "wesam ahmed", action: "left a 5 star review", date: "22/5/2011" },
  { name: "mohamed hasan", action: "Placed a new order", date: "25/5/2011" },
  { name: "ahmed mohamed", action: "agreed to cancel", date: "22/5/2012" },
  { name: "osama mahmod", action: "Placed a new order", date: "22/5/2012" },
  { name: "marawan ahmed", action: "agreed to cancel", date: "30/5/2009" },
  { name: "aya salah", action: "Placed a new order", date: "22/5/2015" },
  { name: "salah mohamed", action: "agreed to cancel", date: "28/5/2016" },
  { name: "salah mohamed", action: "Placed a new order", date: "22/5/2006" },
  { name: "aya salah", action: "Placed a new order", date: "22/5/2015" },
  { name: "ahmed mohamed", action: "agreed to cancel", date: "22/5/2012" },
];

const Notifications: React.FC = () => {
  return (
    <div className="notifications-container">
      <Sidebar_2 />
      <div className="main-content">
        <Navbar />
        <div className="notifications-wrapper">
          <h1>Notifications</h1>
          <div className="notifications-header">
            <span>User</span>
            <span></span> {/* Middle column — no header */}
            <span className="header-date">Date</span>
          </div>
          <div className="notifications-list">
            {notifications.map((item, index) => (
              <div key={index} className="notification-item">
                {/* User Info */}
                <div className="user-info">
                  <img src="/images/avatar.png" alt={item.name} />
                  <p className="user-name">{item.name}</p>
                </div>

                {/* Message/Action */}
                <div className="action-column">
                  <p>{item.action}</p>
                </div>

                {/* Date */}
                <span className="date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
