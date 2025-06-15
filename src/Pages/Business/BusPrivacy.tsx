import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/BusPrivacy.css";
import { FaArrowLeft, FaShieldAlt, FaUserShield, FaLock, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../../components/navbar copy/Navbar";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="main-content">
        <Sidebar_2 />
        <div className="page-content-area">
          {/* Fixed Header */}
          <div className="privacy-fixed-header">
            <button
              className="back-button"
              onClick={() => navigate("/bus-settings")}
              aria-label="Go back to settings"
            >
              <FaArrowLeft />
            </button>
            <div className="header-title-section">
              <FaShieldAlt className="header-icon" />
              <h1>Privacy Policy</h1>
            </div>
          </div>

          {/* Main Content */}
          <div className="privacy-content">
            <div className="privacy-intro">
              <div className="intro-icon">
                <FaUserShield />
              </div>
              <div className="intro-text">
                <h2>Your Privacy Matters</h2>
                <p>
                  Welcome to <strong>GoOrder</strong>. This Privacy Policy describes
                  how we collect, use, and protect your personal information when
                  you use our mobile application and services. By accessing or using
                  our Services, you agree to the terms outlined below.
                </p>
              </div>
            </div>

            {/* Privacy Sections */}
            <div className="privacy-sections">
              <section className="privacy-section">
                <div className="section-header">
                  <div className="section-number">1</div>
                  <h3>Information We Collect</h3>
                </div>
                <div className="section-content">
                  <p>
                    We collect information you provide directly to us, such as when you
                    create an account, place an order, or communicate with us. This
                    may include:
                  </p>
                  <div className="info-grid">
                    <div className="info-card">
                      <h4>Personal Information</h4>
                      <ul>
                        <li>Name and contact details</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Profile preferences</li>
                      </ul>
                    </div>
                    <div className="info-card">
                      <h4>Transaction Data</h4>
                      <ul>
                        <li>Order history</li>
                        <li>Payment information</li>
                        <li>Billing addresses</li>
                        <li>Purchase preferences</li>
                      </ul>
                    </div>
                    <div className="info-card">
                      <h4>Usage Data</h4>
                      <ul>
                        <li>Location data (if enabled)</li>
                        <li>Device information</li>
                        <li>App usage patterns</li>
                        <li>Performance metrics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <div className="section-number">2</div>
                  <h3>How We Use Your Information</h3>
                </div>
                <div className="section-content">
                  <p>We use the information we collect to enhance your experience:</p>
                  <div className="usage-list">
                    <div className="usage-item">
                      <div className="usage-icon">🛍️</div>
                      <div>
                        <h4>Service Delivery</h4>
                        <p>Provide, maintain, and improve our Services</p>
                      </div>
                    </div>
                    <div className="usage-item">
                      <div className="usage-icon">💳</div>
                      <div>
                        <h4>Order Processing</h4>
                        <p>Process your orders and transactions securely</p>
                      </div>
                    </div>
                    <div className="usage-item">
                      <div className="usage-icon">📱</div>
                      <div>
                        <h4>Communication</h4>
                        <p>Send updates about orders, services, and promotions</p>
                      </div>
                    </div>
                    <div className="usage-item">
                      <div className="usage-icon">⚡</div>
                      <div>
                        <h4>Personalization</h4>
                        <p>Customize your experience and recommendations</p>
                      </div>
                    </div>
                    <div className="usage-item">
                      <div className="usage-icon">📊</div>
                      <div>
                        <h4>Analytics</h4>
                        <p>Monitor trends and improve our platform</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <div className="section-number">3</div>
                  <h3>Information Sharing</h3>
                </div>
                <div className="section-content">
                  <p>We may share your information with trusted partners:</p>
                  <div className="sharing-cards">
                    <div className="sharing-card">
                      <h4>Service Providers</h4>
                      <p>Third-party vendors who help us deliver services (payment processing, delivery, customer support)</p>
                    </div>
                    <div className="sharing-card">
                      <h4>Marketing Partners</h4>
                      <p>With your explicit consent, we may share data for promotional purposes</p>
                    </div>
                    <div className="sharing-card">
                      <h4>Legal Requirements</h4>
                      <p>When required by law enforcement or government agencies</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="privacy-section security-section">
                <div className="section-header">
                  <div className="section-number">4</div>
                  <h3>Data Security</h3>
                  <FaLock className="security-icon" />
                </div>
                <div className="section-content">
                  <div className="security-content">
                    <p>
                      We implement industry-standard security measures to protect your
                      personal information from unauthorized access, use, or disclosure.
                      Our security measures include:
                    </p>
                    <div className="security-features">
                      <div className="security-feature">
                        <span className="feature-badge">🔐</span>
                        <span>End-to-end encryption</span>
                      </div>
                      <div className="security-feature">
                        <span className="feature-badge">🛡️</span>
                        <span>Secure data centers</span>
                      </div>
                      <div className="security-feature">
                        <span className="feature-badge">🔍</span>
                        <span>Regular security audits</span>
                      </div>
                      <div className="security-feature">
                        <span className="feature-badge">⚠️</span>
                        <span>Breach monitoring</span>
                      </div>
                    </div>
                    <div className="security-note">
                      <p><strong>Note:</strong> While we strive to protect your data, no method of transmission over the Internet is 100% secure.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <div className="section-number">5</div>
                  <h3>Your Rights & Choices</h3>
                </div>
                <div className="section-content">
                  <p>You have control over your personal information:</p>
                  <div className="rights-grid">
                    <div className="right-item">
                      <h4>Access & Correction</h4>
                      <p>View and update your personal information anytime</p>
                    </div>
                    <div className="right-item">
                      <h4>Marketing Opt-out</h4>
                      <p>Unsubscribe from promotional communications</p>
                    </div>
                    <div className="right-item">
                      <h4>Data Deletion</h4>
                      <p>Request removal of your data (subject to legal obligations)</p>
                    </div>
                    <div className="right-item">
                      <h4>Data Portability</h4>
                      <p>Export your data in a readable format</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="privacy-section">
                <div className="section-header">
                  <div className="section-number">6</div>
                  <h3>Policy Updates</h3>
                </div>
                <div className="section-content">
                  <p>
                    We may update this Privacy Policy from time to time to reflect
                    changes in our practices or legal requirements. We will notify
                    you of any significant changes by posting the updated policy
                    on our Services and updating the "Last Updated" date.
                  </p>
                </div>
              </section>

              <section className="privacy-section contact-section">
                <div className="section-header">
                  <div className="section-number">7</div>
                  <h3>Contact Us</h3>
                </div>
                <div className="section-content">
                  <p>If you have any questions about this Privacy Policy, please reach out:</p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <div>
                        <h4>Email</h4>
                        <p>privacy@goorder.com</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <div>
                        <h4>Phone</h4>
                        <p>+1 987-654-3210</p>
                      </div>
                    </div>
                    <div className="contact-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <div>
                        <h4>Address</h4>
                        <p>GoOrder Privacy Team<br />123 Main Street<br />City, Country</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="privacy-footer">
              <p><strong>Last Updated:</strong> January 2025</p>
              <p>Thank you for trusting GoOrder with your information.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;