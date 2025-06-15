import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar copy/Navbar";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import { useTranslation } from "react-i18next";
import "../../styles/BusSettings.css";

// Assume that the parent component (e.g., App.tsx or Layout.tsx)
// will manage the mobile menu state and pass it down.
// For demonstration within BusSettings, we'll manage `isMobileMenuOpen` locally here.

const BusSettings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English (US)");

  // NEW STATE FOR MOBILE SIDEBAR MANAGEMENT
  // In a real app, this state would likely come from a parent component via props.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // This function would typically be passed down from a parent Layout component
  const handleToggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => {
      const newState = !prev;
      // When sidebar is about to open, ensure any other popups are closed
      if (newState) { // If it's becoming open
        setShowPopup(false); // Close language popup
      }
      return newState;
    });
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    if (language === "Arabic") {
      i18n.changeLanguage("ar");
      document.documentElement.dir = "rtl";
    } else {
      i18n.changeLanguage("en");
      document.documentElement.dir = "ltr";
    }
    setShowPopup(false);
  };

  const handleLocationToggle = () => {
    if (!locationEnabled) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          setLocationEnabled(true);
          // ✅ Replace with your actual API endpoint
          fetch("YOUR_API_ENDPOINT", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log("Location sent:", data);
            })
            .catch((err) => {
              console.error("Error sending location:", err);
            });
        },
        (error) => {
          console.warn("Location access denied by user:", error.message);
          setLocationEnabled(false);
        }
      );
    } else {
      // User is turning location OFF
      setLocationEnabled(false);
    }
  };

  return (
    <>
      {/* Assuming Navbar can also trigger sidebar toggle or reflect its state */}
      {/* You might need to pass toggleMobileMenu and isMobileMenuOpen to Navbar */}
      <Navbar />

      <div className="page-layout"> {/* New wrapper for sidebar and content */}
        {/* Pass isMobileMenuOpen and handleToggleMobileMenu to Sidebar_2 */}
        <Sidebar_2
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={handleToggleMobileMenu}
        />
        {/*
          Apply 'blurred' class to settings-container only if showPopup is true
          AND the sidebar is NOT open. This prevents the BusSettings blur from
          stacking with the sidebar overlay when the sidebar is active.
        */}
        <div className={`settings-container ${showPopup && !isMobileMenuOpen ? "blurred" : ""}`}>
          <h1 className="settings-title">{t("Settings")}</h1>

          <div className="settings-menu">
            <p className="active">{t("Profile")}</p>
            <hr />

            <div className="settings-option">
              <span>{t("Location")}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={locationEnabled}
                  onChange={handleLocationToggle}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Only allow opening language popup if sidebar is not open */}
            <div className="settings-option" onClick={() => !isMobileMenuOpen && setShowPopup(true)}>
              <span>{t("Language")}</span>
              <span className="option-right">{selectedLanguage} &gt;</span>
            </div>

            <div
              className="settings-option"
              onClick={() => navigate("/bus-privacy-policy")}
            >
              <span>{t("Privacy & Policy")}</span>
              <span className="option-right">&gt;</span>
            </div>

            <div
              className="settings-option"
              onClick={() => navigate("/bus-terms-and-conditions")}
            >
              <span>{t("Terms & Conditions")}</span>
              <span className="option-right">&gt;</span>
            </div>
          </div>

          {/*
            Conditionally render the popup overlay only if showPopup is true
            AND the sidebar is NOT open.
            This prevents the popup from being active visually or in the DOM
            when the sidebar overlay is meant to be the primary focus.
          */}
          {showPopup && !isMobileMenuOpen && (
            <div className="popup-overlay">
              <div className="popup-content">
                <h2>{t("Select Language")}</h2>

                <div
                  className={`language-option ${
                    selectedLanguage === "Arabic" ? "selected" : ""
                  }`}
                  onClick={() => handleLanguageChange("Arabic")}
                >
                  <img
                    src="https://flagcdn.com/w40/sa.png"
                    alt="Arabic"
                    className="flag-icon"
                  />
                  <span>Arabic</span>
                </div>

                <div
                  className={`language-option ${
                    selectedLanguage === "English (US)" ? "selected" : ""
                  }`}
                  onClick={() => handleLanguageChange("English (US)")}
                >
                  <img
                    src="https://flagcdn.com/w40/gb.png"
                    alt="English"
                    className="flag-icon"
                  />
                  <span>English (US)</span>
                </div>

                <button
                  className="select-button"
                  onClick={() => setShowPopup(false)}
                >
                  {t("Select")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BusSettings;