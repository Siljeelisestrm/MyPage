import React, { useState, useEffect } from "react";

export default function RecipeForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Middag");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [time, setTime] = useState("");
  const [temperature, setTemperature] = useState("");
  const [image, setImage] = useState(""); // <–– nytt

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setCategory(initialData.category || "Middag");
      setIngredients(initialData.ingredients || "");
      setInstructions(initialData.instructions || "");
      setTime(initialData.time || "");
      setTemperature(initialData.temperature || "");
      setImage(initialData.image || ""); // <–– nytt
    }
  }, [initialData]);

  // konverterer fil til base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      id: initialData?.id || Date.now(),
      title: title.trim(),
      category,
      ingredients,
      instructions,
      time,
      temperature,
      image, // <–– nytt
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <h2>{initialData ? "Rediger oppskrift" : "Ny oppskrift"}</h2>
      <input
        placeholder="Navn på oppskrift"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{ padding: "8px" }}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{ padding: "8px" }}
      >
        <option>Middag</option>
        <option>Dessert</option>
        <option>Bakeverk</option>
        <option>Annet</option>
      </select>
      <textarea
        placeholder="Ingredienser (ett per linje)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        rows={4}
        style={{ padding: "8px" }}
      />
      <textarea
        placeholder="Fremgangsmåte"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
        style={{ padding: "8px" }}
      />
      <input
        placeholder="Steketid (f.eks 30 min)"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={{ padding: "8px" }}
      />
      <input
        placeholder="Grader (f.eks 200°C)"
        value={temperature}
        onChange={(e) => setTemperature(e.target.value)}
        style={{ padding: "8px" }}
      />

      {/* Nytt felt for bilde */}
      <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        Legg til bilde:
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>
      {image && (
        <img
          src={image}
          alt="Forhåndsvisning"
          style={{
            maxWidth: "100%",
            maxHeight: "150px",
            marginTop: "8px",
            borderRadius: "6px",
          }}
        />
      )}

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <button type="button" onClick={onCancel}>
          Avbryt
        </button>
        <button
          type="submit"
          style={{
            background: "#2E8B57",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
          }}
        >
          Lagre
        </button>
      </div>
    </form>
  );
}
