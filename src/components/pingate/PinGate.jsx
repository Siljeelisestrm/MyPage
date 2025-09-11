import React, { useState, useEffect } from "react";

/**
 * Props:
 * - requiredPin: string (fire sifre) — hvis ikke satt, default "1234"
 * - storageKey: string (optional) — nøkkel i localStorage for å huske opplåst state
 * - children: komponent som skal vises når låst opp
 */
export default function PinGate({
  requiredPin = "1234",
  storageKey = "giftPlannerUnlocked",
  children,
}) {
  const [pinInput, setPinInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Sjekk localStorage ved mount
    const saved = localStorage.getItem(storageKey);
    if (saved === "true") setUnlocked(true);
  }, [storageKey]);

  const handleChange = (e) => {
    // bare tall, maks 4 tegn
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setPinInput(value);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pinInput.length !== 4) {
      setError("PIN må være 4 sifre.");
      return;
    }
    if (pinInput === requiredPin) {
      setUnlocked(true);
      localStorage.setItem(storageKey, "true");
      setError("");
    } else {
      setError("Feil PIN. Prøv igjen.");
      setPinInput("");
    }
  };

  const handleResetLock = () => {
    setUnlocked(false);
    localStorage.removeItem(storageKey);
    setPinInput("");
    setError("");
  };

  if (unlocked) {
    // Vi viser barna — men legger også en liten lås-knapp oppe (valgfritt)
    // Hvis du heller vil plassere logout-knapp i GiftPlanner, ta den bort her.
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: 8,
          }}
        >
          <button
            onClick={handleResetLock}
            style={{
              padding: "6px 10px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "#eee",
              cursor: "pointer",
            }}
            title="Lås siden"
          >
            Lås
          </button>
        </div>
        {children}
      </div>
    );
  }

  // Låst view (PIN input)
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginTop: 0 }}>Skriv inn 4-sifret kode</h3>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 8 }}
        >
          <input
            inputMode="numeric"
            pattern="\d*"
            value={pinInput}
            onChange={handleChange}
            placeholder="____"
            style={{
              padding: "10px 12px",
              fontSize: "1.2rem",
              letterSpacing: "6px",
              textAlign: "center",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
            autoFocus
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: 6,
                backgroundColor: "#2E8B57",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Lås opp
            </button>
            <button
              type="button"
              onClick={() => {
                setPinInput("");
                setError("");
              }}
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: 6,
                background: "white",
                cursor: "pointer",
              }}
            >
              Nullstill
            </button>
          </div>

          {error && (
            <div style={{ color: "#b00020", fontSize: 14 }}>{error}</div>
          )}

          <div style={{ fontSize: 12, color: "#666" }}>
            Tips: PIN er 4 sifre. Du kan endre koden ved å sende
            `requiredPin`-prop til PinGate-komponenten.
          </div>
        </form>
      </div>
    </div>
  );
}
