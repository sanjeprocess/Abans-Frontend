import React, { useState } from "react";
import "./theme.css";
import PreForm from "./PreForm";
import TermsAndConditions from "./components/TermsAndConditions";

/**
 * App flow:
 *   1. PreForm            – applicant details + OTP verification
 *   2. TermsAndConditions – Initial Loan Origination T&Cs (scroll-gated)
 *
 * Privacy blur is handled globally by privacyGuard.js before React renders.
 */
function App() {
  const [stage, setStage] = useState("preform");

  if (stage === "preform") {
    return (
      <PreForm
        onVerified={() => setStage("terms")}
      />
    );
  }

  return <TermsAndConditions onAgree={() => setStage("terms")} />;
}

export default App;