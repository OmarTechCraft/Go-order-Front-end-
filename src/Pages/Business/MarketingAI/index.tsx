"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useMarketing } from "./MarketingContext"
import { Info, Upload, ChevronDown, ChevronRight, Check } from "lucide-react"

export default function MarketingAI() {
  const { campaign, updateCampaign, nextStep } = useMarketing()
  const [showPriceDetails, setShowPriceDetails] = useState(false)
  const [showAudienceModal, setShowAudienceModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const durationSliderRef = useRef<HTMLDivElement>(null)
  const budgetSliderRef = useRef<HTMLDivElement>(null)
  const [isDraggingDuration, setIsDraggingDuration] = useState(false)
  const [isDraggingBudget, setIsDraggingBudget] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        updateCampaign({ contentImage: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Duration slider logic
  const handleDurationSliderMouseDown = (e: React.MouseEvent) => {
    setIsDraggingDuration(true)
    updateDurationFromMousePosition(e)
  }

  const handleBudgetSliderMouseDown = (e: React.MouseEvent) => {
    setIsDraggingBudget(true)
    updateBudgetFromMousePosition(e)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingDuration) {
        updateDurationFromMousePosition(e)
      }
      if (isDraggingBudget) {
        updateBudgetFromMousePosition(e)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingDuration(false)
      setIsDraggingBudget(false)
    }

    if (isDraggingDuration || isDraggingBudget) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingDuration, isDraggingBudget])

  const updateDurationFromMousePosition = (e: React.MouseEvent | MouseEvent) => {
    if (!durationSliderRef.current) return

    const rect = durationSliderRef.current.getBoundingClientRect()
    const position = (e.clientX - rect.left) / rect.width
    const clampedPosition = Math.max(0, Math.min(1, position))

    // Map position to days (1-7)
    const days = Math.max(1, Math.min(7, Math.round(clampedPosition * 7) || 1))
    updateCampaign({ duration: days })
  }

  const updateBudgetFromMousePosition = (e: React.MouseEvent | MouseEvent) => {
    if (!budgetSliderRef.current) return

    const rect = budgetSliderRef.current.getBoundingClientRect()
    const position = (e.clientX - rect.left) / rect.width
    const clampedPosition = Math.max(0, Math.min(1, position))

    // Map position to budget values (5000, 7000, 10000, 13000)
    const budgetValues = [5000, 7000, 10000, 13000]
    const index = Math.min(budgetValues.length - 1, Math.floor(clampedPosition * budgetValues.length))
    updateCampaign({ budget: budgetValues[index] })
  }

  const handleCreateAudience = () => {
    setShowAudienceModal(true)
  }

  const handleDefaultAudience = () => {
    updateCampaign({
      audience: {
        isDefault: true,
      },
    })
  }

  const handlePay = () => {
    nextStep()
  }

  return (
    <>
      <div className="marketing-card">
        <h2 className="section-title">
          Select your content
          <Info size={16} className="info-icon" />
        </h2>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/jpeg,image/png,image/jpg"
          onChange={handleFileUpload}
        />

        {campaign.contentImage ? (
          <div className="uploaded-image">
            <img
              src={campaign.contentImage || "/placeholder.svg"}
              alt="Uploaded content"
              style={{ width: "100%", borderRadius: "8px", marginBottom: "20px" }}
            />
            <button className="button-primary" onClick={handleUploadClick}>
              Change Image
            </button>
          </div>
        ) : (
          <div className="upload-container" onClick={handleUploadClick}>
            <div className="upload-icon">
              <Upload size={24} color="white" />
            </div>
            <div className="upload-text">Drop your image here or Browse</div>
            <div className="upload-support">Support: JPG, JPEG, PNG</div>
          </div>
        )}

        <div className="promotion-stats">
          <div className="stats-title">Custom Promotion</div>
          <div className="stats-value">750-200</div>
          <div className="stats-description">Estimated image views</div>
        </div>
      </div>

      <div className="marketing-card">
        <h2 className="section-title">
          Define your audience
          <Info size={16} className="info-icon" />
        </h2>

        <div className="audience-options">
          <div className="audience-option">
            <div className="option-label">Default audience</div>
            <div
              className={`custom-checkbox ${campaign.audience.isDefault ? "checked" : ""}`}
              onClick={handleDefaultAudience}
            >
              {campaign.audience.isDefault && <Check size={16} color="white" />}
            </div>
          </div>
          <div className="audience-option">
            <div className="option-label">Create your own</div>
            <ChevronRight size={20} onClick={handleCreateAudience} style={{ cursor: "pointer" }} />
          </div>
        </div>
      </div>

      <div className="marketing-card">
        <h2 className="section-title">Set budget and duration</h2>

        <div className="slider-container">
          <div className="slider-header">
            <div className="slider-title">Duration</div>
          </div>
          <div className="slider-track" ref={durationSliderRef} onMouseDown={handleDurationSliderMouseDown}>
            <div className="slider-fill" style={{ width: `${(campaign.duration / 7) * 100}%` }}></div>
            <div className="slider-thumb" style={{ left: `${(campaign.duration / 7) * 100}%` }}></div>
          </div>
          <div className="slider-options">
            <div className="slider-option" style={{ fontWeight: campaign.duration === 1 ? "bold" : "normal" }}>
              1day
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 2 ? "bold" : "normal" }}>
              2days
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 3 ? "bold" : "normal" }}>
              3days
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 4 ? "bold" : "normal" }}>
              4days
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 5 ? "bold" : "normal" }}>
              5days
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 6 ? "bold" : "normal" }}>
              6days
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.duration === 7 ? "bold" : "normal" }}>
              7days
            </div>
          </div>
        </div>

        <div className="slider-container">
          <div className="slider-header">
            <div className="slider-title">Budget</div>
          </div>
          <div className="slider-track" ref={budgetSliderRef} onMouseDown={handleBudgetSliderMouseDown}>
            <div className="slider-fill" style={{ width: `${getBudgetPercentage(campaign.budget)}%` }}></div>
            <div className="slider-thumb" style={{ left: `${getBudgetPercentage(campaign.budget)}%` }}></div>
          </div>
          <div className="slider-options">
            <div className="slider-option" style={{ fontWeight: campaign.budget === 5000 ? "bold" : "normal" }}>
              EGY 5000
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.budget === 7000 ? "bold" : "normal" }}>
              EGY 7000
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.budget === 10000 ? "bold" : "normal" }}>
              EGY 10000
            </div>
            <div className="slider-option" style={{ fontWeight: campaign.budget === 13000 ? "bold" : "normal" }}>
              EGY 13000
            </div>
          </div>
        </div>

        <div className="price-container">
          <div className="price">EGY {campaign.budget}</div>
          <div className="price-details" onClick={() => setShowPriceDetails(true)}>
            See price details
            <ChevronDown size={16} style={{ marginLeft: "4px" }} />
          </div>
        </div>

        <div className="button-container">
          <button className="button-primary" onClick={handlePay}>
            PAY
          </button>
        </div>
      </div>

      {/* Price Details Modal */}
      {showPriceDetails && (
        <div className="modal-overlay">
          <div className="modal price-details-modal">
            <div className="modal-header">
              <button
                onClick={() => setShowPriceDetails(false)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                Cancel
              </button>
              <div className="modal-title">Price details</div>
              <div style={{ width: "50px" }}></div> {/* Spacer for alignment */}
            </div>
            <div className="modal-body">
              <div className="price-item">
                <div className="price-label">Subtotal</div>
                <div className="price-value">EGY {Math.round(campaign.budget * 0.857)}</div>
              </div>
              <div className="price-item">
                <div className="price-label">Insufficient amount</div>
                <div className="price-value">EGY {Math.round(campaign.budget * 0.071)}</div>
              </div>
              <div className="price-item">
                <div className="price-label">
                  Tax
                  <Info size={14} className="price-info" />
                </div>
                <div className="price-value">EGY {Math.round(campaign.budget * 0.071)}</div>
              </div>
              <div className="price-item">
                <div className="price-label">Total</div>
                <div className="price-value">EGY {campaign.budget}</div>
              </div>
            </div>
            <div className="button-container">
              <button className="button-primary" onClick={() => setShowPriceDetails(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Audience Modal */}
      {showAudienceModal && <AudienceModal onClose={() => setShowAudienceModal(false)} />}
    </>
  )
}

// Helper function to calculate budget percentage for slider
function getBudgetPercentage(budget: number): number {
  const budgetValues = [5000, 7000, 10000, 13000]
  const index = budgetValues.indexOf(budget)
  if (index === -1) return 0
  return (index / (budgetValues.length - 1)) * 100
}

interface AudienceModalProps {
  onClose: () => void
}

function AudienceModal({ onClose }: AudienceModalProps) {
  const { updateCampaign } = useMarketing()
  const [step, setStep] = useState(1)
  const [audienceName, setAudienceName] = useState("")
  const [gender, setGender] = useState("All")
  const [ageRange, setAgeRange] = useState("18-24")
  const [location, setLocation] = useState("New Cairo")
  const [interests, setInterests] = useState<string[]>(["Education"])

  const handleSave = () => {
    updateCampaign({
      audience: {
        name: audienceName,
        gender,
        ageRange,
        locations: [location],
        interests,
        isDefault: false,
      },
    })
    onClose()
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="modal-header">
              <button onClick={() => onClose()} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Cancel
              </button>
              <div className="modal-title">Create your own</div>
              <div style={{ width: "50px" }}></div> {/* Spacer for alignment */}
            </div>
            <div className="modal-body">
              <div className="audience-estimate">
                <div className="audience-number">
                  20.36M-42.66M
                  <Info size={16} className="audience-info" />
                </div>
                <div className="audience-label">Estimated audience</div>
              </div>

              <div className="form-group">
                <label className="form-label">Write an audience name</label>
                <input
                  type="text"
                  className="form-input"
                  value={audienceName}
                  onChange={(e) => setAudienceName(e.target.value)}
                  placeholder="Enter audience name"
                />
              </div>

              <div className="option-group">
                <div className="option-title">Select your target audience</div>

                <div className="audience-option">
                  <div className="option-label">Gender & age</div>
                  <div>All | All</div>
                </div>

                <div className="audience-option">
                  <div className="option-label">Locations</div>
                  <div>None selected</div>
                </div>

                <div className="audience-option">
                  <div className="option-label">Interests</div>
                  <div>None selected</div>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="button-primary" onClick={() => setStep(2)}>
                Save
              </button>
            </div>
          </>
        )
      case 2:
        return (
          <>
            <div className="modal-header">
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Back
              </button>
              <div className="modal-title">Gender & age</div>
              <div style={{ width: "50px" }}></div> {/* Spacer for alignment */}
            </div>
            <div className="modal-body">
              <div className="audience-estimate">
                <div className="audience-number">
                  20.36M-42.66M
                  <Info size={16} className="audience-info" />
                </div>
                <div className="audience-label">Estimated audience</div>
              </div>

              <div className="option-group">
                <div className="option-title">Gender</div>
                <div className="option-buttons">
                  <button
                    className={`option-button ${gender === "All" ? "selected" : ""}`}
                    onClick={() => setGender("All")}
                  >
                    All
                  </button>
                  <button
                    className={`option-button ${gender === "Female" ? "selected" : ""}`}
                    onClick={() => setGender("Female")}
                  >
                    Female
                  </button>
                  <button
                    className={`option-button ${gender === "Male" ? "selected" : ""}`}
                    onClick={() => setGender("Male")}
                  >
                    Male
                  </button>
                </div>
              </div>

              <div className="option-group">
                <div className="option-title">Age</div>
                <div className="option-buttons">
                  <button
                    className={`option-button ${ageRange === "All" ? "selected" : ""}`}
                    onClick={() => setAgeRange("All")}
                  >
                    All
                  </button>
                  <button
                    className={`option-button ${ageRange === "13-17" ? "selected" : ""}`}
                    onClick={() => setAgeRange("13-17")}
                  >
                    13-17
                  </button>
                  <button
                    className={`option-button ${ageRange === "18-24" ? "selected" : ""}`}
                    onClick={() => setAgeRange("18-24")}
                  >
                    18-24
                  </button>
                  <button
                    className={`option-button ${ageRange === "25-34" ? "selected" : ""}`}
                    onClick={() => setAgeRange("25-34")}
                  >
                    25-34
                  </button>
                  <button
                    className={`option-button ${ageRange === "35-44" ? "selected" : ""}`}
                    onClick={() => setAgeRange("35-44")}
                  >
                    35-44
                  </button>
                  <button
                    className={`option-button ${ageRange === "45-54" ? "selected" : ""}`}
                    onClick={() => setAgeRange("45-54")}
                  >
                    45-54
                  </button>
                  <button
                    className={`option-button ${ageRange === "55+" ? "selected" : ""}`}
                    onClick={() => setAgeRange("55+")}
                  >
                    55+
                  </button>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="button-primary" onClick={() => setStep(3)}>
                Save
              </button>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div className="modal-header">
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Back
              </button>
              <div className="modal-title">Locations</div>
              <div style={{ width: "50px" }}></div> {/* Spacer for alignment */}
            </div>
            <div className="modal-body">
              <div className="audience-estimate">
                <div className="audience-number">
                  20.36M-42.66M
                  <Info size={16} className="audience-info" />
                </div>
                <div className="audience-label">Estimated audience</div>
              </div>

              <div className="form-group">
                <div className="search-container1">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search For Locations"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <p className="option-subtitle">
                  Search for the cities, towns, and provinces you want to target. Results are limited to the country
                  you're posting from.
                </p>
              </div>
            </div>
            <div className="button-container">
              <button className="button-primary" onClick={() => setStep(4)}>
                Save
              </button>
            </div>
          </>
        )
      case 4:
        return (
          <>
            <div className="modal-header">
              <button onClick={() => setStep(1)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                Back
              </button>
              <div className="modal-title">Interests</div>
              <div style={{ width: "50px" }}></div> {/* Spacer for alignment */}
            </div>
            <div className="modal-body">
              <div className="audience-estimate">
                <div className="audience-number">
                  20.36M-42.66M
                  <Info size={16} className="audience-info" />
                </div>
                <div className="audience-label">Estimated audience</div>
              </div>

              <div className="option-group">
                <div className="interest-options">
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Healthy food")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Healthy food"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Healthy food"))
                          }
                        }}
                      />
                      Healthy food
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Fast food")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Fast food"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Fast food"))
                          }
                        }}
                      />
                      Fast food
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Market")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Market"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Market"))
                          }
                        }}
                      />
                      Market
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Handmade")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Handmade"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Handmade"))
                          }
                        }}
                      />
                      Handmade
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Dessert")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Dessert"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Dessert"))
                          }
                        }}
                      />
                      Dessert
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Accessories")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Accessories"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Accessories"))
                          }
                        }}
                      />
                      Accessories
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Fashion")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Fashion"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Fashion"))
                          }
                        }}
                      />
                      Fashion
                    </label>
                  </div>
                  <div className="interest-option">
                    <label>
                      <input
                        className="check"
                        type="checkbox"
                        checked={interests.includes("Education")}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInterests([...interests, "Education"])
                          } else {
                            setInterests(interests.filter((i) => i !== "Education"))
                          }
                        }}
                      />
                      Education
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="button-container">
              <button className="button-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        {renderStep()}
      </div>
    </div>
  )
}
