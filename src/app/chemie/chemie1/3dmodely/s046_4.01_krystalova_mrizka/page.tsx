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
  
  // Pole pro dodatečná světla
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  
  // Intenzita bodových a spot světel
  const [spotLightIntensity, setSpotLightIntensity] = useState(0.8);
  const [pointLightIntensity, setPointLightIntensity] = useState(0.6);

  // Pozadí scény RGB(72, 96, 97) → "#486061"
  const [sceneBg, setSceneBg] = useState("#486061");

  // Kovovost (metalness) a drsnost (roughness)
  const [modelRoughness, setModelRoughness] = useState(0.3); // Sníženo pro větší lesklost
  const [modelMetalness, setModelMetalness] = useState(0); // Zvýšeno pro větší lesklost
  
  // Referenční objekty pro originální materiály
  const originalMaterialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Stav panelu (collapsible)
  const [panelOpen, setPanelOpen] = useState(true);

  // Detekce mobilu
  const [isMobile, setIsMobile] = useState(false);

  // ANIMACE – animace se spustí hned od začátku
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const [animPlaying] = useState(true); // Animace běží vždy

  // exposure pro zvýšení jasu (tone mapping)
  const [exposure, setExposure] = useState(10); // Sníženo pro lepší kontrast
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Reference na OrbitControls
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Přiblížení kamery a pozice
  const [initialZoom, setInitialZoom] = useState(3.5);  // Výchozí zoom - menší hodnota = větší přiblížení
  const [cameraY, setCameraY] = useState(0.5);  // Výška kamery
  
  // Cesta k modelu - pevně daná pro konkrétní stránku
  const modelPath = "/3DModel/s046_4.01_krystalova_mrizka.glb";
  
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
    // Inicializace scény pouze při prvním render
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneBg);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Kamera začíná v pohledu zepředu
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance" // Lepší výkon pro komplexní scény
    });
    // Nastavení tone mappingu a exposure
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Opraveno - Lepší barvy
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Zapnutí stínů
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Měkčí stíny
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
    directionalLight.castShadow = true; // Stíny pro směrové světlo
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // Přidání více světel pro lepší lesklost a odlesky
    // 1. Přidání spot světel ze čtyř stran
    const spotPositions = [
      { pos: new THREE.Vector3(5, 5, 0), color: 0xffffee },
      { pos: new THREE.Vector3(-5, 5, 0), color: 0xeeffff },
      { pos: new THREE.Vector3(0, 5, 5), color: 0xffeeff },
      { pos: new THREE.Vector3(0, 5, -5), color: 0xeeffee }
    ];
    
    spotPositions.forEach(({ pos, color }) => {
      const spotLight = new THREE.SpotLight(color, spotLightIntensity, 15, Math.PI / 6, 0.5);
      spotLight.position.copy(pos);
      spotLight.lookAt(0, 0, 0);
      spotLight.castShadow = true;
      scene.add(spotLight);
      spotLightsRef.current.push(spotLight);
    });
    
    // 2. Přidání bodových světel pro lepší odlesky
    const pointPositions = [
      { pos: new THREE.Vector3(3, -3, 3), color: 0xffffff },
      { pos: new THREE.Vector3(-3, -3, -3), color: 0xffffff },
      { pos: new THREE.Vector3(3, 3, -3), color: 0xffffff },
      { pos: new THREE.Vector3(-3, 3, 3), color: 0xffffff }
    ];
    
    pointPositions.forEach(({ pos, color }) => {
      const pointLight = new THREE.PointLight(color, pointLightIntensity, 10);
      pointLight.position.copy(pos);
      scene.add(pointLight);
      pointLightsRef.current.push(pointLight);
    });

    // OrbitControls - ovládání kamery myší
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;  // Minimální vzdálenost pro zoom
    controls.maxDistance = 30;   // Maximální vzdálenost pro zoom
    
    // Přidat pomocné osy pro ladění (volitelné, ve výchozím stavu vypnuté)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    axesHelper.visible = false;  // Vypnuto pro produkci, pro ladění nastavte na true

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
            
            // Uložíme originální materiál pro pozdější referenci
            if (!originalMaterialsRef.current.has(category)) {
              // Klonujeme materiál, abychom měli nezávislou referenci
              const clonedMaterial = material.clone();
              originalMaterialsRef.current.set(category, clonedMaterial);
            }
            
            // Nastavíme drsnost a kovovost pro lepší lesklost
            material.roughness = modelRoughness;
            material.metalness = modelMetalness;
            material.needsUpdate = true;
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

        // Nastavení stínů pro všechny meshe v modelu
        gltf.scene.traverse((child: THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // Nastavení materiálů pro lesklost
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              material.roughness = modelRoughness;
              material.metalness = modelMetalness;
              material.needsUpdate = true;
            }
          }
        });

        // Detekovat části modelu
        const detectedParts = detectModelParts(gltf.scene);
        console.log("Detected model parts:", detectedParts);

        // DŮLEŽITÉ: Vycentrování modelu - vypočítat bouding box a umístit na střed
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        
        // Přesunout model tak, aby jeho střed byl na [0,0,0]
        gltf.scene.position.set(-center.x, -center.y, -center.z);
        
        // Upravit kameru podle velikosti modelu
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
        
        // Přidat rezervu, aby model nebyl u kraje
        cameraDistance *= 1.5;
        
        // Nastavit kameru na správnou vzdálenost a namířit na střed modelu
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
        
        // Ukládat počáteční hodnotu přiblížení pro pozdější reset
        setInitialZoom(cameraDistance);

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
  // Závislosti omezeny pouze na ty nezbytné, aby nedocházelo k překreslování při každé změně
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aktualizace vlastností scény při změně parametrů
  useEffect(() => {
    // Aktualizace základních světel
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
    
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = directionalIntensity;
    }
    
    // Aktualizace intenzity bodových světel
    spotLightsRef.current.forEach(light => {
      light.intensity = spotLightIntensity;
    });
    
    // Aktualizace intenzity spot světel
    pointLightsRef.current.forEach(light => {
      light.intensity = pointLightIntensity;
    });
    
    // Aktualizace pozadí scény
    const scene = gltfSceneRef.current?.parent;
    if (scene && scene instanceof THREE.Scene) {
      scene.background = new THREE.Color(sceneBg);
    }
    
    // Aktualizace expozice (tone mapping)
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = exposure;
    }
    
    // Aktualizace vlastností materiálů modelu
    if (gltfSceneRef.current) {
      gltfSceneRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            material.roughness = modelRoughness;
            material.metalness = modelMetalness;
            material.needsUpdate = true;
          }
        }
      });
    }
    
    // Aktualizace kamery
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
      // Zachováme aktuální X pozici, ale aktualizujeme Y a Z
      camera.position.set(camera.position.x, cameraY, initialZoom);
      camera.updateProjectionMatrix();
    }
  }, [
    ambientIntensity, 
    directionalIntensity, 
    spotLightIntensity, 
    pointLightIntensity,
    sceneBg, 
    exposure, 
    initialZoom, 
    cameraY, 
    modelRoughness, 
    modelMetalness
  ]);

  // Reset barev – nastaví na původní barvy z modelu
  const resetColors = () => {
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    // Sbírka původních barev podle kategorie
    const originalColors: {[key: string]: string} = {};
    
    // Projít model a obnovit originální barvy a materiálové vlastnosti
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        if (category) {
          // Obnovit původní barvu z reference
          if (originalMaterialsRef.current.has(category)) {
            const originalMaterial = originalMaterialsRef.current.get(category);
            if (originalMaterial) {
              material.color.copy(originalMaterial.color);
              originalColors[category] = "#" + material.color.getHexString();
            }
          }
          
          // Aktualizovat materiálové vlastnosti
          material.roughness = modelRoughness;
          material.metalness = modelMetalness;
          material.needsUpdate = true;
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

  // Opravená funkce pro změnu barvy části modelu
  function changePartColor(key: string, value: string): void {
    // 1. Aktualizovat stav barev v modelParts
    const updatedParts = { ...modelParts };
    if (updatedParts[key]) {
      updatedParts[key] = {
        ...updatedParts[key],
        color: value
      };
      setModelParts(updatedParts);
    }
    
    // 2. Aktualizovat skutečné barvy v 3D modelu
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    // Konvertovat hex barvu na THREE.Color
    const newColor = new THREE.Color(value);
    
    // Projít všechny meshe a aktualizovat barvy podle kategorie
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        // Pokud kategorie odpovídá klíči, změnit barvu
        if (category === key) {
          material.color.copy(newColor);
          material.needsUpdate = true; // Důležité pro refresh materiálu
        }
      }
    });
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
          
          {/* 5) Bodová světla */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Bodová světla:
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={pointLightIntensity}
              onChange={(e) => setPointLightIntensity(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {pointLightIntensity.toFixed(2)}
            </span>
          </div>
          
          {/* 6) Spot světla */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Spot světla:
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={spotLightIntensity}
              onChange={(e) => setSpotLightIntensity(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {spotLightIntensity.toFixed(2)}
            </span>
          </div>

          {/* 7) Pozadí scény */}
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

          {/* 9) Kovovost */}
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

          {/* 10) Expozice */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Expozice:
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {exposure.toFixed(1)}
            </span>
          </div>
          
          {/* 11) Počáteční zoom (vzdálenost kamery) */}
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
          
          {/* 12) Výška kamery */}
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
                if (controlsRef.current && gltfSceneRef.current) {
                  // Vypočítat střed modelu
                  const boundingBox = new THREE.Box3().setFromObject(gltfSceneRef.current);
                  const center = boundingBox.getCenter(new THREE.Vector3());
                  
                  // Reset OrbitControls
                  controlsRef.current.reset();
                  
                  // Nastavení pohledu kamery na střed modelu
                  const camera = controlsRef.current.object as THREE.PerspectiveCamera;
                  camera.position.set(0, 0, initialZoom);
                  camera.lookAt(center);
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
