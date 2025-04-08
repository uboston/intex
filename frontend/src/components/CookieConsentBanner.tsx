// src/components/CookieConsentBanner.tsx
import React from "react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";

const CookieConsentBanner: React.FC = () => {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="siteConsent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      declineButtonStyle={{ fontSize: "13px" }}
      expires={150}
    >
      We use cookies to personalize content and analyze traffic. You can accept or decline.
    </CookieConsent>
  );
};

export default CookieConsentBanner;
