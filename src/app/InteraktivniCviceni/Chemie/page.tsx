"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Přidáme druhý objekt pro animaci
const exercisesData = [
  {
    name: "Interaktivní 3D model",
    type: "3D Model",
    grade: "1. ročník",
    difficulty: "Lehké",
    path: "/InteraktivniCviceni/Chemie/3DModel",
  },
  {
    name: "Chemická animace",
    type: "Animace",
    grade: "1. ročník",
    difficulty: "Lehké",
    path: "/InteraktivniCviceni/Chemie/Animace",
  },
];

export default function ChemiePage() {
  const router = useRouter();

  // States pro vyhledávání a filtry
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  // Logika filtrace
  const filteredExercises = exercisesData.filter((exercise) => {
    const matchName = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = filterGrade ? exercise.grade === filterGrade : true;
    const matchType = filterType ? exercise.type === filterType : true;
    const matchDifficulty = filterDifficulty ? exercise.difficulty === filterDifficulty : true;

    return matchName && matchGrade && matchType && matchDifficulty;
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hlavní obsah */}
      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko Zpět */}
        <div className="w-full max-w-7xl mb-6">
          <button
            onClick={() => router.push("/InteraktivniCviceni")}
            className="flex items-center px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zpět
          </button>
        </div>

        {/* Nadpis a popis */}
        <div className="max-w-4xl w-full text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">Cvičení z Chemie</h1>
          <p className="text-lg text-gray-300 mb-6">
            Vyzkoušejte si interaktivní 3D model a prohlédněte si chemickou animaci!
          </p>

          {/* Vyhledávání a filtry */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center items-center mb-6 mt-6">
            <input
              type="text"
              placeholder="Vyhledat cvičení..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow md:flex-none md:w-1/3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Všechny ročníky</option>
              <option value="1. ročník">1. ročník</option>
              <option value="2. ročník">2. ročník</option>
              <option value="3. ročník">3. ročník</option>
              <option value="4. ročník">4. ročník</option>
            </select>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Všechny typy</option>
              <option value="Quiz">Quiz</option>
              <option value="Drag & Drop">Drag & Drop</option>
              <option value="Tabulka">Tabulka</option>
              <option value="Výpočet">Výpočet</option>
              <option value="Simulace">Simulace</option>
              <option value="Pexeso">Pexeso</option>
              <option value="3D Model">3D Model</option>
              <option value="Animace">Animace</option>
            </select>

            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Všechny obtížnosti</option>
              <option value="Lehké">Lehké</option>
              <option value="Střední">Střední</option>
              <option value="Těžké">Těžké</option>
            </select>
          </div>
        </div>

        {/* Grid layout s cvičeními */}
        <div className="max-w-7xl w-full">
          {filteredExercises.length > 0 && (
            <h2 className="text-2xl font-bold text-left mb-4">Výsledky:</h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExercises.map((exercise, index) => (
              <div
                key={index}
                className="relative p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
              >
                {/* Obtížnost */}
                <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-sm rounded">
                  {exercise.difficulty}
                </div>

                <h2 className="text-2xl font-bold text-white mb-2 mt-4">{exercise.name}</h2>
                <p className="text-gray-300 mb-1">Typ: {exercise.type}</p>
                <p className="text-gray-300">Ročník: {exercise.grade}</p>
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (exercise.path) {
                      // Otevře cvičení v nové záložce
                      window.open(exercise.path, "_blank");
                    } else {
                      alert("Cvičení zatím není dostupné.");
                    }
                  }}
                >
                  Spustit cvičení
                </button>
              </div>
            ))}

            {/* Zobrazení informace, pokud nejsou nalezeny žádné výsledky */}
            {filteredExercises.length === 0 && (
              <div className="col-span-full text-center text-gray-300 mt-6">
                <p>Žádné cvičení neodpovídá zadaným kritériím.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
