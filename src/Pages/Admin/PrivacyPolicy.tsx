import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PrivacyPolicy.css"; // The specified CSS file
import { FaArrowLeft } from "react-icons/fa"; // Back button icon
import Navbar from "../../components/navbar/Navbar"; // Assuming Navbar handles its own fixed/sticky positioning

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <>
      <Navbar /> {/* Renders the navigation bar component */}

      {/* Main content area, pushed down to prevent overlap with the Navbar */}
      <div className="main-content">
        {/* Container for the terms and conditions content, styled with animations and layout */}
        <div className="terms-container">
          {/* Header section containing the back button and the page title */}
          <div className="terms-header">
            {/* Back button to navigate to the settings page */}
            <button
              className="back-button"
              onClick={() => navigate("/settings")}
              aria-label="Go back to settings" // Accessibility: describes the button's purpose
            >
              <FaArrowLeft className="back-icon" /> {/* Displays the left arrow icon */}
            </button>
            {/* Main title of the page, now consistent with the component name */}
            <h1 className="header1">Privacy & Policy</h1>
          </div>

          {/* Introduction to GoOrder's terms */}
          <p>
            Welcome to <strong>GoOrder</strong>, a mobile application that
            connects you with local restaurants and enables you to order food
            for delivery. By accessing or using the GoOrder app or services
            (collectively, the "Services"), you agree to be bound by these Terms
            & Conditions. If you do not agree to these Terms & Conditions,
            please do not use our Services.
          </p>

          {/* Section 1: Details on the Use of Services */}
          <h2>1. Use of Services</h2>
          <p>
            By using the Services, you agree to comply with these Terms &
            Conditions. You must be at least 18 years old or have parental
            consent to use our Services. You are responsible for maintaining the
            confidentiality of your account information and for all activities
            that occur under your account.
          </p>

          {/* Section 2: User Responsibilities */}
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

          {/* Section 3: Information on Orders and Payments */}
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

          {/* Section 4: Details regarding Delivery */}
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

          {/* Section 5: Data Privacy Policies */}
          <h2>5. Data Privacy</h2>
          <p>
            We collect, store, and process personal data as described in our
            Privacy Policy.
          </p>

          {/* Section 6: Account Termination Policies */}
          <h2>6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account if you
            violate these terms or any applicable laws.
          </p>

          {/* Section 7: Limitation of Liability */}
          <h2>7. Limitation of Liability</h2>
          <p>
            The Services are provided "as is" and "as available" without any
            warranties, express or implied. GoOrder is not responsible for any
            indirect, incidental, special, or consequential damages resulting
            from the use of our services.
          </p>

          {/* Section 8: Changes to Terms & Conditions */}
          <h2>8. Changes to Terms & Conditions</h2>
          <p>
            We may update these Terms & Conditions from time to time to reflect
            changes in our policies, services, or legal requirements.
          </p>

          {/* Section 9: Contact Information */}
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

export default PrivacyPolicy;
