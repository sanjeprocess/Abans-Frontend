import React, { useState, useRef } from "react";
import ApplicationForm from "./form/ApplicationForm";
import "./RegistrationPage.css";

/* ─── Inline style constants (immune to global CSS overrides) ─── */
const S = {
  title:     { fontSize: "1.2rem",   fontWeight: 800,   color: "#ffffff",  margin: 0, fontFamily: "inherit", letterSpacing: "-0.02em", lineHeight: 1.25 },
  subtitle:  { fontSize: "0.76rem",  fontWeight: 400,   color: "rgba(255,255,255,0.75)", margin: "3px 0 0", fontFamily: "inherit" },
  badge:     { fontSize: "0.68rem",  fontWeight: 700,   color: "rgba(255,255,255,0.92)", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "inherit" },
  hintText:  { fontSize: "0.72rem",  fontWeight: 600,   color: "#1d4ed8",  fontFamily: "inherit", letterSpacing: "0.03em" },
  blockNum:  { fontSize: "0.65rem",  fontWeight: 800,   color: "#ffffff",  lineHeight: 1, fontFamily: "inherit" },
  blockTitle:{ fontSize: "0.84rem",  fontWeight: 700,   color: "#1e1b4b",  letterSpacing: "-0.01em", lineHeight: 1.3, fontFamily: "inherit" },
  blockBody: { fontSize: "0.83rem",  fontWeight: 400,   color: "#1f2937",  lineHeight: 1.65, margin: 0, fontFamily: "inherit" },
  bulletItem:{ fontSize: "0.8rem",   fontWeight: 400,   color: "#374151",  lineHeight: 1.55, fontFamily: "inherit", display: "flex", alignItems: "flex-start", gap: 8 },
  endText:   { fontSize: "0.7rem",   fontWeight: 400,   color: "#94a3b8",  letterSpacing: "0.05em", fontFamily: "inherit" },
  checkText: { fontSize: "0.85rem",  fontWeight: 600,   color: "#1e293b",  lineHeight: 1.4, fontFamily: "inherit" },
  btnDisabled:{ fontSize: "0.92rem", fontWeight: 700,   color: "#94a3b8",  fontFamily: "inherit", letterSpacing: "0.01em" },
  btnActive:  { fontSize: "0.92rem", fontWeight: 700,   color: "#ffffff",  fontFamily: "inherit", letterSpacing: "0.01em" },
};

/* ─── Terms data ─── */
const TERMS_SECTIONS = [
  {
    id: 1, icon: "🎯", title: "Purpose",
    content: "This system collects your personal and sensitive information to register you in the system.",
  },
  {
    id: 2, icon: "🗂️", title: "Data We Collect",
    content: "We collect the personal and sensitive information you provide during registration, including:",
    bullets: [
      "Identity: name, NIC number, date of birth, gender",
      "Contact: phone number, email, address",
      "Family: details of your spouse, children and dependants",
      "Employment: workplace, job title, employment history, income source",
      "Financial: income, bank account details, loans and other financial information",
      "Education: schools, qualifications, certificates and results",
      "Other: any further information requested in the registration form",
    ],
  },
  {
    id: 3, icon: "✅", title: "Sensitive Data Consent",
    content: 'By ticking "I agree", you give your clear and explicit consent for us to collect, store and process your sensitive data, including financial data, for registration.',
  },
  {
    id: 4, icon: "👨‍👩‍👧", title: "Third-Party Data",
    content: "If you provide information about other people (children, family members), you confirm that you have the right or legal authority to share it.",
  },
  {
    id: 5, icon: "📊", title: "Use of Data",
    content: "Your data is used only for registration and related record keeping. We do not sell it, and we do not share it with third parties, except where required by law or by authorized officers.",
  },
  {
    id: 6, icon: "🔐", title: "Access Control",
    content: "Only authorized staff can view your data, and only as needed for their duties. Access is logged.",
  },
  {
    id: 7, icon: "🛡️", title: "Security",
    content: "Your data is protected with encryption, secure storage and access controls. No system is completely secure, but we work to prevent unauthorized access, loss or misuse.",
  },
  {
    id: 8, icon: "⚠️", title: "Data Breach",
    content: "If your data is affected by a security breach, we will inform you and the relevant authorities as required by law.",
  },
  {
    id: 9, icon: "🗓️", title: "Retention",
    content: "We keep your data only as long as your registration is active or as required by law. After that, it is securely deleted or anonymized.",
  },
  {
    id: 10, icon: "✏️", title: "Accuracy",
    content: "You confirm that all the information you provide is true and correct. You must update it if it changes. False information may lead to your registration being rejected or cancelled.",
  },
  {
    id: 11, icon: "📱", title: "OTP Security",
    content: "Do not share your OTP with anyone. You are responsible for activity done with your verified phone number.",
  },
  {
    id: 12, icon: "⚖️", title: "Your Rights",
    content: "You may ask to view, correct or delete your data, or withdraw your consent, subject to legal requirements. Withdrawing consent may mean we can no longer keep your registration active. Contact: [your email or phone].",
  },
  {
    id: 13, icon: "🔄", title: "Changes",
    content: "We may update these terms. We will notify you of important changes, and continued use means you accept them.",
  },
  {
    id: 14, icon: "🤝", title: "Agreement",
    content: 'By ticking "I agree", you confirm that you have read, understood and accept these terms.',
  },
];

