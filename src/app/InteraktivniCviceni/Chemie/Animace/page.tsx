import React from 'react';

const AnimationPage: React.FC = () => {
  // Kontejner centrálně vycentruje obsah (video) na obrazovce
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000' // volitelně můžete nastavit pozadí
  };

  // Video bude na mobilu zabírat 90 % šířky obrazovky,
  // ale na desktopu nebude větší než 600px
  const videoStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: '600px'
  };

  return (
    <div style={containerStyle}>
      <video autoPlay loop muted playsInline style={videoStyle}>
        <source src="/Animace/Animace.mp4" type="video/mp4" />
        Váš prohlížeč nepodporuje přehrávání videa.
      </video>
    </div>
  );
};

export default AnimationPage;
