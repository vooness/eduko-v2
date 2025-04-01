"use client";

import React, { useRef } from "react";

const AnimationPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#000",
    position: "relative",
  };

  const videoStyle: React.CSSProperties = {
    width: "90%",
    maxWidth: "600px",
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "20px",
    zIndex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#fff",
    transition: "background-color 0.3s ease",
  };

  const handleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleFullScreen}
        style={buttonStyle}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)")
        }
        aria-label="Fullscreen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          style={{ width: "20px", height: "20px" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2
               M16 4h2a2 2 0 012 2v2
               M16 20h2a2 2 0 002-2v-2"
          />
        </svg>
        <span style={{ fontSize: "14px" }}>zvětšit na fullscreen</span>
      </button>

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        style={videoStyle}
      >
        <source src="/Animace/testchemie.mp4" type="video/mp4" />
        Váš prohlížeč nepodporuje přehrávání videa.
      </video>
    </div>
  );
};

export default AnimationPage;
