import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import { Users, MousePointer, Grid, TrendingUp } from "lucide-react";
import Navbar from "../components/navbar/Navbar";
import {
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import axiosInstance from "../api/api";

interface DashboardData {
  totalOrders: number;
  orderRequests: number;
  totalRevenue: number;
  dailyRevenue: { [key: string]: number };
  monthlyRevenue: { [key: string]: number };
  yearlyRevenue: { [key: string]: number };
}

const Dashboard: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<"Daily" | "Monthly" | "Yearly">(
    "Daily"
  );
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/Admin/Dashboard");
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Dashboard API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Transform API data for charts
  const getChartData = () => {
    if (!dashboardData) return [];

    const revenueData =
      timeFilter === "Daily"
        ? dashboardData.dailyRevenue
        : timeFilter === "Monthly"
        ? dashboardData.monthlyRevenue
        : dashboardData.yearlyRevenue;

    return Object.entries(revenueData).map(([key, value]) => ({
      name: key,
      revenue: value,
    }));
  };

  // Get current revenue value for display
  const getCurrentRevenue = () => {
    if (!dashboardData) return "0 EGP";

    const revenueData =
      timeFilter === "Daily"
        ? dashboardData.dailyRevenue
        : timeFilter === "Monthly"
        ? dashboardData.monthlyRevenue
        : dashboardData.yearlyRevenue;

    const values = Object.values(revenueData);
    const currentValue = values[values.length - 1] || 0;
    return `${currentValue.toLocaleString()} EGP`;
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <Navbar />
        <div className="main-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <Navbar />
        <div className="main-content">
          <div className="error-container">
            <p className="error-message">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <Navbar />
      <div className="main-content">
        <div className="dashboard">
          <div className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <p>Monitor your business performance and analytics</p>
          </div>

          <div className="dashboard-grid">
            {/* Total Revenue Section */}
            <div className="total-revenue-section">
              <div className="section-header">
                <h2>Revenue Analytics</h2>
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

              <div className="revenue-display">
                <div className="revenue-value">
                  <span className="revenue-amount">{getCurrentRevenue()}</span>
                  <span className="revenue-period">{timeFilter} Revenue</span>
                </div>
                <div className="revenue-trend">
                  <TrendingUp className="trend-icon" />
                  <span className="trend-text">+12.5% from last period</span>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#bb41d0"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#bb41d0"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e8eaed",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#bb41d0"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Key Metrics Section */}
            <div className="metrics-section">
              <h2>Key Metrics</h2>

              <div className="metric-card featured">
                <div className="metric-header">
                  <div className="metric-icon total-revenue">
                    <TrendingUp size={24} />
                  </div>
                  <span className="metric-label">Total Revenue</span>
                </div>
                <div className="metric-value">
                  {dashboardData?.totalRevenue.toLocaleString()} EGP
                </div>
                <div className="metric-change positive">+15.3% this month</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon orders">
                    <Grid size={20} />
                  </div>
                  <span className="metric-label">Total Orders</span>
                </div>
                <div className="metric-value">
                  {dashboardData?.totalOrders.toLocaleString()}
                </div>
                <div className="metric-change positive">+8.2%</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon requests">
                    <MousePointer size={20} />
                  </div>
                  <span className="metric-label">Order Requests</span>
                </div>
                <div className="metric-value">
                  {dashboardData?.orderRequests.toLocaleString()}
                </div>
                <div className="metric-change positive">+12.1%</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <div className="metric-icon users">
                    <Users size={20} />
                  </div>
                  <span className="metric-label">Active Users</span>
                </div>
                <div className="metric-value">2.4K</div>
                <div className="metric-change positive">+5.7%</div>
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Section */}
          <div className="revenue-breakdown-section">
            <div className="breakdown-chart">
              <h3>Revenue Breakdown</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={getChartData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e8eaed",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#bb41d0"
                    radius={[4, 4, 0, 0]}
                    className="revenue-bar"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="summary-cards">
              <div className="summary-card">
                <h4>Performance Summary</h4>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Average Order Value</span>
                    <span className="stat-value">
                      {dashboardData?.totalOrders
                        ? Math.round(
                            dashboardData.totalRevenue /
                              dashboardData.totalOrders
                          ).toLocaleString()
                        : 0}{" "}
                      EGP
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Conversion Rate</span>
                    <span className="stat-value">
                      {dashboardData?.orderRequests &&
                      dashboardData?.totalOrders
                        ? Math.round(
                            (dashboardData.totalOrders /
                              dashboardData.orderRequests) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Growth Rate</span>
                    <span className="stat-value positive">+18.5%</span>
                  </div>
                </div>
              </div>

              <div className="summary-card">
                <h4>Quick Actions</h4>
                <div className="action-buttons">
                  <button className="action-btn primary">View Reports</button>
                  <button className="action-btn secondary">Export Data</button>
                  <button className="action-btn secondary">Settings</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
