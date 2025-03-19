"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaArrowDown } from "react-icons/fa";

const InfoSection = () => {
  return (
    <section className="bg-gray-900 text-white py-12 sm:py-20 lg:py-28 px-6 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">

        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl font-extrabold text-green-600 mb-6 text-center">
          Elektronické výukové materiály
        </h2>

        {/* Top Description */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-base sm:text-lg text-gray-300 mb-4">
            Ve školním roce 2024/2025 jsme pro vás, stejně jako v předchozích
            letech, připravili kromě tištěných učebnic i elektronické výukové
            materiály.
          </p>
        </motion.div>

        {/* 2-Column Layout: Each column has a heading box + link + short description + image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* LEFT COLUMN: ONLINE UČEBNICE + Flexibooks */}
          <div className="flex flex-col">
            {/* ONLINE UČEBNICE Box */}
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                Online učebnice najdete zde
              </h2>
              <div className="bg-gray-700 px-4 py-2 rounded-md mb-3">
                PRO UČITELE A STUDENTY
              </div>
              <p className="text-gray-300 mb-2">Online verze tištěných knih</p>
              <p className="text-base font-semibold text-green-600 mb-8">
                Nyní můžete se všemi učebnicemi <br />
                pracovat ONLINE i OFFLINE
              </p>
              <FaArrowDown className="text-green-600 text-2xl mb-2" />
            </div>

            {/* Flexibooks Link + Short Description + Image */}
            <div className="mt-6 flex flex-col items-center">
              <a
                href="https://flexibooks.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 text-lg font-semibold hover:text-green-300 mb-2"
              >
                https://flexibooks.cz →
              </a>
              <p className="text-gray-300 text-center mb-4 max-w-md">
                FlexiBooks je online knihovna, kde si můžete číst všechny naše 
                učebnice a pracovat s nimi dokonce i v offline režimu.
              </p>
              <a
                href="https://flexibooks.cz"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:max-w-md"
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  src="/imgs/ctecka1.jpg"
                  alt="Náhled učebnic"
                  className="w-full rounded shadow hover:shadow-lg transition-all duration-200"
                />
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: e-Eduko + Portal Image */}
          <div className="flex flex-col">
            {/* e-Eduko Box */}
            <div className="bg-gray-800 rounded-lg p-6 text-center shadow-lg flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-2 text-green-600">
                Elektronická podpora e-Eduko
              </h2>
              <div className="bg-gray-700 px-4 py-2 rounded-md mb-3">
                PRO UČITELE
              </div>
              <ul className="text-gray-300 mb-4 leading-6">
                <li> - Řešení úloh z učebnic</li>
                <li> - Prezentace (ekonomika, právo)</li>
                <li> - Procvičování a testy (právo)</li>
                <li> - Materiály ze seminářů</li>
              </ul>
              <FaArrowDown className="text-green-600 text-2xl mb-2" />
            </div>

            {/* e-Eduko Link + Short Description + Image */}
            <div className="mt-6 flex flex-col items-center">
              <a
                href="https://eduko.elmg.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 text-lg font-semibold hover:text-green-300 mb-2"
              >
                https://eduko.elmg.net →
              </a>
              <p className="text-gray-300 text-center mb-4 max-w-md">
                e-Eduko vám umožní přístup k interaktivním testům, prezentacím 
                a materiálům pro  výuku.
              </p>
              <a
                href="https://eduko.elmg.net"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:max-w-md"
              >
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  src="/imgs/ctecka2.jpg"
                  alt="Náhled e-EDUKO"
                  className="w-full rounded shadow hover:shadow-lg transition-all duration-200"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfoSection;
