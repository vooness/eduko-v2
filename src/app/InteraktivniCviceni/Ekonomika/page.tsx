"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Exercise {
  name: string;
  type: string;
  grade: string;
  difficulty: string;
  cover: string;
  link: string;
}

const exercisesData: Exercise[] = [
  {
    name: "Rozpočet firmy",
    type: "Quiz",
    grade: "1. ročník",
    difficulty: "Lehké",
    cover: "/images/rozpocet-cover.jpg",
    link: "/ekonomika1/story.html",
  },
  {
    name: "Analýza trhu",
    type: "Drag & Drop",
    grade: "2. ročník",
    difficulty: "Střední",
    cover: "/images/analyza-cover.jpg",
    link: "/articulate/analyza-trhu/story.html",
  },
  {
    name: "Závazky a pohledávky",
    type: "Tabulka",
    grade: "3. ročník",
    difficulty: "Těžké",
    cover: "/images/zavazky-cover.jpg",
    link: "/articulate/zavazky/story.html",
  },
  {
    name: "Výpočet daní",
    type: "Výpočet",
    grade: "4. ročník",
    difficulty: "Těžké",
    cover: "/images/dane-cover.jpg",
    link: "/articulate/vypocet-dani/story.html",
  },
  {
    name: "Mzdové výpočty",
    type: "Simulace",
    grade: "2. ročník",
    difficulty: "Střední",
    cover: "/images/mzdy-cover.jpg",
    link: "/articulate/mzdove-vypocty/story.html",
  },
  {
    name: "Ekonomické modely",
    type: "Quiz",
    grade: "3. ročník",
    difficulty: "Lehké",
    cover: "/images/modely-cover.jpg",
    link: "/articulate/ekonomicke-modely/story.html",
  },
  {
    name: "Finanční plány",
    type: "Pexeso",
    grade: "1. ročník",
    difficulty: "Lehké",
    cover: "/images/finplan-cover.jpg",
    link: "/articulate/financni-plany/story.html",
  },
  {
    name: "Náklady a výnosy",
    type: "Tabulka",
    grade: "4. ročník",
    difficulty: "Střední",
    cover: "/images/naklady-cover.jpg",
    link: "/articulate/naklady-vynosy/story.html",
  },
  {
    name: "Marketingové strategie",
    type: "Simulace",
    grade: "3. ročník",
    difficulty: "Těžké",
    cover: "/images/marketing-cover.jpg",
    link: "/articulate/marketingove-strategie/story.html",
  },
  {
    name: "Účetní doklady",
    type: "Drag & Drop",
    grade: "2. ročník",
    difficulty: "Střední",
    cover: "/images/ucetni-cover.jpg",
    link: "/articulate/ucetni-doklady/story.html",
  },
  {
    name: "Investiční plány",
    type: "Výpočet",
    grade: "4. ročník",
    difficulty: "Těžké",
    cover: "/images/investice-cover.jpg",
    link: "/articulate/investicni-plany/story.html",
  },
  {
    name: "Obchodní smlouvy",
    type: "Quiz",
    grade: "3. ročník",
    difficulty: "Lehké",
    cover: "/images/smlouvy-cover.jpg",
    link: "/articulate/obchodni-smlouvy/story.html",
  },
];

export default function EkonomikaPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  const filteredExercises = exercisesData.filter((exercise) => {
    const matchName = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = filterGrade ? exercise.grade === filterGrade : true;
    const matchType = filterType ? exercise.type === filterType : true;
    const matchDifficulty = filterDifficulty ? exercise.difficulty === filterDifficulty : true;

    return matchName && matchGrade && matchType && matchDifficulty;
  });

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko zpět */}
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
          <h1 className="text-5xl font-extrabold text-white mb-4">Cvičení z Ekonomiky</h1>
          <p className="text-lg text-gray-300 mb-6">
            Procvičte si ekonomické znalosti a rozšiřte své dovednosti. Níže můžete vyhledávat a filtrovat cvičení.
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

        {/* Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
          {filteredExercises.map((exercise, index) => (
            <div
              key={index}
              className="relative p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
            >
              {/* Obtížnost v rohu */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-green-600 text-white text-sm rounded">
                {exercise.difficulty}
              </div>

              {/* Cover obrázek, pokud existuje */}
              {exercise.cover && (
                <img
                  src={exercise.cover}
                  alt={`${exercise.name} cover`}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              <h2 className="text-2xl font-bold text-white mb-2 mt-4">{exercise.name}</h2>
              <p className="text-gray-300 mb-1">Typ: {exercise.type}</p>
              <p className="text-gray-300">Ročník: {exercise.grade}</p>

              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                // Otevře odkaz v nové záložce:
                onClick={() => window.open(exercise.link, "_blank")}
              >
                Spustit cvičení
              </button>
            </div>
          ))}

          {filteredExercises.length === 0 && (
            <div className="col-span-full text-center text-gray-300 mt-6">
              <p>Žádné cvičení neodpovídá zadaným kritériím.</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
