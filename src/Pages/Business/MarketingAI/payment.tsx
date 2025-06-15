"use client";

import type React from "react";
import { useState } from "react";
import { useMarketing } from "./MarketingContext";
import { CreditCard, X } from "lucide-react";

// Define a type for a saved card
interface SavedCard {
  id: string;
  name: string;
  number: string;
  icon: React.ReactNode;
  logo: string;
}

export default function PaymentPage() {
  const { updateCampaign } = useMarketing();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [showAddNewCardForm, setShowAddNewCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message

  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: "mastercard",
      name: "MasterCard",
      number: "**** **** **** 7873",
      icon: <CreditCard size={24} />,
      logo: "/images/master.png",
    },
    {
      id: "paypal",
      name: "Paypal",
      number: "**** **** **** 4672",
      icon: <CreditCard size={24} />,
      logo: "/images/paypal.png",
    },
    {
      id: "apple_pay",
      name: "Apple Pay",
      number: "**** **** **** 4672",
      icon: <CreditCard size={24} />,
      logo: "/images/apay.png",
    },
  ]);

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
    setShowAddNewCardForm(false); // Hide the form if a saved card is selected
  };

  const handleDeleteCard = (id: string) => {
    setSavedCards((prevCards) => prevCards.filter((card) => card.id !== id));
    if (selectedPayment === id) {
      setSelectedPayment(null); // Deselect if the deleted card was selected
    }
  };

  const handleAddNewCardClick = () => {
    setShowAddNewCardForm(true); // Show the new card form in place
    setCardDetails({
      name: "",
      number: "",
      expiry: "",
      cvv: "",
    }); // Clear card details when showing form
    setErrors({ name: "", number: "", expiry: "", cvv: "" }); // Clear errors
    setSelectedPayment(null); // Deselect any existing payment method
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "number") {
      formattedValue = value.replace(/\D/g, ""); // Remove non-digits
      if (formattedValue.length > 0) {
        formattedValue = formattedValue.match(/.{1,4}/g)?.join(" ") || "";
      }
      setErrors((prev) => ({ ...prev, number: "" })); // Clear error on input
    } else if (name === "expiry") {
      formattedValue = value.replace(/\D/g, ""); // Remove non-digits
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2);
      }
      if (formattedValue.length > 5) formattedValue = formattedValue.slice(0, 5);
      setErrors((prev) => ({ ...prev, expiry: "" })); // Clear error on input
    } else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, ""); // Remove non-digits
      setErrors((prev) => ({ ...prev, cvv: "" })); // Clear error on input
    } else if (name === "name") {
      setErrors((prev) => ({ ...prev, name: "" })); // Clear error on input
    }

    setCardDetails({
      ...cardDetails,
      [name]: formattedValue,
    });
  };

  const validateCardDetails = () => {
    let newErrors = { name: "", number: "", expiry: "", cvv: "" };
    let isValid = true;

    // Cardholder Name Validation
    if (!cardDetails.name.trim()) {
      newErrors.name = "Cardholder name is required.";
      isValid = false;
    }

    // Card Number Validation (simplified check for length and digits)
    const rawCardNumber = cardDetails.number.replace(/\s/g, "");
    if (!rawCardNumber) {
      newErrors.number = "Card number is required.";
      isValid = false;
    } else if (!/^\d{16}$/.test(rawCardNumber)) {
      newErrors.number = "Card number must be 16 digits.";
      isValid = false;
    }

    // Expiry Date Validation (MM/YY)
    const expiryParts = cardDetails.expiry.split("/");
    const month = parseInt(expiryParts[0], 10);
    const year = parseInt(expiryParts[1], 10);
    const currentYear = new Date().getFullYear() % 100; // Last two digits of current year
    const currentMonth = new Date().getMonth() + 1; // 1-indexed

    if (!cardDetails.expiry || expiryParts.length !== 2 || isNaN(month) || isNaN(year)) {
      newErrors.expiry = "Expiry date must be in MM/YY format.";
      isValid = false;
    } else if (month < 1 || month > 12) {
      newErrors.expiry = "Month must be between 01 and 12.";
      isValid = false;
    } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
      newErrors.expiry = "Expiry date cannot be in the past.";
      isValid = false;
    }

    // CVV Validation
    if (!cardDetails.cvv) {
      newErrors.cvv = "CVV is required.";
    } else if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirmCard = () => {
    if (validateCardDetails()) {
      const maskedNumber = "**** **** **** " + (cardDetails.number.replace(/\s/g, "").slice(-4) || "");
      const newCard: SavedCard = {
        id: "new_card_" + Date.now(),
        name: cardDetails.name || "New Card",
        number: maskedNumber,
        icon: <CreditCard size={24} />, // Generic icon for new card
        logo: "/images/generic_card.png", // Placeholder for new card logo
      };

      setSavedCards((prevCards) => [...prevCards, newCard]);
      setSelectedPayment(newCard.id);
      updateCampaign({ paymentMethod: newCard.id });

      // Reset form and revert to cards list
      setCardDetails({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
      });
      setErrors({ name: "", number: "", expiry: "", cvv: "" });
      setShowAddNewCardForm(false); // Revert to cards list view
      setShowSuccessMessage(true); // Show success message
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
    }
  };

  return (
    <div className="marketing-ai-card marketing-ai-animate-fade-in">
      {showSuccessMessage && (
        <div className="marketing-ai-success-message marketing-ai-animate-fade-in-down">
          Card added successfully!
        </div>
      )}

      {showAddNewCardForm ? (
        // In-page "Add New Card" form
        <div className="marketing-ai-add-new-card-section">
          <div className="marketing-ai-modal-header-compact">
            {" "}
            {/* Re-using modal header styles for consistency */}
            <button className="marketing-ai-modal-back-button" onClick={() => setShowAddNewCardForm(false)}>
              Back
            </button>
            <div className="marketing-ai-modal-title">Add New Card</div>
            <div className="marketing-ai-header-spacer"></div> {/* Spacer for symmetry */}
          </div>

          <div className="marketing-ai-modal-body">
            {" "}
            {/* Re-using modal body padding */}
            <div className="marketing-ai-card-visualization-new">
              <div className="marketing-ai-card-brand-new">SoCard</div>
              <div className="marketing-ai-card-number-display-new">
                {/* Display 4-digit chunks, replace empty with dots or default */}
                {cardDetails.number.padEnd(19, "•").replace(/\s/g, "").match(/.{1,4}/g)?.join(" ") || "•••• •••• •••• ••••"}
              </div>

              <div className="marketing-ai-card-details-row-new">
                <div className="marketing-ai-card-detail-group-new">
                  <div className="marketing-ai-card-detail-label-new">Card holder name</div>
                  <div className="marketing-ai-card-detail-value-new">
                    {cardDetails.name.toUpperCase() || "FULL NAME"}
                  </div>
                </div>
                <div className="marketing-ai-card-detail-group-new">
                  <div className="marketing-ai-card-detail-label-new">Expiry date</div>
                  <div className="marketing-ai-card-detail-value-new">
                    {cardDetails.expiry || "MM/YY"}
                  </div>
                </div>
              </div>

              <div className="marketing-ai-card-logo-new">
                {/* You can add logic here to dynamically show card type logo based on number */}
                <img src="/images/master.png" alt="MasterCard" style={{ height: "30px", width: "auto" }} />
              </div>
            </div>

            <div className="marketing-ai-card-form-fields-new">
              <div className="marketing-ai-form-group-new">
                <label htmlFor="cardholderName" className="marketing-ai-form-label-new">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="name"
                  className={`marketing-ai-form-input-new ${errors.name ? "marketing-ai-input-error" : ""}`}
                  placeholder="Enter cardholder name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="marketing-ai-error-message">{errors.name}</p>}
              </div>

              <div className="marketing-ai-form-group-new">
                <label htmlFor="cardNumber" className="marketing-ai-form-label-new">
                  Card Number
                </label>
                <div className="marketing-ai-card-number-input-container-new">
                  <input
                    type="text"
                    id="cardNumber"
                    name="number"
                    className={`marketing-ai-form-input-new ${errors.number ? "marketing-ai-input-error" : ""}`}
                    placeholder="**** **** **** ****"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    maxLength={19} // Max length for formatted number with spaces
                  />
                  <span className="marketing-ai-card-icon-container-new">
                    <img src="/images/master.png" alt="Card" />
                  </span>
                </div>
                {errors.number && <p className="marketing-ai-error-message">{errors.number}</p>}
              </div>

              <div className="marketing-ai-form-row-new">
                <div className="marketing-ai-form-col-new">
                  <label htmlFor="expiryDate" className="marketing-ai-form-label-new">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiry"
                    className={`marketing-ai-form-input-new ${errors.expiry ? "marketing-ai-input-error" : ""}`}
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                  {errors.expiry && <p className="marketing-ai-error-message">{errors.expiry}</p>}
                </div>
                <div className="marketing-ai-form-col-new">
                  <label htmlFor="cvv" className="marketing-ai-form-label-new">
                    3-Digit CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    className={`marketing-ai-form-input-new ${errors.cvv ? "marketing-ai-input-error" : ""}`}
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    maxLength={4} // Allows for 4-digit CVV (e.g., Amex)
                  />
                  {errors.cvv && <p className="marketing-ai-error-message">{errors.cvv}</p>}
                </div>
              </div>

              <button className="marketing-ai-pay-now-button-new" onClick={handleConfirmCard}>
                Confirm Card
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Display list of saved cards
        <>
          <div className="marketing-ai-payment-methods">
            {savedCards.map((card) => (
              <div
                key={card.id}
                className={`marketing-ai-payment-method ${selectedPayment === card.id ? "selected" : ""}`}
                // Only allow selection if it's not the currently selected card and not adding a new one
                onClick={() => handlePaymentSelect(card.id)}
              >
                <div className="marketing-ai-payment-info">
                  <div className="marketing-ai-payment-icon">{card.icon}</div>
                  <div className="marketing-ai-payment-details">
                    <div className="marketing-ai-payment-name">{card.name}</div>
                    <div className="marketing-ai-payment-number">{card.number}</div>
                  </div>
                </div>
                <img
                  src={card.logo || "/placeholder.svg?height=24&width=40"}
                  alt={card.name}
                  className="marketing-ai-payment-logo"
                />
                <button
                  className="marketing-ai-delete-card-button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card selection when deleting
                    handleDeleteCard(card.id);
                  }}
                  aria-label={`Delete ${card.name} card`}
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="marketing-ai-button-container">
            <button className="marketing-ai-button-primary" onClick={handleAddNewCardClick}>
              Add New Card
            </button>
          </div>
        </>
      )}
    </div>
  );
}