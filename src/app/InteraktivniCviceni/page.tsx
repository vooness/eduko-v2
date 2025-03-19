import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import InteraktivniCviceniContent from "@/components/InteraktivniCviceniContent";

export default function InteraktivniCviceniPage() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex-grow mt-28 mb-28">
        <InteraktivniCviceniContent />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
