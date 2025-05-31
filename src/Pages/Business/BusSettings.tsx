import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar copy/Navbar";
import Sidebar_2 from "../../components/Sidebar_2/Sidebar_2";
import { useTranslation } from "react-i18next";

const BusSettings = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English (US)");

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

          // ✅ Set location toggle ON immediately
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
              // ❗ Optional: Revert if API fails
              // setLocationEnabled(false);
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
      <Navbar />

      <div className={`settings-container ${showPopup ? "blurred" : ""}`}>
        <Sidebar_2
          name="Yaqeen"
          email="yaq24@gmail.com"
          avatarUrl="/images/avatar.png"
        />
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

          <div className="settings-option" onClick={() => setShowPopup(true)}>
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

        {showPopup && (
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
    </>
  );
};

export default BusSettings;
