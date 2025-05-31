import React, { useState } from "react";
import "../styles/Dashboard.css";
import { Users, MousePointer, Grid } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import { FaStar } from "react-icons/fa";
import { XAxis, Tooltip, BarChart, Bar, ResponsiveContainer } from "recharts";

const monthlySalesData = [
  { name: "Jan", revenue: 200 },
  { name: "Feb", revenue: 300 },
  { name: "Mar", revenue: 250 },
  { name: "Apr", revenue: 400 },
  { name: "May", revenue: 350 },
  { name: "Jun", revenue: 500 },
  { name: "Jul", revenue: 450 },
  { name: "Aug", revenue: 470 },
  { name: "Sep", revenue: 430 },
  { name: "Oct", revenue: 460 },
  { name: "Nov", revenue: 490 },
  { name: "Dec", revenue: 510 },
];

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"Daily" | "Monthly" | "Yearly">(
    "Daily"
  );

  // Different data points for each time filter
  const dataPoints = {
    Daily: { value: "500 EGY", position: { top: 70, left: 350 } },
    Monthly: { value: "15,000 EGY", position: { top: 90, left: 450 } },
    Yearly: { value: "180,000 EGY", position: { top: 50, left: 650 } },
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="main-content">
        <div className="dashboard">
          <div className="dashboard-grid">
            {/* Total Revenue Section */}
            <div className="total-revenue-section">
              <div className="section-header">
                <h2>Total Revenue</h2>
                <div className="time-filters">
                  {(["Daily", "Monthly", "Yearly"] as const).map((tf) => (
                    <button
                      key={tf}
                      className={`filter-btn ${
                        timeFilter === tf ? "active" : ""
                      }`}
                      onClick={() => setTimeFilter(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="chart-wrapper">
                <div
                  className="data-point"
                  style={{
                    top: `${dataPoints[timeFilter].position.top}px`,
                    left: `${dataPoints[timeFilter].position.left}px`,
                  }}
                >
                  <div className="data-point-value">
                    {dataPoints[timeFilter].value}
                  </div>
                  <div className="data-point-marker"></div>
                  <div className="data-point-line"></div>
                </div>
                <div className="revenue-chart">
                  <svg
                    width="100%"
                    height="200"
                    viewBox="0 0 800 200"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="revenueGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#bb41d0"
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor="#bb41d0"
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,150 C100,120 150,80 200,70 C250,60 300,90 350,100 C400,110 450,80 500,90 C550,100 600,120 650,110 C700,100 750,70 800,50 L800,200 L0,200 Z"
                      fill="url(#revenueGradient)"
                    />
                    <path
                      d="M0,150 C100,120 150,80 200,70 C250,60 300,90 350,100 C400,110 450,80 500,90 C550,100 600,120 650,110 C700,100 750,70 800,50"
                      fill="none"
                      stroke="#bb41d0"
                      strokeWidth="3"
                    />
                  </svg>
                  <div className="chart-labels">
                    <span>10AM</span>
                    <span>11AM</span>
                    <span>12PM</span>
                    <span>01PM</span>
                    <span>02PM</span>
                    <span>03PM</span>
                    <span>04PM</span>
                  </div>
                </div>
              </div>

              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon users">
                    <Users size={20} />
                  </div>
                  <div className="metric-label">Users</div>
                  <div className="metric-value">76.5K</div>
                  <div className="metric-change positive">25%</div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon sales">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="2"
                        y="3"
                        width="4"
                        height="18"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="10"
                        y="8"
                        width="4"
                        height="13"
                        rx="1"
                        fill="currentColor"
                      />
                      <rect
                        x="18"
                        y="5"
                        width="4"
                        height="16"
                        rx="1"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <div className="metric-label">Sales</div>
                  <div className="metric-value">76.5K</div>
                  <div className="metric-change positive">30%</div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon clicks">
                    <MousePointer size={20} />
                  </div>
                  <div className="metric-label">Clicks</div>
                  <div className="metric-value">76.5K</div>
                  <div className="metric-change positive">15%</div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon items">
                    <Grid size={20} />
                  </div>
                  <div className="metric-label">Items</div>
                  <div className="metric-value">80.3K</div>
                  <div className="metric-change positive">40%</div>
                </div>
              </div>
            </div>

            {/* Card Title Section */}
            <div className="card-title-section">
              <h2>Card Title</h2>

              <div className="card-section">
                <div className="card-section-header blue">Total Earning</div>
                <div className="card-section-value">121,900 EGP</div>
                <div className="card-section-subtext">
                  1.4% Since Last Month
                </div>
              </div>

              <div className="card-divider"></div>

              <div className="card-section">
                <div className="card-section-header blue">
                  Wallet
                  <span className="wallet-icon">
                    <img src="/photos/wallet.png" />
                  </span>
                </div>
                <div className="card-section-value">9,760 EGP</div>
              </div>

              <div className="card-divider"></div>

              <div className="card-section">
                <div className="card-section-header blue">Total Orders</div>
                <div className="card-section-value-with-icon">
                  <div className="order-icon">
                    <img src="/photos/calendar.png" />
                  </div>
                  <span>4000</span>
                </div>
              </div>

              <div className="card-decoration"></div>
            </div>
          </div>

          {/* Reviews Section - UPDATED to match Figma */}
          <div className="reviewsSection">
            <div className="reviewsHeader">
              <h4>Total Reviews this month</h4>
            </div>
            <p>
              <br />
              <strong>85,654 k</strong>
              <br />
              <FaStar className="starIcon" />
              <strong className="star-text"> 4.9</strong>
            </p>
          </div>

          {/* Monthly Sales Section - UPDATED to match Figma */}
          <div className="salesSection">
            <h4>Monthly Sales</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlySalesData}>
                <XAxis dataKey="name" />
                <Tooltip />
                <Bar
                  dataKey="revenue"
                  fill="#8A5BC6"
                  className="salesChartFill"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
