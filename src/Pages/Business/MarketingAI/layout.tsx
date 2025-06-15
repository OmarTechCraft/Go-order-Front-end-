// layout.tsx
"use client"

import type { ReactNode } from "react"
import Nav_2 from "../../../components/Sidebar_2/Sidebar_2"
import Navbar from "../../../components/navbar copy/Navbar"
import { MarketingProvider } from "./MarketingContext"
import "./marketing-ai.css" // Keep this single import

interface LayoutProps {
  children: ReactNode
}

export default function MarketingAILayout({ children }: LayoutProps) {
  return (
    <MarketingProvider>
      <div className="app-container">
        <Navbar/>

        <div className="main-content">
          <Nav_2 />
          <div className="content-area2">
            <div className="marketing-ai-content">{children}</div> {/* Changed class */}
          </div>
        </div>
      </div>
    </MarketingProvider>
  )
}