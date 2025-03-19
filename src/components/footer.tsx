import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-white py-10 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid - multiple columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About us */}
          <div className="relative">
            {/* Owl for MOBILE (centered, bigger, above text) */}
            <div className="sm:hidden flex justify-center mb-4">
              <img
                src="/imgs/owl.png"
                alt="Owl"
                className="w-64 h-auto"
              />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-3">O EDUKO</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Nabízíme moderní řešení pro učitele, studenty i instituce –
              učebnice, semináře a elektronické výukové materiály.
            </p>

            {/* Owl for DESKTOP (shifted more to the left, larger) */}
            <img
              src="/imgs/owl.png"
              alt="Owl"
              className="hidden sm:block absolute top-0 left-[-250px] w-64 h-auto transform -translate-y-1/3"
            />
          </div>

          {/* Column 2: Quick links */}
          <div>
            <h3 className="text-xl font-bold mb-3">Rychlá navigace</h3>
            <ul className="space-y-2">
              <li>
                <a href="/nase-knihy" className="hover:text-[#10B981] transition">
                  Naše knihy
                </a>
              </li>
              <li>
                <a href="/seminare" className="hover:text-[#10B981] transition">
                  Semináře
                </a>
              </li>
              <li>
                <a href="/informace" className="hover:text-[#10B981] transition">
                  Informace
                </a>
              </li>
              <li>
                <a href="/kontakt" className="hover:text-[#10B981] transition">
                  Kontakt
                </a>
              </li>
              <li>
                <a href="/e-eduko" className="hover:text-[#10B981] transition">
                  e-EDUKO
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div>
            <h3 className="text-xl font-bold mb-3">Kontakty</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <FaPhone className="text-[#10B981]" />
                <span>Tel.: 774 754 567, 216 216 501</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-[#10B981]" />
                <a
                  href="mailto:eduko@eduko.cz"
                  className="hover:text-[#10B981] transition"
                >
                  eduko@eduko.cz
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#10B981]" />
                <span>Ulice 123, 110 00 Praha</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div>
            <h3 className="text-xl font-bold mb-3">Sledujte nás</h3>
            <p className="text-sm text-gray-300 mb-3">
              Připojte se k nám na sociálních sítích
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#10B981] transition"
              >
                <FaFacebookF size={20} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#10B981] transition"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#10B981] transition"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#10B981] transition"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom row */}
        <div className="mt-8 border-t border-gray-700 pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">
            © 2024 EDUKO nakladatelství, s. r. o.
          </p>
          <p className="text-sm text-gray-400">
            Vyrobil{" "}
            <a
              href="https://flexisystems.cz"
              className="hover:text-[#10B981] transition"
            >
              FlexiSystems s.r.o.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
