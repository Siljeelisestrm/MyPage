import React, { useState } from "react";
import Playground from "../components/playground/Playground";
import Separator from "../components/separator/Separator";

export default function Home() {
  const categories = [
    "Venner",
    "Familie",
    "Besteforeldre",
    "Svigerfamilie",
    "Dyr",
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <>
      <div>
        <h1>Komponentbibliotek 🚀</h1>
        <p> Prøv det selv!</p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "16px",
          flexDirection: "column",
        }}
      >
        <Playground code={`<Card title="Dette er en Card-komponent" />`} />
        <Separator />

        <Playground
          code={`<Button onClick={() => alert("Hei!")}>Trykk meg</Button>`}
        />
        <Separator />

        <Playground code={` <Input placeholder="Input felt"></Input>`} />
        <Separator />

        <Playground
          code={`<Dropdown options={categories} value={selectedCategory} onChange={setSelectedCategory} />`}
          scope={{ categories, selectedCategory, setSelectedCategory }}
        />
        <Separator />
      </div>
    </>
  );
}
