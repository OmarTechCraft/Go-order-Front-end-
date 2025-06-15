import React from "react";
import { Link } from "react-router-dom";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import "../../styles/Home.css"; // Consolidated CSS file
import Navbar from "../../components/HomNav/HomeNav"; // Assuming this is your Navbar component path
import { useTranslation } from "react-i18next"; // Import useTranslation

// Dummy GetStartedButton component since its code wasn't provided
const GetStartedButton: React.FC = () => {
  const { t } = useTranslation();
  return <button className="get-started">{t("Get Started")}</button>;
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    // Apply dir attribute to the outermost div of your content
    <div dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="try">
        <Navbar />
      </div>

      {/* First Section - OfferSection */}
      <div className="offer-container">
        <div className="offer-text">
          <div className="offer-title">
            <h1 className="offer-heading">{t("Claim Best Offer")}</h1>
            <div className="on-order-container">
              {/* Conditional rendering for 'on Order' based on language */}
              {i18n.language === "en" ? (
                <>
                  <span className="on-text">{t("on")}</span>
                  <span className="highlight">
                    <span className="special-o">O</span>rder
                  </span>
                </>
              ) : (
                <>
                  <span className="on-text">{t("on")}</span>
                  {/* استخدام class جديد لتطبيق نفس تصميم الـ "highlight" ولكن على كلمة كاملة */}
                  <span className="arabic-order-style">{t("Order")}</span>
                </>
              )}
            </div>
          </div>

          {/* تبديل مكان جملة "تجرأ على..." مع مجموعة CTA بالكامل */}
          {i18n.language === "en" ? (
            <>
              {/* الترتيب الافتراضي للغة الإنجليزية */}
              <p className="tagline">{t("“Dare to Be Different, Shop With Us”")}</p>
              <div className="cta-reviews">
                <Link to="/register">
                  <GetStartedButton />
                </Link>
                <div className="collab-images">
                  <img src="/images/girl1.jpg" alt="Customer 1" />
                  <img src="/images/girl2.jpg" alt="Customer 2" />
                  <img src="/images/boy11.jpg" alt="Customer 3" />
                </div>
                <div className="customer-reviews">
                  <span>{t("Our Happy Customer")}</span>
                  <div className="stars">⭐ 4.8 (12.5k Reviews)</div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* الترتيب للغة العربية بعد التبديل الأول (tagline) */}
               <p className="tagline">{t("“Dare to Be Different, Shop With Us”")}</p>{" "}
              {/* جملة التاج لاين تأتي في النهاية هنا */}
              <div className="cta-reviews">
                {/* تم تبديل مكان زر ابدأ الآن مع عملاؤنا السعداء */}
                <Link to="/register">
                  <GetStartedButton /> {/* زر "ابدأ الآن" يأتي أولاً (على اليمين) */}
                </Link>

                <div className="customer-reviews">
                  {" "}
                  {/* ثم نص عملاؤنا السعداء والنجوم */}
                  <span>{t("Our Happy Customer")}</span>
                  <div className="stars">⭐ 4.8 (12.5k Reviews)</div>
                </div>

                <div className="collab-images">
                  {" "}
                  {/* صور العملاء في النهاية */}
                  <img src="/images/girl1.jpg" alt="Customer 1" />
                  <img src="/images/girl2.jpg" alt="Customer 2" />
                  <img src="/images/boy11.jpg" alt="Customer 3" />
                </div>
              </div>
             
            </>
          )}
        </div>
      </div>

      {/* Second Section - What We Serve */}
      <div className="what-we-serve-container">
        <p className="what-we-serve-title">{t("WHAT WE SERVE")}</p>
        <h2 className="delivery-partner-heading">
          {t("Your Favourite Delivery Partner")}
        </h2>
        <div className="services-container">
          <div className="service">
            <img src="/images/req.jpg" alt="Easy to Order" />
            <h3 className="service-title">{t("Easy To Order")}</h3>
            <p className="service-description">
              {t("You only need a few steps in ordering")}
            </p>
          </div>
          <div className="service">
            <img src="/images/take.jpg" alt="Fastest Delivery" />
            <h3 className="service-title">{t("Fastest Delivery")}</h3>
            <p className="service-description">
              {t("Delivery that is always on time, even faster")}
            </p>
          </div>
          <div className="service">
            <img src="/images/serve.jpg" alt="Best Quality" />
            <h3 className="service-title">{t("Best Quality")}</h3>
            <p className="service-description">
              {t("Not only fast, our quality is also number one")}
            </p>
          </div>
        </div>
      </div>

      {/* Third Section - Two Images Side by Side (No text to translate here) */}
      <div className="image-split-container">
        <img
          src="/images/chch.jpg"
          alt="Chef Serving Food"
          className="left-image"
        />
        <img
          src="/images/chch2.jpg"
          alt="Customer Review Section"
          className="right-image"
        />
      </div>

      {/* Fourth Phase - Who We Are Section */}
      <div className="phase4-content">
        <div className="phase4-text">
          <p className="about-us">{t("About Us")}</p>
          <h2 className="who-we-are">{t("Who We Are")}</h2>
          <p className="description1">
            {t(
              "GoOrder, the leading on-demand food and Q-commerce app for everyday deliveries, has been offering convenience and reliability to its customers. We harness innovative technology and knowledge to simplify everyday life for our customers, optimize operations for our restaurants and local shops, and provide our riders with reliable earning opportunities daily."
            )}
          </p>
          <div className="cta-container">
            <p className="join-us">{t("Join As Partner")}</p>
            <Link to="/register">
              <GetStartedButton />
            </Link>
          </div>
        </div>
        <div className="phase4-image-container">
          <div className="purple-background"></div>
          <img
            src="/images/ccare.jpg"
            alt="Customer Care"
            className="ccare-image"
          />
        </div>
      </div>

      {/* Fifth Phase - We Deliver Section */}
      <div className="phase5-container">
        <div className="phase5-image">
          <div className="truck-background"></div>
          <img src="/images/truck.jpg" alt="Delivery Truck" />
          <div className="dot yellow" style={{ top: "10%", left: "5%" }}></div>
          <div
            className="dot purple"
            style={{ top: "-13%", left: "70%" }}
          ></div>
          <div className="dot purple" style={{ top: "30%", left: "70%" }}></div>
          <div className="dot yellow" style={{ top: "85%", left: "10%" }}></div>
          <div className="dot yellow" style={{ top: "10%", left: "70%" }}></div>
          <div className="dot purple" style={{ top: "-10%", left: "0%" }}></div>
        </div>
        <div className="phase5-content">
          <h2 className="phase5-title">{t("We Deliver")}</h2>
          <p className="phase5-text">
            {t(
              "A GoOrder rider will be along shortly to pick up the order and deliver it to the customer. We highly recommend other restaurants to work with Talabat and experience the benefits of their joint partnership. Delivery that is always on time, even faster."
            )}
          </p>
          <div className="phase5-cta">
            <p className="join-text">{t("Join as Deliver")}</p>
            <Link to="/deliver-with-us">
              <GetStartedButton />
            </Link>
          </div>
        </div>
      </div>

      {/* Sixth Phase - Download Our Application */}
      <div className="phase6-container">
        <div className="content-wrapper">
          <div className="phase6-content">
            <p className="download-app">{t("DOWNLOAD APP")}</p>
            <h2 className="phase6-title">{t("Download Our Application Now!")}</h2>
            <p className="phase6-text">
              {t("Discover order wherever and whenever and get your order delivered quickly.")}
            </p>
            <div className="download-links">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn google-play"
              >
                <FaGooglePlay className="icon" />
                <span>
                  <small>{t("GET IT ON")}</small>
                  <strong>{t("Google Play")}</strong>
                </span>
              </a>
              <a
                href="https://www.apple.com/app-store/"
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn app-store"
              >
                <FaApple className="icon" />
                <span>
                  <small>{t("Download on the")}</small>
                  <strong>{t("App Store")}</strong>
                </span>
              </a>
            </div>
          </div>
          <div className="phase6-image">
            <img src="/images/apps.jpg" alt="App Preview" />
          </div>
        </div>
      </div>

      {/* Seventh Phase - Footer */}
      <div className="footer">
        <div className="footer-section goorder-section">
          <h2 className="title goorder">{t("GoOrder")}</h2>
          <p className="description">
            {t("Our job is to fill your tummy with delicious food and with fast and free delivery.")}
          </p>
          <div className="social-section">
            <h3 className="social-title">{t("You can find us there")}</h3>
            <div className="separator"></div>
            <div className="social-icons">
              <a
                className="google"
                href="https://www.google.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/gog.jpg" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/fac.jpg" />
              </a>
              <a
                href="https://www.apple.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/appl.jpg" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-section contact-section">
          <h3 className="title contact">{t("Contact info")}</h3>
          <p>
            <strong>{t("Phone number :")}</strong> +(20) 1111111111
          </p>
          <p>
            <strong>{t("Address :")}</strong> {t("Egypt - Cairo")}
          </p>
        </div>
        <div className="footer-section help-section">
          <h3 className="title get-help">{t("Get Help")}</h3>
          <p>
            <Link to="/privacy-notice">{t("Privacy Notice")}</Link>
          </p>
          <p>
            <Link to="/term-condition">{t("Terms & Conditions")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;