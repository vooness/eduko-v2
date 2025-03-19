"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";

// Definice typů
interface Chapter {
  range: string;
}

interface Year {
  chapters: Chapter[];
}

interface Subject {
  name: string;
  years: {
    [key: number]: string[];
  };
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const mainSubjects: Subject[] = [
    {
      name: "ÚČETNICTVÍ",
      years: {
        1: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        2: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        3: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        4: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"]
      }
    },
    {
      name: "EKONOMIKA",
      years: {
        1: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        2: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        3: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        4: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"]
      }
    },
    {
      name: "PRÁVO",
      years: {
        1: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        2: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        3: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        4: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"]
      }
    },
    {
      name: "MARKETING",
      years: {
        1: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        2: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        3: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"],
        4: ["1-20", "21-40", "41-60", "61-80", "81-100", "101-120", "121-140"]
      }
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    hidden: {
      y: "-100%",
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
    exit: {
      y: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md text-green-900"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text"
        >
          <SchoolIcon className="mr-2 text-green-500" fontSize="large" />
          I-EDUKO
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex items-center gap-8">
            {mainSubjects.map((subject, index) => (
              <li key={index} className="relative group">
                <a
                  href="#"
                  className="relative transition-all duration-300 group-hover:text-green-600 flex items-center"
                >
                  {subject.name}
                  <span className="ml-1">▼</span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full" />
                </a>

                {/* Ročníky submenu */}
                <div className="absolute left-0 top-full bg-white text-green-900 rounded shadow-lg py-2 
                             opacity-0 translate-y-1 pointer-events-none 
                             group-hover:opacity-100 group-hover:translate-y-0 
                             group-hover:pointer-events-auto transition-all 
                             duration-300 z-50 min-w-[160px]">
                  {Object.entries(subject.years).map(([year, chapters]) => (
                    <div key={year} className="relative group/year">
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-green-100 justify-between items-center"
                      >
                        {year}. ročník
                        <span className="ml-2">▶</span>
                      </a>

                      {/* Kapitoly submenu */}
                      <div className="absolute left-full top-0 bg-white text-green-900 rounded shadow-lg py-2 
                                   opacity-0 translate-x-1 pointer-events-none 
                                   group-hover/year:opacity-100 group-hover/year:translate-x-0 
                                   group-hover/year:pointer-events-auto transition-all 
                                   duration-300 min-w-[180px]">
                        {chapters.map((kapitola, kIndex) => (
                          <a
                            key={kIndex}
                            href={`/InteraktivniCviceni/${subject.name}/Rocnik-${year}/Kapitoly-${kapitola}`}
                            className="block px-4 py-2 hover:bg-green-100"
                          >
                            Kapitoly {kapitola}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Icons */}
        <div className="flex items-center lg:hidden space-x-4">
          <motion.button
            className="text-2xl focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? "×" : "☰"}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-green-600 to-green-500 text-white"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="pt-20 px-6">
              {mainSubjects.map((subject, index) => (
                <div key={index} className="mb-6">
                  <button
                    onClick={() => setSelectedSubject(selectedSubject === subject.name ? null : subject.name)}
                    className="w-full text-left py-2 px-4 text-lg font-semibold hover:bg-green-500 rounded transition-colors"
                  >
                    {subject.name}
                  </button>
                  
                  {selectedSubject === subject.name && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-4 mt-2"
                    >
                      {Object.entries(subject.years).map(([year, chapters]) => (
                        <div key={year} className="mb-2">
                          <button
                            onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                            className="w-full text-left py-2 px-4 hover:bg-green-500 rounded transition-colors"
                          >
                            {year}. ročník
                          </button>
                          
                          {selectedYear === year && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-4 mt-1"
                            >
                              {chapters.map((kapitola, kIndex) => (
                                <a
                                  key={kIndex}
                                  href={`/InteraktivniCviceni/${subject.name}/Rocnik-${year}/Kapitoly-${kapitola}`}
                                  className="block py-2 px-4 text-sm hover:bg-green-500 rounded transition-colors"
                                >
                                  Kapitoly {kapitola}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-3xl"
              aria-label="Close menu"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;