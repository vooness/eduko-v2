"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Script from "next/script";

export default function BiologieUkol2Page() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hlavní obsah */}
      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        <div className="max-w-4xl w-full text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">Biologie - Úkol 2</h1>
          <p className="text-lg text-gray-300 mb-6">
            Tento úkol je připraven pomocí H5P a je plně interaktivní. Zkuste si jej a procvičte své znalosti z biologie.
          </p>
        </div>

        {/* H5P Interaktivní Úkol */}
        <div className="w-full max-w-3xl bg-white rounded shadow-lg p-6">
          <iframe
            src="https://i-eduko.h5p.com/content/1292493719147939277/embed"
            aria-label="Biologie Úkol 2"
            width="100%"
            height="637"
            frameBorder="0"
            allowFullScreen={true}
            allow="autoplay *; geolocation *; microphone *; camera *; midi *; encrypted-media *"
            title="Biologie Úkol 2"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <Footer />

      {/* Dynamické načtení skriptu */}
      <Script src="https://i-eduko.h5p.com/js/h5p-resizer.js" strategy="lazyOnload" charSet="UTF-8" />
    </div>
  );
}
