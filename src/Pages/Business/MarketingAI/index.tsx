"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useMarketing } from "./MarketingContext";
import { Info, Upload, ChevronDown, ChevronRight, Check, X } from "lucide-react";

export default function MarketingAI() {
  const { campaign, updateCampaign, nextStep } = useMarketing();
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [showAudienceModal, setShowAudienceModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const durationSliderRef = useRef<HTMLDivElement>(null);
  const budgetSliderRef = useRef<HTMLDivElement>(null);
  const [isDraggingDuration, setIsDraggingDuration] = useState(false);
  const [isDraggingBudget, setIsDraggingBudget] = useState(false);

  // Define min/max budget for the continuous slider
  const MIN_BUDGET = 1000;
  const MAX_BUDGET = 20000;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateCampaign({ contentImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Duration slider logic
  const handleDurationSliderMouseDown = (e: React.MouseEvent) => {
    setIsDraggingDuration(true);
    updateDurationFromMousePosition(e);
  };

  const handleBudgetSliderMouseDown = (e: React.MouseEvent) => {
    setIsDraggingBudget(true);
    updateBudgetFromMousePosition(e);
  };

  // Using useCallback for memoization to prevent unnecessary re-renders
  const updateDurationFromMousePosition = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!durationSliderRef.current) return;

      const rect = durationSliderRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const clampedPosition = Math.max(0, Math.min(1, position));

      const days = Math.max(1, Math.min(7, Math.round(clampedPosition * 7) || 1));
      updateCampaign({ duration: days });
    },
    [updateCampaign]
  ); // Dependency array

  // Updated to support continuous budget selection
  const updateBudgetFromMousePosition = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (!budgetSliderRef.current) return;

      const rect = budgetSliderRef.current.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      const clampedPosition = Math.max(0, Math.min(1, position));

      // Corrected the typo: MIN_BUDget -> MIN_BUDGET
      const newBudget = MIN_BUDGET + clampedPosition * (MAX_BUDGET - MIN_BUDGET);
      updateCampaign({ budget: Math.round(newBudget / 100) * 100 }); // Round to nearest 100 for cleaner numbers
    },
    [updateCampaign]
  ); // Dependency array

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingDuration) {
        updateDurationFromMousePosition(e);
      }
      if (isDraggingBudget) {
        updateBudgetFromMousePosition(e);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingDuration(false);
      setIsDraggingBudget(false);
    };

    if (isDraggingDuration || isDraggingBudget) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingDuration, isDraggingBudget, updateDurationFromMousePosition, updateBudgetFromMousePosition]); // Add useCallback dependencies

  const handleCreateAudience = () => {
    setShowAudienceModal(true);
  };

  const handleDefaultAudience = () => {
    updateCampaign({
      audience: {
        isDefault: true,
      },
    });
  };

  const handlePay = () => {
    nextStep();
  };

  // Handles manual budget input and updates slider position
  const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      value = MIN_BUDGET; // Default to min if input is invalid
    }
    value = Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, value));
    updateCampaign({ budget: value });
  };

  // Helper function to calculate budget percentage for slider - UPDATED for continuous range
  function getBudgetPercentage(currentBudget: number, minBudget: number, maxBudget: number): number {
    if (minBudget === maxBudget) return 0; // Avoid division by zero
    const percentage = ((currentBudget - minBudget) / (maxBudget - minBudget)) * 100;
    return Math.max(0, Math.min(100, percentage));
  }

  return (
    <>
      <div className="marketing-ai-card marketing-ai-animate-fade-in">
        <h2 className="marketing-ai-section-title">
          Select your content
          <Info size={16} className="marketing-ai-info-icon" />
        </h2>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileUpload}
        />

        {campaign.contentImage ? (
          <div className="marketing-ai-uploaded-image">
            <img
              src={campaign.contentImage || "/placeholder.svg"}
              alt="Uploaded content"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
            />
            <button className="marketing-ai-button-primary" onClick={handleUploadClick}>
              Change Image
            </button>
          </div>
        ) : (
          <div className="marketing-ai-upload-container" onClick={handleUploadClick}>
            <div className="marketing-ai-upload-icon">
              <Upload size={24} color="white" />
            </div>
            <div className="marketing-ai-upload-text">Drop your image here or Browse</div>
            <div className="marketing-ai-upload-support">Support: JPG, JPEG, PNG</div>
          </div>
        )}

        <div className="marketing-ai-promotion-stats">
          <div className="marketing-ai-stats-title">Custom Promotion</div>
          <div className="marketing-ai-stats-value">750-200</div>
          <div className="marketing-ai-stats-description">Estimated image views</div>
        </div>
      </div>

      <div className="marketing-ai-card marketing-ai-animate-fade-in">
        <h2 className="marketing-ai-section-title">
          Define your audience
          <Info size={16} className="marketing-ai-info-icon" />
        </h2>

        <div className="marketing-ai-audience-options">
          <div className="marketing-ai-audience-option" onClick={handleDefaultAudience}>
            <div className="marketing-ai-option-label">Default audience</div>
            <div
              className={`marketing-ai-custom-checkbox ${campaign.audience.isDefault ? "checked" : ""}`}
            >
              {campaign.audience.isDefault && <Check size={16} color="white" />}
            </div>
          </div>
          <div className="marketing-ai-audience-option" onClick={handleCreateAudience}>
            <div className="marketing-ai-option-label">Create your own</div>
            <ChevronRight size={20} style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>

      <div className="marketing-ai-card marketing-ai-animate-fade-in">
        <h2 className="marketing-ai-section-title">Set budget and duration</h2>

        <div className="marketing-ai-slider-container">
          <div className="marketing-ai-slider-header">
            <div className="marketing-ai-slider-title">Duration</div>
          </div>
          <div className="marketing-ai-slider-track" ref={durationSliderRef} onMouseDown={handleDurationSliderMouseDown}>
            <div className="marketing-ai-slider-fill" style={{ width: `${(campaign.duration / 7) * 100}%` }}></div>
            <div className="marketing-ai-slider-thumb" style={{ left: `${(campaign.duration / 7) * 100}%` }}></div>
          </div>
          <div className="marketing-ai-slider-options">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div
                key={day}
                className={`marketing-ai-slider-option ${campaign.duration === day ? "selected" : ""}`}
                onClick={() => updateCampaign({ duration: day })}
              >
                {day}day{day > 1 ? "s" : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="marketing-ai-slider-container">
          <div className="marketing-ai-slider-header">
            <div className="marketing-ai-slider-title">Budget</div>
            {/* Added custom budget input */}
            <div className="marketing-ai-budget-input-wrapper">
              <span className="marketing-ai-currency-prefix">EGY</span>
              <input
                type="number"
                value={campaign.budget}
                onChange={handleBudgetInputChange}
                onBlur={() => {
                  let value = parseInt(String(campaign.budget), 10);
                  if (isNaN(value)) value = MIN_BUDGET;
                  updateCampaign({ budget: Math.max(MIN_BUDGET, Math.min(MAX_BUDGET, value)) });
                }}
                className="marketing-ai-custom-budget-input"
                min={MIN_BUDGET}
                max={MAX_BUDGET}
              />
            </div>
          </div>
          <div className="marketing-ai-slider-track" ref={budgetSliderRef} onMouseDown={handleBudgetSliderMouseDown}>
            <div className="marketing-ai-slider-fill" style={{ width: `${getBudgetPercentage(campaign.budget, MIN_BUDGET, MAX_BUDGET)}%` }}></div>
            <div className="marketing-ai-slider-thumb" style={{ left: `${getBudgetPercentage(campaign.budget, MIN_BUDGET, MAX_BUDGET)}%` }}></div>
          </div>
          <div className="marketing-ai-slider-options">
            <div>EGY {MIN_BUDGET}</div>
            <div>EGY {MAX_BUDGET}</div>
          </div>
        </div>

        <div className="marketing-ai-price-container">
          <div className="marketing-ai-price">EGY {campaign.budget}</div>
          <div className="marketing-ai-price-details" onClick={() => setShowPriceDetails(true)}>
            See price details
            <ChevronDown size={16} style={{ marginLeft: "4px" }} />
          </div>
        </div>

        <div className="marketing-ai-button-container">
          <button className="marketing-ai-button-primary" onClick={handlePay}>
            PAY
          </button>
        </div>
      </div>

      {/* Price Details Modal */}
      {showPriceDetails && (
        <div className="marketing-ai-modal-overlay">
          <div className="marketing-ai-modal marketing-ai-price-details-modal marketing-ai-animate-slide-up">
            <div className="marketing-ai-modal-header-compact">
              <button className="marketing-ai-modal-back-button" onClick={() => setShowPriceDetails(false)}>
                Cancel
              </button>
              <div className="marketing-ai-modal-title">Price details</div>
              <div className="marketing-ai-header-spacer"></div>
            </div>
            <div className="marketing-ai-modal-body">
              <div className="marketing-ai-price-item">
                <div className="marketing-ai-price-label">Subtotal</div>
                <div className="marketing-ai-price-value">EGY {Math.round(campaign.budget * 0.857)}</div>
              </div>
              <div className="marketing-ai-price-item">
                <div className="marketing-ai-price-label">Insufficient amount</div>
                <div className="marketing-ai-price-value">EGY {Math.round(campaign.budget * 0.071)}</div>
              </div>
              <div className="marketing-ai-price-item">
                <div className="marketing-ai-price-label">
                  Tax
                  <Info size={14} className="marketing-ai-price-info" />
                </div>
                <div className="marketing-ai-price-value">EGY {Math.round(campaign.budget * 0.071)}</div>
              </div>
              <div className="marketing-ai-price-item">
                <div className="marketing-ai-price-label">Total</div>
                <div className="marketing-ai-price-value">EGY {campaign.budget}</div>
              </div>
            </div>
            <div className="marketing-ai-button-container">
              <button className="marketing-ai-button-primary" onClick={() => setShowPriceDetails(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Audience Modal */}
      {showAudienceModal && <AudienceModal onClose={() => setShowAudienceModal(false)} />}
    </>
  );
}

interface AudienceModalProps {
  onClose: () => void;
}

// AudienceModal component moved into the same file
function AudienceModal({ onClose }: AudienceModalProps) {
  const { updateCampaign } = useMarketing();
  const [step, setStep] = useState(1);
  const [audienceName, setAudienceName] = useState("");
  const [gender, setGender] = useState("All");
  const [ageRange, setAgeRange] = useState("18-24");
  const [location, setLocation] = useState("New Cairo");
  const [interests, setInterests] = useState<string[]>(["Education"]);
  const [audienceErrors, setAudienceErrors] = useState({ audienceName: "" });

  const validateStep1 = () => {
    let isValid = true;
    let newErrors = { audienceName: "" };

    if (!audienceName.trim()) {
      newErrors.audienceName = "Audience name is required.";
      isValid = false;
    }
    setAudienceErrors(newErrors);
    return isValid;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(step + 1);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handleSave = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }

    updateCampaign({
      audience: {
        name: audienceName,
        gender,
        ageRange,
        locations: [location],
        interests,
        isDefault: false,
      },
    });
    onClose();
  };

  const renderStep = () => {
    let title = "Create your own";
    let showBackButton = false;

    if (step === 2) {
      title = "Gender & age";
      showBackButton = true;
    } else if (step === 3) {
      title = "Locations";
      showBackButton = true;
    } else if (step === 4) {
      title = "Interests";
      showBackButton = true;
    }

    return (
      <>
        <div className="marketing-ai-modal-header-compact">
          {showBackButton ? (
            <button className="marketing-ai-modal-back-button" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <div className="marketing-ai-header-spacer"></div> // Spacer for symmetry if no back button
          )}
          <div className="marketing-ai-modal-title">{title}</div>
          <button className="marketing-ai-modal-close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="marketing-ai-modal-body">
          <div className="marketing-ai-progress-indicator">
            <div className={`marketing-ai-progress-dot ${step >= 1 ? "active" : ""}`}></div>
            <div className={`marketing-ai-progress-dot ${step >= 2 ? "active" : ""}`}></div>
            <div className={`marketing-ai-progress-dot ${step >= 3 ? "active" : ""}`}></div>
            <div className={`marketing-ai-progress-dot ${step >= 4 ? "active" : ""}`}></div>
          </div>

          <div className="marketing-ai-audience-estimate">
            <div className="marketing-ai-audience-number">
              20.36M-42.66M
              <Info size={16} className="marketing-ai-audience-info" />
            </div>
            <div className="marketing-ai-audience-label">Estimated audience</div>
          </div>

          {step === 1 && (
            <>
              <div className="marketing-ai-form-group">
                <label className="marketing-ai-form-label">Write an audience name</label>
                <input
                  type="text"
                  className={`marketing-ai-form-input ${audienceErrors.audienceName ? "marketing-ai-input-error" : ""}`}
                  value={audienceName}
                  onChange={(e) => {
                    setAudienceName(e.target.value);
                    setAudienceErrors((prev) => ({ ...prev, audienceName: "" }));
                  }}
                  placeholder="e.g., My Custom Audience"
                />
                {audienceErrors.audienceName && (
                  <p className="marketing-ai-error-message">{audienceErrors.audienceName}</p>
                )}
              </div>

              <div className="marketing-ai-option-group">
                <div className="marketing-ai-option-title">Select your target audience</div>

                <div className="marketing-ai-audience-option" onClick={() => setStep(2)}>
                  <div className="marketing-ai-option-label">Gender & age</div>
                  <div>
                    {gender} | {ageRange}
                  </div>
                  <ChevronRight size={20} />
                </div>

                <div className="marketing-ai-audience-option" onClick={() => setStep(3)}>
                  <div className="marketing-ai-option-label">Locations</div>
                  <div>{location || "None selected"}</div>
                  <ChevronRight size={20} />
                </div>

                <div className="marketing-ai-audience-option" onClick={() => setStep(4)}>
                  <div className="marketing-ai-option-label">Interests</div>
                  <div>{interests.length > 0 ? interests.join(", ") : "None selected"}</div>
                  <ChevronRight size={20} />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="marketing-ai-option-group">
                <div className="marketing-ai-option-title">Gender</div>
                <div className="marketing-ai-option-buttons">
                  <button
                    className={`marketing-ai-option-button ${gender === "All" ? "selected" : ""}`}
                    onClick={() => setGender("All")}
                  >
                    All
                  </button>
                  <button
                    className={`marketing-ai-option-button ${gender === "Female" ? "selected" : ""}`}
                    onClick={() => setGender("Female")}
                  >
                    Female
                  </button>
                  <button
                    className={`marketing-ai-option-button ${gender === "Male" ? "selected" : ""}`}
                    onClick={() => setGender("Male")}
                  >
                    Male
                  </button>
                </div>
              </div>

              <div className="marketing-ai-option-group">
                <div className="marketing-ai-option-title">Age</div>
                <div className="marketing-ai-option-buttons">
                  <button
                    className={`marketing-ai-option-button ${ageRange === "All" ? "selected" : ""}`}
                    onClick={() => setAgeRange("All")}
                  >
                    All
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "13-17" ? "selected" : ""}`}
                    onClick={() => setAgeRange("13-17")}
                  >
                    13-17
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "18-24" ? "selected" : ""}`}
                    onClick={() => setAgeRange("18-24")}
                  >
                    18-24
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "25-34" ? "selected" : ""}`}
                    onClick={() => setAgeRange("25-34")}
                  >
                    25-34
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "35-44" ? "selected" : ""}`}
                    onClick={() => setAgeRange("35-44")}
                  >
                    35-44
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "45-54" ? "selected" : ""}`}
                    onClick={() => setAgeRange("45-54")}
                  >
                    45-54
                  </button>
                  <button
                    className={`marketing-ai-option-button ${ageRange === "55+" ? "selected" : ""}`}
                    onClick={() => setAgeRange("55+")}
                  >
                    55+
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="marketing-ai-form-group">
                <label className="marketing-ai-form-label">Search for locations</label>
                <div className="marketing-ai-search-container1">
                  <input
                    type="text"
                    className="marketing-ai-form-input"
                    placeholder="Search for cities, towns, and provinces"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <p className="marketing-ai-option-subtitle">
                  Search for the cities, towns, and provinces you want to target. Results are
                  limited to the country you're posting from.
                </p>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="marketing-ai-option-group">
                <div className="marketing-ai-option-title">Select interests</div>
                <div className="marketing-ai-interest-options">
                  {[
                    "Healthy food",
                    "Fast food",
                    "Market",
                    "Handmade",
                    "Dessert",
                    "Accessories",
                    "Fashion",
                    "Education",
                  ].map((interest) => (
                    <div className="marketing-ai-interest-option" key={interest}>
                      <label>
                        <input
                          type="checkbox"
                          checked={interests.includes(interest)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInterests([...interests, interest]);
                            } else {
                              setInterests(interests.filter((i) => i !== interest));
                            }
                          }}
                        />
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="marketing-ai-button-container">
          <button className="marketing-ai-button-primary" onClick={step < 4 ? handleNextStep : handleSave} disabled={step === 1 && !audienceName.trim()}>
            {step < 4 ? "Next" : "Save Audience"}
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="marketing-ai-modal-overlay">
      <div className="marketing-ai-modal marketing-ai-animate-slide-up" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {renderStep()}
      </div>
    </div>
  );
}