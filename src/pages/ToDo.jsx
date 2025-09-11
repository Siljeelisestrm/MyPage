import React, { useState, useEffect } from "react";
import Card from "../components/card/Card";
import InputField from "../components/input/Input";
import colors from "../theme/colors";

export default function ToDo() {
  // Hent lagret liste fra localStorage
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("todoItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState("");

  // Lagre listen til localStorage hver gang den endres
  useEffect(() => {
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (inputValue.trim() === "") return;
    setItems((prev) => [...prev, inputValue.trim()]);
    setInputValue("");
  };

  const removeItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Min huskeliste</h2>

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}
      >
        <InputField
          value={inputValue}
          onChange={setInputValue}
          onEnter={addItem}
        />
        <button
          onClick={addItem}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            backgroundColor: colors.coralGreen,
            color: colors.softWhite,
            cursor: "pointer",
          }}
        >
          Legg til
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {items.map((item, index) => (
          <Card
            key={index}
            title={item}
            bg="softBlue"
            style={{
              height: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              onClick={() => removeItem(index)}
              style={{
                background: "transparent",
                border: "none",
                color: colors.midnight,
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✖
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
