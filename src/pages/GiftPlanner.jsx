import React, { useState, useEffect } from "react";
import Card from "../components/card/Card";
import Input from "../components/input/Input";
import colors from "../theme/colors";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Dropdown from "../components/dropdown/Dropdown";

const categories = [
  "Venner",
  "Familie",
  "Besteforeldre",
  "Svigerfamilie",
  "Dyr",
];

function makeId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export default function GiftPlanner() {
  const [people, setPeople] = useState(() => {
    const saved = localStorage.getItem("giftPlanner");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // sørg for at alle entries har id, ideas og purchasedIdeas
      return parsed.map((p) => ({
        id: p.id || makeId(),
        name: p.name || "",
        category: p.category || categories[0],
        newIdea: p.newIdea || "",
        ideas: p.ideas || [],
        purchasedIdeas: p.purchasedIdeas || [],
      }));
    } catch {
      return [];
    }
  });

  const [inputName, setInputName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [filter, setFilter] = useState("Alle");

  // Lagre til localStorage
  useEffect(() => {
    localStorage.setItem("giftPlanner", JSON.stringify(people));
  }, [people]);

  // --- Funksjoner basert på personId (ikke indeks) ---
  const addPerson = () => {
    const name = inputName.trim();
    if (!name) return;
    setPeople((prev) => [
      ...prev,
      {
        id: makeId(),
        name,
        ideas: [],
        purchasedIdeas: [],
        newIdea: "",
        category: selectedCategory,
      },
    ]);
    setInputName("");
  };

  const addIdea = (personId) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === personId && person.newIdea?.trim()
          ? {
              ...person,
              ideas: [...(person.ideas || []), person.newIdea.trim()],
              newIdea: "",
            }
          : person
      )
    );
  };

  const updateIdeaInput = (personId, value) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === personId ? { ...person, newIdea: value } : person
      )
    );
  };

  const deletePerson = (personId) => {
    setPeople((prev) => prev.filter((p) => p.id !== personId));
  };

  const deleteIdea = (personId, ideaIndex) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              ideas: (person.ideas || []).filter((_, idx) => idx !== ideaIndex),
            }
          : person
      )
    );
  };

  const markIdeaBought = (personId, ideaIndex) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id !== personId) return person;
        const idea = (person.ideas || [])[ideaIndex];
        return {
          ...person,
          ideas: (person.ideas || []).filter((_, idx) => idx !== ideaIndex),
          purchasedIdeas: [...(person.purchasedIdeas || []), idea],
        };
      })
    );
  };

  const unmarkIdeaBought = (personId, purchasedIndex) => {
    setPeople((prev) =>
      prev.map((person) => {
        if (person.id !== personId) return person;
        const idea = (person.purchasedIdeas || [])[purchasedIndex];
        return {
          ...person,
          purchasedIdeas: (person.purchasedIdeas || []).filter(
            (_, idx) => idx !== purchasedIndex
          ),
          ideas: [...(person.ideas || []), idea],
        };
      })
    );
  };

  // --- Drag & drop (kun når filter === "Alle") ---
  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (filter !== "Alle") return; // enkel og sikker løsning

    const src = result.source.index;
    const dst = result.destination.index;
    const items = Array.from(people);
    const [removed] = items.splice(src, 1);
    items.splice(dst, 0, removed);
    setPeople(items);
  };

  // --- Filtrering ---
  const filteredPeople =
    filter === "Alle" ? people : people.filter((p) => p.category === filter);

  // --- hjelpere for teller (antall personer med minst én kjøpt idé) ---
  const purchasedPeopleCount = people.filter(
    (p) => (p.purchasedIdeas || []).length > 0
  ).length;
  const totalPeopleCount = people.length;

  // --- Render ---
  return (
    <div>
      <h2>Julegaveplanlegger</h2>

      {/* Rad øverst: input (venstre) og teller/card (høyre) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Input
            value={inputName}
            onChange={setInputName}
            onEnter={addPerson}
            placeholder="Legg til person"
          />
          <Dropdown
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
          <button
            onClick={addPerson}
            style={{
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              backgroundColor: colors.coralGreen,
              color: colors.midnight,
              cursor: "pointer",
            }}
          >
            Legg til person
          </button>
        </div>

        <Card style={{ minWidth: 180, textAlign: "center" }}>
          <h3>Gaver kjøpt</h3>
          <p style={{ fontSize: "1.1rem", fontWeight: "600" }}>
            {purchasedPeopleCount} av {totalPeopleCount} gaver kjøpt
          </p>
        </Card>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: 12 }}>
        <Dropdown
          label="Filter:"
          options={["Alle", ...categories]}
          value={filter}
          onChange={setFilter}
        />
      </div>

      {/* Liste */}
      {filter === "Alle" ? (
        // Drag & drop-listen (vis alle)
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="people-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {people.map((person, idx) => (
                  <Draggable
                    key={person.id}
                    draggableId={person.id.toString()}
                    index={idx}
                  >
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        <Card
                          title={`${person.name} (${person.category})`}
                          bg={
                            (person.ideas?.length || 0) === 0 &&
                            (person.purchasedIdeas?.length || 0) > 0
                              ? "fog"
                              : "softBlue"
                          }
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <Input
                              value={person.newIdea || ""}
                              onChange={(v) => updateIdeaInput(person.id, v)}
                              onEnter={() => addIdea(person.id)}
                              placeholder="Legg til idé"
                            />
                            <button
                              onClick={() => addIdea(person.id)}
                              style={{
                                padding: "4px 8px",
                                border: "none",
                                borderRadius: 4,
                                backgroundColor: colors.coralGreen,
                                color: colors.midnight,
                                cursor: "pointer",
                              }}
                            >
                              Legg til idé
                            </button>
                            <button
                              onClick={() => deletePerson(person.id)}
                              style={{
                                padding: "4px 8px",
                                border: "none",
                                borderRadius: 4,
                                backgroundColor: colors.midnight,
                                color: colors.softWhite,
                                cursor: "pointer",
                              }}
                            >
                              Slett
                            </button>
                          </div>

                          {/* Ideer */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 6,
                              width: "100%",
                              maxWidth: 680,
                            }}
                          >
                            {(person.ideas || []).map((idea, i) => (
                              <div
                                key={i}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "6px 8px",
                                  borderRadius: 6,
                                  background: "rgba(0,0,0,0.03)",
                                }}
                              >
                                <span>{idea}</span>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button
                                    onClick={() => markIdeaBought(person.id, i)}
                                    style={{
                                      padding: "2px 6px",
                                      border: "none",
                                      borderRadius: 4,
                                      backgroundColor: colors.coralGreen,
                                      color: colors.midnight,
                                      cursor: "pointer",
                                      fontSize: 12,
                                    }}
                                  >
                                    Kjøpt
                                  </button>
                                  <button
                                    onClick={() => deleteIdea(person.id, i)}
                                    style={{
                                      padding: "2px 6px",
                                      border: "none",
                                      borderRadius: 4,
                                      backgroundColor: colors.blood,
                                      color: colors.softWhite,
                                      cursor: "pointer",
                                      fontSize: 12,
                                    }}
                                  >
                                    X
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Kjøpte gaver */}
                          {(person.purchasedIdeas || []).length > 0 && (
                            <div style={{ marginTop: 8 }}>
                              <strong>Kjøpt:</strong>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 6,
                                  marginTop: 6,
                                }}
                              >
                                {(person.purchasedIdeas || []).map(
                                  (item, j) => (
                                    <div
                                      key={j}
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      <span>{item}</span>
                                      <button
                                        onClick={() =>
                                          unmarkIdeaBought(person.id, j)
                                        }
                                        style={{
                                          padding: "2px 6px",
                                          border: "none",
                                          borderRadius: 4,
                                          backgroundColor: colors.fog,
                                          color: colors.softWhite,
                                          cursor: "pointer",
                                          fontSize: 12,
                                        }}
                                      >
                                        Angre
                                      </button>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        // Filtrert visning (ingen drag & drop) — operasjoner bruker id
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 16,
          }}
        >
          {filteredPeople.map((person) => (
            <Card
              key={person.id}
              title={`${person.name} (${person.category})`}
              bg={
                (person.ideas?.length || 0) === 0 &&
                (person.purchasedIdeas?.length || 0) > 0
                  ? "fog"
                  : "softBlue"
              }
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <Input
                  value={person.newIdea || ""}
                  onChange={(v) => updateIdeaInput(person.id, v)}
                  onEnter={() => addIdea(person.id)}
                  placeholder="Legg til idé"
                />
                <button
                  onClick={() => addIdea(person.id)}
                  style={{
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: 4,
                    backgroundColor: colors.coralGreen,
                    color: colors.midnight,
                  }}
                >
                  Legg til idé
                </button>
                <button
                  onClick={() => deletePerson(person.id)}
                  style={{
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: 4,
                    backgroundColor: colors.midnight,
                    color: colors.softWhite,
                  }}
                >
                  Slett
                </button>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  width: "100%",
                  maxWidth: 680,
                }}
              >
                {(person.ideas || []).map((idea, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <span>{idea}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => markIdeaBought(person.id, i)}
                        style={{
                          padding: "2px 6px",
                          border: "none",
                          borderRadius: 4,
                          backgroundColor: colors.coralGreen,
                          color: colors.midnight,
                        }}
                      >
                        Kjøpt
                      </button>
                      <button
                        onClick={() => deleteIdea(person.id, i)}
                        style={{
                          padding: "2px 6px",
                          border: "none",
                          borderRadius: 4,
                          backgroundColor: colors.blood,
                          color: colors.softWhite,
                        }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(person.purchasedIdeas || []).length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Kjøpt:</strong>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      marginTop: 6,
                    }}
                  >
                    {(person.purchasedIdeas || []).map((item, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => unmarkIdeaBought(person.id, j)}
                          style={{
                            padding: "2px 6px",
                            border: "none",
                            borderRadius: 4,
                            backgroundColor: colors.fog,
                            color: colors.softWhite,
                          }}
                        >
                          Angre
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
