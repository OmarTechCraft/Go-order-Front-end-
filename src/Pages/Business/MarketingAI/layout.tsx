"use client";

import type { ReactNode } from "react";
import Navbar from "../../../components/navbar copy/Navbar";
import Sidebar_2 from "../../../components/Sidebar_2/Sidebar_2";
import { MarketingProvider } from "./MarketingContext";
import "./marketing-ai.css";

interface LayoutProps {
  children: ReactNode;
}

export default function MarketingAILayout({ children }: LayoutProps) {
  return (
    <MarketingProvider>
      <div className="app-container">
        <Sidebar_2 />
        <div className="main-content">
          <Navbar />
          <div className="content-area">
            <div className="marketing-content">{children}</div>
          </div>
        </div>
      </div>
    </MarketingProvider>
  );
}
