import "./App.css";
import PrivacyNotice from "./Pages/public/PrivacyNotice";
import MainTerms from "./Pages/public/MainTerms";
import Dashboard from "./Pages/Admin/Dashboard";
import Settings from "./Pages/Admin/Settings";
import PrivacyPolicy from "./Pages/Admin/PrivacyPolicy";
import TermsAndConditions from "./Pages/Admin/TermsAndConditions";
import "./i18n"; // should be before app rendering
import ImageGenerator from "./Pages/Business/image-generator/ImageGenerator";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/public/Home";
import MyLogin from "./Pages/public/Login";
import Register from "./Pages/public/Register";
import DeliverWithUs from "./Pages/public/DeliverWithUs";
import Profile from "./Pages/Admin/Profile";
import Reviews from "./Pages/Business/Reviews";
import Profile_B from "./Pages/Business/Profile_B";
import ManageBusiness from "./Pages/Admin/manage-business";
import ManageDeliveryMan from "./Pages/Admin/ManageDeliveryMan";
import AddCategory from "./Pages/Admin/AddCategory";
import AddSubcategory from "./Pages/Admin/AddSubcategory";
import AcceptRegister from "./Pages/Admin/Accept_Register";
import AddAdmin from "./Pages/Admin/AddAdmin";
import Messages from "./Pages/Business/Messages";
import AddCategoryBusiness from "./Pages/Business/AddCategoryBusiness";
import AddSubCategoryBusiness from "./Pages/Business/Add_SubCategory_Business";
import AddProductBusiness_1 from "./Pages/Business/add-product-business_1";
import BusDashboard from "./Pages/Business/BusDashboard";
import BusSettings from "./Pages/Business/BusSettings";
import BusPrivacy from "./Pages/Business/BusPrivacy";
import BusTerms from "./Pages/Business/BusTerms";
import AllOrders from "./Pages/Business/Orders/orders";
import MarketingAILayout from "./Pages/Business/MarketingAI/layout";
import MarketingRouter from "./Pages/Business/MarketingAI/marketing-router";
import ScrollToTop from './components/ScrollToTop'; // Import the new ScrollToTop component


// Temporary placeholder components for missing order components
const WaitingOrders: React.FC = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>Waiting Orders</h2>
    <p>
      This component is under development. Please create the WaitingOrders
      component.
    </p>
  </div>
);

const InProgressOrders: React.FC = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>In Progress Orders</h2>
    <p>
      This component is under development. Please create the InProgressOrders
      component.
    </p>
  </div>
);

const DoneOrders: React.FC = () => (
  <div style={{ padding: "20px", textAlign: "center" }}>
    <h2>Done Orders</h2>
    <p>
      This component is under development. Please create the DoneOrders
      component.
    </p>
  </div>
);

// Temporary OrdersProvider placeholder
const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

// Create a 404 Not Found component
const NotFound: React.FC = () => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "50px",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1
        style={{
          fontSize: "72px",
          color: "#e74c3c",
          margin: "0",
          fontWeight: "bold",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "24px",
          color: "#2c3e50",
          margin: "20px 0",
        }}
      >
        Page Not Found
      </h2>
      <p
        style={{
          fontSize: "16px",
          color: "#7f8c8d",
          marginBottom: "30px",
        }}
      >
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        style={{
          color: "#fff",
          textDecoration: "none",
          fontSize: "18px",
          backgroundColor: "#3498db",
          border: "none",
          padding: "12px 24px",
          borderRadius: "6px",
          display: "inline-block",
          transition: "background-color 0.3s ease",
          cursor: "pointer",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = "#2980b9";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = "#3498db";
        }}
      >
        Go Back Home
      </a>
    </div>
  );
};

const MyApp: React.FC = () => {
  return (
    <OrdersProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/privacy-notice" element={<PrivacyNotice />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/image-generator" element={<ImageGenerator />} />
          <Route path="/login" element={<MyLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/deliver-with-us" element={<DeliverWithUs />} />

          {/* Admin Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/manage-business" element={<ManageBusiness />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/add-subcategory" element={<AddSubcategory />} />
          <Route path="/manage-delivery" element={<ManageDeliveryMan />} />
          <Route path="/accept-register" element={<AcceptRegister />} />
          <Route path="/add-admin" element={<AddAdmin />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/settings/terms-and-conditions"
            element={<TermsAndConditions />}
          />

          {/* Business Routes */}
          <Route path="/profile_b" element={<Profile_B />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/messages" element={<Messages />} />
          <Route
            path="/add-category-business"
            element={<AddCategoryBusiness />}
          />
          <Route
            path="/add-subcategory-business"
            element={<AddSubCategoryBusiness />}
          />
          <Route
            path="/add-product-business_1"
            element={<AddProductBusiness_1 />}
          />
          <Route path="/BusDashboard" element={<BusDashboard />} />
          <Route path="/Bus-settings" element={<BusSettings />} />
          <Route path="/Bus-privacy-policy" element={<BusPrivacy />} />
          <Route path="/Bus-terms-and-conditions" element={<BusTerms />} />

          {/* Marketing AI Routes */}
          <Route
            path="/marketing-ai"
            element={
              <MarketingAILayout>
                <MarketingRouter />
              </MarketingAILayout>
            }
          />

          {/* Order Routes */}
          <Route path="/orders/all" element={<AllOrders />} />
          <Route path="/orders/waiting" element={<WaitingOrders />} />
          <Route path="/orders/in-progress" element={<InProgressOrders />} />
          <Route path="/orders/done" element={<DoneOrders />} />

          {/* Public Pages */}
          <Route path="/term-condition" element={<MainTerms />} />

          {/* 404 Catch-all Route - MUST be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </OrdersProvider>
  );
};

export default MyApp;
