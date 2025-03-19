"use client";

import { useRouter } from "next/navigation";

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Přístup zamítnut</h1>
      <p className="text-lg text-gray-300 mb-8">
        Na tento web se můžete dostat pouze prostřednictvím speciálního odkazu.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-all"
      >
        Zpět na hlavní stránku
      </button>
    </div>
  );
}
