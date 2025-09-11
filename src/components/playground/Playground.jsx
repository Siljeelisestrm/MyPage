import React from "react";
import { LiveProvider, LiveEditor, LivePreview, LiveError } from "react-live";
import Button from "../button/Button";
import Card from "../card/Card";
import Input from "../input/Input";
import Dropdown from "../dropdown/Dropdown";

export default function Playground({ code, scope = {} }) {
  const baseScope = { Button, Card, Input, Dropdown, React };

  return (
    <LiveProvider code={code} scope={{ ...baseScope, ...scope }}>
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "16px",
          flexDirection: "column",
        }}
      >
        <LiveEditor
          style={{
            flex: 1,
            background: "#f5f5f5",
            borderRadius: "6px",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        />
        <div style={{ flex: 1, padding: "8px" }}>
          <LivePreview />
          <LiveError style={{ color: "red", marginTop: "8px" }} />
        </div>
      </div>
    </LiveProvider>
  );
}
