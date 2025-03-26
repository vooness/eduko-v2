"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SchoolIcon from "@mui/icons-material/School";

// Definice typů
interface Subject {
  name: string;
  link: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const mainSubjects: Subject[] = [
    {
      name: "KOMUNIKACE",
      link: "/InteraktivniCviceni/Komunikace",
    },
    {
      name: "EKONOMIKA",
      link: "/InteraktivniCviceni/Ekonomika",
    },
    {
      name: "PRÁVO",
      link: "/InteraktivniCviceni/Pravo",
    },
    {
      name: "BIOLOGIE",
      link: "/InteraktivniCviceni/Biologie",
    },
    {
      name: "CHEMIE",
      link: "/InteraktivniCviceni/Chemie",
    },
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
        isScrolled ? "bg-white shadow-md text-green-900" : "bg-transparent text-white"
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
                  href={subject.link}
                  className="relative transition-all duration-300 group-hover:text-green-600 flex items-center"
                >
                  {subject.name}
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile Icon */}
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
                  <a
                    href={subject.link}
                    className="block w-full text-left py-2 px-4 text-lg font-semibold hover:bg-green-500 rounded transition-colors"
                  >
                    {subject.name}
                  </a>
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
