import React, { useState, useEffect } from "react";
import Popover from "../components/popover/Popover";
import RecipeForm from "../components/recipes/RecipeForm";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem("recipes");
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const handleSave = (recipe) => {
    setRecipes((prev) => {
      const exists = prev.find((r) => r.id === recipe.id);
      if (exists) {
        return prev.map((r) => (r.id === recipe.id ? recipe : r));
      } else {
        return [...prev, recipe];
      }
    });
    setIsOpen(false);
    setEditingRecipe(null);
  };

  const handleEdit = (id) => {
    const rec = recipes.find((r) => r.id === id);
    setEditingRecipe(rec);
    setIsOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Vil du slette denne oppskriften?")) {
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const [filter, setFilter] = useState("");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Oppskrifter</h1>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Søk etter tittel eller ingrediens…"
          style={{
            padding: "8px",
            marginBottom: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "250px",
          }}
        />

        <button
          onClick={() => {
            setEditingRecipe(null);
            setIsOpen(true);
          }}
          style={{
            background: "#4682B4",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Ny oppskrift
        </button>
      </div>

      {recipes.length === 0 && (
        <p>Ingen oppskrifter enda. Klikk «Ny oppskrift» for å starte.</p>
      )}

      <div style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
        {recipes.length === 0 && (
          <p>Ingen oppskrifter enda. Klikk «Ny oppskrift» for å starte.</p>
        )}

        <div style={{ marginTop: "20px", display: "grid", gap: "16px" }}>
          {recipes
            .filter(
              (r) =>
                r.title.toLowerCase().includes(filter.toLowerCase()) ||
                (r.ingredients &&
                  r.ingredients.toLowerCase().includes(filter.toLowerCase()))
            )
            .map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  padding: "16px",
                  background: "#fafafa",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {/* Venstre: tekst */}
                <div style={{ flex: 1 }}>
                  <h2 style={{ margin: "0 0 8px 0" }}>
                    {r.title}{" "}
                    <small style={{ fontWeight: "normal", color: "#666" }}>
                      ({r.category})
                    </small>
                  </h2>
                  {r.time && (
                    <p>
                      <strong>Steketid:</strong> {r.time}
                    </p>
                  )}
                  {r.temperature && (
                    <p>
                      <strong>Grader:</strong> {r.temperature}
                    </p>
                  )}
                  {r.ingredients && (
                    <>
                      <strong>Ingredienser:</strong>
                      <ul>
                        {r.ingredients.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {r.instructions && (
                    <p style={{ whiteSpace: "pre-wrap" }}>
                      <strong>Fremgangsmåte:</strong>
                      <br />
                      {r.instructions}
                    </p>
                  )}
                  <div
                    style={{ display: "flex", gap: "8px", marginTop: "8px" }}
                  >
                    <button onClick={() => handleEdit(r.id)}>Rediger</button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        color: "white",
                        background: "#b22222",
                        border: "none",
                        padding: "4px 8px",
                      }}
                    >
                      Slett
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Popover
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingRecipe(null);
        }}
      >
        <RecipeForm
          initialData={editingRecipe}
          onSave={handleSave}
          onCancel={() => {
            setIsOpen(false);
            setEditingRecipe(null);
          }}
        />
      </Popover>
    </div>
  );
}
