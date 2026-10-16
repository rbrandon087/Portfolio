// script.js — small touches for the portfolio.
// The page works without this file; each block adds one feature.


// 1) FOOTER YEAR
// new Date() is today's date; getFullYear() pulls out just the year.
// So the footer never goes stale.
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


// 2) COPY EMAIL BUTTON
// navigator.clipboard.writeText() returns a Promise, so we await it.
// If the browser refuses (some do), we fall back to selecting the text
// so the visitor can press Ctrl+C themselves.
const copyBtn = document.getElementById("copy-email");
const emailEl = document.getElementById("email");

if (copyBtn && emailEl) {
  const originalLabel = copyBtn.textContent;

  copyBtn.addEventListener("click", async () => {
    const email = emailEl.textContent.trim();

    try {
      await navigator.clipboard.writeText(email);
      copyBtn.textContent = "Copied";
    } catch (err) {
      // Fallback: highlight the email so it's easy to copy by hand.
      const range = document.createRange();
      range.selectNodeContents(emailEl);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyBtn.textContent = "Press Ctrl+C";
    }

    // Put the original label back after 2 seconds.
    setTimeout(() => {
      copyBtn.textContent = originalLabel;
    }, 2000);
  });
}


// 3) HIGHLIGHT THE CURRENT SECTION IN THE TOP BAR
// IntersectionObserver tells us when a section enters the middle of the
// screen, without running code on every single scroll event.
const navLinks = document.querySelectorAll(".routes a");
const sections = document.querySelectorAll("main section[id]");

function setActive(id) {
  navLinks.forEach((link) => {
    // Only the link whose href is "#<id>" gets the class.
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });
}

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      // Shrink the "viewport" to a thin band in the middle of the screen,
      // so only one section counts as "current" at a time.
      rootMargin: "-45% 0px -50% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));
}


// 4) PING THE APEX TRACKER API
// Calls only the base URL, never a route that returns player data.
// Any answer from the server (even a 404) proves it's awake.
const API_URL = "https://apex-tracker-tqxf.onrender.com/";
const TIMEOUT_MS = 90000; // Render's free tier can take ~1 min to wake up

const pingBtn = document.getElementById("ping-api");
const pingOut = document.getElementById("ping-result");

// Some hosts send an empty statusText, so keep a small fallback list.
const STATUS_TEXT = { 200: "OK", 201: "Created", 204: "No Content", 404: "Not Found", 500: "Server Error" };

if (pingBtn && pingOut) {
  pingBtn.addEventListener("click", async () => {
    pingBtn.disabled = true;
    pingOut.textContent = "Sending request…";

    // If it's slow, the server is probably asleep. Tell the visitor why.
    const slowNotice = setTimeout(() => {
      pingOut.textContent = "Waking up the server (free tier). This can take up to a minute…";
    }, 3000);

    // AbortController lets us give up after TIMEOUT_MS instead of waiting forever.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const start = performance.now();

    try {
      const res = await fetch(API_URL, { cache: "no-store", signal: controller.signal });
      const ms = Math.round(performance.now() - start);
      const text = res.statusText || STATUS_TEXT[res.status] || "";
      pingOut.textContent = `${res.status} ${text} · ${ms} ms · server is up`;
    } catch (err) {
      if (err.name === "AbortError") {
        pingOut.textContent = `No answer after ${TIMEOUT_MS / 1000} seconds. Try again in a minute.`;
      } else {
        // A TypeError here usually means CORS: the server answered, but the
        // browser won't let this page READ the answer. A "no-cors" request
        // can't read the status either, but it does tell us the server replied.
        try {
          const retryStart = performance.now();
          await fetch(API_URL, { mode: "no-cors", cache: "no-store" });
          const ms = Math.round(performance.now() - retryStart);
          pingOut.textContent = `Server is up (${ms} ms). The browser hid the status code because of CORS.`;
        } catch {
          pingOut.textContent = "Couldn't reach the API. It may be down; try again later.";
        }
      }
    } finally {
      // finally runs whether the request worked or failed, so cleanup goes here.
      clearTimeout(slowNotice);
      clearTimeout(timeout);
      pingBtn.disabled = false;
    }
  });
}