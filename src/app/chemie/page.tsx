"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Data pro knihy – aktuálně jen Chemie 1
const booksData = [
  {
    name: "Chemie 1",
    type: "Kniha",
    grade: "1. ročník",
    path: "/chemie/chemie1",
  },
];

export default function ChemiePage() {
  const router = useRouter();

  // States pro vyhledávání a filtry
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterType, setFilterType] = useState("");

  // Logika filtrace
  const filteredBooks = booksData.filter((book) => {
    const matchName = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchGrade = filterGrade ? book.grade === filterGrade : true;
    const matchType = filterType ? book.type === filterType : true;
    return matchName && matchGrade && matchType;
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
          <h1 className="text-5xl font-extrabold text-white mb-4">Knihy z Chemie</h1>
          <p className="text-lg text-gray-300 mb-6">
            Vyberte si knihu pro chemii. Momentálně dostupná je pouze <strong>Chemie 1</strong>.
          </p>

          {/* Vyhledávání a filtry */}
          <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center items-center mb-6 mt-6">
            <input
              type="text"
              placeholder="Vyhledat knihu..."
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
              <option value="Kniha">Kniha</option>
            </select>
          </div>
        </div>

        {/* Grid layout s knihami */}
        <div className="max-w-7xl w-full">
          {filteredBooks.length > 0 && (
            <h2 className="text-2xl font-bold text-left mb-4">Výsledky:</h2>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-white mb-2 mt-4">{book.name}</h2>
                <p className="text-gray-300 mb-1">Typ: {book.type}</p>
                <p className="text-gray-300">Ročník: {book.grade}</p>
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (book.path) {
                      router.push(book.path);
                    } else {
                      alert("Kniha zatím není dostupná.");
                    }
                  }}
                >
                  Otevřít knihu
                </button>
              </div>
            ))}

            {filteredBooks.length === 0 && (
              <div className="col-span-full text-center text-gray-300 mt-6">
                <p>Žádná kniha neodpovídá zadaným kritériím.</p>
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
