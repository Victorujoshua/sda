"use client";
import { useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");

  function handleSubmit() {
    if (email.trim()) {
      // TODO: wire to newsletter service in Section 7
      console.log("Newsletter signup:", email);
      setEmail("");
    }
  }

  return (
    <section style={{
      padding: "48px 40px",
      borderBottom: "1px solid var(--hairline)",
    }}>
      <p style={{
        fontFamily: "var(--in)",
        fontSize: "15px",
        color: "rgba(17,17,17,0.45)",
        maxWidth: "500px",
        marginBottom: "20px",
        lineHeight: 1.6,
        letterSpacing: "0.04em",
      }}>
        Sign up for Imani Ventures deal flow — updates on new opportunities, portfolio news,
        and what we have been backing.
      </p>

      {/* DO NOT use <form> element per spec */}
      <div style={{
        maxWidth: "500px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid var(--hairline)",
      }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Enter your email"
          className="imani-email-input"
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "var(--sr)",
            fontSize: "18px",
            fontWeight: 300,
            color: "var(--ink)",
            padding: "12px 0",
          }}
        />
        <button
          onClick={handleSubmit}
          className="imani-email-arrow"
          style={{
            background: "none",
            border: "none",
            fontFamily: "var(--in)",
            fontSize: "18px",
            cursor: "pointer",
            padding: "8px 0",
          }}
        >
          →
        </button>
      </div>
    </section>
  );
}
