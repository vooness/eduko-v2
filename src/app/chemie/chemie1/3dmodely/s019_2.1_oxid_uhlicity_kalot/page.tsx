"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Model3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  // GLTF hlavní groupa
  const gltfSceneRef = useRef<THREE.Group | null>(null);

  // Auto-rotace
  const [autoRotate, setAutoRotate] = useState(false);
  const autoRotateRef = useRef(false);

  // Rychlost rotace
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const rotationSpeedRef = useRef(0.01);

  // Dynamická detekce částí modelu
  const [modelParts, setModelParts] = useState<{[key: string]: {name: string, color: string}}>({}); 

  // Výchozí intenzity pro světlo
  const [ambientIntensity, setAmbientIntensity] = useState(1.0);
  const [directionalIntensity, setDirectionalIntensity] = useState(1.5);

  // Reference na světla
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Pozadí scény RGB(72, 96, 97) → "#486061"
  const [sceneBg, setSceneBg] = useState("#486061");

  // Kovovost (metalness) na 0.25
  const [modelRoughness, setModelRoughness] = useState(0.0);
  const [modelMetalness, setModelMetalness] = useState(0.25);

  // Stav panelu (collapsible)
  const [panelOpen, setPanelOpen] = useState(true);

  // Detekce mobilu
  const [isMobile, setIsMobile] = useState(false);

  // ANIMACE – animace se spustí hned od začátku
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const [animPlaying] = useState(true); // Animace běží vždy

  // exposure pro zvýšení jasu (tone mapping)
  const [exposure, setExposure] = useState(1.0);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Reference na OrbitControls
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Přiblížení kamery a pozice
  const [initialZoom, setInitialZoom] = useState(1.0);  // Výchozí zoom - menší hodnota = větší přiblížení
  const [cameraY, setCameraY] = useState(0.5);  // Výška kamery
  
  // Cesta k modelu - pevně daná pro konkrétní stránku
  const modelPath = "/3DModel/3d1.glb";
  
  // Detekce změny velikosti obrazovky
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Uložení autoRotate a rotationSpeed do referencí
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);
  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  // Inicializace scény
  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneBg);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Přiblížená pozice kamery (nižší hodnota Z = bližší pohled)
    camera.position.set(0, cameraY, initialZoom);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // Nastavení tone mappingu a exposure
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Ambientní osvětlení
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Směrové osvětlení na 1.50
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      directionalIntensity
    );
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;  // Minimální vzdálenost pro zoom
    controls.maxDistance = 30;   // Maximální vzdálenost pro zoom

    // Detekce a kategorizace částí modelu
    function detectModelParts(model: THREE.Group) {
      const foundParts: {[key: string]: {name: string, color: string}} = {};
      const originalMaterialColors: {[key: string]: string} = {};
      
      // Nejprve projdeme model a zaznamenáme všechny unikátní materiály a jejich barvy
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          
          if (!material || !material.color) return;
          
          const name = mesh.name.toLowerCase();
          // Získáme kategorii podle názvu
          let category = getCategoryFromName(name);
          
          if (category && category.length > 0) {
            // Uložíme originální barvu
            const colorHex = "#" + material.color.getHexString();
            originalMaterialColors[category] = colorHex;
          }
        }
      });
      
      // Nyní vytvoříme části s originálními barvami
      model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const name = mesh.name.toLowerCase();
          const category = getCategoryFromName(name);
          
          if (category && category.length > 0) {
            // Pokud již kategorie existuje, přeskočíme
            if (foundParts[category]) return;
            
            const displayName = formatCategoryName(category);
            const colorHex = originalMaterialColors[category] || "#888888";
            
            foundParts[category] = {
              name: displayName,
              color: colorHex
            };
          }
        }
      });
      
      // Pokud jsme nenašli žádné části, přidáme alespoň jednu výchozí
      if (Object.keys(foundParts).length === 0) {
        foundParts["model"] = {
          name: "Model",
          color: "#888888"
        };
      }
      
      console.log("Detekované části s originálními barvami:", foundParts);
      setModelParts(foundParts);
      return foundParts;
    }
    
    // Pomocná funkce pro získání kategorie z názvu
    function getCategoryFromName(name: string): string {
      // Speciální případy
      if (name.includes("cylinder") || name.includes("bond")) {
        return "cylinder";
      } else if (name.includes("sphere_3") || name === "sphere_3" || name.startsWith("sphere_3.")) {
        return "sphere_3";
      } else if (name.includes("sphere_2") || name === "sphere_2" || name.startsWith("sphere_2.")) {
        return "sphere_2"; 
      } else if (name.includes("sphere") && !name.includes("sphere_2") && !name.includes("sphere_3")) {
        return "sphere";
      } else {
        // Získat první token (znak nebo slovo) před tečkou nebo mezerou
        return name.split(/[.\s]/)[0];
      }
    }
    
    // Pomocná funkce pro formátování názvu kategorie
    function formatCategoryName(category: string): string {
      // Konverze na pěkný název pro zobrazení
      if (category === "c") return "Uhlík (C)";
      if (category === "h") return "Vodík (H)";
      if (category === "cylinder") return "Vazby";
      if (category === "sphere") return "Atom 1";
      if (category === "sphere_2") return "Atom 2";
      if (category === "sphere_3") return "Atom 3";
      
      // Obecné formátování - první písmeno velké
      return category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Načtení modelu
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        // Výpis struktury do konzole
        console.log("Model loaded, analyzing structure:");
        gltf.scene.traverse((child: { name: any; type: any }) => {
          console.log("Node name:", child.name, "Type:", child.type);
        });

        // Detekovat části modelu
        const detectedParts = detectModelParts(gltf.scene);
        console.log("Detected model parts:", detectedParts);

        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixerRef.current = mixer;

          // Zkusíme najít "Chair-boat flip" nebo použijeme první animaci
          let clip = gltf.animations.find((c: { name: string }) => c.name === "Chair-boat flip");
          if (!clip) {
            clip = gltf.animations[0];
          }
          if (clip) {
            const action = mixer.clipAction(clip);
            // Animace se spustí, protože animPlaying je vždy true
            if (animPlaying) {
              action.play();
            }
          }
        }

        gltfSceneRef.current = gltf.scene;
        scene.add(gltf.scene);
      },
      undefined,
      (error) => console.error("Chyba při načítání modelu:", error)
    );

    // Animační smyčka
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotace modelu
      if (autoRotateRef.current && gltfSceneRef.current) {
        gltfSceneRef.current.rotation.y += rotationSpeedRef.current;
      }

      // Aktualizace animací
      const delta = clockRef.current.getDelta();
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Reakce na změnu velikosti
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [ambientIntensity, animPlaying, directionalIntensity, exposure, modelPath, sceneBg, initialZoom, cameraY]);

  // Aktualizace intenzity světel
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
  }, [ambientIntensity]);
  useEffect(() => {
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = directionalIntensity;
    }
  }, [directionalIntensity]);

  // Aktualizace pozadí scény
  useEffect(() => {
    const scene = gltfSceneRef.current?.parent;
    if (scene && scene instanceof THREE.Scene) {
      scene.background = new THREE.Color(sceneBg);
    }
  }, [sceneBg]);

  // Změna barvy konkrétní části modelu
  const changePartColor = (partKey: string, color: string) => {
    const updatedParts = { ...modelParts };
    updatedParts[partKey] = { ...updatedParts[partKey], color };
    setModelParts(updatedParts);
  };

  // Přebarvení modelu a nastavení roughness/metalness
  useEffect(() => {
    const scene = gltfSceneRef.current;
    if (!scene || Object.keys(modelParts).length === 0) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (!material) return;

        // Nastavení drsnosti a kovovosti pro všechny části
        material.roughness = modelRoughness;
        material.metalness = modelMetalness;

        // Nastavení barev podle kategorie
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        // Najít odpovídající kategorii v modelParts a nastavit barvu
        if (category && modelParts[category]) {
          material.color.set(modelParts[category].color);
        }
      }
    });
  }, [modelParts, modelRoughness, modelMetalness]);
  
  // Sledujeme změny zoom hodnoty a kamery Y
  useEffect(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      camera.position.set(camera.position.x, cameraY, initialZoom);
      camera.updateProjectionMatrix();
    }
  }, [initialZoom, cameraY]);

  // Sledujeme změny exposure
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = exposure;
    }
  }, [exposure]);

  // Reset barev – nastaví na původní barvy z modelu
  const resetColors = () => {
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    // Sbírka původních barev podle kategorie
    const originalColors: {[key: string]: string} = {};
    
    // Projít model a získat originální barvy
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        if (category && !originalColors[category]) {
          originalColors[category] = "#" + material.color.getHexString();
        }
      }
    });
    
    // Aktualizovat všechny části modelu na původní barvy
    const updatedParts: {[key: string]: {name: string, color: string}} = {};
    
    for (const [key, part] of Object.entries(modelParts)) {
      const originalColor = originalColors[key] || part.color;
      updatedParts[key] = {
        ...part,
        color: originalColor
      };
    }
    
    setModelParts(updatedParts);
  };
  
  // Pomocná funkce pro získání kategorie, duplikát z detectModelParts
  // (přidaná sem pro použití v resetColors)
  function getCategoryFromName(name: string): string {
    if (name.includes("cylinder") || name.includes("bond")) {
      return "cylinder";
    } else if (name.includes("sphere_3") || name === "sphere_3" || name.startsWith("sphere_3.")) {
      return "sphere_3";
    } else if (name.includes("sphere_2") || name === "sphere_2" || name.startsWith("sphere_2.")) {
      return "sphere_2"; 
    } else if (name.includes("sphere") && !name.includes("sphere_2") && !name.includes("sphere_3")) {
      return "sphere";
    } else {
      return name.split(/[.\s]/)[0];
    }
  }

  return (
    <>
      {/* Tlačítko pro schování/zobrazení panelu */}
      <button
        onClick={() => setPanelOpen(!panelOpen)}
        style={{
          position: "absolute",
          top: "1rem",
          left: "1rem",
          zIndex: 1000,
          backgroundColor: "#222",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "0.25rem",
          cursor: "pointer",
          marginBottom: "0.5rem",
        }}
      >
        {panelOpen ? "Schovat panel" : "Zobrazit panel"}
      </button>

      {/* Panel s nastavením */}
      {panelOpen && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? "5rem" : "3.5rem",
            left: "1rem",
            zIndex: 999,
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: "1rem",
            borderRadius: "0.25rem",
            maxWidth: "270px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          {/* 1) Automatická rotace */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Automatická rotace:
            </label>
            <input
              type="checkbox"
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
            />
          </div>

          {/* 2) Rychlost rotace */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Rychlost rotace:
            </label>
            <input
              type="range"
              min="0"
              max="0.05"
              step="0.001"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {rotationSpeed.toFixed(3)}
            </span>
          </div>

          {/* 3) Ambientní osvětlení */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Ambientní osvětlení:
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={ambientIntensity}
              onChange={(e) => setAmbientIntensity(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {ambientIntensity.toFixed(2)}
            </span>
          </div>

          {/* 4) Směrové osvětlení */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Směrové osvětlení:
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={directionalIntensity}
              onChange={(e) => setDirectionalIntensity(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {directionalIntensity.toFixed(2)}
            </span>
          </div>

          {/* 5) Pozadí scény */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Pozadí scény:
            </label>
            <input
              type="color"
              value={sceneBg}
              onChange={(e) => setSceneBg(e.target.value)}
            />
          </div>

          {/* 6) Drsnost */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Drsnost:
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={modelRoughness}
              onChange={(e) => setModelRoughness(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {modelRoughness.toFixed(2)}
            </span>
          </div>

          {/* 7) Kovovost */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Kovovost:
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={modelMetalness}
              onChange={(e) => setModelMetalness(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {modelMetalness.toFixed(2)}
            </span>
          </div>

          {/* 8) Expozice */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Expozice:
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {exposure.toFixed(2)}
            </span>
          </div>
          
          {/* 9) Počáteční zoom (vzdálenost kamery) */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Přiblížení:
            </label>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={initialZoom}
              onChange={(e) => setInitialZoom(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {initialZoom.toFixed(1)}
            </span>
          </div>
          
          {/* 10) Výška kamery */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Výška kamery:
            </label>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={cameraY}
              onChange={(e) => setCameraY(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {cameraY.toFixed(1)}
            </span>
          </div>

          {/* Dynamicky vygenerované barevné ovládací prvky pro rozpoznané části modelu */}
          <div style={{ borderTop: "1px solid #666", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>Barvy částí modelu:</h3>
            
            {Object.entries(modelParts).map(([key, part]) => (
              <div key={key} style={{ marginBottom: "0.5rem" }}>
                <label style={{ color: "#fff", marginRight: "0.5rem" }}>
                  Barva ({part.name}):
                </label>
                <input
                  type="color"
                  value={part.color}
                  onChange={(e) => changePartColor(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Resetovat barvy tlačítko */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              style={{
                backgroundColor: "#444",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
              onClick={resetColors}
            >
              Resetovat barvy
            </button>
            
            {/* Tlačítko pro vycentrování kamery */}
            <button
              style={{
                backgroundColor: "#444",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
              }}
              onClick={() => {
                if (controlsRef.current) {
                  controlsRef.current.reset();
                  const camera = controlsRef.current.object as THREE.PerspectiveCamera;
                  camera.position.set(0, cameraY, initialZoom);
                  camera.updateProjectionMatrix();
                }
              }}
            >
              Vycentrovat
            </button>
          </div>
        </div>
      )}

      <div
        ref={mountRef}
        style={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      />
      
      {/* Debugovací informace - můžete odstranit v produkci */}
      {false && (
        <div style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          maxWidth: "400px",
          maxHeight: "200px",
          overflow: "auto",
          fontSize: "10px"
        }}>
          <h4>Detekované části modelu:</h4>
          <pre>{JSON.stringify(modelParts, null, 2)}</pre>
        </div>
      )}
    </>
  );
}