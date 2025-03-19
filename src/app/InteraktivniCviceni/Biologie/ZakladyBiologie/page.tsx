"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

export default function ZakladyBiologie() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko Zpět */}
        <div className="w-full max-w-7xl mb-6">
          <button
            onClick={() => router.push("/InteraktivniCviceni/Biologie")}
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

        {/* H5P obsah */}
        <div className="flex justify-center items-center">
          <iframe
            src="https://h5p.org/h5p/embed/611"
            width="1090"
            height="555"
            frameBorder="0"
            allowFullScreen
            allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
            title="Fill in the Blanks"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
