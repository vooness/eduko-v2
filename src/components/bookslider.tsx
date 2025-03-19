"use client";

import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { BsCartPlus, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Definice typu pro knihu
type Book = {
  id: number;
  title: string;
  shortDescription: string;
  price: number;
  category: string;
  image?: string;
  series?: string; // Název série, pokud kniha patří do série
  part?: number; // Číslo dílu v sérii
  totalParts?: number; // Celkový počet dílů v sérii
  isTopProduct?: boolean; // Indikátor pro "Top produkt" (pouze pro první díl)
};

// Plný seznam 22 knih s unikátními ID a označením "Top produkt" pouze pro první díly
const books: Book[] = [
  // Písemná komunikace
  {
    id: 1,
    title: "Písemná a elektronická komunikace 1",
    shortDescription:
      "3., upravené vydání (2023) – I. Hochová. Jak efektivně psát úřední korespondence a e-maily v podnikové praxi.",
    price: 200,
    category: "Písemná komunikace",
    image: "/imgs/kniha.png",
    series: "Písemná a elektronická komunikace",
    part: 1,
    totalParts: 2,
    isTopProduct: true, // První díl série
  },
  {
    id: 2,
    title: "Písemná a elektronická komunikace 2",
    shortDescription:
      "3., upravené vydání (2024) – A. Kocourková. Rozšiřuje znalosti o moderní firemní komunikaci, včetně cvičení.",
    price: 200,
    category: "Písemná komunikace",
    image: "/imgs/kniha.png",
    series: "Písemná a elektronická komunikace",
    part: 2,
    totalParts: 2,
  },

  // Ekonomika
  {
    id: 3,
    title: "Ekonomika 1 – pro ekonomicky zaměřené obory SŠ",
    shortDescription:
      "Podnikání, majetek a zaměstnanci (10. akt. vydání, 2024). Autoři: P. Klínský, O. Münch.",
    price: 200,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
    series: "Ekonomika",
    part: 1,
    totalParts: 5,
    isTopProduct: true, // První díl série
  },
  {
    id: 4,
    title: "Ekonomika 1+2",
    shortDescription:
      "Spojuje 1. a 2. díl, 9. akt. vydání (2024). Komplexní učebnice pro střední školy, marketing a finance.",
    price: 380,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
    series: "Ekonomika",
    part: 2,
    totalParts: 5,
  },
  {
    id: 5,
    title: "Ekonomika 2",
    shortDescription:
      "Hlavní činnost, marketing a prodej (9. akt. vydání, 2024).",
    price: 200,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
    series: "Ekonomika",
    part: 3,
    totalParts: 5,
  },
  {
    id: 6,
    title: "Ekonomika 3",
    shortDescription: "Peníze a financování (8. akt. vydání, 2024).",
    price: 250,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
    series: "Ekonomika",
    part: 4,
    totalParts: 5,
  },
  {
    id: 7,
    title: "Ekonomika 4",
    shortDescription: "Řídíme stát i firmu (7. akt. vydání, 2024).",
    price: 180,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
    series: "Ekonomika",
    part: 5,
    totalParts: 5,
    isTopProduct: false, // Správně nastaveno na false
  },
  {
    id: 8,
    title: "Ekonomika pro SOU a SOŠ",
    shortDescription:
      "7., akt. vydání (2024) – J. Porvichová. Základy podnikové ekonomiky, tabulky a grafy, finanční gramotnost.",
    price: 100,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
  },
  {
    id: 9,
    title: "Ekonomika – ekonomická a finanční gramotnost",
    shortDescription:
      "15. akt. vydání (2024) – P. Klínský, O. Münch, D. Chromá.",
    price: 200,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
  },
  {
    id: 10,
    title: "Ekonomika nejen k maturitě",
    shortDescription: "10. akt. vydání (2024) – P. Klínský, O. Münch.",
    price: 400,
    category: "Ekonomika",
    image: "/imgs/kniha.png",
  },

  // Právo
  {
    id: 11,
    title: "Právo pro střední školy",
    shortDescription:
      "11., upravené vydání (2024) – R. Ryska, M. Puškinová. Základy občanského, trestního a obchodního práva.",
    price: 200,
    category: "Právo",
    image: "/imgs/kniha.png",
    series: "Právo",
    part: 1,
    totalParts: 3,
    isTopProduct: true, // První díl série
  },
  {
    id: 12,
    title: "Průvodce světem práva",
    shortDescription:
      "8. akt. vydání (2024). Objasňuje právní systém ČR pro veřejnosprávní činnost. Aktuální předpisy.",
    price: 500,
    category: "Právo",
    image: "/imgs/kniha.png",
    series: "Právo",
    part: 2,
    totalParts: 3,
  },
  {
    id: 13,
    title: "Právo a společnost",
    shortDescription:
      "5. vydání (2024) – K. Nováková. Interakce mezi právem a sociálními strukturami.",
    price: 300,
    category: "Právo",
    image: "/imgs/kniha.png",
    series: "Právo",
    part: 3,
    totalParts: 3,
  },
  {
    id: 14,
    title: "Právo mezinárodní",
    shortDescription:
      "1. vydání (2024) – D. Svoboda. Základy mezinárodního práva a jeho aplikace.",
    price: 350,
    category: "Právo",
    image: "/imgs/kniha.png",
    series: "Právo",
    part: 4,
    totalParts: 4,
    isTopProduct: false, // Správně nastaveno na false
  },

  // Biologie
  {
    id: 15,
    title: "Biologie v souvislostech 1",
    shortDescription:
      "2., doplněné vydání (2024) – P. Šíma. Moderní přístup k biologii s důrazem na ekosystémy.",
    price: 200,
    category: "Biologie",
    image: "/imgs/kniha.png",
    series: "Biologie",
    part: 1,
    totalParts: 3,
    isTopProduct: true, // První díl série
  },
  {
    id: 16,
    title: "Biologie v souvislostech 2",
    shortDescription:
      "3., doplněné vydání (2025) – P. Šíma. Pokročilé témata v biologii a ekologie.",
    price: 220,
    category: "Biologie",
    image: "/imgs/kniha.png",
    series: "Biologie",
    part: 2,
    totalParts: 3,
  },
  {
    id: 17,
    title: "Biologie v souvislostech 3",
    shortDescription:
      "4., doplněné vydání (2026) – P. Šíma. Laboratorní cvičení a projekty v biologii.",
    price: 250,
    category: "Biologie",
    image: "/imgs/kniha.png",
    series: "Biologie",
    part: 3,
    totalParts: 3,
  },
  {
    id: 18,
    title: "Základy biologie pro gymnázia",
    shortDescription: "1. vydání (2024) – P. Šíma. Novinka 2024.",
    price: 350,
    category: "Biologie",
    image: "/imgs/kniha.png",
  },

  // Chemie
  {
    id: 19,
    title: "Chemie 1",
    shortDescription:
      "Obecná a anorganická chemie (1. vydání, 2024). Novinka 2024.",
    price: 200,
    category: "Chemie",
    image: "/imgs/kniha.png",
    series: "Chemie",
    part: 1,
    totalParts: 4,
    isTopProduct: true, // První díl série
  },
  {
    id: 20,
    title: "Chemie 2",
    shortDescription:
      "Obecná a organická chemie (2. vydání, 2025). Pokračování v obecném přehledu chemie.",
    price: 220,
    category: "Chemie",
    image: "/imgs/kniha.png",
    series: "Chemie",
    part: 2,
    totalParts: 4,
  },
  {
    id: 21,
    title: "Chemie 3",
    shortDescription:
      "Fyzikální a biochemická chemie (3. vydání, 2026). Pokročilé téma v chemii.",
    price: 250,
    category: "Chemie",
    image: "/imgs/kniha.png",
    series: "Chemie",
    part: 3,
    totalParts: 4,
  },
  {
    id: 22,
    title: "Chemie praktická",
    shortDescription:
      "4. vydání (2027) – J. Dvořák. Praktické laboratoře a experimenty pro střední školy.",
    price: 220,
    category: "Chemie",
    image: "/imgs/kniha.png",
    series: "Chemie",
    part: 4,
    totalParts: 4,
  },
];

const BookSlider: React.FC = () => {
  // Kategorie filtrace
  const [selectedCategory, setSelectedCategory] = useState<string>("Vše");

  // Výběr varianty (Fyzická/Online) - výchozí na "fyzická"
  const [selectedVersions, setSelectedVersions] = useState<{
    [bookId: number]: "physical" | "online";
  }>(() => {
    const initialVersions: { [bookId: number]: "physical" | "online" } = {};
    books.forEach((book) => {
      initialVersions[book.id] = "physical"; // Výchozí na "fyzická verze"
    });
    return initialVersions;
  });

  // Množství pro každou knihu
  const [quantities, setQuantities] = useState<{ [bookId: number]: number }>(() => {
    const init: { [bookId: number]: number } = {};
    books.forEach((b) => {
      init[b.id] = 1;
    });
    return init;
  });

  // Ref for the slider
  const sliderRef = useRef<Slider>(null);

  // Reset slider to first slide when category changes
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0);
    }
  }, [selectedCategory]);

  // Filtrace knih podle kategorie
  const filteredBooks =
    selectedCategory === "Vše"
      ? books
      : books.filter((b) => b.category === selectedCategory);

  // Změna varianty
  const handleVersionChange = (bookId: number, version: "physical" | "online") => {
    setSelectedVersions((prev) => ({ ...prev, [bookId]: version }));
  };

  // Změna množství
  const handleQuantityChange = (bookId: number, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[bookId] || 1) + delta);
      return { ...prev, [bookId]: newQty };
    });
  };

  // Přidání do košíku
  const handleAddToCart = (book: Book) => {
    const version = selectedVersions[book.id] || "physical";
    const qty = quantities[book.id];
    const total = book.price * qty;

    // Příklad logování - nahraďte reálnou logikou košíku
    console.log(
      `Přidáno do košíku: ${book.title}, varianta: ${version}, počet: ${qty}, cena: ${total} Kč`
    );
  };

  // Kategorie tlačítka
  const categories = [
    "Vše",
    "Novinky",
    "Ekonomika",
    "Právo",
    "Biologie",
    "Chemie",
    "Písemná komunikace",
    "Základní škola",
    "Interaktivní učení",
    "Doprodej",
  ];

  // Funkce pro přiřazení "Top produkt" a informace o dílu
  const getTopProductLabel = (book: Book) => {
    if (book.isTopProduct) {
      if (book.series && book.part && book.totalParts) {
        return `Top produkt: ${book.part}. díl ze ${book.totalParts}`;
      }
      return "Top produkt";
    }
    return null;
  };

  // Definice Custom Arrows
  const NextArrow: React.FC<any> = (props) => {
    const { className, style, onClick, currentSlide, slideCount } = props;
    // Determine slidesToShow based on responsive settings
    let slidesToShow = 4;
    const width = window.innerWidth;
    if (width <= 640) {
      slidesToShow = 1;
    } else if (width <= 1024) {
      slidesToShow = 2;
    }

    if (currentSlide + slidesToShow >= slideCount) {
      return null;
    }

    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px", zIndex: 1 }}
        onClick={onClick}
      >
        <BsArrowRight className="text-green-600 text-2xl" />
      </div>
    );
  };

  const PrevArrow: React.FC<any> = (props) => {
    const { className, style, onClick, currentSlide } = props;
    if (currentSlide === 0) {
      return null;
    }
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
        onClick={onClick}
      >
        <BsArrowLeft className="text-green-600 text-2xl" />
      </div>
    );
  };

  // Nastavení slideru
  const settings = {
    dots: true,
    infinite: false, // Změněno na false, aby se šipky skrývaly na koncích
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
 
    responsive: [
      {
        breakpoint: 1024, // Tablet
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640, // Mobil
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section  id="Knihy" className="bg-gray-900 text-white py-8 px-4 ">
      <div className="max-w-7xl mx-auto mt-24">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-green-600">Naše knihy</h2>
        <h2 className="text-2xl sm:text-xl mb-4 text-green-600">Pro střední školy a gymnázia</h2>
        <p className="text-lg mb-6">
          Prodáváme klasické učebnice i jejich vylepšené online verze, které obsahují cvičení, zajímavé informace, mluvené slovo, interaktivní cvičení a mnoho dalších vychytávek, které neustále rozšiřujeme. Podívejte se na naše učebnice pro střední školy a gymnázia. Najdete zde
          kvalitní vzdělávací materiály, které vám pomohou v učení.
        </p>

        

        {/* Kategorie tlačítka */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center lg:justify-start">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full border-2 transition focus:outline-none ${
                selectedCategory === cat
                  ? "bg-green-600 border-green-600 text-white"
                  : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Slider knih */}
        <Slider ref={sliderRef} {...settings}>
          {filteredBooks.map((book) => {
            const qty = quantities[book.id];
            const totalPrice = book.price * qty;
            const isOnline = selectedVersions[book.id] === "online";
            const topProductLabel = getTopProductLabel(book);

            return (
              <div key={book.id} className="p-3">
                {/* Karta knihy */}
                <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-[580px] flex flex-col relative">
                  {/* Označení "Top produkt" */}
                  {topProductLabel && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                      {topProductLabel}
                    </span>
                  )}

                  {/* Obrázek knihy */}
                  {book.image && (
                    <div className="h-[200px] w-full mb-3 flex items-center justify-center">
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full object-contain"
                      />
                    </div>
                  )}

                  {/* Název a popis knihy */}
                  <div className="mb-3 flex-grow overflow-hidden">
                    <h3 className="text-lg font-semibold text-green-600 mb-1">
                      {book.title}
                    </h3>
                    <div className="h-[80px] overflow-hidden">
                      <p className="text-sm text-gray-200 leading-snug">
                        {book.shortDescription}
                      </p>
                    </div>
                  </div>

                  {/* Výběr varianty */}
                  <div className="mb-3 p-2 rounded-md bg-gray-700/50">
                    <h4 className="text-sm font-medium text-gray-200 mb-2">Vybrat variantu</h4>
                    <div className="flex items-center space-x-4">
                      {/* Fyzická verze */}
                      <label
                        className={`flex items-center text-sm cursor-pointer p-2 rounded-md ${
                          selectedVersions[book.id] === "physical"
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`version-${book.id}`}
                          value="physical"
                          checked={selectedVersions[book.id] === "physical"}
                          onChange={() => handleVersionChange(book.id, "physical")}
                          className="hidden" // Skryje samotný radio input
                        />
                        <span>Koupit učebnici</span>
                      </label>

                      {/* Online verze */}
                      <label
                        className={`flex items-center text-sm cursor-pointer p-2 rounded-md ${
                          selectedVersions[book.id] === "online"
                            ? "bg-green-600 text-white"
                            : "bg-gray-600 text-gray-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`version-${book.id}`}
                          value="online"
                          checked={selectedVersions[book.id] === "online"}
                          onChange={() => handleVersionChange(book.id, "online")}
                          className="hidden" // Skryje samotný radio input
                        />
                        <span>Online verze</span>
                      </label>
                    </div>
                  </div>

                  {/* Cena, množství a tlačítko "Přidat do košíku" */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-white">
                        {totalPrice} Kč
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(book.id, -1)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                        >
                          –
                        </button>
                        <span className="font-semibold text-lg">{qty}</span>
                        <button
                          onClick={() => handleQuantityChange(book.id, 1)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Tlačítko "Přidat do košíku" mění barvu a text podle varianty */}
                    <button
                      onClick={() => handleAddToCart(book)}
                      className={`w-full text-white py-2 px-4 transition flex items-center justify-center rounded ${
                        isOnline
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <BsCartPlus className="mr-1" />
                      {isOnline ? "Online verze - Flexibook" : "Přidat do košíku"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>

        {/* Zpráva, pokud nejsou žádné knihy ve vybrané kategorii */}
        {filteredBooks.length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            Zatím zde nejsou žádné knihy v této kategorii.
          </p>
        )}
      </div>
    </section>
  );
};

export default BookSlider;
