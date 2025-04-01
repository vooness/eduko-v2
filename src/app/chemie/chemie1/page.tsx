"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

export default function Chemie1Page() {
  const router = useRouter();

  // Možnosti k výběru
  const options = [
    {
      name: "Animace",
      path: "/chemie/chemie1/animace",
    },
    {
      name: "3D Modely",
      path: "/chemie/chemie1/3dmodely",
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hlavní obsah */}
      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko Zpět */}
        <div className="w-full max-w-7xl mb-6">
          <button
            onClick={() => router.push("/chemie")}
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
          <h1 className="text-5xl font-extrabold text-white mb-4">Chemie 1</h1>
          <p className="text-lg text-gray-300 mb-6">
            Zde si můžete vybrat, zda chcete zobrazit animace nebo 3D modely pro Chemii 1.
          </p>
        </div>

        {/* Grid layout s nabídkami */}
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 gap-8">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-white mb-2 mt-4">{option.name}</h2>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                onClick={() => router.push(option.path)}
              >
                Otevřít
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
