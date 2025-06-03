import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import HomeNav from "../../components/HomNav/HomeNav"; // Adjust path if necessary
import "../../styles/MainTerms.css"; // CSS for this page

const MainTerms: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleBackToHome = () => {
    navigate("/Home"); // Navigate to the home page
  };

  return (
    <>
      <HomeNav /> {/* HomeNav component at the top */}
      <div className="privacy-notice-container">
        {/* Back Button */}
        <button className="back-to-home-button" onClick={handleBackToHome}>
          Back to Home
        </button>

        <h1>Terms & Conditions</h1>
        <p>
          This Terms & Conditions explains how [Your Company Name] collects,
          uses, and protects your personal data when you use our services. We
          are committed to ensuring the privacy and security of your
          information.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect various types of information to provide and improve our
          services to you, including:
        </p>
        <ul>
          <li>
            <strong>Personal Identifiable Information:</strong> Name, email
            address, phone number, delivery address, payment information.
          </li>
          <li>
            <strong>Usage Data:</strong> Information on how the service is
            accessed and used (e.g., pages visited, time spent on pages, device
            information).
          </li>
          <li>
            <strong>Location Data:</strong> If you grant us permission, we may
            collect your location data to facilitate delivery services.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is used for various purposes, including:</p>
        <ul>
          <li>To provide and maintain our service.</li>
          <li>To process transactions and manage your orders.</li>
          <li>To improve customer service and support.</li>
          <li>To personalize your experience.</li>
          <li>To send you updates, promotional offers, and newsletters.</li>
          <li>To detect, prevent, and address technical issues.</li>
        </ul>

        <h2>3. Data Sharing and Disclosure</h2>
        <p>
          We may share your personal information with third parties only in
          specific situations:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We may employ third-party
            companies and individuals to facilitate our service, provide the
            service on our behalf, or assist us in analyzing how our service is
            used.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your personal
            data in the good faith belief that such action is necessary to
            comply with a legal obligation, protect and defend the rights or
            property of [Your Company Name], or protect the personal safety of
            users of the service or the public.
          </li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          The security of your data is important to us. While we strive to use
          commercially acceptable means to protect your Personal Data, we cannot
          guarantee its absolute security.
        </p>

        <h2>5. Your Data Protection Rights</h2>
        <p>
          Depending on your location, you may have the following data protection
          rights:
        </p>
        <ul>
          <li>
            The right to access, update, or delete the information we have on
            you.
          </li>
          <li>The right of rectification.</li>
          <li>The right to object.</li>
          <li>The right of restriction.</li>
          <li>The right to data portability.</li>
          <li>The right to withdraw consent.</li>
        </ul>

        <h2>6. Changes to This Terms & Conditions</h2>
        <p>
          We may update our Privacy Notice from time to time. We will notify you
          of any changes by posting the new Privacy Notice on this page. You are
          advised to review this Privacy Notice periodically for any changes.
        </p>

        <h2>7. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Notice, please contact
          us:
        </p>
        <ul>
          <li>By email: privacy@[yourcompany].com</li>
          <li>By visiting this page on our website: [Your Contact Page URL]</li>
        </ul>
      </div>
    </>
  );
};

export default MainTerms;
