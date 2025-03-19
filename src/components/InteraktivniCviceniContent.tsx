"use client";

import { useRouter } from "next/navigation";

export default function InteraktivniCviceniContent() {
  const router = useRouter();

  // Definice kategorií
  const categories = [
    { name: "Ekonomika", path: "/InteraktivniCviceni/Ekonomika" },
    { name: "Právo", path: "/InteraktivniCviceni/Pravo" },
    { name: "Biologie", path: "/InteraktivniCviceni/Biologie" },
    { name: "Elektronická Komunikace", path: "/InteraktivniCviceni/Komunikace" },
  ];

  return (
    <div className="flex-grow p-6 flex flex-col items-center">
      {/* Tlačítko Zpět */}
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => router.push("/")}
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
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-white mb-6">Interaktivní Cvičení</h1>
        <p className="mb-10 text-lg text-gray-300">
          Zábavné a efektivní vzdělávání. Vyberte si kategorii, která vás zajímá, a začněte procvičovat!
        </p>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl w-full">
        {categories.map((category) => (
          <a
            key={category.name}
            href={category.path}
            className="relative p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-500 to-blue-600 text-white overflow-hidden group transform transition-transform hover:scale-105 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <h2 className="relative text-3xl font-bold z-10">{category.name}</h2>
            <p className="relative text-sm text-gray-200 mt-2 z-10">
              Vyberte si a začněte objevovat.
            </p>
            <div className="absolute bottom-0 right-0 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white opacity-30 group-hover:opacity-60 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
