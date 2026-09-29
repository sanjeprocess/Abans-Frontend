import React, { useState, useEffect } from "react";
import "./PreForm.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== "")
  ? import.meta.env.VITE_API_BASE_URL
  : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : "";

function PreForm({ onVerified }) {
  const [step, setStep]       = useState("form"); // "form" | "otp"
  const [name, setName]       = useState("");
  const [nic, setNic]         = useState("");
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [status, setStatus]   = useState("idle"); // "idle" | "loading" | "error" | "success"
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // OTP Countdown timer
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // ── Step 1: Submit pre-registration → server generates OTP ─────────────────
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim() || !nic.trim() || !phone.trim()) {
      setStatus("error");
      setMessage("Please fill in your Full Name, NIC, and Mobile Number.");
      return;
    }

    setStatus("loading");
    setMessage("Registering applicant & sending OTP...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/pre-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), nicNo: nic.trim(), phone: phone.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server error — please verify the backend service is active.");
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data?.message || "Registration failed");
      }

      setStatus("success");
      setMessage("Verification code sent! Please check your mobile phone.");
      setStep("otp");
      setResendTimer(60);

    } catch (err) {
      setStatus("error");
      setMessage("Error: " + err.message);
    }
  };

  // ── Step 2: Verify OTP against server ─────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      setStatus("error");
      setMessage("Please enter the 6-digit OTP code.");
      return;
    }

    setStatus("loading");
    setMessage("Verifying code...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), otp: otp.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Server error — please check backend.");
      }

      const data = await res.json();

      if (!data.success) {
        setStatus("error");
        setMessage(data.message || "OTP verification failed.");
        return;
      }

      // Verified — pass data to parent application
      onVerified({ name, nicNo: nic, phone });

    } catch (err) {
      setStatus("error");
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="preform-bg">
      <div className="preform-card">
        
        {/* Modern Header */}
        <div className="preform-header">
          <div className="preform-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
              <path d="M12 8v8M8 12h8"></path>
            </svg>
          </div>
          <div className="preform-title-block">
            <h1 className="preform-company">Digital Financial Services</h1>
            <p className="preform-subtitle">Loan & Lease Application Portal</p>
            <p className="preform-subtitle-si">ණය සහ ලීසිං අයදුම්පත් පද්ධතිය</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="preform-progress-bar">
          <div className={`progress-step ${step === "form" ? "active" : "completed"}`}>
            <span className="step-num">1</span>
            <span className="step-text">Applicant Details</span>
          </div>
          <div className="progress-divider"></div>
          <div className={`progress-step ${step === "otp" ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-text">OTP Security</span>
          </div>
        </div>

        {/* ── STEP 1: Pre-registration form ─────────────────────────────── */}
        {step === "form" && (
          <form className="preform-body" onSubmit={handleSendOtp}>
            <div className="form-intro">
              <h2>Welcome! Enter your details to start</h2>
              <p>සාදරයෙන් පිළිගනිමු! ඉදිරියට යාමට ඔබේ තොරතුරු ඇතුළත් කරන්න</p>
            </div>

            <div className="preform-field">
              <label className="pf-label">
                Full Name <span className="pf-label-si">/ සම්පූර්ණ නම</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  className="pf-input"
                  type="text"
                  placeholder="e.g. K.A. Tharindu Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="preform-field">
              <label className="pf-label">
                NIC / Passport Number <span className="pf-label-si">/ ජා.හැ.අ. අංකය</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                  <circle cx="9" cy="10" r="2"></circle>
                  <line x1="15" y1="8" x2="19" y2="8"></line>
                  <line x1="15" y1="12" x2="19" y2="12"></line>
                </svg>
                <input
                  className="pf-input"
                  type="text"
                  placeholder="e.g. 199012345678 or 901234567V"
                  value={nic}
                  onChange={(e) => setNic(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="preform-field">
              <label className="pf-label">
                Mobile Phone Number <span className="pf-label-si">/ ජංගම දුරකථන අංකය</span>
              </label>
              <div className="input-with-icon">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                  <line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                <input
                  className="pf-input"
                  type="tel"
                  placeholder="e.g. 0771234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {status === "error" && (
              <div className="pf-msg pf-msg-error">
                <span className="msg-icon">⚠️</span> {message}
              </div>
            )}

            <button type="submit" className="pf-btn" disabled={status === "loading"}>
              {status === "loading" ? (
                <span className="btn-loading-content">
                  <span className="mini-spinner"></span> Generating Security Code...
                </span>
              ) : (
                <span>Request OTP Security Code →</span>
              )}
            </button>
          </form>
        )}

        {/* ── STEP 2: OTP verification ──────────────────────────────────── */}
        {step === "otp" && (
          <form className="preform-body" onSubmit={handleVerifyOtp}>
            <div className="form-intro">
              <h2>Enter Security Code</h2>
              <p>ඔබගේ ජංගම දුරකථනයට ලැබුණු OTP අංකය ඇතුළත් කරන්න</p>
            </div>

            <div className="pf-otp-info">
              <div className="pf-otp-phone">
                <span className="phone-badge-icon">📱</span> {phone}
              </div>
              <p className="pf-otp-note">
                We sent a 6-digit verification code to your phone.
              </p>
            </div>

            <div className="preform-field">
              <label className="pf-label text-center">6-Digit Security Code (OTP)</label>
              <input
                className="pf-input pf-input-otp"
                type="text"
                placeholder="• • • • • •"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                autoFocus
                required
              />
            </div>

            {status === "error" && (
              <div className="pf-msg pf-msg-error">
                <span className="msg-icon">⚠️</span> {message}
              </div>
            )}
            {status === "success" && (
              <div className="pf-msg pf-msg-success">
                <span className="msg-icon">✅</span> {message}
              </div>
            )}

            <button type="submit" className="pf-btn" disabled={status === "loading"}>
              {status === "loading" ? (
                <span className="btn-loading-content">
                  <span className="mini-spinner"></span> Verifying OTP...
                </span>
              ) : (
                <span>Verify & Proceed to Application →</span>
              )}
            </button>

            <div className="otp-actions-row">
              <button
                type="button"
                className="pf-btn-back"
                onClick={() => {
                  setStep("form");
                  setStatus("idle");
                  setMessage("");
                  setOtp("");
                }}
              >
                ← Edit Details
              </button>

              <button
                type="button"
                className="pf-btn-resend"
                disabled={resendTimer > 0 || status === "loading"}
                onClick={handleSendOtp}
              >
                {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        <div className="preform-footer">
          🔒 256-Bit Encrypted Secure Application Portal
        </div>
      </div>
    </div>
  );
}

export default PreForm;