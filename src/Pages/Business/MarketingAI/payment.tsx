"use client"

import type React from "react"
import { useState } from "react"
import { useMarketing } from "./MarketingContext"
import { CreditCard, X } from "lucide-react"

export default function PaymentPage() {
  const { updateCampaign } = useMarketing()
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [showCardModal, setShowCardModal] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  })
  const [savedCards, setSavedCards] = useState([
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
  ])

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method)
  }

  const handleAddNewCard = () => {
    setShowCardModal(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails({
      ...cardDetails,
      [name]: value,
    })
  }

  const handlePayNow = () => {
    setShowCardModal(false)

    const maskedNumber = "**** **** **** " + (cardDetails.number.slice(-4) || "")

    const newCard = {
      id: "new_card_" + Date.now(),
      name: cardDetails.name || "New Card",
      number: maskedNumber,
      icon: <CreditCard size={24} />,
      logo: "/placeholder.svg?height=24&width=40",
    }

    setSavedCards([...savedCards, newCard])
    setSelectedPayment(newCard.id)

    setCardDetails({
      name: "",
      number: "",
      expiry: "",
      cvv: "",
    })

    updateCampaign({ paymentMethod: newCard.id }) // ✅ Now this works without error
  }

  return (
    <div className="marketing-card">
      <h2 className="section-title">Credit card</h2>

      <div className="payment-methods">
        {savedCards.map((card) => (
          <div
            key={card.id}
            className={`payment-method ${selectedPayment === card.id ? "selected" : ""}`}
            onClick={() => handlePaymentSelect(card.id)}
          >
            <div className="payment-info">
              <div className="payment-icon">{card.icon}</div>
              <div className="payment-details">
                <div className="payment-name">{card.name}</div>
                <div className="payment-number">{card.number}</div>
              </div>
            </div>
            <img src={card.logo || "/placeholder.svg"} alt={card.name} className="payment-logo" />
          </div>
        ))}
      </div>

      <div className="button-container">
        <button className="button-primary" onClick={handleAddNewCard}>
          Add New Card
        </button>
      </div>

      {showCardModal && (
        <div className="modal-overlay">
          <div className="card-modal-new">
            <button className="modal-close-button" onClick={() => setShowCardModal(false)}>
              <X size={20} />
            </button>

            <div className="card-visualization-new">
              <div className="card-brand-new">SoCard</div>
              <div className="card-number-display-new">•••• •••• •••• {cardDetails.number.slice(-4) || "8374"}</div>

              <div className="card-details-row-new">
                <div className="card-detail-group-new">
                  <div className="card-detail-label-new">Card holder name</div>
                  <div className="card-detail-value-new">{cardDetails.name || "••• •••"}</div>
                </div>
                <div className="card-detail-group-new">
                  <div className="card-detail-label-new">Expiry date</div>
                  <div className="card-detail-value-new">{cardDetails.expiry || "••• / •••"}</div>
                </div>
              </div>

              <div className="card-logo-new">
                <div className="mastercard-logo-new">
                  <div className="circle-left-new"></div>
                  <div className="circle-right-new"></div>
                </div>
              </div>
            </div>

            <div className="card-form-fields-new">
              <div className="form-group-new">
                <label htmlFor="cardholderName" className="form-label-new">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardholderName"
                  name="name"
                  className="form-input-new"
                  placeholder="Enter cardholder name"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group-new">
                <label htmlFor="cardNumber" className="form-label-new">
                  Card Number
                </label>
                <div className="card-number-input-container-new">
                  <input
                    type="text"
                    id="cardNumber"
                    name="number"
                    className="form-input-new"
                    placeholder="**** **** **** ****"
                    value={cardDetails.number}
                    onChange={handleInputChange}
                    maxLength={19}
                  />
                  <span className="card-icon-container-new">
                    <img src="/images/master.png" alt="Card" />
                  </span>
                </div>
              </div>

              <div className="form-row-new">
                <div className="form-col-new">
                  <label htmlFor="expiryDate" className="form-label-new">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiry"
                    className="form-input-new"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                    maxLength={5}
                  />
                </div>
                <div className="form-col-new">
                  <label htmlFor="cvv" className="form-label-new">
                    3-Digit CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    className="form-input-new"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleInputChange}
                    maxLength={3}
                  />
                </div>
              </div>

              <button className="pay-now-button-new" onClick={handlePayNow}>
                Pay now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
