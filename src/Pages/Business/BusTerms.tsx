import React from "react";
import { useNavigate } from "react-router-dom";
import "./BusTerms.css";
import { FaArrowLeft } from "react-icons/fa"; // This will be used for the back button
import Navbar from "../../components/navbar copy/Navbar";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
const TermsConditions: React.FC = () => {
  const navigate = useNavigate();

  const User = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "/images/avatar.png",
  };

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Sidebar_2
          name={User.name}
          email={User.email}
          avatarUrl={User.avatarUrl}
        />
        <div className="terms-container">
          <div className="terms-header">
            <button
              className="back-button"
              onClick={() => navigate("/bus-settings")}
            >
              <FaArrowLeft />
            </button>
            <h1>Terms & Conditions</h1>
          </div>
          <p>
            Welcome to <strong>GoOrder</strong>, a mobile application that
            connects you with local restaurants and enables you to order food
            for delivery. By accessing or using the GoOrder app or services
            (collectively, the "Services"), you agree to be bound by these Terms
            & Conditions. If you do not agree to these Terms & Conditions,
            please do not use our Services.
          </p>

          <h2>1. Use of Services</h2>
          <p>
            By using the Services, you agree to comply with these Terms &
            Conditions. You must be at least 18 years old or have parental
            consent to use our Services. You are responsible for maintaining the
            confidentiality of your account information and for all activities
            that occur under your account.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete registration information.</li>
            <li>
              Use the Services only for lawful purposes and in compliance with
              these Terms.
            </li>
            <li>
              Not use the Services for any fraudulent, harmful, or illegal
              activity.
            </li>
            <li>
              Not impersonate another person or misrepresent your identity.
            </li>
          </ul>

          <h2>3. Orders and Payments</h2>
          <ul>
            <li>
              By placing an order, you agree to pay the total amount at
              checkout.
            </li>
            <li>
              Orders are subject to availability, and we reserve the right to
              refuse or cancel any order.
            </li>
            <li>
              Payments are securely processed through a third-party payment
              provider.
            </li>
          </ul>

          <h2>4. Delivery</h2>
          <ul>
            <li>Delivery times are estimates and may vary.</li>
            <li>
              We are not responsible for delays caused by restaurants, traffic,
              or unforeseen circumstances.
            </li>
            <li>
              Users must ensure accurate delivery details to avoid any delays or
              failed deliveries.
            </li>
          </ul>

          <h2>5. Data Privacy</h2>
          <p>
            We collect, store, and process personal data as described in our
            Privacy Policy.
          </p>

          <h2>6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these terms or any applicable laws.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            The Services are provided "as is" and "as available" without any
            warranties, express or implied. GoOrder is not responsible for any
            indirect, incidental, special, or consequential damages resulting
            from the use of our services.
          </p>

          <h2>8. Changes to Terms & Conditions</h2>
          <p>
            We may update these Terms & Conditions from time to time to reflect
            changes in our policies, services, or legal requirements.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about these Terms & Conditions, please
            contact us at:
          </p>
          <ul>
            <li>Email: support@goorder.com</li>
            <li>Phone: +1 123-456-7890</li>
            <li>Address: GoOrder, 123 Main Street, City, Country</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;
