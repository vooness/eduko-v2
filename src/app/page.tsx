"use client"

import Navbar from "@/components/navbar";
import Index from "@/components/index";
import Footer from "@/components/footer";
import BookSlider from "@/components/bookslider";
import EdukoSlider from "@/components/bookslider2";
import AboutEdukoSection from "@/components/AboutEdukoSection";
import TeachingMaterials from "@/components/TeachingMaterials";
import ChatWidget from "@/components/ChatWidget"; // <-- Import ChatWidget

export default function Home() {
  return (
    <div className="bg-[#064E3B] text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content area */}
      <div className="flex-grow">
        <Index />
        
      </div>

      

      {/* Footer */}
      <Footer />

      {/* Chat Widget (vpravo dole) */}
      <ChatWidget />
    </div>
  );
}
