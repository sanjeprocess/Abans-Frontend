/** privacyGuard.js - call startPrivacyGuard() once before React renders. */

const MIN_RATIO = 0.95;          // window must cover >= 95% of the screen
const BLUR_ON_FOCUS_LOSS = false;

let enabled = false;             // OFF until a page turns it on
const root = document.documentElement;

const isMinimized = () =>
  document.hidden ||
  document.visibilityState === "hidden" ||
  window.outerWidth === 0 || window.outerHeight === 0 ||
  window.screenX <= -30000 || window.screenY <= -30000;

const isNotMaximized = () =>
  window.outerWidth  / screen.availWidth  < MIN_RATIO ||
  window.outerHeight / screen.availHeight < MIN_RATIO;

const apply = () => {
  if (!enabled) { root.classList.remove("privacy-hidden"); return; }
  const hidden =
    isMinimized() || isNotMaximized() ||
    (BLUR_ON_FOCUS_LOSS && !document.hasFocus());
  root.classList.toggle("privacy-hidden", hidden);
};

export function setPrivacyGuardEnabled(on) {
  enabled = !!on;
  apply();
}

export function startPrivacyGuard() {
  document.addEventListener("visibilitychange", apply);
  window.addEventListener("resize", apply);
  window.addEventListener("focus", apply);
  window.addEventListener("blur", apply);
  window.addEventListener("pagehide", () => { if (enabled) root.classList.add("privacy-hidden"); });
  window.addEventListener("pageshow", apply);
  setInterval(apply, 50);
  apply();
}
