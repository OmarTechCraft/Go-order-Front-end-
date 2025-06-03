import "./App.css";
import PrivacyNotice from "./Pages/public/PrivacyNotice";
import MainTerms from "./Pages/public/MainTerms";
import Dashboard from "./Pages/Dashboard";
import Settings from "./Pages/Settings";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import TermsAndConditions from "./Pages/TermsAndConditions";
import "./i18n"; // should be before app rendering
import ImageGenerator from "./Pages/Business/image-generator/ImageGenerator";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/public/Home";
import MyLogin from "./Pages/Login";
import Register from "./Pages/Register";
import DeliverWithUs from "./Pages/DeliverWithUs";
import Profile from "./Pages/Admin/Profile";
import Reviews from "./Pages/Reviews";
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
import AddSubCategoryBusiness_2 from "./Pages/Business/add-subcategory-business_2";
import AddProductBusiness_1 from "./Pages/Business/add-product-business_1";
import "./App.css";
import BusDashboard from "./Pages/Business/BusDashboard";
import BusSettings from "./Pages/Business/BusSettings";
import BusPrivacy from "./Pages/Business/BusPrivacy";
import BusTerms from "./Pages/Business/BusTerms";
import Notifications from "./Pages/Business/Notifications";
import AllOrders from "./Pages/Business/Orders/all-orders";
import WaitingOrders from "./Pages/Business/Orders/waiting-orders";
import InProgressOrders from "./Pages/Business/Orders/in-progress-orders";
import DoneOrders from "./Pages/Business/Orders/done-orders";
import { OrdersProvider } from "./Pages/Business/Orders/context/OrdersContext";
import MarketingAILayout from "./Pages/Business/MarketingAI/layout";
import MarketingRouter from "./Pages/Business/MarketingAI/marketing-router";

const MyApp: React.FC = () => {
  return (
    <OrdersProvider>
      <Router>
        <Routes>
          <Route path="" element={<Home />} />
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile_b" element={<Profile_B />} />
          <Route path="/manage-business" element={<ManageBusiness />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/add-subcategory" element={<AddSubcategory />} />
          <Route path="/manage-delivery" element={<ManageDeliveryMan />} />
          <Route path="/accept-register" element={<AcceptRegister />} />
          <Route path="/add-admin" element={<AddAdmin />} />
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
          <Route path="/BusDashboard" element={<BusDashboard />} />
          <Route path="/Bus-settings" element={<BusSettings />} />
          <Route path="Bus-privacy-policy" element={<BusPrivacy />} />
          <Route path="Bus-terms-and-conditions" element={<BusTerms />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route
            path="/marketing-ai"
            element={
              <MarketingAILayout>
                <MarketingRouter />
              </MarketingAILayout>
            }
          />

          <Route path="/orders/all" element={<AllOrders />} />

          <Route path="/privacy-notice" element={<PrivacyNotice />} />
          <Route path="/term-condition" element={<MainTerms />} />

          <Route path="/orders/waiting" element={<WaitingOrders />} />
          <Route path="/orders/in-progress" element={<InProgressOrders />} />
          <Route path="/orders/done" element={<DoneOrders />} />

          <Route
            path="/add-subcategory-business_2"
            element={<AddSubCategoryBusiness_2 />}
          />
          <Route
            path="/add-product-business_1"
            element={<AddProductBusiness_1 />}
          />

          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/settings/terms-and-conditions"
            element={<TermsAndConditions />}
          />
        </Routes>
      </Router>
    </OrdersProvider>
  );
};

export default MyApp;
