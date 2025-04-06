"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

interface Exercise {
  name: string;
  cover: string;
  link: string;
}

// Pole se třemi cvičeními s názvy přímo dle zadání
const exercisesData: Exercise[] = [
  {
    name: "A. Procvičovací úlohy bez možnosti opravy",
    cover: "/imgs/cover.jpg",
    link: "/ekonomika1/story.html",
  },
  {
    name: "B. Procvičovací úlohy s možností jedné opravy za 50 % bodů",
    cover: "/imgs/cover.jpg",
    link: "/Ekonomika1-druhypokus/story.html",
  },
  {
    name: "C. Procvičovací úlohy s okamžitým zobrazením správné odpovědi v případě chyby",
    cover: "/imgs/cover.jpg",
    link: "/Ekonomika1-Feedback/story.html",
  },
];

export default function EkonomikaPage() {
  const router = useRouter();

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

        {/* Nadpis */}
        <div className="max-w-4xl w-full text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">
          Ukázka procvičovacích úloh
          </h1>
          
        </div>

        {/* Grid s cvičeními */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
          {exercisesData.map((exercise, index) => (
            <div
              key={index}
              className="relative p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
            >
              {exercise.cover && (
                <img
                  src={exercise.cover}
                  alt={`${exercise.name} cover`}
                  className="w-full h-40 object-cover rounded"
                />
              )}

              <h2 className="text-xl font-bold text-white mb-2 mt-4">
                {exercise.name}
              </h2>

              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                onClick={() => window.open(exercise.link, "_blank")}
              >
                Spustit test
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
