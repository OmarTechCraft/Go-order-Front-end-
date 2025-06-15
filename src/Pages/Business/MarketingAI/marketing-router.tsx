// marketing-router.tsx
// This file remains the same as it handles routing between MarketingAI and PaymentPage.
"use client"

import { useMarketing } from "./MarketingContext"
import MarketingAI from "./index"
import PaymentPage from "./payment"

export default function MarketingRouter() {
  const { campaign } = useMarketing()

  // Render different pages based on the current step
  switch (campaign.step) {
    case 1:
      return <MarketingAI />
    case 2:
      return <PaymentPage />
    default:
      return <MarketingAI />
  }
}