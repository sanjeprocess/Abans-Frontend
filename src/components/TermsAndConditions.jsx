import React, { useRef, useState, useCallback, useEffect } from "react";
import "./TermsAndConditions.css";
import { setPrivacyGuardEnabled } from "../privacyGuard";

/* ── Terms content (7 sections as specified) ────────────────────────────── */
const SECTIONS = [
  {
    id: 1,
    title: "Introduction",
    content:
      "This agreement governs the Initial Loan Origination process conducted by Digital Financial Services. By proceeding, you acknowledge that you are applying for a loan or lease facility and that you understand the nature of this financial commitment. Please read each section carefully before agreeing.",
  },
  {
    id: 2,
    title: "Identity & Biometric Verification",
    content:
      "As part of the loan origination process, we are required to verify your identity in accordance with applicable Know Your Customer (KYC) regulations. This includes:",
    bullets: [
      "Collection of your National Identity Card (NIC) or Passport number",
      "Verification of your identity details against official records",
      "Cross-referencing your biometric data against your submitted identity documents",
      "Retention of verification records for regulatory compliance purposes",
    ],
  },
  {
    id: 3,
    title: "Credit Assessment",
    content:
      "We will conduct a credit assessment to evaluate your eligibility for the requested facility. This process involves:",
    bullets: [
      "Retrieving your credit history from licensed credit bureaus",
      "Analysing your declared income, expenses, assets and liabilities",
      "Assessing your debt-service-coverage ratio against regulatory guidelines",
      "Generating a risk classification that influences approval terms",
    ],
  },
  {
    id: 4,
    title: "Data Protection",
    content:
      "Your personal, financial and biometric data is processed in strict compliance with applicable data protection legislation. We commit to the following:",
    bullets: [
      "Your data is encrypted at rest and in transit using industry-standard protocols",
      "Access is restricted exclusively to authorised personnel on a need-to-know basis",
      "We do not sell, lease or trade your personal information to third parties",
      "Data is shared only where required by law or by direction of a competent authority",
      "All access events are logged and auditable",
    ],
  },
  {
    id: 5,
    title: "Accuracy of Information",
    content:
      "You confirm that all information provided in this application is true, complete and accurate to the best of your knowledge. You agree to:",
    bullets: [
      "Notify us promptly of any material changes to your financial or personal circumstances",
      "Correct any inaccuracies in your submitted data without undue delay",
      "Accept that providing false or misleading information may result in immediate rejection or cancellation of any approved facility, and may constitute a criminal offence under applicable law",
    ],
  },
  {
    id: 6,
    title: "Approval & Conditions",
    content:
      "Submission of this application does not constitute an offer or guarantee of credit. Final approval is subject to satisfactory completion of all verification steps, a positive credit assessment outcome, compliance with our internal credit policy, and the availability of the requested facility. Approved facilities will be subject to a separate loan or lease agreement setting out all terms, repayment schedules and applicable charges.",
  },
  {
    id: 7,
    title: "Changes to These Terms",
    content:
      "Digital Financial Services reserves the right to amend these terms at any time to reflect changes in applicable law, regulatory guidance or our internal policies. We will notify you of material changes through the contact details provided in your application. Continued use of our services after notification constitutes acceptance of the revised terms.",
  },
];

/* ── TermsAndConditions ─────────────────────────────────────────────────── */
export default function TermsAndConditions({ onAgree }) {
  const bodyRef          = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [checked,  setChecked]  = useState(false);
  const [activeSection, setActiveSection] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setPrivacyGuardEnabled(true);
  }, []);

  /* Enable checkbox only after scrolling to the very end */
  const handleScroll = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
    if (atBottom) setScrolled(true);

    const activeTop = el.getBoundingClientRect().top + 32;
    el.querySelectorAll(".tc-section").forEach(section => {
      if (section.getBoundingClientRect().top <= activeTop) {
        setActiveSection(Number(section.dataset.section));
      }
    });
  }, []);

  const toggleCheck = event => {
    if (!scrolled) return;
    setChecked(event.currentTarget.checked);
  };

  const handleAccept = () => {
    if (checked) onAgree();
    setDone(true);
  };

  return (
    <div className="tc-bg">
      <header className="tc-topbar">
        <div className="tc-topbar__inner">
          <div className="tc-brand-mark" aria-hidden="true">ILO</div>
          <span className="tc-brand-name">Initial Loan Origination</span>
        </div>
      </header>

      {done ? (
        <div className="tc-success" role="status" aria-live="polite">
          <div className="tc-success-icon">✓</div>
          <h2 className="tc-success-title">Agreement Successful</h2>
          <p className="tc-success-text">
            Thank you! You have accepted the Terms and Conditions for Initial
            Loan Origination. Your application can now proceed.
          </p>
        </div>
      ) : (
      <div className="tc-layout">
        <aside className="tc-sidebar" aria-label="Terms sections">
          <h2 className="tc-sidebar__title">Terms</h2>
          <nav>
            <ul className="tc-sidebar__list">
              {SECTIONS.map(sec => (
                <li key={sec.id}>
                  <a
                    className={`tc-sidebar__link${activeSection === sec.id ? " tc-sidebar__link--active" : ""}`}
                    href={`#tc-section-${sec.id}`}
                    onClick={event => {
                      event.preventDefault();
                      document.getElementById(`tc-section-${sec.id}`)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    {sec.id}. {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <main className="tc-card" aria-labelledby="tc-heading">
          <div className="tc-card__heading">
            <h1 id="tc-heading">Initial Loan Origination</h1>
            <p>Terms and Conditions · Last updated October 14, 2026</p>
          </div>

          <div
            className="tc-body"
            ref={bodyRef}
            onScroll={handleScroll}
            tabIndex={0}
            aria-label="Terms and Conditions content"
          >
            {SECTIONS.map(sec => (
              <section
                key={sec.id}
                id={`tc-section-${sec.id}`}
                className="tc-section"
                data-section={sec.id}
              >
                <h2>{sec.id}. {sec.title}</h2>
                <p>{sec.content}</p>
                {sec.bullets && (
                  <ul>
                    {sec.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}
            <p className="tc-end-text">End of Terms and Conditions</p>
          </div>

          <footer className="tc-footer">
            <label className={`tc-checkbox-row${!scrolled ? " tc-checkbox-row--disabled" : ""}`}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!scrolled}
                onChange={toggleCheck}
              />
              <span>I have read and agree to the Terms and Conditions</span>
            </label>
            <button
              className="tc-btn"
              disabled={!checked}
              onClick={handleAccept}
            >
              Agree &amp; Continue
            </button>
          </footer>
        </main>
      </div>
      )}
    </div>
  );
}
