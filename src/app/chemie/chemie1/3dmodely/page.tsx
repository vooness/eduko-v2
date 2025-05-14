"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

const modelsData = [
  {
    name: "Interaktivní 3D model",
    description: "Popis 3D modelu...", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel1", // Opravená absolutní cesta
  },
  {
    name: "Interaktivní 3D model",
    description: "s019 2.1_oxid uhličitý kalot", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel2", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.1.1_Orbital_1s", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel3", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.1.2_Orbital_2s", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel4", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.1.3_Orbital_3s", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel5", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.2.1_Orbital_2p_y", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel6", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.2.2_Orbital_2p_z", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel7", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.2.3_Orbital_2p_x", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel8", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.2.4_podslupka_2p", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel9", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "s035 3.2.3.1_Orbital_3d_xy", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel10", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "Popis 3D modelu...", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel1", // Opravená absolutní cesta
  },
   {
    name: "Interaktivní 3D model",
    description: "Popis 3D modelu...", // Nepovinný popis
    path: "/chemie/chemie1/3dmodely/3dmodel1", // Opravená absolutní cesta
  },
];

export default function Model3DPage() {
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
          <h1 className="text-5xl font-extrabold text-white mb-4">3D Modely</h1>
          <p className="text-lg text-gray-300 mb-6">
            Zde je seznam dostupných 3D modelů pro Chemii 1.
          </p>
        </div>

        {/* Seznam 3D modelů */}
        <div className="max-w-7xl w-full">
          {modelsData.length > 0 && (
            <h2 className="text-2xl font-bold text-left mb-4">Výsledky:</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {modelsData.map((item, index) => (
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
                      alert("3D model zatím není dostupný.");
                    }
                  }}
                >
                  Zobrazit model
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
