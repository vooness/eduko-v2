"use client";

import React from "react";

const TextbooksOverviewSection = () => {
  return (
    <section className="bg-gray-900 text-white py-12 sm:py-20 px-6 sm:px-8 lg:px-20">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section Title */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-green-600 mb-4">
            O naších učebnicích
          </h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Nakladatelství EDUKO vzniklo v roce 2008 s cílem vydávat moderní
            učebnice pro střední školy a poskytovat učitelům kvalitní servis –
            včetně pravidelných aktualizací, online verzí, akreditovaných
            seminářů a elektronické podpory e‑EDUKO.
          </p>
        </div>

        {/* UČEBNICE EKONOMIKY */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Učebnice Ekonomiky
          </h3>
          <p className="text-gray-300 mb-3">
            Pro různé typy středních škol, od ekonomických oborů až po
            neekonomické zaměření. Často aktualizované a dostupné i online.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 pl-4">
            <li>
              <strong>Ekonomika pro ekonomicky zaměřené obory</strong> (1–4 i
              sloučená 1+2) – moderní řada, zahrnuje cvičení v tištěných verzích.
            </li>
            <li>
              <strong>Ekonomika nejen k maturitě</strong> – stručné, přehledné
              shrnutí s prostorem pro vlastní metody výuky.
            </li>
            <li>
              <strong>Ekonomika – ekonomická a finanční gramotnost</strong> –
              vhodná pro školy s menší dotací ekonomiky (cca 3 hodiny týdně).
            </li>
            <li>
              <strong>Ekonomika pro SOU a SOŠ</strong> – přístupná forma výkladu
              (komunikace učitele a studentů).
            </li>
            <li>
              <strong>Ekonomika pro gymnázia</strong> – pouze online verze
              (vydání 2019).
            </li>
          </ul>
        </div>

        {/* UČEBNICE PRÁVA */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Učebnice Práva
          </h3>
          <p className="text-gray-300 mb-3">
            Pro střední školy i specializované obory. Učebnice vycházejí
            pravidelně v nových vydáních a reflektují aktuální změny v právu.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 pl-4">
            <li>
              <strong>Právo pro střední školy</strong> – tradiční učebnice (11.
              vydání v r. 2024) pro 2–4hodinovou dotaci.
            </li>
            <li>
              <strong>Průvodce světem práva</strong> pro obor Veřejnosprávní
              činnost – podrobný výklad pro vybrané střední školy a VOŠ.
            </li>
            <li>
              <strong>Průvodce světem práva</strong> pro obor Bezpečnostně
              právní činnost – navíc rozšířená kapitola Trestní právo.
            </li>
            <li>
              <strong>Trestní právo</strong> – doplněk k základní učebnici pro
              Bezpečnostně právní činnost (lze zakoupit samostatně).
            </li>
          </ul>
        </div>

        {/* UČEBNICE PÍSEMNÉ A ELEKTRONICKÉ KOMUNIKACE */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Učebnice Písemné a Elektronické Komunikace
          </h3>
          <p className="text-gray-300 mb-3">
            Naučte se efektivně komunikovat písemně, psát všemi deseti a
            zvládat obchodní i úřední korespondenci.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 pl-4">
            <li>
              <strong>PEK 1 – Desetiprstová hmatová metoda</strong> – obecná
              pravidla a postupy psaní, základy MS Word a typografie.
            </li>
            <li>
              <strong>PEK 2 – Obchodní, úřední a jiná korespondence</strong> –
              formální i obsahové náležitosti elektronických i tištěných
              dokumentů.
            </li>
          </ul>
        </div>

        {/* UČEBNICE BIOLOGIE A CHEMIE */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Učebnice Biologie a Chemie
          </h3>
          <p className="text-gray-300 mb-3">
            Moderní pojetí vědních oborů pro gymnázia a SOŠ, s důrazem
            na souvislosti i praktickou aplikaci poznatků.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 pl-4">
            <li>
              <strong>Biologie v souvislostech 1</strong> – od obecné biologie po
              botaniku a zoologii. Určeno pro gymnázia a přírodovědná lycea.
            </li>
            <li>
              <strong>Základy biologie pro gymnázia</strong> – základní rozsah
              středoškolského učiva.
            </li>
            <li>
              <strong>Chemie 1 – Obecná a anorganická chemie</strong> –
              novodobý výklad pro čtyřletá gymnázia.
            </li>
            <li>
              <strong>Chemie pro SOŠ nechemického zaměření</strong> – přehled
              pro předměty v oblasti Přírodovědné vzdělávání.
            </li>
          </ul>
        </div>

        {/* PRACOVNÍ SEŠITY PRO PŘEDŠKOLÁKY */}
        <div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">
            Pracovní sešity pro předškoláky
          </h3>
          <p className="text-gray-300 mb-3">
            Zábavné publikace pro zvídavé děti 4–8 let, učitele MŠ a 1. stupně
            ZŠ i rodiče a vedoucí kroužků. Rozvíjejí logiku, kreativitu a chuť
            objevovat.
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-300 pl-4">
            <li>
              <strong>Na stopě záhad – fyzikální pokusy</strong> s úlohami.
            </li>
            <li>
              <strong>Na stopě záhad – chemické pokusy</strong> s úlohami.
            </li>
            <li>
              <strong>Hrajeme si s písmenky</strong> – velkými i malými,
              tiskacími i psacími.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TextbooksOverviewSection;
