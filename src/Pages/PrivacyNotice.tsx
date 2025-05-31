import React from "react";
import Navbar from "../components/Navbar"; // Adjust path if necessary
import "./PrivacyNotice.css";

const PrivacyNotice: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="privacy-policy-container">
      <h1><strong>Privacy & Policy</strong></h1>
              <p>At GoOrder, your privacy is important to us. This Privacy Notice explains how we collect, use, and protect your information.</p>
        
              <h2><strong>1. Information We Collect</strong></h2>
      <p><strong>We collect the following types of information from you:</strong></p>

      <h3><strong>Personal Information:</strong></h3>
      <ul>
        <li><strong>Full name, address, phone number, delivery address.</strong></li>
        <li><strong>Username, password, date of birth, gender (optional).</strong></li>
        <li><strong>Location data (with your consent) to enable order delivery, provide location-based services, and personalize your experience.</strong></li>
        <li><strong>Credit/debit card information, payment history, billing address.</strong></li>
        <li><strong>Order History: Items ordered, delivery address, order status, and delivery preferences.</strong></li>
      </ul>

      <h2><strong>2. How We Collect Information</strong></h2>
      <p><strong>We collect information through various means, including:</strong></p>
      <ul>
        <li><strong>Directly from you: When you register for an account, place an order, contact customer support, or otherwise interact with our services.</strong></li>
        <li><strong>Automatically: When you browse the app, such as search queries, interactions, and time spent on features.</strong></li>
        <li><strong>From third-party services like social media platforms if you choose to connect your account.</strong></li>
      </ul>

      <h2><strong>3. How We Use Your Information</strong></h2>
      <p><strong>We use your information for:</strong></p>
      <ul>
        <li><strong>Processing orders, delivering food, providing customer support, and improving services.</strong></li>
        <li><strong>Providing personalized recommendations, offers, and content based on your preferences.</strong></li>
        <li><strong>Ensuring regulatory compliance and protecting our rights.</strong></li>
      </ul>

      <h2><strong>4. How We Share Your Information</strong></h2>
      <p><strong>We may share your information in the following situations:</strong></p>
      <ul>
        <li><strong>With Service Providers:</strong> We may share your information with third-party vendors, contractors, or business partners who help us provide, maintain, and improve our services.</li>
        <li><strong>With Business Partners:</strong> We may share information with our business partners to offer products and services that may interest you.</li>
        <li><strong>For Legal Reasons:</strong> We may disclose your information when required by law or in response to legal requests.</li>
        <li><strong>Business Transfers:</strong> If our business is involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</li>
      </ul>

      <h2><strong>5. Data Security</strong></h2>
      <p><strong>We implement appropriate security measures to protect your information from unauthorized access, loss, misuse, or alteration. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.</strong></p>

      <h2><strong>6. Your Privacy Rights</strong></h2>
      <p><strong>You have certain rights regarding your personal information, including:</strong></p>
      <ul>
        <li><strong>Accessing and updating your account information.</strong></li>
        <li><strong>Requesting deletion of your data, subject to legal and contractual obligations.</strong></li>
        <li><strong>Opting out of receiving promotional emails and communications.</strong></li>
        <li><strong>Adjusting your preferences for targeted advertising.</strong></li>
      </ul>

      <h2><strong>7. Changes to this Privacy Policy</strong></h2>
      <p><strong>We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or other operational reasons. Any changes will be posted on this page with an updated "Last Updated" date.</strong></p>

      <h2><strong>8. Contact Us</strong></h2>
      <p><strong>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:</strong></p>
      <ul>
        <li><strong>Email: support@goorder.com</strong></li>
        <li><strong>Phone: +1-800-123-4567</strong></li>
        <li><strong>Mail: GoOrder, 123 Main Street, City, Country</strong></li>
      </ul>
    </div>
    </>
  );
};

export default PrivacyNotice;
