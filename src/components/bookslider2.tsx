"use client"

import React, { useState, useRef, useEffect } from "react"
import Slider from "react-slick"
import { BsCartPlus } from "react-icons/bs"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Typ pro produkty
type EduMaterial = {
  id: number
  title: string
  description: string
  price: number
  category: string
  image?: string
}

// Data pro elektronické materiály EDUKO
const eduMaterials: EduMaterial[] = [
  {
    id: 1,
    title: "Ekonomika pro ekonomické obory SŠ – e-EDUKO",
    description: "Školní rok 2024/25 Prezentace, aktuality a řešení úloh.",
    price: 1500,
    category: "Ekonomika",
    image: "/imgs/podpora1.png",
  },
  {
    id: 2,
    title: "Ekonomika nejen k maturitě – e-EDUKO",
    description: "Školní rok 2024/25 Prezentace, aktuality a řešení úloh.",
    price: 1500,
    category: "Ekonomika",
    image: "/imgs/podpora1.png",
  },
  {
    id: 3,
    title: "Ekonomická a finanční gramotnost – e-EDUKO",
    description: "Školní rok 2024/25 Prezentace, aktuality a řešení úloh.",
    price: 1500,
    category: "Finanční gramotnost",
    image: "/imgs/podpora1.png",
  },
  {
    id: 4,
    title: "Právo – e-EDUKO",
    description: "Školní rok 2024/25 Videa, řešení úloh, prezentace.",
    price: 100,
    category: "Právo",
    image: "/imgs/podpora1.png",
  },
  {
    id: 5,
    title: "Základy statistiky pro OA – e-EDUKO",
    description: "Základní výklad, postupy řešení v Excelu, rozšiřující učivo.",
    price: 500,
    category: "Statistika",
    image: "/imgs/podpora1.png",
  },
  {
    id: 6,
    title: "Biologie pro gymnázia – e-EDUKO",
    description: "Školní rok 2024/25 ŘEŠENÍ ÚLOH.",
    price: 400,
    category: "Biologie",
    image: "/imgs/podpora1.png",
  },
  {
    id: 7,
    title: "Právo informačních technologií",
    description: "Videozáznam semináře. Platnost přístupu 2 roky.",
    price: 700,
    category: "Právo",
    image: "/imgs/podpora1.png",
  },
  {
    id: 8,
    title: "Pracovní právo",
    description: "Videozáznam semináře. Platnost přístupu 2 roky.",
    price: 300,
    category: "Právo",
    image: "/imgs/podpora1.png",
  },
]

const EdukoSlider: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Vše")
  const sliderRef = useRef<Slider | null>(null)

  // Množství pro každý produkt
  const [quantities, setQuantities] = useState<{ [materialId: number]: number }>(() => {
    const init: { [materialId: number]: number } = {}
    eduMaterials.forEach((material) => {
      init[material.id] = 1
    })
    return init
  })

  // Filtrace materiálů podle kategorie
  const filteredMaterials =
    selectedCategory === "Vše"
      ? eduMaterials
      : eduMaterials.filter((material) => material.category === selectedCategory)

  // Změna množství
  const handleQuantityChange = (materialId: number, delta: number) => {
    setQuantities((prev) => {
      const newQty = Math.max(1, (prev[materialId] || 1) + delta)
      return { ...prev, [materialId]: newQty }
    })
  }

  // Přidání do košíku
  const handleAddToCart = (material: EduMaterial) => {
    const qty = quantities[material.id]
    const total = material.price * qty
    console.log(`Přidáno do košíku: ${material.title}, počet: ${qty}, cena: ${total} Kč`)
  }

  // Nastavení slideru
  const settings = {
    dots: true,
    infinite: false, // Prevent looping to avoid UI bugs
    speed: 500,
    slidesToShow: 4, // Počet viditelných karet
    slidesToScroll: 1, // Počet karet, které se posunou
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
  }

  // Zajištění re-renderu slideru při změně kategorie
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(0) // Resetuje slider na začátek
    }
  }, [filteredMaterials])

  const categories = [
    "Vše",
    ...Array.from(new Set(eduMaterials.map((material) => material.category))),
  ]

  return (
    <section className="bg-gray-900 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">

      <h3 className="text-3xl font-semibold text-green-600 mb-2">
          Video návod: Jak aktivovat online knihu
        </h3>
        <p className="text-gray-200 mb-12">
          Sledujte následující video, kde se dozvíte, jak snadno aktivovat vaši
          online knihu.
        </p>
        <h2 className="text-4xl font-bold mb-4 text-green-600">
          Elektronické výukové materiály EDUKO
        </h2>
        <p className="text-lg mb-6">
          Prohlédněte si naše moderní elektronické vzdělávací materiály. Nabízíme širokou škálu produktů přizpůsobených
          pro potřeby studentů i učitelů. 
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

        {/* Slider produktů */}
        <Slider {...settings} ref={sliderRef}>
          {filteredMaterials.map((material) => (
            <div key={material.id} className="p-2">
              <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col h-[450px]">
                {/* Obrázek produktu */}
                {material.image && (
                  <div className="h-[200px] w-full mb-3 flex items-center justify-center">
                    <img
                      src={material.image}
                      alt={material.title}
                      className="h-full object-contain"
                    />
                  </div>
                )}
                {/* Název a popis produktu */}
                <div className="mb-3 flex-grow overflow-hidden">
                  <h3 className="text-lg font-semibold text-green-600 mb-1">
                    {material.title}
                  </h3>
                  <p className="text-sm text-gray-200 leading-snug">{material.description}</p>
                </div>
                {/* Cena, množství a tlačítko "Přidat do košíku" */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-white">{material.price} Kč</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(material.id, -1)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        –
                      </button>
                      <span className="font-semibold text-lg">{quantities[material.id]}</span>
                      <button
                        onClick={() => handleQuantityChange(material.id, 1)}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(material)}
                    className="w-full text-white py-2 px-4 transition flex items-center justify-center rounded bg-green-600 hover:bg-green-700"
                  >
                    <BsCartPlus className="mr-1" />
                    Přidat do košíku
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Zpráva, pokud nejsou žádné produkty ve vybrané kategorii */}
        {filteredMaterials.length === 0 && (
          <p className="mt-6 text-center text-gray-400">
            Zatím zde nejsou žádné materiály v této kategorii.
          </p>
        )}
      </div>
    </section>
  )
}

export default EdukoSlider