/* ─── Bullet dot ─── */
const BulletDot = () => (
  <span style={{
    flexShrink: 0, width: 7, height: 7, borderRadius: "50%",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
    display: "inline-block", marginTop: 6,
  }} />
);

/* ─── RegistrationPage ─── */
export default function RegistrationPage({ preFilledData }) {
  const [agreed, setAgreed]     = useState(false);
  const [accepted, setAccepted] = useState(false);
  const consentRef = useRef({ agreed: false, agreedAt: null });

  const handleAccept = () => {
    consentRef.current = { agreed: true, agreedAt: new Date().toISOString() };
    setAccepted(true);
  };

  const enrichedData = { ...(preFilledData || {}), consent: consentRef.current };

  return (
    <div className="rp-root">

      {/* Blurred / locked form */}
      <div
        className={`rp-form-wrapper${accepted ? " rp-form-wrapper--unlocked" : ""}`}
        aria-hidden={!accepted}
        {...(!accepted ? { inert: "" } : {})}
      >
        <ApplicationForm preFilledData={enrichedData} />
      </div>

      {/* Terms overlay */}
      {!accepted && (
        <div className="rp-overlay" role="dialog" aria-modal="true" aria-labelledby="tc-title">
          <div className="rp-card">

            {/* ── Header ── */}
            <div className="rp-card__header">
              <div className="rp-card__header-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <line x1="10" y1="9"  x2="8" y2="9"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 id="tc-title" style={S.title}>Terms &amp; Conditions</h2>
                <p style={S.subtitle}>Please read carefully before continuing</p>
              </div>
              <div className="rp-card__badge">
                <span style={S.badge}>v1.0</span>
              </div>
            </div>

            {/* ── Scroll hint ── */}
            <div className="rp-card__scroll-hint">
              <svg className="rp-scroll-icon" viewBox="0 0 24 24" fill="none"
                stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                width="14" height="14">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <polyline points="19 12 12 19 5 12"/>
              </svg>
              <span style={S.hintText}>Scroll to read all 14 terms</span>
            </div>

            {/* ── Scrollable body ── */}
            <div className="rp-card__body" tabIndex={0} aria-label="Terms and Conditions">
              {TERMS_SECTIONS.map((sec) => (
                <div key={sec.id} className="rp-term-block">

                  {/* Block header */}
                  <div className="rp-term-block__head">
                    <span className="rp-term-block__num">
                      <span style={S.blockNum}>{sec.id}</span>
                    </span>
                    <span style={{ fontSize: "1rem", lineHeight: 1 }}>{sec.icon}</span>
                    <span style={S.blockTitle}>{sec.title}</span>
                  </div>

                  {/* Block body */}
                  <div className="rp-term-block__body">
                    <p style={S.blockBody}>{sec.content}</p>
                    {sec.bullets && (
                      <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                        {sec.bullets.map((b, i) => (
                          <li key={i} style={S.bulletItem}>
                            <BulletDot />
                            <span style={{ ...S.blockBody, fontSize: "0.79rem" }}>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}

              <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
                <span style={S.endText}>— End of Terms and Conditions —</span>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="rp-card__footer">

              {/* Checkbox row */}
              <div
                className={`rp-checkbox-label${agreed ? " rp-checkbox-label--checked" : ""}`}
                onClick={() => setAgreed(v => !v)}
                role="checkbox"
                aria-checked={agreed}
                tabIndex={0}
                onKeyDown={(e) => e.key === " " && setAgreed(v => !v)}
              >
                <div className="rp-checkbox-custom" aria-hidden="true">
                  {agreed && (
                    <svg viewBox="0 0 12 10" fill="none" stroke="white"
                      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                      width="12" height="10">
                      <polyline points="1 5 4.5 8.5 11 1"/>
                    </svg>
                  )}
                </div>
                <span style={S.checkText}>
                  I have read and agree to the Terms and Conditions
                </span>
              </div>

              {/* CTA button */}
              <button
                className={`rp-btn${agreed ? " rp-btn--active" : ""}`}
                disabled={!agreed}
                onClick={handleAccept}
              >
                {agreed ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      width="17" height="17">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={S.btnActive}>Agree &amp; Continue</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="17" height="17">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <span style={S.btnDisabled}>Accept to Unlock Form</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
