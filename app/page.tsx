"use client";
import { useState } from "react";

type CardKey = string;

type EditingState = {
  card: CardKey;
  index: number;
} | null;

export default function Page() {
  const [boards, setBoards] = useState<CardKey[]>(["card1", "card2", "card3"]);

  const [selectedCard, setSelectedCard] = useState<CardKey>("card1");
  const [todo, setTodo] = useState("");

  const [cards, setCards] = useState<Record<CardKey, string[]>>({
    card1: [],
    card2: [],
    card3: [],
  });

  const [editing, setEditing] = useState<EditingState>(null);
  const [editText, setEditText] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");

  const addTodo = () => {
    if (!todo.trim()) return;

    setCards((prev) => ({
      ...prev,
      [selectedCard]: [...(prev[selectedCard] || []), todo],
    }));

    setTodo("");
  };

  const deleteTodo = (card: CardKey, index: number) => {
    setCards((prev) => ({
      ...prev,
      [card]: prev[card].filter((_, i) => i !== index),
    }));
  };

  const startEdit = (card: CardKey, index: number, text: string) => {
    setEditing({ card, index });
    setEditText(text);
  };

  const saveEdit = () => {
    if (!editing || !editText.trim()) return;

    setCards((prev) => ({
      ...prev,
      [editing.card]: prev[editing.card].map((t, i) =>
        i === editing.index ? editText : t,
      ),
    }));

    setEditing(null);
    setEditText("");
  };

  const addBoard = () => {
    if (!newBoardName.trim()) return;
    if (boards.includes(newBoardName)) return;

    setBoards((prev) => [...prev, newBoardName]);
    setCards((prev) => ({ ...prev, [newBoardName]: [] }));
    setSelectedCard(newBoardName);

    setNewBoardName("");
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-purple-700 from-blue-100 via-indigo-100 to-purple-100">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-xl font-bold bg-blue-600 bg-clip-text text-transparent">
            Todo Cards
          </h1>

          <div className="flex flex-wrap gap-3 items-center">
            <input
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Enter Here"
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm w-56"
            />

            <select
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
              className="rounded-lg border border-gray-300 bg-blue-600 px-4 py-2 text-sm cursor-pointer text-white"
            >
              {boards.map((card) => (
                <option key={card} value={card}>
                  {card.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              onClick={addTodo}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm shadow-md cursor-pointer"
            >
              Add Todo
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm shadow-md cursor-pointer"
            >
              Add Board
            </button>
          </div>
        </div>
      </nav>

      {/* BOARDS CONTAINER */}
      <div className="px-6 py-10">
        <div className="flex gap-6 overflow-x-auto pb-8">
          {boards.map((card) => (
            <div
              key={card}
              className="min-w-[320px] max-w-[320px] h-[430] rounded-2xl 
                         bg-white/70 backdrop-blur-md p-5 shadow-lg flex flex-col"
            >
              <h3 className="mb-4 text-lg font-semibold text-center bg-blue-800 bg-clip-text text-transparent">
                {card.toUpperCase()}
              </h3>

              <div className="flex-1 overflow-y-auto">
                {cards[card]?.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center italic">
                    No todos here
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {cards[card].map((t, i) => {
                      const isEditing =
                        editing?.card === card && editing?.index === i;

                      return (
                        <li
                          key={i}
                          className="rounded-lg bg-white px-4 py-3 flex justify-between items-center shadow-sm"
                        >
                          {isEditing ? (
                            <>
                              <input
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="rounded-md border px-2 py-1 text-sm w-full mr-2"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEdit}
                                  className="text-green-600 text-sm cursor-pointer"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditing(null)}
                                  className="text-gray-500 text-sm cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="text-sm text-gray-700">{t}</span>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => startEdit(card, i, t)}
                                  className="text-blue-600 text-sm cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteTodo(card, i)}
                                  className="text-red-600 text-sm cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Add New Board</h2>

            <input
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Board name"
              className="w-full border rounded-md px-3 py-2 mb-4 text-sm"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-sm text-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={addBoard}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
