import React, { useState, useEffect } from "react";
import "./ApplicationForm.css";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== "")
  ? import.meta.env.VITE_API_BASE_URL
  : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : "";
const SIGNATURE_BASE_URL = (import.meta.env.VITE_SIGNATURE_BASE_URL !== undefined && import.meta.env.VITE_SIGNATURE_BASE_URL !== "")
  ? import.meta.env.VITE_SIGNATURE_BASE_URL
  : (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? `${window.location.protocol}//${window.location.hostname}:3003`
    : "";

const SubmissionLoaderModal = ({ stage, stellaLink, applicationId }) => {
  return (
    <div className="modern-loader-overlay">
      <div className="modern-loader-card">
        <div className="modern-spinner-container">
          <div className={`modern-spinner-ring ${stage === 4 ? 'success' : ''}`}></div>
          <div className="modern-spinner-core">
            {stage === 4 ? (
              <span style={{ fontSize: "32px" }}>✅</span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
        </div>

        <h2 className="loader-title">
          {stage === 4 ? "Stella Signature Link Ready!" : "Processing Application"}
        </h2>
        <p className="loader-subtitle">
          {stage === 4
            ? "Opening Stella Digital Signature form in a new window..."
            : "Please wait while WorkHub24 generates your Stella Signature link..."}
        </p>

        {applicationId && (
          <div className="loader-app-id-pill">
            Application ID: <strong>{applicationId}</strong>
          </div>
        )}

        <div className="loader-steps-list">
          <div className={`loader-step-item ${stage >= 1 ? 'active' : ''} ${stage > 1 ? 'completed' : ''}`}>
            <span className="step-dot"></span>
            <span className="step-label">1. Validating & Submitting to WorkHub24...</span>
          </div>
          <div className={`loader-step-item ${stage >= 2 ? 'active' : ''} ${stage > 2 ? 'completed' : ''}`}>
            <span className="step-dot"></span>
            <span className="step-label">2. WorkHub24 Datastores Saved Successfully</span>
          </div>
          <div className={`loader-step-item ${stage >= 3 ? 'active' : ''} ${stage > 3 ? 'completed' : ''}`}>
            <span className="step-dot"></span>
            <span className="step-label">3. Waiting for Stella Signature Link from WorkHub24...</span>
          </div>
          <div className={`loader-step-item ${stage >= 4 ? 'active completed' : ''}`}>
            <span className="step-dot"></span>
            <span className="step-label">4. Stella Digital Signature Link Ready & Opening!</span>
          </div>
        </div>

        {stellaLink && (
          <div style={{ marginTop: "20px" }}>
            <a
              href={stellaLink}
              target="_blank"
              rel="noreferrer"
              className="signature-primary-button"
              style={{ display: "block", textDecoration: "none", textAlign: "center" }}
            >
              ✍️ Click Here to Open Stella Signature Form
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const ThankYouPage = ({ onRestart, applicationId, signUrl }) => {
  return (
    <div className="thank-you-container">
      <div className="thank-you-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h1 className="thank-you-title">Application Submitted!</h1>

        {applicationId && (
          <div className="application-id-box">
            <span className="app-id-label">Application ID</span>
            <span className="app-id-value">{applicationId}</span>
          </div>
        )}

        <p className="thank-you-message">
          Thank you for submitting your application.
          <br />
          Your application has been registered in WorkHub24.
          <br />
          Please complete your Stella Digital Signature below.
        </p>

        <div className="thank-you-actions">
          {signUrl && (
            <a
              href={signUrl}
              target="_blank"
              rel="noreferrer"
              className="signature-primary-button"
              style={{ display: "block", textDecoration: "none", textAlign: "center" }}
            >
              ✍️ Open Stella Digital Signature Form
            </a>
          )}

          <button className="thank-you-button secondary" onClick={onRestart}>
            Submit Another Application
          </button>
        </div>
      </div>
    </div>
  );
};

const emptyCreditRow = { institution: "", type: "", approvedAmount: "", term: "", monthlyRepayment: "", presentOS: "", security: "" };
const emptyBankRow = { bank: "", branch: "", accountNo: "", officer: "", telephone: "" };
const emptyGuarantorRow = { fullName: "", relationship: "", nicBusinessRegNo: "", age: "", months: "" };
const emptyLandRow = { location: "", extent: "", value: "", deedNo: "", mortgaged: "" };
const emptyVehicleRow = { makeModel: "", value: "", regNo: "", ownership: "" };
const emptyShareRow = { institution: "", currentValue: "", noOfShares: "" };
const emptyFacilityRow = { makeModel: "", status: "", purpose: "", supplier: "", period: "", cost: "" };

const incomeRows = [
  { key: "incomeMainSalary",      label: "Main Income / Salary",           si: "ප්‍රධාන ආදායම / වැටුප",   ta: "முக்கிய வருமானம் / சம்பளம்" },
  { key: "incomeOtherAllowances", label: "Other Allowances / Commissions", si: "වෙනත් දීමනා / කොමිස්",     ta: "பிற கொடுப்பனவு / கமிஷன்" },
  { key: "incomeAdditional",      label: "Additional Income",              si: "අමතර ආදායම",               ta: "கூடுதல் வருமானம்" },
  { key: "incomeOther",           label: "Other",                          si: "වෙනත්",                     ta: "மற்றவை" },
];

const expenseRows = [
  { key: "expenseHousehold",  label: "Household Expenses",    si: "ගෘහස්ථ වියදම්",         ta: "குடும்பச் செலவுகள்" },
  { key: "expensePersonal",   label: "Personal",              si: "පුද්ගලික",               ta: "தனிப்பட்ட" },
  { key: "expenseLoanLease",  label: "Loan / Lease Payment",  si: "ණය / ලීසිං ගෙවීම්",   ta: "கடன் / குத்தகை தவணை" },
  { key: "expenseCreditCard", label: "Credit card payment",   si: "ක්‍රෙඩිට් කාඩ් ගෙවීම්",ta: "கிரெடிட் கார்டு கட்டணம்" },
  { key: "expenseFuel",       label: "Fuel Expenses",         si: "ඉන්ධන වියදම්",          ta: "எரிபொருள் செலவு" },
  { key: "expenseOther",      label: "Other",                 si: "වෙනත්",                  ta: "மற்றவை" },
];

function splitValueToBoxes(value, length) {
  const safe = (value || "").toString().slice(0, length);
  return Array.from({ length }, (_, i) => safe[i] || "");
}

const defaultFormData = {
  fullName: "",
  residentialStatus: "",
  permanentAddress: "", mailingAddress: "",
  yearsAtAbove: "", monthsAtAbove: "",
  homeContact: "", officeContact: "", fax: "", mobile1: "", mobile2: "", email: "",
  nicNo: "", passportNo: "",
  maritalStatus: "", nationality: "", gender: "", dateOfBirth: "",
  noOfChildren: "", childAge1: "", childAge2: "", childAge3: "", totalDependants: "",
  qualifications: [],
  familyMembers: [
    { member: "Father", memberSi: "පියා", memberTa: "තந்தை", name: "", contact: "" },
    { member: "Spouse", memberSi: "කලත්‍රයා/කලත්‍රිය", memberTa: "கணவன் / மனைவி", name: "", contact: "" },
  ],
  bankDetails: [{ ...emptyBankRow }, { ...emptyBankRow }, { ...emptyBankRow }],
  creditFacilities: [{ ...emptyCreditRow }, { ...emptyCreditRow }, { ...emptyCreditRow }],
  reference1Name: "", reference1Profession: "", reference1Contact: "",
  reference2Name: "", reference2Profession: "", reference2Contact: "",
  employerBusinessName: "", employerBusinessAddress: "",
  natureOfBusiness: "", designationProfession: "",
  telephone: "", designation: "",
  employmentProfessionalBusiness: "", specificIncomeSource: "", additionalIncomeSources: "",
  liableForTax: "", taxFileNo: "",
  incomeMainSalary: "", incomeOtherAllowances: "", incomeAdditional: "", incomeOther: "",
  expenseHousehold: "", expensePersonal: "", expenseLoanLease: "", expenseCreditCard: "", expenseFuel: "", expenseOther: "",
  guarantors: [{ ...emptyGuarantorRow }, { ...emptyGuarantorRow }],
  landBuildings: [{ ...emptyLandRow }, { ...emptyLandRow }],
  vehicles: [{ ...emptyVehicleRow }, { ...emptyVehicleRow }],
  shares: [{ ...emptyShareRow }, { ...emptyShareRow }],
  lifeInsurance: "", lifeInsuranceSpecify: "",
  deposits: "", depositsSpecify: "",
  facilityRequirements: [{ ...emptyFacilityRow }, { ...emptyFacilityRow }, { ...emptyFacilityRow }],
  preferredLanguage: "",
  locationOfLeasedAsset: "",
  fundSources: [],
  annualTurnoverIndividual: "",
  annualTurnoverBusiness: "",
  otherConnectedBusiness: "", reasonForLoan: "",
  withinBranchServiceArea: "", ifNoReason: "",
  isPEP: "", pepRelationship: "",
  signatureName: "",
  signatureDate: "",
};

function ApplicationForm({ preFilledData }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [submitted, setSubmitted] = useState(false);
  const [apiStatus, setApiStatus] = useState("idle");
  const [apiMessage, setApiMessage] = useState("");
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [signUrl, setSignUrl] = useState("");
  const [loaderStage, setLoaderStage] = useState(0);

  useEffect(() => {
    if (preFilledData) {
      setFormData(p => ({
        ...p,
        fullName: preFilledData.name || p.fullName,
        nicNo: preFilledData.nicNo || p.nicNo,
        mobile1: preFilledData.phone || p.mobile1,
        signatureName: preFilledData.name || p.signatureName,
      }));
    }
  }, [preFilledData]);

  const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
  const toggleCheck = (field, val) => setFormData(p => ({ ...p, [field]: p[field] === val ? "" : val }));
  const toggleArray = (field, val) => setFormData(p => {
    const arr = p[field] || [];
    return { ...p, [field]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const handleQualificationChange = (val) => setFormData(p => {
    const ex = p.qualifications.includes(val);
    return { ...p, qualifications: ex ? p.qualifications.filter(i => i !== val) : [...p.qualifications, val] };
  });
  const handleFundSourceChange = (val) => setFormData(p => {
    const ex = p.fundSources.includes(val);
    return { ...p, fundSources: ex ? p.fundSources.filter(i => i !== val) : [...p.fundSources, val] };
  });

  const tableChange = (field, index, key, value) => {
    const updated = [...formData[field]]; updated[index][key] = value;
    setFormData(p => ({ ...p, [field]: updated }));
  };

  const addRow = (field, emptyRow) => setFormData(p => ({ ...p, [field]: [...p[field], { ...emptyRow }] }));
  const removeRow = (field, index) => setFormData(p => ({ ...p, [field]: p[field].filter((_,i) => i !== index) }));

  // Auto-grow textarea
  const autoGrow = (e) => { e.target.style.height = "auto"; e.target.style.height = e.target.scrollHeight + "px"; };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setSignUrl("");
    setApplicationId("");
    setApiStatus("loading");
    setLoaderStage(1);
    setApiMessage("Submitting application...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/submit-application`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          formData,
          guarantors: formData.guarantors || []
        })
      });

      const text = await response.text();
      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Backend did not return valid JSON");
      }

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message || data?.message || "Submission failed");
      }

      const appId = data.applicationId || data.mainRecordId || "";
      setApplicationId(appId);
      setLoaderStage(2);

      // Transition to Stage 3: Waiting for WorkHub24 to post Stella_Link webhook
      setTimeout(() => setLoaderStage(3), 800);

      // Poll backend for incoming Stella_Link webhook from WorkHub24
      const pollStellaLink = async (targetAppId, attempt = 0) => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/stella-link?applicationId=${targetAppId}`);
          const json = await res.json();
          if (json?.stellaLink) {
            console.log("🔑 Found Stella Link via Webhook:", json.stellaLink);
            setSignUrl(json.stellaLink);
            setLoaderStage(4);

            // Auto-launch Stella Signature form
            setTimeout(() => {
              try {
                window.open(json.stellaLink, "_blank");
              } catch (e) {
                console.warn("Popup blocked for Stella Link:", e);
              }
            }, 600);

            // Show completion Thank You screen after 2.5s
            setTimeout(() => {
              setSubmitted(true);
              setIsSubmittedSuccessfully(true);
              setLoaderStage(0);
            }, 2500);
            return;
          }
        } catch (e) { /* silent retry */ }

        console.log(`Waiting for WorkHub24 Stella link (attempt ${attempt + 1})...`);
        setTimeout(() => pollStellaLink(targetAppId, attempt + 1), 2000);
      };

      if (appId) {
        if (data.signUrl) {
          setSignUrl(data.signUrl);
          setLoaderStage(4);
          window.open(data.signUrl, "_blank");
          setTimeout(() => {
            setSubmitted(true);
            setIsSubmittedSuccessfully(true);
            setLoaderStage(0);
          }, 1500);
        } else {
          pollStellaLink(appId);
        }
      } else {
        throw new Error("WorkHub24 did not return an application ID.");
      }

    } catch (error) {
      console.error("API submit error:", error);
      setApiStatus("error");
      setApiMessage("Submission error: " + error.message);
      setSubmitted(false);
      setLoaderStage(0);
    }
  };

  const handleReset = () => {
    setFormData(defaultFormData);
    setSubmitted(false);
    setApiStatus("idle");
    setApiMessage("");
  };

  const handleRestartApplication = () => {
    window.location.reload();
  };

  if (isSubmittedSuccessfully) {
    return <ThankYouPage onRestart={handleRestartApplication} applicationId={applicationId} signUrl={signUrl} />;
  }

  const nicBoxes      = splitValueToBoxes(formData.nicNo, 12);
  const passportBoxes = splitValueToBoxes(formData.passportNo, 10);
  const homeBoxes     = splitValueToBoxes(formData.homeContact, 10);
  const officeBoxes   = splitValueToBoxes(formData.officeContact, 10);
  const faxBoxes      = splitValueToBoxes(formData.fax, 10);
  const mobile1Boxes  = splitValueToBoxes(formData.mobile1, 10);
  const mobile2Boxes  = splitValueToBoxes(formData.mobile2, 10);
  const dobBoxes      = splitValueToBoxes(formData.dateOfBirth.replace(/-/g,""), 8);

  const totalIncome       = incomeRows.reduce((s,r) => s + (parseFloat(formData[r.key]) || 0), 0);
  const totalExpenses     = expenseRows.reduce((s,r) => s + (parseFloat(formData[r.key]) || 0), 0);
  const totalFacilityCost = formData.facilityRequirements.reduce((s,r) => s + (parseFloat(r.cost) || 0), 0);

  return (
    <>
    {loaderStage > 0 && (
      <SubmissionLoaderModal
        stage={loaderStage}
        stellaLink={signUrl}
        applicationId={applicationId}
        onSkip={() => {
          setSubmitted(true);
          setIsSubmittedSuccessfully(true);
          setLoaderStage(0);
        }}
      />
    )}
    <div className="abans-page-bg">
      <form className="abans-paper" onSubmit={handleSubmit}>

        {/* HEADER */}
        <header className="paper-header">
          <div className="logo-panel">
            <div className="paper-brand-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>
                <path d="M12 8v8M8 12h8"></path>
              </svg>
            </div>
          </div>
          <div className="company-panel">
            <div className="company-name">Digital Financial Services</div>
            <div className="company-line">Digital Financial Application Portal</div>
            <div className="company-line">Tel: 011 220 8888 &nbsp;&nbsp;|&nbsp;&nbsp; Web: www.financialservices.lk</div>
            <div className="company-line">Official Lease &amp; Loan Application Service</div>
          </div>
        </header>

        {/* TITLE BAR */}
        <div className="title-bar">
          <span>APPLICATION FOR PERSONAL LEASE /LOAN</span>
          <span>පුද්ගලික කල්බදු / ණය අයදුම්පත</span>
          <span>தனிப்பட்ட குத்தகை / கடன் விண்ணப்பத்திரம்</span>
        </div>

        {/* 1. Full Name */}
        <section className="paper-section">
          <div className="section-row">
            <div className="question-cell">
              <span className="q-num">1).</span>
              <div className="q-labels">
                <div className="q-en">Full Name of Applicant</div>
                <div className="q-sub">as per the NIC</div>
                <div className="q-sub">please underline the surname</div>
                <div className="q-si">අයදුම්කරුගේ සම්පූර්ණ නම</div>
                <div className="q-si">(ජා.හැ.අ. අනුව)</div>
                <div className="q-si">(උරුම නම යට ඉරි ඇදිය යුතුය)</div>
                <div className="q-ta">விண்ணப்பதாரரின் முழுப் பெயர்</div>
                <div className="q-ta">(தே.அ.அ படி)</div>
              </div>
            </div>
            <div className="answer-cell">
              <textarea className="auto-textarea" name="fullName" value={formData.fullName} onChange={e=>{handleChange(e);autoGrow(e);}} rows={1} placeholder="Enter full name..." />
            </div>
          </div>
        </section>

        {/* 2. Residential Status */}
        <section className="paper-section">
          <div className="section-row">
            <div className="question-cell">
              <span className="q-num">2).</span>
              <div className="q-labels">
                <div className="q-en">Residential Status</div>
                <div className="q-si">නේවාසික තත්ත්වය</div>
                <div className="q-ta">வசிப்பு நிலை</div>
              </div>
            </div>
            <div className="answer-cell">
              <div className="res-options">
                {[["Own","තමන්ගේ","சொந்தம்"],["Rented","කුලියට","வாடகை"],["Mortgaged","උකස්","அடகு"],["With parents","දෙමාපියන් සමග","பெற்றோருடன்"]].map(([en,si,ta]) => (
                  <label key={en} className="res-opt">
                    <input type="checkbox" checked={formData.residentialStatus===en} onChange={() => toggleCheck("residentialStatus", en)} />
                    <div><div className="q-en">{en}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                  </label>
                ))}
              </div>

              <div className="addr-block">
                <div className="addr-lbl"><div className="q-en">Permanent Address</div><div className="q-si">ස්ථිර ලිපිනය</div><div className="q-ta">நிரந்தர முகவரி</div></div>
                <textarea className="auto-textarea" name="permanentAddress" value={formData.permanentAddress} onChange={e=>{handleChange(e);autoGrow(e);}} rows={2} placeholder="Enter permanent address..." />
              </div>

              <div className="addr-block">
                <div className="addr-lbl"><div className="q-en">Mailing Address</div><div className="q-si">තැපැල් ලිපිනය</div><div className="q-ta">அஞ்சல் முகவரி</div></div>
                <textarea className="auto-textarea" name="mailingAddress" value={formData.mailingAddress} onChange={e=>{handleChange(e);autoGrow(e);}} rows={2} placeholder="Enter mailing address..." />
              </div>

              <div className="duration-row">
                <div className="dur-lbl"><div className="q-en">Duration at above</div><div className="q-si">ඉහත ලිපිනයේ කාලය</div><div className="q-ta">மேலுள்ள முகவரியில் காலம்</div></div>
                <div className="dur-pair">
                  <span className="dur-unit"><div className="q-en">Years</div><div className="q-si">අවුරුදු</div><div className="q-ta">வருடம்</div></span>
                  <input className="small-box" name="yearsAtAbove" value={formData.yearsAtAbove} onChange={handleChange} />
                </div>
                <div className="dur-pair">
                  <span className="dur-unit"><div className="q-en">Months</div><div className="q-si">මාස</div><div className="q-ta">மாதம்</div></span>
                  <input className="small-box" name="monthsAtAbove" value={formData.monthsAtAbove} onChange={handleChange} />
                </div>
              </div>

              <div className="contact-label-block"><div className="q-en">Contact No</div><div className="q-si">දුරකථන අංකය</div><div className="q-ta">தொடர்பு இலக்கம்</div></div>
              <div className="contact-2col">
                <div className="contact-col">
                  {[["Home","නිවස","வீடு","homeContact",homeBoxes],["Fax","ෆැක්ස්","தொலைநகல்","fax",faxBoxes]].map(([lbl,si,ta,name,boxes]) => (
                    <div key={name} className="boxed-row">
                      <div className="box-lbl"><div className="q-en">{lbl}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                      <div className="char-wrap">
                        <div className="char-boxes">{boxes.map((c,i) => <span key={i} className="char-box">{c}</span>)}</div>
                        <input type="text" className="overlay-input" name={name} value={formData[name]} onChange={handleChange} />
                      </div>
                    </div>
                  ))}
                  <div className="boxed-row email-row">
                    <div className="box-lbl"><div className="q-en">Email</div><div className="q-si">විද්‍යුත් ලිපිනය</div><div className="q-ta">மின்னஞ்சல்</div></div>
                    <input className="line-input" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="contact-col">
                  {[["Office","කාර්යාලය","அலுவலகம்","officeContact",officeBoxes],["Mob -1","ජංගම 1","கையடக்கி 1","mobile1",mobile1Boxes],["Mob -2","ජංගම 2","கையடக்கி 2","mobile2",mobile2Boxes]].map(([lbl,si,ta,name,boxes]) => (
                    <div key={name} className="boxed-row">
                      <div className="box-lbl"><div className="q-en">{lbl}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                      <div className="char-wrap">
                        <div className="char-boxes">{boxes.map((c,i) => <span key={i} className="char-box">{c}</span>)}</div>
                        <input type="text" className="overlay-input" name={name} value={formData[name]} onChange={handleChange} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3–8 Identity Grid */}
        <section className="paper-section">
          <div className="identity-grid">
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">3).</span><div><div className="q-en">NIC No</div><div className="q-si">ජා.හැ.අංකය</div><div className="q-ta">தே.அ.அ எண்</div></div></div>
              <div className="char-wrap id-boxes">
                <div className="char-boxes">{nicBoxes.map((c,i)=><span key={i} className="char-box">{c}</span>)}</div>
                <input className="overlay-input full-overlay" name="nicNo" value={formData.nicNo} onChange={handleChange} />
              </div>
            </div>
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">6).</span><div><div className="q-en">Date of Birth</div><div className="q-si">උපන් දිනය</div><div className="q-ta">பிறந்த தேதி</div></div></div>
              <div className="char-wrap id-boxes">
                <div className="char-boxes dob-boxes">{dobBoxes.map((c,i)=><span key={i} className="char-box">{c}</span>)}</div>
                <input className="overlay-input full-overlay" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="YYYYMMDD" />
              </div>
            </div>
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">4).</span><div><div className="q-en">Passport No</div><div className="q-si">විදේශ ගමන් බලපත්‍ර අංකය</div><div className="q-ta">கடவுச்சீட்டு எண்</div></div></div>
              <div className="char-wrap id-boxes">
                <div className="char-boxes">{passportBoxes.map((c,i)=><span key={i} className="char-box">{c}</span>)}</div>
                <input className="overlay-input full-overlay" name="passportNo" value={formData.passportNo} onChange={handleChange} />
              </div>
            </div>
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">7).</span><div><div className="q-en">Nationality</div><div className="q-si">ජාතිකත්වය</div><div className="q-ta">தேசியம்</div></div></div>
              <input className="line-input" name="nationality" value={formData.nationality} onChange={handleChange} />
            </div>
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">5).</span><div><div className="q-en">Married / Unmarried / separate / divorce</div><div className="q-si">විවාහක / අවිවාහක / වෙන් වූ / දික්කසාද</div><div className="q-ta">திருமணமானவர் / திருமணமாகாதவர் / தனிமை / விவாகரத்து</div></div></div>
              <input className="line-input" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} />
            </div>
            <div className="id-item">
              <div className="id-lbl"><span className="q-num">8).</span><div><div className="q-en">Gender</div><div className="q-si">ස්ත්‍රී / පුරුෂ භාවය</div><div className="q-ta">பால்</div></div></div>
              <input className="line-input" name="gender" value={formData.gender} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* 9. Family Members */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">9).</span><span className="q-en">Details of Family Members</span><span className="q-si">පවුලේ සාමාජිකයින්ගේ විස්තර</span><span className="q-ta">குடும்ப உறுப்பினர் விவரம்</span></div>
          <table className="paper-table family-table">
            <thead><tr>
              <th><div>Member</div><div className="th-si">සාමාජිකයා</div><div className="th-ta">உறுப்பினர்</div></th>
              <th><div>Name</div><div className="th-si">නම</div><div className="th-ta">பெயர்</div></th>
              <th><div>Contact Number (Prefer land line)</div><div className="th-si">දුරකථන අංකය (දේශීය දුරකථනයකට කැමැත්ත)</div><div className="th-ta">தொடர்பு எண் (நிலைத்தட வரிசை விரும்பப்படுகிறது)</div></th>
            </tr></thead>
            <tbody>
              {formData.familyMembers.map((row,i) => (
                <tr key={row.member}>
                  <td className="member-cell"><div className="q-en-b">{row.member}</div><div className="th-si">{row.memberSi}</div><div className="th-ta">{row.memberTa}</div></td>
                  <td><input value={row.name} onChange={e=>tableChange("familyMembers",i,"name",e.target.value)} /></td>
                  <td><input value={row.contact} onChange={e=>tableChange("familyMembers",i,"contact",e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="children-row">
            <div className="chi-field"><label><div className="q-en">No of Children</div><div className="q-si">ළමුන් ගණන</div><div className="q-ta">குழந்தைகள் எண்ணிக்கை</div></label><input className="small-box" name="noOfChildren" value={formData.noOfChildren} onChange={handleChange} /></div>
            <div className="chi-field"><label><div className="q-en">Age:</div><div className="q-si">වයස</div></label><input className="small-box" name="childAge1" value={formData.childAge1} onChange={handleChange} /><span className="q-en">Yrs<br/><span className="q-si">අවු.</span></span></div>
            <div className="chi-field"><input className="small-box" name="childAge2" value={formData.childAge2} onChange={handleChange} /><span className="q-en">Yrs<br/><span className="q-si">අවු.</span></span></div>
            <div className="chi-field"><input className="small-box" name="childAge3" value={formData.childAge3} onChange={handleChange} /><span className="q-en">Yrs<br/><span className="q-si">අවු.</span></span></div>
            <div className="chi-field"><label><div className="q-en">Total Dependants</div><div className="q-si">සමස්ත යැපෙන්නන්</div><div className="q-ta">சார்ந்தவர்கள் எண்ணிக்கை</div></label><input className="small-box" name="totalDependants" value={formData.totalDependants} onChange={handleChange} /></div>
          </div>
        </section>

        {/* 10. Qualifications */}
        <section className="paper-section">
          <div className="qual-row">
            <div className="qual-lbl"><span className="q-num">10).</span><div><div className="q-en">Qualifications</div><div className="q-si">සුදුසුකම්</div><div className="q-ta">தகுதிகள்</div></div></div>
            <div className="qual-opts">
              {[["Primary","ප්‍රාථමික","ஆரம்பநிலை"],["Secondary","ද්විතීයික","இடைநிலை"],["Graduate","උපාධිධාරී","பட்டதாரி"],["Post Graduate","පශ්චාත් උපාධිය","முதுகலை"],["Professional","වෘත්තීය","தொழில்முறை"]].map(([en,si,ta])=>(
                <label key={en} className="qual-item">
                  <input type="checkbox" checked={formData.qualifications.includes(en)} onChange={()=>handleQualificationChange(en)} />
                  <div><div className="q-en">{en}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Bank Details */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">11).</span><span className="q-en">Bank Details</span><span className="q-si">බැංකු විස්තර</span><span className="q-ta">வங்கி விபரம்</span></div>
          <table className="paper-table bank-table">
            <thead><tr>
              <th><div>Bank</div><div className="th-si">බැංකුව</div><div className="th-ta">வங்கி</div></th>
              <th><div>Branch</div><div className="th-si">ශාඛාව</div><div className="th-ta">கிளை</div></th>
              <th><div>Account No</div><div className="th-si">ගිණුම් අංකය</div><div className="th-ta">கணக்கு எண்</div></th>
              <th><div>Officer</div><div className="th-si">නිලධාරියා</div><div className="th-ta">அதிகாரி</div></th>
              <th><div>Telephone</div><div className="th-si">දුරකථනය</div><div className="th-ta">தொலைபேசி</div></th>
            </tr></thead>
            <tbody>{formData.bankDetails.map((r,i)=><tr key={i}><td><input value={r.bank} onChange={e=>tableChange("bankDetails",i,"bank",e.target.value)} /></td><td><input value={r.branch} onChange={e=>tableChange("bankDetails",i,"branch",e.target.value)} /></td><td><input value={r.accountNo} onChange={e=>tableChange("bankDetails",i,"accountNo",e.target.value)} /></td><td><input value={r.officer} onChange={e=>tableChange("bankDetails",i,"officer",e.target.value)} /></td><td className="td-with-del"><input value={r.telephone} onChange={e=>tableChange("bankDetails",i,"telephone",e.target.value)} />{i>=3&&<button type="button" className="del-row-btn" onClick={()=>removeRow("bankDetails",i)}>✕</button>}</td></tr>)}</tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("bankDetails",emptyBankRow)}>+ Add Row</button>
        </section>

        {/* 12. Credit Facilities */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">12).</span><span className="q-en">Details Of Credit Facilities Obtained From Financial Institutions</span></div>
          <div className="q-si" style={{fontSize:10,marginBottom:4}}>මූල්‍ය ආයතනවලින් ලබාගත් ණය පහසුකම් විස්තර</div>
          <div className="q-ta" style={{fontSize:10,marginBottom:6}}>நிதி நிறுவனங்களிலிருந்தும் பெறப்பட்ட கடன் வசதி விவரங்கள்</div>
          <table className="paper-table credit-table">
            <thead><tr>
              <th><div>Name of Institution</div><div className="th-si">ආයතනයේ නම</div><div className="th-ta">நிறுவனத்தின் பெயர்</div></th>
              <th><div>Type</div><div className="th-si">වර්ගය</div><div className="th-ta">வகை</div></th>
              <th><div>Approved Amount</div><div className="th-si">අනුමත මුදල</div><div className="th-ta">அங்கீகரிக்கப்பட்ட தொகை</div></th>
              <th><div>Term</div><div className="th-si">කාලය</div><div className="th-ta">காலம்</div></th>
              <th><div>Monthly Repayment</div><div className="th-si">මාසික ගෙවීම</div><div className="th-ta">மாத தவணை</div></th>
              <th><div>Present O/S</div><div className="th-si">වත්මන් ශේෂය</div><div className="th-ta">தற்போதைய நிலுவை</div></th>
              <th><div>Security</div><div className="th-si">ආරක්ෂාව</div><div className="th-ta">பாதுகாப்பு</div></th>
            </tr></thead>
            <tbody>{formData.creditFacilities.map((r,i)=><tr key={i}><td><input value={r.institution} onChange={e=>tableChange("creditFacilities",i,"institution",e.target.value)} /></td><td><input value={r.type} onChange={e=>tableChange("creditFacilities",i,"type",e.target.value)} /></td><td><input value={r.approvedAmount} onChange={e=>tableChange("creditFacilities",i,"approvedAmount",e.target.value)} /></td><td><input value={r.term} onChange={e=>tableChange("creditFacilities",i,"term",e.target.value)} /></td><td><input value={r.monthlyRepayment} onChange={e=>tableChange("creditFacilities",i,"monthlyRepayment",e.target.value)} /></td><td><input value={r.presentOS} onChange={e=>tableChange("creditFacilities",i,"presentOS",e.target.value)} /></td><td className="td-with-del"><input value={r.security} onChange={e=>tableChange("creditFacilities",i,"security",e.target.value)} />{i>=3&&<button type="button" className="del-row-btn" onClick={()=>removeRow("creditFacilities",i)}>✕</button>}</td></tr>)}</tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("creditFacilities",emptyCreditRow)}>+ Add Row</button>
        </section>

        {/* 13. Non-Related Referees */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">13).</span><span className="q-en">Non Related Referees</span><span className="q-si">ඥාතීන් නොවන විශ්වාසනීය පුද්ගලයන්</span><span className="q-ta">உறவினர் அல்லாத சிபாரிசர்கள்</span></div>
          <div className="referees-grid">
            {[{n:"reference1Name",p:"reference1Profession",c:"reference1Contact",num:"1"},{n:"reference2Name",p:"reference2Profession",c:"reference2Contact",num:"2"}].map(({n,p,c,num})=>(
              <div key={num} className="referee-card">
                <div className="ref-row"><div className="ref-lbl"><strong>{num}. Name :</strong><br/><span className="q-si">නම</span> / <span className="q-ta">பெயர்</span></div><input className="line-input" name={n} value={formData[n]} onChange={handleChange} /></div>
                <div className="ref-row"><div className="ref-lbl"><strong>Profession :</strong><br/><span className="q-si">රැකියාව</span> / <span className="q-ta">தொழில்</span></div><input className="line-input" name={p} value={formData[p]} onChange={handleChange} /></div>
                <div className="ref-row"><div className="ref-lbl"><strong>Contact Number :</strong><br/><span className="q-si">දුරකථන අංකය</span> / <span className="q-ta">தொடர்பு எண்</span></div><input className="line-input" name={c} value={formData[c]} onChange={handleChange} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* 14. Employer/Business */}
        <section className="paper-section">
          <div className="s14-grid">
            <div className="s14-lbl"><span className="q-num">14).</span><div><div className="q-en">Employer/Business Name and Address</div><div className="q-si">සේවායෝජකයාගේ / ව්‍යාපාරයේ නම සහ ලිපිනය</div><div className="q-ta">நியோஜகர் / வணிகத்தின் பெயர் மற்றும் முகவரி</div></div></div>
            <div className="s14-ans"><textarea className="auto-textarea" name="employerBusinessName" value={formData.employerBusinessName} onChange={e=>{handleChange(e);autoGrow(e);}} rows={1} placeholder="Name..." /><textarea className="auto-textarea" name="employerBusinessAddress" value={formData.employerBusinessAddress} onChange={e=>{handleChange(e);autoGrow(e);}} rows={1} placeholder="Address..." /></div>

            <div className="s14-lbl"><div className="q-en">Nature of Business</div><div className="q-si">ව්‍යාපාරයේ ස්වභාවය</div><div className="q-ta">வணிகத்தின் தன்மை</div></div>
            <div className="s14-ans"><input className="line-input" name="natureOfBusiness" value={formData.natureOfBusiness} onChange={handleChange} /></div>

            <div className="s14-lbl"><div className="q-en">Your Designation / Profession</div><div className="q-si">ඔබගේ තනතුර / රැකියාව</div><div className="q-ta">பதவி / தொழில்</div></div>
            <div className="s14-ans"><input className="line-input" name="designationProfession" value={formData.designationProfession} onChange={handleChange} /></div>

            <div className="s14-lbl"><div className="q-en">Reference</div><div className="q-si">යොමුකිරීම</div><div className="q-ta">குறிப்பு</div></div>
            <div className="s14-ans">
              <div className="ref-split">
                <div><div className="q-en" style={{fontSize:11}}>Telephone <span className="q-si">දුරකථනය</span> <span className="q-ta">தொலைபேசி இல</span></div><input className="line-input" name="telephone" value={formData.telephone} onChange={handleChange} /></div>
                <div><div className="q-en" style={{fontSize:11}}>Designation <span className="q-si">තනතුර</span> <span className="q-ta">பதவி</span></div><input className="line-input" name="designation" value={formData.designation} onChange={handleChange} /></div>
              </div>
            </div>

            <div className="s14-lbl"><div className="q-en">Main Income source</div><div className="q-si">ප්‍රධාන ආදායම් මාර්ගය</div><div className="q-ta">முக்கிய வருமான மூலம்</div></div>
            <div className="s14-ans"><div className="q-en" style={{fontSize:11}}>Employment / Professional / business <span className="q-si">රැකියාව / වෘත්තිය / ව්‍යාපාරය</span> <span className="q-ta">வேலைவாய்ப்பு / தொழில் / வணிகம்</span></div><input className="line-input" name="employmentProfessionalBusiness" value={formData.employmentProfessionalBusiness} onChange={handleChange} /></div>

            <div className="s14-lbl"><div className="q-en">Specify the income source</div><div className="q-si">ආදායම් මාර්ගය සඳහන් කරන්න</div><div className="q-ta">வருமான மூலம் குறிப்பிடவும்</div></div>
            <div className="s14-ans"><input className="line-input" name="specificIncomeSource" value={formData.specificIncomeSource} onChange={handleChange} /></div>

            <div className="s14-lbl"><div className="q-en">Additional Income sources</div><div className="q-si">අමතර ආදායම් මාර්ග</div><div className="q-ta">பிற வருமான ஆதாரம்</div></div>
            <div className="s14-ans"><input className="line-input" name="additionalIncomeSources" value={formData.additionalIncomeSources} onChange={handleChange} /></div>
          </div>
        </section>

        {/* 15. Income/Expenses */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">15).</span><span className="q-en">Details of Present Monthly Income / Expenses</span><span className="q-si">වත්මන් මාසික ආදායම / වියදම් විස්තර</span><span className="q-ta">தற்போதைய மாதாந்த வருமான / செலவு விவரங்கள்</span></div>
          <div className="tax-row">
            <div className="tax-q"><div className="q-en">Are You Liable For Payee Tax or Income Tax</div><div className="q-si">ඔබ ගෙවිය යුතු ආදායම් බදු හෝ Payee Tax ට යටත්ද</div><div className="q-ta">நீங்கள் Payee Tax அல்லது Income Tax செலுத்துகிறீர்களா</div></div>
            <div className="yn-group">
              <label className="yn-lbl">Yes <span className="q-si">ඔව්</span> <span className="q-ta">ஆம்</span><input type="checkbox" checked={formData.liableForTax==="Yes"} onChange={()=>toggleCheck("liableForTax","Yes")} /></label>
              <label className="yn-lbl">No <span className="q-si">නැත</span> <span className="q-ta">இல்லை</span><input type="checkbox" checked={formData.liableForTax==="No"} onChange={()=>toggleCheck("liableForTax","No")} /></label>
            </div>
            <div className="tax-file-grp"><div className="q-en" style={{fontSize:11}}>If Yes , File No : <span className="q-si">එසේනම් ලිපිගොනු අංකය</span></div><input className="line-input" name="taxFileNo" value={formData.taxFileNo} onChange={handleChange} /></div>
          </div>
          <table className="paper-table income-table">
            <tbody>
              <tr className="income-head-row"><td colSpan={2}><strong>Income</strong> <span className="q-si">ආදායම්</span> <span className="q-ta">வருமானம்</span></td></tr>
              {incomeRows.map(r=>(
                <tr key={r.key}><td className="inc-lbl"><div className="q-en">{r.label}</div><div className="q-si">{r.si}</div><div className="q-ta">{r.ta}</div></td><td className="inc-amt"><input value={formData[r.key]} onChange={e=>setFormData(p=>({...p,[r.key]:e.target.value}))} /></td></tr>
              ))}
              <tr className="total-row"><td className="inc-lbl"><strong>Total Income</strong> <span className="q-si">මුළු ආදායම</span> <span className="q-ta">மொத்த வருமானம்</span></td><td className="inc-amt total-val">{totalIncome>0?totalIncome.toLocaleString():""}</td></tr>
              <tr className="income-head-row"><td colSpan={2}><strong>Expenses</strong> <span className="q-si">වියදම්</span> <span className="q-ta">செலவுகள்</span></td></tr>
              {expenseRows.map(r=>(
                <tr key={r.key}><td className="inc-lbl"><div className="q-en">{r.label}</div><div className="q-si">{r.si}</div><div className="q-ta">{r.ta}</div></td><td className="inc-amt"><input value={formData[r.key]} onChange={e=>setFormData(p=>({...p,[r.key]:e.target.value}))} /></td></tr>
              ))}
              <tr className="total-row"><td className="inc-lbl"><strong>Total Expenses</strong> <span className="q-si">මුළු වියදම</span> <span className="q-ta">மொத்த செலவுகள்</span></td><td className="inc-amt total-val">{totalExpenses>0?totalExpenses.toLocaleString():""}</td></tr>
            </tbody>
          </table>
        </section>

        {/* 16. Proposed Guarantors */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">16).</span><span className="q-en">Proposed Guarantors</span><span className="q-si">යෝජිත ඇපකරුවන්</span><span className="q-ta">முன்மொழியப்பட்ட பிணையாளர்கள்</span></div>
          <table className="paper-table guarantor-table">
            <thead><tr>
              <th style={{width:"4%"}}></th>
              <th><div>Full Name</div><div className="th-si">සම්පූර්ණ නම</div><div className="th-ta">முழுப் பெயர்</div></th>
              <th><div>Relationship</div><div className="th-si">සම්බන්ධතාවය</div><div className="th-ta">உறவு</div></th>
              <th><div>NIC / Business Reg.No</div><div className="th-si">ජා.හැ.අ. / ව්‍යාපාර ලියාපදිංචි අංකය</div><div className="th-ta">தே.அ.அ / வியாபார பதிவு இல</div></th>
            </tr></thead>
            <tbody>
              {formData.guarantors.map((row,i)=>(
                <React.Fragment key={i}>
                  <tr>
                    <td rowSpan={2} className="g-num">{i+1}{i>=2&&<button type="button" className="del-row-btn del-small" onClick={()=>removeRow("guarantors",i)}>✕</button>}</td>
                    <td><input value={row.fullName} onChange={e=>tableChange("guarantors",i,"fullName",e.target.value)} /></td>
                    <td><input value={row.relationship} onChange={e=>tableChange("guarantors",i,"relationship",e.target.value)} /></td>
                    <td><input value={row.nicBusinessRegNo} onChange={e=>tableChange("guarantors",i,"nicBusinessRegNo",e.target.value)} /></td>
                  </tr>
                  <tr>
                    <td colSpan={3}>
                      <div className="age-months">
                        <span className="q-en">Age <span className="q-si">වයස</span> <span className="q-ta">வயது</span></span>
                        <input className="small-box" value={row.age} onChange={e=>tableChange("guarantors",i,"age",e.target.value)} />
                        <span className="q-en">Months <span className="q-si">මාස</span> <span className="q-ta">மாதம்</span></span>
                        <input className="small-box" value={row.months} onChange={e=>tableChange("guarantors",i,"months",e.target.value)} />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("guarantors",emptyGuarantorRow)}>+ Add Guarantor</button>
        </section>

        {/* 17. Property */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">17).</span><span className="q-en">Particulars Of Immovable &amp; Movable Property Owned</span><span className="q-si">ඔබට අයිති චල හා අචල දේපල විස්තර</span><span className="q-ta">அசையும் அசையா சொந்தங்கள்</span></div>

          <div className="prop-sub-head">Land and Building <span className="q-si">ඉඩම් සහ ගොඩනැගිලි</span> <span className="q-ta">காணி மற்றும் கட்டிடங்கள்</span></div>
          <table className="paper-table land-table">
            <thead><tr>
              <th><div>Location</div><div className="th-si">පිහිට ස්ථානය</div><div className="th-ta">அமைவிடம்</div></th>
              <th><div>Extent</div><div className="th-si">ප්‍රමාණය</div><div className="th-ta">பரப்பு</div></th>
              <th><div>Value (Rs.)</div><div className="th-si">වටිනාකම රු.</div><div className="th-ta">பெறுமதி</div></th>
              <th><div>Deed No.</div><div className="th-si">ඔප්පු අංකය</div><div className="th-ta">ஆவண இல</div></th>
              <th><div>Mortgaged</div><div className="th-si">උකස්</div><div className="th-ta">அடகு</div></th>
            </tr></thead>
            <tbody>{formData.landBuildings.map((r,i)=><tr key={i}><td><input value={r.location} onChange={e=>tableChange("landBuildings",i,"location",e.target.value)} /></td><td><input value={r.extent} onChange={e=>tableChange("landBuildings",i,"extent",e.target.value)} /></td><td><input value={r.value} placeholder="Rs." onChange={e=>tableChange("landBuildings",i,"value",e.target.value)} /></td><td><input value={r.deedNo} onChange={e=>tableChange("landBuildings",i,"deedNo",e.target.value)} /></td><td><div className="yn-radio"><label><span>Yes</span><input type="radio" name={`lm${i}`} checked={r.mortgaged==="Yes"} onChange={()=>tableChange("landBuildings",i,"mortgaged","Yes")} /></label><label><span>No</span><input type="radio" name={`lm${i}`} checked={r.mortgaged==="No"} onChange={()=>tableChange("landBuildings",i,"mortgaged","No")} /></label>{i>=2&&<button type="button" className="del-row-btn" onClick={()=>removeRow("landBuildings",i)}>✕</button>}</div></td></tr>)}</tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("landBuildings",emptyLandRow)}>+ Add Row</button>

          <div className="prop-sub-head" style={{marginTop:10}}>Vehicle <span className="q-si">වාහන</span> <span className="q-ta">வாகனம்</span></div>
          <table className="paper-table vehicle-table">
            <thead><tr>
              <th><div>Make &amp; Model</div><div className="th-si">වර්ගය සහ මාදිලිය</div><div className="th-ta">வகை மற்றும் மாதிரி</div></th>
              <th><div>Value (Rs.)</div><div className="th-si">වටිනාකම</div><div className="th-ta">பெறுமதி</div></th>
              <th><div>Reg. No</div><div className="th-si">ලිය.ස. අංකය</div><div className="th-ta">பதிவிடப்பட்ட இல</div></th>
              <th><div>Own/Mortgaged/Leased/Hire Purchase</div><div className="th-si">සෝන්ත/උකස්/කුලිඅදා/ගෙවා ගනිමු</div><div className="th-ta">சொந்த/அடமானம்/குத்தகை/தவணைமுறை</div></th>
            </tr></thead>
            <tbody>{formData.vehicles.map((r,i)=><tr key={i}><td><input value={r.makeModel} onChange={e=>tableChange("vehicles",i,"makeModel",e.target.value)} /></td><td><input value={r.value} placeholder="Rs." onChange={e=>tableChange("vehicles",i,"value",e.target.value)} /></td><td><input value={r.regNo} onChange={e=>tableChange("vehicles",i,"regNo",e.target.value)} /></td><td className="td-with-del"><input value={r.ownership} onChange={e=>tableChange("vehicles",i,"ownership",e.target.value)} />{i>=2&&<button type="button" className="del-row-btn" onClick={()=>removeRow("vehicles",i)}>✕</button>}</td></tr>)}</tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("vehicles",emptyVehicleRow)}>+ Add Row</button>

          <div className="prop-sub-head" style={{marginTop:10}}>Shares <span className="q-si">කොටස්</span> <span className="q-ta">பங்கு</span></div>
          <table className="paper-table shares-table">
            <thead><tr>
              <th><div>Name of Institution</div><div className="th-si">ආයතනයේ නම</div><div className="th-ta">சம்பனியின் பெயர்</div></th>
              <th><div>Current Value (Rs.)</div><div className="th-si">වටිනාකම</div><div className="th-ta">தற்போதைய பெறுமதி</div></th>
              <th><div>No. of Shares</div><div className="th-si">කොටස් ගණන</div><div className="th-ta">பங்குகள் எண்ணிக்கை</div></th>
            </tr></thead>
            <tbody>{formData.shares.map((r,i)=><tr key={i}><td><input value={r.institution} onChange={e=>tableChange("shares",i,"institution",e.target.value)} /></td><td><input value={r.currentValue} placeholder="Rs." onChange={e=>tableChange("shares",i,"currentValue",e.target.value)} /></td><td className="td-with-del"><input value={r.noOfShares} onChange={e=>tableChange("shares",i,"noOfShares",e.target.value)} />{i>=2&&<button type="button" className="del-row-btn" onClick={()=>removeRow("shares",i)}>✕</button>}</td></tr>)}</tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("shares",emptyShareRow)}>+ Add Row</button>

          <div className="ins-dep-section">
            {[{k:"lifeInsurance",sk:"lifeInsuranceSpecify",en:"Life Insurance",si:"ජීවිත රක්ෂණය",ta:"வாழ்க்கை காப்புறுதி"},{k:"deposits",sk:"depositsSpecify",en:"Deposits",si:"සංචිත",ta:"வைப்பிலிகள்"}].map(({k,sk,en,si,ta})=>(
              <div key={k} className="ins-dep-row">
                <div className="ins-name"><div className="q-en">{en}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                <div className="yn-group">
                  <label className="yn-lbl">Yes <span className="q-si">ඔව්</span> <span className="q-ta">ஆம்</span><input type="checkbox" checked={formData[k]==="Yes"} onChange={()=>toggleCheck(k,"Yes")} /></label>
                  <label className="yn-lbl">No <span className="q-si">නැත</span> <span className="q-ta">இல்லை</span><input type="checkbox" checked={formData[k]==="No"} onChange={()=>toggleCheck(k,"No")} /></label>
                </div>
                <div className="ins-spec"><span className="q-en">If Yes Please Specify <span className="q-si">එසේනම් සඳහන් කරන්න</span></span><input className="line-input" name={sk} value={formData[sk]} onChange={handleChange} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* 18. Facility Requirement */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">18).</span><span className="q-en">Facility Requirement Lease / Loan</span><span className="q-si">ලබා ගත අවශ්‍ය ලීස් / ණය</span><span className="q-ta">கடன் மற்றும் குத்தகைக்கான தேவைப்பாடுகள்</span></div>
          <table className="paper-table facility-table">
            <thead><tr>
              <th><div>Make &amp; Model of Equipment</div><div className="th-si">උපකරණයේ වර්ගය සහ මාදිලිය</div><div className="th-ta">சாதனத்தின் வகை மற்றும் மாதிரி</div></th>
              <th><div>Status</div><div className="th-si">තත්ත්වය</div><div className="th-ta">தற்போதைய நிலை</div></th>
              <th><div>Purpose of Loan/Lease</div><div className="th-si">ණය / ලීසිං ලබා ගැනීමේ නොකාව</div><div className="th-ta">கடன் குத்தகைக்கான நோக்கம்</div></th>
              <th><div>Supplier</div><div className="th-si">සැපයුම්කරු</div><div className="th-ta">விநியோகத்தார்</div></th>
              <th><div>Period</div><div className="th-si">කාලය</div><div className="th-ta">கால எல்லை</div></th>
              <th><div>Cost (Rs.)</div><div className="th-si">වටිනාකම රු.</div><div className="th-ta">மதிப்பு</div></th>
            </tr></thead>
            <tbody>
              {formData.facilityRequirements.map((r,i)=><tr key={i}><td><input value={r.makeModel} onChange={e=>tableChange("facilityRequirements",i,"makeModel",e.target.value)} /></td><td><input value={r.status} onChange={e=>tableChange("facilityRequirements",i,"status",e.target.value)} /></td><td><input value={r.purpose} onChange={e=>tableChange("facilityRequirements",i,"purpose",e.target.value)} /></td><td><input value={r.supplier} onChange={e=>tableChange("facilityRequirements",i,"supplier",e.target.value)} /></td><td><input value={r.period} onChange={e=>tableChange("facilityRequirements",i,"period",e.target.value)} /></td><td className="td-with-del"><input value={r.cost} placeholder="Rs." onChange={e=>tableChange("facilityRequirements",i,"cost",e.target.value)} />{i>=3&&<button type="button" className="del-row-btn" onClick={()=>removeRow("facilityRequirements",i)}>✕</button>}</td></tr>)}
              <tr className="total-row"><td colSpan={5} className="total-r"><strong>Total <span className="q-si">එකතුව</span></strong></td><td><strong>{totalFacilityCost>0?`Rs. ${totalFacilityCost.toLocaleString()}`:""}</strong></td></tr>
            </tbody>
          </table>
          <button type="button" className="add-row-btn" onClick={()=>addRow("facilityRequirements",emptyFacilityRow)}>+ Add Row</button>
        </section>

        {/* 19. Preferred Language */}
        <section className="paper-section">
          <div className="lang-sec">
            <div className="lang-lbl"><span className="q-num">19).</span><div><div className="q-en">Preferred Language for Communication:</div><div className="q-si">සන්නිවේදනය සඳහා කැමැති භාෂාව :</div><div className="q-ta">தொடர்புக்கு விரும்பும் மொழி</div></div></div>
            <div className="lang-opts">
              {[["Sinhala","සිංහල","சிங்களம்"],["Tamil","දෙමළ","தமிழ்"],["English","ඉංග්‍රීසි","ஆங்கிலம்"]].map(([en,si,ta])=>(
                <label key={en} className="lang-opt">
                  <input type="checkbox" checked={formData.preferredLanguage===en} onChange={()=>toggleCheck("preferredLanguage",en)} />
                  <div><div className="q-en">{en}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* 20. Location of Leased Asset */}
        <section className="paper-section">
          <div className="s20-row">
            <div className="s20-lbl"><span className="q-num">20).</span><div><div className="q-en">Location of Leased Asset</div><div className="q-si">කුලියට දෙන වත්කමේ පිහිට ස්ථානය</div><div className="q-ta">குத்தகை சொத்து அமைவிடம்</div></div></div>
            <input className="line-input" name="locationOfLeasedAsset" value={formData.locationOfLeasedAsset} onChange={handleChange} />
          </div>
        </section>

        {/* 21. Sources of Funds */}
        <section className="paper-section">
          <div className="sec-head wrap-head"><span className="q-num">21).</span><span className="q-en">Sources of funds and /or nature of credits into the account:</span><span className="q-si">ආදායම් මාර්ග සහ/හෝ ගිණුමේ ගෙවීම් ස්වභාවය:</span><span className="q-ta">நிதி மூலம் மற்றும் கணக்கிற்கு</span></div>
          <div className="fund-grid">
            {[["Business Income","ව්‍යාපාරික ආදායම","வியாபார வருமானம்"],["Salary/Earnings","ශ්‍රමය / ශ්‍රමලාභය","சம்பளம்"],["Sale of Property/ Assets","දේපල / වත්කම් අලෙවිකිරීමෙන්","சொத்து விற்பனை"],["Family Inward Remittance","පවුලේ ලද ශ්‍රමය","குடும்ப பணம் அனுப்புதல்"],["Donations Charity (Local / Foreign)","පරිත්‍යාගශීලී ශ්‍රදා (දේශීය / විදේශීය)","நன்கொடை (உள்ளூர் / வெளிநாடு)"],["Others (Specify)","වෙනත් (නිශ්චිතව සඳහන් කරන්න)","வேறு (குறிப்பிடவும்)"]].map(([en,si,ta])=>(
              <label key={en} className="fund-item">
                <input type="checkbox" checked={formData.fundSources.includes(en)} onChange={()=>handleFundSourceChange(en)} />
                <div><div className="q-en">{en}</div><div className="q-si">{si}</div><div className="q-ta">{ta}</div></div>
              </label>
            ))}
          </div>
        </section>

        {/* 22. Annual Turnover Individual */}
        <section className="paper-section">
          <div className="sec-head wrap-head"><span className="q-num">22).</span><span className="q-en">Annual turnover (Individual Earnings)</span><span className="q-si">වාර්ෂික පිරිවැටුම (සහජ පුද්ගල ලාභය)</span><span className="q-ta">வருடாந்த வருமானம் (தனிப்பட்ட வருமானம்)</span></div>
          <div className="turnover-grid">
            {["< 499,999","500,000 - 1,499,999","1,500,000 – 2,499,999","2,500,000- 4,999,999","5,000,000 - 9,999,999","10,000,000- 19,999,999",">20,000,000"].map(r=>(
              <label key={r} className="tv-item"><input type="checkbox" checked={formData.annualTurnoverIndividual===r} onChange={()=>toggleCheck("annualTurnoverIndividual",r)} /><span>{r}</span></label>
            ))}
          </div>
        </section>

        {/* 23. Annual Turnover Business */}
        <section className="paper-section">
          <div className="sec-head wrap-head"><span className="q-num">23).</span><span className="q-en">Annual turnover (Business Earnings)</span><span className="q-si">වාර්ෂික පිරිවැටුම (ව්‍යාපාරික ලාභය)</span><span className="q-ta">வருடாந்த வருமானம் (வியாபாரத்தின் வருமானம்)</span></div>
          <div className="turnover-grid">
            {["< 4,999,999","5,000,000- 9,999,999","10,000,000 – 24,999,999","25,000,000- 49,999,999","> 50,000,000"].map(r=>(
              <label key={r} className="tv-item"><input type="checkbox" checked={formData.annualTurnoverBusiness===r} onChange={()=>toggleCheck("annualTurnoverBusiness",r)} /><span>{r}</span></label>
            ))}
          </div>
        </section>

        {/* 24 */}
        <section className="paper-section">
          <div className="sec-head"><span className="q-num">24).</span></div>
          <div className="s24-block">
            <div className="s24-row">
              <div className="s24-lbl">
                <span className="s24-n">1.</span>
                <div><div className="q-en">Other connected business / Professional relationships &amp; interests:</div><div className="q-si">වෙනත් ශ්‍රිත ව්‍යාපාර / රැකියා සම්බන්ධතා සහ උනන්දු:</div><div className="q-ta">வேறு இணைந்த வியாபார / தொழில் உறவு முறைகள்</div></div>
              </div>
              <input className="line-input" name="otherConnectedBusiness" value={formData.otherConnectedBusiness} onChange={handleChange} />
            </div>
            <div className="s24-row">
              <div className="s24-lbl s24-indent"><div className="q-en">Reason to obtain a Lease / Loan facility:</div><div className="q-si">ලීස් / ණය පහසුකම් ලබා ගැනීමේ කාරණය:</div><div className="q-ta">குத்தகைக்கான காரணம் / கடன் வசதி</div></div>
              <input className="line-input" name="reasonForLoan" value={formData.reasonForLoan} onChange={handleChange} />
            </div>
            <div className="s24-row s24-branch">
              <div className="s24-lbl">
                <span className="s24-n">2.</span>
                <div><div className="q-en">If the Permanent address is within the Branch Service Area?</div><div className="q-si">ස්ථිර ලිපිනය ශාඛා සේවා ප්‍රදේශය තුළ සේ?</div><div className="q-ta">நிரந்தர முகவரி சேவை வழங்கும் கிளை பிரிவில் உள்ளதா</div></div>
              </div>
              <div className="yn-group">
                <label className="yn-lbl">Yes <span className="q-si">ඔව්</span> <span className="q-ta">ஆம்</span><input type="checkbox" checked={formData.withinBranchServiceArea==="Yes"} onChange={()=>toggleCheck("withinBranchServiceArea","Yes")} /></label>
                <label className="yn-lbl">No <span className="q-si">නැත</span> <span className="q-ta">இல்லை</span><input type="checkbox" checked={formData.withinBranchServiceArea==="No"} onChange={()=>toggleCheck("withinBranchServiceArea","No")} /></label>
              </div>
            </div>
            <div className="s24-row">
              <div className="s24-lbl s24-indent"><div className="q-en">If No, Reason:</div><div className="q-si">නැත නම්, හේතුව:</div><div className="q-ta">இல்லை எனில்:</div></div>
              <input className="line-input" name="ifNoReason" value={formData.ifNoReason} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* 25. PEP */}
        <section className="paper-section">
          <div className="pep-block">
            <div className="pep-q">
              <span className="q-num">25).</span>
              <div><div className="q-en">Are you / Owner/s, Partner/s, Director/s, Official/s, or any family member a Political Exposed Person (PEP)?</div><div className="q-si">ඔබ / හිමිකරු / ව්‍යාපාරික හිමිකරු / ශ්‍රිත / ශ්‍රිතාධිකාරී / ඔබේ කිසියම් පවුලේ සාමාජිකයෙකු ශ්‍රිතිකාල අරාජකය (PEP)?</div><div className="q-ta">நீங்கள் / உரிமையாளர் / கூட்டாளி / இயக்குனர் / அதிகாரி / எந்த குடும்ப உறுப்பினரும் அரசியலமைப்பு வெளிப்படுத்தப்பட்ட நபர் (PEP)?</div></div>
            </div>
            <div className="pep-ans">
              <div className="yn-group">
                <label className="yn-lbl">Yes <span className="q-si">ඔව්</span> <span className="q-ta">ஆம்</span><input type="checkbox" checked={formData.isPEP==="Yes"} onChange={()=>toggleCheck("isPEP","Yes")} /></label>
                <label className="yn-lbl">No <span className="q-si">නැත</span> <span className="q-ta">இல்லை</span><input type="checkbox" checked={formData.isPEP==="No"} onChange={()=>toggleCheck("isPEP","No")} /></label>
              </div>
              <div className="pep-specify">
                <div className="q-en">If Yes please specify the relationship: <span className="q-si">ඔව් නම් සම්බන්ධතාවය සඳහන් කරන්න:</span> <span className="q-ta">ஆம் எனில் உறவை குறிப்பிடவும்:</span></div>
                <input className="line-input" name="pepRelationship" value={formData.pepRelationship} onChange={handleChange} />
              </div>
            </div>
          </div>
        </section>

        {/* DECLARATION */}
        <section className="paper-section decl-section">
          <p className="decl-p">I declare that the above information is true and warrant that I have made full disclosure of all matters relevant in any way whatsoever in this application. I authorize you to make any inquires as you deem necessary for credit assessment or confirmation of the above particulars from the banks, auditors, Credit Information Bureau (CRIB), Department for Registration of Persons and any other parties or any other source.</p>
          <p className="decl-p decl-si">ඉහත තොරතුරු සත්‍ය බවට මම ප්‍රකාශ කරන අතර, මෙම අයදුම්පතට නෛගේ හෝ අදාළ වන සියළු කරුණු සම්පූර්ණයෙන් හෙළි කර ඇති බව සහතික කෙරෙමි. ණය ආගමිකය, ගිණකම්කරුවන්, ණය තොරතුරු කාර්යාංශය (CRIB), පුද්ගලයන් ලියාපදිංචි කිරීමේ දෙපාර්තමේන්තුව හා වෙනත් ඕනෑම පාර්ශ්වයකින් හෝ වෙනත් ඕනෑ මූලාශ්‍රයකින් ඉහත විස්තරය ත්‍යාග කිරීමේ ඉමැසිලිකරු ඔබ අවශ්‍ය ව හිතන ඕනෑ ම විමසුම් කිරීමට මම ඔබට අවසර දෙමි.</p>
          <p className="decl-p decl-ta">மேலே குறிப்பிட்ட தகவல்கள் உண்மை என்று நான் அறிவிக்கிறேன். இந்த விண்ணப்பத்தில் தொடர்புடைய அனைத்து விஷயங்களையும் முழுமையாக வெளிப்படுத்தியுள்ளேன் என்று உறுதிப்படுத்துகிறேன். கடன் மதிப்பீடு அல்லது மேற்கூறிய விவரங்களை உறுதிப்படுத்த வங்கிகள், கணக்காய்வாளர்கள், கடன் தகவல் பணியகம் (CRIB), ஆட்கள் பதிவு திணைக்களம் மற்றும் வேறு எந்த தரப்பினரிடமிருந்தும் நீங்கள் அவசியமென கருதும் விசாரணையையும் மேற்கொள்ள நான் உங்களுக்கு அதிகாரம் அளிக்கிறேன்.</p>

          <p className="decl-p" style={{marginTop:12}}>I authorize Abans Finance PLC to register my facility and asset details in the Secured Transactions Register (STR).</p>
          <p className="decl-p decl-si">අබාන්ස් ෆිනෑන්ස් පීඑල්සී වෙත, මගේ පහසුකම් සහ වත්කම් ප්‍රකාශිත ගනු දෙනු ලේඛනය (STR) ලියාපදිංචි කිරීමට මම බලය ගෙවීමි.</p>
          <p className="decl-p decl-ta">எனது வசதி மற்றும் சொத்து விபரங்களை பிணையப்படுத்தப்பட்ட பரிவர்த்தனைகள் பதிவேட்டில் (STR) பதிவு செய்வதற்கு அபான்ஸ் ஃபைனான்ஸ் பீஎல்சி க்கு நான் அங்கீகாரம் அளிக்கிறேன்.</p>

          <p className="decl-p" style={{marginTop:12}}>This application remains the property of Abans Finance PLC even if the Lease / Loan facility is not granted. Abans Finance PLC reserves the right to reject the application at its sole discretion, without stating reasons.</p>
          <p className="decl-p decl-si">අදාළ ලීසිං හෝ ණය පහසුකම් ලබා දෙනු ලැබිය හෝ නොලැබිය ද, මෙම අයදුම්පත සිමාසහිත අබාන්ස් ෆිනෑන්ස් පීඑල්සී ශ්‍රේෂ්ඨ සේවාවේ තත්ව ද, කාරණු නොදක්වා ශ්‍රේෂ්ඨ සේවාවට ශ්‍රේෂ්ඨ සේවාව.</p>
          <p className="decl-p decl-ta">இக்குத்தகை வசதியானது அபான்ஸ் பைனான்ஸ் பி.எல்.சி கம்பனியினால் நிராகரிக்கப்படட்டாலும் இவ்விண்ணப்பத்தாரமது அபான்ஸ் பைனான்ஸ் பி.எல்.சி கம்பனியின் உடைமையாகும். இவ்விண்ணப்பத்திரத்தை காரணங்கள் குறிப்பிடாமல் நிராகரிக்கப்படலும் அபான்ஸ் பைனான்ஸ் பி.எல்.சி கம்பனிக்கு முழுமை அதிகாரமுண்டு.</p>
        </section>

        {/* SIGNATURE */}
        <section className="paper-section sig-section">
          <div className="sig-grid">
            <div className="sig-col">
              <div className="sig-line"></div>
              <div className="sig-lbl">Signature <span className="q-si">අත්සන</span> <span className="q-ta">கையொப்பம்</span></div>
            </div>
            <div className="sig-col sig-name">
              <input className="sig-name-input" name="signatureName" value={formData.signatureName} onChange={handleChange} placeholder="Full name..." />
              <div className="sig-lbl">Name <span className="q-si">නම</span> <span className="q-ta">பெயர்</span></div>
            </div>
            <div className="sig-col sig-date">
              <div className="sig-lbl">Date <span className="q-si">දිනය</span> <span className="q-ta">திகதி</span></div>
              <input
                type="date"
                className="sig-date-input"
                name="signatureDate"
                value={formData.signatureDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* FORM ACTIONS */}
        <div className="form-actions">
          <button type="button" className="paper-btn secondary" onClick={handleReset}>Clear Form</button>
          <button type="submit" className="paper-btn primary">Submit</button>
        </div>

        {apiStatus === "loading" && <div className="submit-note" style={{ color: "#1a73e8" }}>{apiMessage}</div>}
        {apiStatus === "success" && <div className="submit-note" style={{ color: "#0b6623" }}>{apiMessage}</div>}
        {apiStatus === "error" && <div className="submit-note" style={{ color: "#c62828" }}>{apiMessage}</div>}

      </form>
    </div>
    </>
  );
  
}

export default ApplicationForm;