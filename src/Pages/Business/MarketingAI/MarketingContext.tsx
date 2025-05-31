"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface AudienceSettings {
  name?: string
  gender?: string
  ageRange?: string
  locations?: string[]
  interests?: string[]
  isDefault: boolean
}

export interface MarketingCampaign {
  contentImage?: string
  estimatedViews?: string
  audience: AudienceSettings
  duration: number
  budget: number
  step: number
paymentMethod?: string 
  }
  
interface MarketingContextType {
  campaign: MarketingCampaign
  setCampaign: (campaign: MarketingCampaign) => void
  updateCampaign: (updates: Partial<MarketingCampaign>) => void
  resetCampaign: () => void
  nextStep: () => void
  prevStep: () => void
}

const defaultCampaign: MarketingCampaign = {
  estimatedViews: "750-200",
  audience: {
    isDefault: true,
  },
  duration: 1,
  budget: 7000,
  step: 1,
}

const MarketingContext = createContext<MarketingContextType | undefined>(undefined)

export function MarketingProvider({ children }: { children: ReactNode }) {
  const [campaign, setCampaign] = useState<MarketingCampaign>(defaultCampaign)

  const updateCampaign = (updates: Partial<MarketingCampaign>) => {
    setCampaign((prev) => ({ ...prev, ...updates }))
  }

  const resetCampaign = () => {
    setCampaign(defaultCampaign)
  }

  const nextStep = () => {
    setCampaign((prev) => ({ ...prev, step: prev.step + 1 }))
  }

  const prevStep = () => {
    setCampaign((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }))
  }

  return (
    <MarketingContext.Provider
      value={{
        campaign,
        setCampaign,
        updateCampaign,
        resetCampaign,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </MarketingContext.Provider>
  )
}

export function useMarketing() {
  const context = useContext(MarketingContext)
  if (context === undefined) {
    throw new Error("useMarketing must be used within a MarketingProvider")
  }
  return context
}
