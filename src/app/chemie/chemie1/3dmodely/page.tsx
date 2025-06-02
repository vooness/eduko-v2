"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

const modelsData = [   
  {     
    name: "Interaktivní 3D model",     
    description: "Popis 3D modelu...", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/3dmodel1", // Opravená absolutní cesta   
  },   
  {     
    name: "Interaktivní 3D model",     
    description: "s019 2.1_oxid uhličitý kalot", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s019_2.1_oxid_uhlicity_kalot", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.1.1_Orbital_1s", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.1.1_Orbital_1s", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.1.2_Orbital_2s", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.1.2_Orbital_2s", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.1.3_Orbital_3s", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.1.3_Orbital_3s", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.2.1_Orbital_2p_y", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.2.1_Orbital_2p_y", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.2.2_Orbital_2p_z", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.2.2_Orbital_2p_z", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.2.3_Orbital_2p_x", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.2.3_Orbital_2p_x", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.2.4_podslupka_2p", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.2.4_podslupka_2p", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.3.1_Orbital_3d_xy", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.1_Orbital_3d_xy", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035_3.2.3.2_Orbital_3d_xz", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.2_Orbital_3d_xz", // Opravená absolutní cesta   
  },    
  {     
    name: "Interaktivní 3D model",     
    description: "s035_3.2.3.3_Orbital_3d_z2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.3_Orbital_3d_z2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.3.4_Orbital_3d_yz", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.4_Orbital_3d_yz", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.3.5_Orbital_3d_x2_y2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.5_Orbital_3d_x2_y2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.3.6_podslupka_3d", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.3.6_podslupka_3d", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.4.1_orbital_4f_-3", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.4.1_orbital_4f_-3", // Opravená absolutní cesta   
  },
 
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.4.5_orbital_4f_1", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.4.5_orbital_4f_1", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.4.6_orbital_4f_2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.4.6_orbital_4f_2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.4.7_orbital_4f_3", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.4.7_orbital_4f_3", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s035 3.2.4.8_podslupka_4f", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s035_3.2.4.8_podslupka_4f", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s046 4.01_krystalova_mrizka", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s046_4.01_krystalova_mrizka", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.2.0_tvar_linearni_A", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.2.0_tvar_linearni_A", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.3.0_tvar_trigonalni", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.3.0_tvar_trigonalni", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.3.1_tvar_lomeny_A", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.3.1_tvar_lomeny_A", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.4.0_tvar_tetraedr", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.4.0_tvar_tetraedr", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.4.1_tvar_trigonalni_pyramida", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.4.1_tvar_trigonalni_pyramida", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s048 4.02.4.2_tvar_lomeny_B", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s048_4.02.4.2_tvar_lomeny_B", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.5.0_tvar_trigonalni_bipyramida", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.5.0_tvar_trigonalni_bipyramida", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.5.1_tvar_houpacka", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.5.1_tvar_houpacka", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.5.2_tvar_T", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.5.2_tvar_T", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.5.3_tvar_linearni_B", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.5.3_tvar_linearni_B", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.6.0_tvar_oktaedr", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.6.0_tvar_oktaedr", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.6.1_tvar_tetragonalni_pyramida", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.6.1_tvar_tetragonalni_pyramida", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s049 4.02.6.2_tvar_tetragonalni", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s049_4.02.6.2_tvar_tetragonalni", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s053 4.03a_prekryv_s-s", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s053_4.03a_prekryv_s-s", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s053 4.03b_prekryv_s-p", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s053_4.03b_prekryv_s-p", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s053 4.03c_prekryv_sp-s", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s053_4.03c_prekryv_sp-s", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s054 4.04_voda", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s054_4.04_voda", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s054 4.05.1_prekryv_p-p", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s054_4.05.1_prekryv_p-p", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s054 4.05.2_prekryv_pi", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s054_4.05.2_prekryv_pi", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s054 4.06.2_vazba_CO2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s054_4.06.2_vazba_CO2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s055 4.07_dusik", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s055_4.07_dusik", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s057 4.10_struktura_diamantu2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s057_4.10_struktura_diamantu2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s058 4.11_struktura_ledu", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s058_4.11_struktura_ledu", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s058 4.12_struktura_grafitu2", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s058_4.12_struktura_grafitu2", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s096 6.04_Alkalicka_baterie", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s096_6.04_Alkalicka_baterie", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s104 7.01_graf_atom_polomery", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s104_7.01_graf_atom_polomery", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s105 7.02_graf_atom_ion_energie", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s105_7.02_graf_atom_ion_energie", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s117 8.01_dikyslik_a_ozon", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s117_8.01_dikyslik_a_ozon", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s119 8.02_molekula_vody", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s119_8.02_molekula_vody", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s120 8.03_peroxid_vodiku", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s120_8.03_peroxid_vodiku", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s122 8.04_sira_8", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s122_8.04_sira_8", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s129 8.05_kyselina_dusicna", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s129_8.05_kyselina_dusicna", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s129 8.06_bily_fosfor", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s129_8.06_bily_fosfor", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s131 8.07_fulleren", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s131_8.07_fulleren", // Opravená absolutní cesta   
  },
  {     
    name: "Interaktivní 3D model",     
    description: "s137 kremicitany", // Nepovinný popis     
    path: "/chemie/chemie1/3dmodely/s137_kremicitany", // Opravená absolutní cesta   
  }
];

export default function Model3DPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hlavní obsah */}
      <div className="flex-grow p-6 flex flex-col items-center mt-28 mb-28">
        {/* Tlačítko Zpět */}
        <div className="w-full max-w-7xl mb-6">
          <button
            onClick={() => router.back()}
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

        {/* Nadpis a popis */}
        <div className="max-w-4xl w-full text-center mb-10">
          <h1 className="text-5xl font-extrabold text-white mb-4">3D Modely</h1>
          <p className="text-lg text-gray-300 mb-6">
            Zde je seznam dostupných 3D modelů pro Chemii 1.
          </p>
        </div>

        {/* Seznam 3D modelů */}
        <div className="max-w-7xl w-full">
          {modelsData.length > 0 && (
            <h2 className="text-2xl font-bold text-left mb-4">Výsledky:</h2>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {modelsData.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-gray-800 rounded-xl shadow-lg text-center hover:shadow-2xl transition-shadow"
              >
                <h2 className="text-2xl font-bold text-white mb-2 mt-4">{item.name}</h2>
                {item.description && (
                  <p className="text-gray-300 mb-4">{item.description}</p>
                )}
                <button
                  className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (item.path) {
                      window.open(item.path, "_blank");
                    } else {
                      alert("3D model zatím není dostupný.");
                    }
                  }}
                >
                  Zobrazit model
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}