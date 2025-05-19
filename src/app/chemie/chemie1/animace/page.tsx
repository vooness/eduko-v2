"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

const animationsData = [
  {
    name: "Chemická animace",
    description: "Popis animace...", // Nepovinný popis
    path: "/chemie/chemie1/animace/26_priprava_roztoku", // Cesta k animaci
  },
];

export default function AnimacePage() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hlavní obsah */}
      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko Zpět */}
        <div className="w-full max-w-7xl mb-6">
          <button
            onClick={() => router.back()}
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
          <h1 className="text-5xl font-extrabold text-white mb-4">Animace</h1>
          <p className="text-lg text-gray-300 mb-6">
            Zde je seznam dostupných animací pro Chemii 1.
          </p>
        </div>

        {/* Seznam animací */}
        <div className="max-w-7xl w-full">
          {animationsData.length > 0 && (
            <h2 className="text-2xl font-bold text-left mb-4">Výsledky:</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {animationsData.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-white mb-2 mt-4">{item.name}</h2>
                {item.description && (
                  <p className="text-gray-300 mb-4">{item.description}</p>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (item.path) {
                      window.open(item.path, "_blank");
                    } else {
                      alert("Animace zatím není dostupná.");
                    }
                  }}
                >
                  Spustit animaci
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
