"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Rozlišení částí modelu podle jména (C, H, Cylinder).
 */
function getMeshCategory(name: string): "C" | "H" | "cyl" | undefined {
  const n = name.toLowerCase();
  if (n.startsWith("cylinder")) {
    return "cyl";
  } else if (n === "c" || n.startsWith("c.")) {
    return "C";
  } else if (n === "h" || n.startsWith("h.")) {
    return "H";
  }
  return undefined;
}

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

  // Barvy (C, H, Cylinder)
  const [colorC, setColorC] = useState("");
  const [colorH, setColorH] = useState("");
  const [colorCylinder, setColorCylinder] = useState("");

  // Výchozí intenzity pro světlo
  const [ambientIntensity, setAmbientIntensity] = useState(1.0);

  // **Upraveno**: Směrové osvětlení na 1.50
  const [directionalIntensity, setDirectionalIntensity] = useState(1.5);

  // Reference na světla
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);

  // **Upraveno**: Pozadí scény RGB(72, 96, 97) → "#486061"
  const [sceneBg, setSceneBg] = useState("#486061");

  // **Upraveno**: Kovovost (metalness) na 0.25
  const [modelRoughness, setModelRoughness] = useState(0.5);
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
    camera.position.set(0, 2, 10);

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

    // **Upraveno**: Směrové osvětlení na 1.50
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      directionalIntensity
    );
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1;
    controls.maxDistance = 30;

    // Načtení modelu
    const loader = new GLTFLoader();
    loader.load(
      "/3DModel/3d2.glb",
      (gltf) => {
        gltf.scene.traverse((child: { name: any; type: any }) => {
          console.log("Node name:", child.name, "Type:", child.type);
        });

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
      if (mountRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [ambientIntensity, animPlaying, directionalIntensity, exposure, sceneBg]);

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

  // Přebarvení modelu a nastavení roughness/metalness
  useEffect(() => {
    const scene = gltfSceneRef.current;
    if (!scene) return;

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        if (!material) return;

        // Nastavení barev podle kategorie
        const cat = getMeshCategory(mesh.name);
        if (cat === "C" && colorC !== "") {
          material.color.set(colorC);
        }
        if (cat === "H" && colorH !== "") {
          material.color.set(colorH);
        }
        if (cat === "cyl" && colorCylinder !== "") {
          material.color.set(colorCylinder);
        }

        // Nastavení drsnosti a kovovosti
        material.roughness = modelRoughness;
        // **Upraveno**: Kovovost 0.25
        material.metalness = modelMetalness;
      }
    });
  }, [colorC, colorH, colorCylinder, modelRoughness, modelMetalness]);

  // Sledujeme změny exposure
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = exposure;
    }
  }, [exposure]);

  // Reset barev – nyní se nastaví na výchozí hodnoty
  const resetColors = () => {
    setColorC("#000000");
    setColorH("#ffffff");
    setColorCylinder("#4444ff");
  };

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

          {/* 8) Barva (C) */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Barva (C):
            </label>
            <input
              type="color"
              value={colorC || "#000000"}
              onChange={(e) => setColorC(e.target.value)}
            />
          </div>

          {/* 9) Barva (H) */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Barva (H):
            </label>
            <input
              type="color"
              value={colorH || "#ffffff"}
              onChange={(e) => setColorH(e.target.value)}
            />
          </div>

          {/* 10) Barva (Cylinder) */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Barva (Cylinder):
            </label>
            <input
              type="color"
              value={colorCylinder || "#4444ff"}
              onChange={(e) => setColorCylinder(e.target.value)}
            />
          </div>

          {/* 11) Expozice */}
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

          {/* Resetovat barvy tlačítko */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
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
    </>
  );
}
