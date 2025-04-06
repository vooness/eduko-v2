import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Horizontální navigace */}
        <nav className="flex space-x-4 justify-center mb-4">
          <a href="/komunikace" className="hover:text-[#10B981] transition">
            KOMUNIKACE
          </a>
          <a href="/ekonomika" className="hover:text-[#10B981] transition">
            EKONOMIKA
          </a>
          <a href="/pravo" className="hover:text-[#10B981] transition">
            PRÁVO
          </a>
          <a href="/biologie" className="hover:text-[#10B981] transition">
            BIOLOGIE
          </a>
          <a href="/chemie" className="hover:text-[#10B981] transition">
            CHEMIE
          </a>
        </nav>

        {/* Texty pod čarou */}
        <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2024 EDUKO nakladatelství, s. r. o.
          </p>
          <p className="text-sm text-gray-400">Vyrobil Le Artist</p>
        </div>

        {/* Další řádek s textem uprostřed */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">Všechna práva vyhrazena</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
