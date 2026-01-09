import React from "react";
import { OpenBankLogo } from "./CustomIcons";

export const BrandingPanel = () => {
  return (
    <div className="branding-panel">
      {/* Background Image - Cityscape */}
      <img 
        src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=2613&auto=format&fit=crop" 
        alt="Cityscape" 
        className="branding-bg"
      />
      
      {/* Overlay Gradients */}
      <div className="branding-overlay"></div>
      <div className="branding-tint"></div>

      {/* Content Container */}
      <div className="branding-content">
        <div className="logo-circle">
           <OpenBankLogo className="logo-svg" style={{ width: "6rem", height: "6rem", filter: "drop-shadow(0 0 15px rgba(77,181,255,0.4))" }} />
        </div>
        <h1 className="brand-title">
          Open<strong>Bank</strong>
        </h1>
      </div>
    </div>
  );
};
