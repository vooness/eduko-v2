"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// TypeScript definice pro dynamicky načítané knihovny
interface GLTFResult {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
  scenes: THREE.Group[];
  cameras: THREE.Camera[];
  asset: object;
}

// Správné importy pro Next.js
let GLTFLoader: any;
let OrbitControls: any;

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

  // OPRAVENÉ výchozí intenzity pro světlo - vyšší hodnoty pro zlatý vzhled
  const [ambientIntensity, setAmbientIntensity] = useState(0.8); // Zvýšeno z 0.4
  const [directionalIntensity, setDirectionalIntensity] = useState(1.5); // Zvýšeno z 1.0
  
  // Reference na světla
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  
  // Pole pro dodatečná světla
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  
  // OPRAVENÉ intenzity světel - vyšší pro lepší osvětlení
  const [spotLightIntensity, setSpotLightIntensity] = useState(0.6); // Zvýšeno z 0.3
  const [pointLightIntensity, setPointLightIntensity] = useState(0.4); // Zvýšeno z 0.2

  // OPRAVENÉ pozadí scény - světlejší pro lepší kontrast
  const [sceneBg, setSceneBg] = useState("#404040"); // Změněno z #2a2a2a

  // Kovovost (metalness) a drsnost (roughness) - OPRAVENÉ pro zlatý vzhled
  const [modelRoughness, setModelRoughness] = useState(0.2); // Správná hodnota pro realistický vzhled
  const [modelMetalness, setModelMetalness] = useState(0.75); // Zvýšeno z 0

  // Referenční objekty pro originální materiály
  const originalMaterialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map());

  // Stav panelu (collapsible)
  const [panelOpen, setPanelOpen] = useState(true);

  // Detekce mobilu
  const [isMobile, setIsMobile] = useState(false);

  // ANIMACE
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const clockRef = useRef(new THREE.Clock());
  const [animPlaying] = useState(true);

  // OPRAVENÁ exposure pro tone mapping - vyšší pro jasnější vzhled
  const [exposure, setExposure] = useState(1.5); // Zvýšeno z 1.0
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Reference na OrbitControls
  const controlsRef = useRef<any>(null);
  
  // Přiblížení kamery a pozice
  const [initialZoom, setInitialZoom] = useState(3.5);
  const [cameraY, setCameraY] = useState(0.5);
  
  // Cesta k modelu
  const modelPath = "/3DModel/s129_8.05_kyselina_dusicna.glb";
  
  // OPRAVENÉ - výchozí zachování materiálů FALSE pro správný vzhled
  const [preserveOriginalMaterials, setPreserveOriginalMaterials] = useState(false);

  // Stav načtení knihoven
  const [librariesLoaded, setLibrariesLoaded] = useState(false);
  
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

  // Dynamické načtení knihoven
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Dynamický import pro GLTFLoader
        const { GLTFLoader: LoaderClass } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        GLTFLoader = LoaderClass;
        
        // Dynamický import pro OrbitControls
        const { OrbitControls: ControlsClass } = await import('three/examples/jsm/controls/OrbitControls.js');
        OrbitControls = ControlsClass;
        
        setLibrariesLoaded(true);
      } catch (error) {
        console.error('Chyba při načítání knihoven:', error);
      }
    };

    loadLibraries();
  }, []);

  // Inicializace scény
  useEffect(() => {
    if (!librariesLoaded) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sceneBg);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    // OPRAVENÉ nastavení rendereru pro lepší vzhled
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // OPRAVENÉ osvětlení pro zlatý vzhled
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Hlavní směrové světlo - teplé osvětlení
    const directionalLight = new THREE.DirectionalLight(0xfff8dc, directionalIntensity); // Teplá barva
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // OPRAVENÁ dodatečná světla pro lepší osvětlení
    const spotPositions = [
      { pos: new THREE.Vector3(5, 5, 0), color: 0xfff8dc }, // Teplá barva
      { pos: new THREE.Vector3(-5, 5, 0), color: 0xfff8dc },
      { pos: new THREE.Vector3(0, 5, 5), color: 0xffffff },
      { pos: new THREE.Vector3(0, 5, -5), color: 0xffffff }
    ];
    
    spotPositions.forEach(({ pos, color }) => {
      const spotLight = new THREE.SpotLight(color, spotLightIntensity, 15, Math.PI / 6, 0.5);
      spotLight.position.copy(pos);
      spotLight.lookAt(0, 0, 0);
      spotLight.castShadow = true;
      scene.add(spotLight);
      spotLightsRef.current.push(spotLight);
    });
    
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

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.5;
    controls.maxDistance = 30;
    
    // Pomocné osy (vypnuté)
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    axesHelper.visible = false;

    // OPRAVENÁ funkce pro detekci částí modelu
    function detectModelParts(model: THREE.Group) {
      const foundParts: {[key: string]: {name: string, color: string}} = {};
      const originalMaterialColors: {[key: string]: string} = {};
      
      // Projít model a zaznamenat původní materiály
      model.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          
          if (!material || !material.color) return;
          
          const name = mesh.name.toLowerCase();
          let category = getCategoryFromName(name);
          
          if (category && category.length > 0) {
            // Uložit původní barvu
            const colorHex = "#" + material.color.getHexString();
            originalMaterialColors[category] = colorHex;
            
            // Uložit kompletní původní materiál pro referenci
            if (!originalMaterialsRef.current.has(category)) {
              const clonedMaterial = material.clone();
              originalMaterialsRef.current.set(category, clonedMaterial);
            }
          }
        }
      });
      
      // Vytvořit části s původními barvami
      model.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const name = mesh.name.toLowerCase();
          const category = getCategoryFromName(name);
          
          if (category && category.length > 0) {
            if (foundParts[category]) return;
            
            const displayName = formatCategoryName(category);
            const colorHex = originalMaterialColors[category] || "#FFD700"; // Výchozí zlatá
            
            foundParts[category] = {
              name: displayName,
              color: colorHex
            };
          }
        }
      });
      
      if (Object.keys(foundParts).length === 0) {
        foundParts["model"] = {
          name: "Model",
          color: "#FFD700" // Zlatá barva
        };
      }
      
      console.log("Detekované části s původními materiály:", foundParts);
      setModelParts(foundParts);
      return foundParts;
    }
    
    // Pomocné funkce
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
    
    function formatCategoryName(category: string): string {
      if (category === "c") return "Uhlík (C)";
      if (category === "h") return "Vodík (H)";
      if (category === "cylinder") return "Vazby";
      if (category === "sphere") return "Atom 1";
      if (category === "sphere_2") return "Atom 2";
      if (category === "sphere_3") return "Atom 3";
      
      return category.charAt(0).toUpperCase() + category.slice(1);
    }

    // Načtení modelu s dynamicky načteným GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: GLTFResult) => {
        console.log("Model loaded, analyzing structure:");
        gltf.scene.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
          console.log("Node name:", child.name, "Type:", child.type);
        });

        // OPRAVENÉ nastavení materiálů pro zlatý vzhled
        gltf.scene.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // APLIKOVAT zlaté materiálové vlastnosti hned při načtení
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              
              // Nastavit zlaté vlastnosti pro realistický vzhled
              if (!preserveOriginalMaterials) {
                material.metalness = modelMetalness;
                material.roughness = modelRoughness;
                
                // Pokud je materiál tmavý, nastavit zlatou barvu
                if (material.color.r < 0.5 && material.color.g < 0.5 && material.color.b < 0.5) {
                  material.color.setHex(0xFFD700); // Zlatá barva
                }
              }
              
              material.needsUpdate = true;
            }
          }
        });

        // Detekovat části modelu
        const detectedParts = detectModelParts(gltf.scene);
        console.log("Detected model parts:", detectedParts);

        // Vycentrování modelu
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        const center = boundingBox.getCenter(new THREE.Vector3());
        const size = boundingBox.getSize(new THREE.Vector3());
        
        gltf.scene.position.set(-center.x, -center.y, -center.z);
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraDistance = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
        
        cameraDistance *= 1.5;
        
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
        
        setInitialZoom(cameraDistance);

        // Animace
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixerRef.current = mixer;

          let clip = gltf.animations.find((c: { name: string }) => c.name === "Chair-boat flip");
          if (!clip) {
            clip = gltf.animations[0];
          }
          if (clip) {
            const action = mixer.clipAction(clip);
            if (animPlaying) {
              action.play();
            }
          }
        }

        gltfSceneRef.current = gltf.scene;
        scene.add(gltf.scene);
      },
      undefined,
      (error: any) => console.error("Chyba při načítání modelu:", error)
    );

    // Animační smyčka
    const animate = () => {
      requestAnimationFrame(animate);

      if (autoRotateRef.current && gltfSceneRef.current) {
        gltfSceneRef.current.rotation.y += rotationSpeedRef.current;
      }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [librariesLoaded]);

  // Aktualizace vlastností scény při změně parametrů
  useEffect(() => {
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = ambientIntensity;
    }
    
    if (directionalLightRef.current) {
      directionalLightRef.current.intensity = directionalIntensity;
    }
    
    spotLightsRef.current.forEach(light => {
      light.intensity = spotLightIntensity;
    });
    
    pointLightsRef.current.forEach(light => {
      light.intensity = pointLightIntensity;
    });
    
    const scene = gltfSceneRef.current?.parent;
    if (scene && scene instanceof THREE.Scene) {
      scene.background = new THREE.Color(sceneBg);
    }
    
    if (rendererRef.current) {
      rendererRef.current.toneMappingExposure = exposure;
    }
    
    // APLIKOVAT materiálové vlastnosti
    if (gltfSceneRef.current) {
      gltfSceneRef.current.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            
            if (!preserveOriginalMaterials) {
              material.roughness = modelRoughness;
              material.metalness = modelMetalness;
            }
            
            material.needsUpdate = true;
          }
        }
      });
    }
    
    if (controlsRef.current) {
      const camera = controlsRef.current.object as THREE.PerspectiveCamera;
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
    modelMetalness,
    preserveOriginalMaterials
  ]);

  // Reset barev – nastaví na původní barvy z modelu
  const resetColors = () => {
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    const originalColors: {[key: string]: string} = {};
    
    scene.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        if (category) {
          if (originalMaterialsRef.current.has(category)) {
            const originalMaterial = originalMaterialsRef.current.get(category);
            if (originalMaterial) {
              material.color.copy(originalMaterial.color);
              material.roughness = originalMaterial.roughness;
              material.metalness = originalMaterial.metalness;
              originalColors[category] = "#" + material.color.getHexString();
            }
          } else {
            // Pokud nemáme původní materiál, nastavit zlatou barvu
            material.color.setHex(0xFFD700);
            originalColors[category] = "#FFD700";
          }
          material.needsUpdate = true;
        }
      }
    });
    
    const updatedParts: {[key: string]: {name: string, color: string}} = {};
    
    for (const [key, part] of Object.entries(modelParts)) {
      const originalColor = originalColors[key] || "#FFD700";
      updatedParts[key] = {
        ...part,
        color: originalColor
      };
    }
    
    setModelParts(updatedParts);
  };
  
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

  function changePartColor(key: string, value: string): void {
    const updatedParts = { ...modelParts };
    if (updatedParts[key]) {
      updatedParts[key] = {
        ...updatedParts[key],
        color: value
      };
      setModelParts(updatedParts);
    }
    
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    const newColor = new THREE.Color(value);
    
    scene.traverse((child: THREE.Object3D) => { // OPRAVENÝ typ
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const name = mesh.name.toLowerCase();
        const category = getCategoryFromName(name);
        
        if (category === key) {
          material.color.copy(newColor);
          material.needsUpdate = true;
        }
      }
    });
  }

  // Načítání knihoven
  if (!librariesLoaded) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2a2a2a",
        color: "#fff",
        fontSize: "1.2rem"
      }}>
        Načítání 3D knihoven...
      </div>
    );
  }

  return (
    <>
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

      {panelOpen && (
        <div
          style={{
            position: "absolute",
            top: isMobile ? "5rem" : "3.5rem",
            left: "1rem",
            zIndex: 999,
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "1rem",
            borderRadius: "0.25rem",
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          {/* Kontrola pro zachování původních materiálů */}
          <div style={{ borderBottom: "1px solid #666", paddingBottom: "0.5rem", marginBottom: "0.5rem" }}>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Zachovat původní materiály:
            </label>
            <input
              type="checkbox"
              checked={preserveOriginalMaterials}
              onChange={(e) => setPreserveOriginalMaterials(e.target.checked)}
            />
            <div style={{ fontSize: "0.8em", color: "#ccc", marginTop: "0.25rem" }}>
              Zapnuté = model vypadá jako v GLB vieweru
            </div>
          </div>

          {/* Automatická rotace */}
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

          {/* Rychlost rotace */}
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

          {/* Ambientní osvětlení */}
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

          {/* Směrové osvětlení */}
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
          
          {/* Bodová světla */}
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
          
          {/* Spot světla */}
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

          {/* Pozadí scény */}
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

          {/* Materiálové vlastnosti - pouze když nejsou zachovány původní */}
          {!preserveOriginalMaterials && (
            <>
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
            </>
          )}

          {/* Expozice */}
          <div>
            <label style={{ color: "#fff", marginRight: "0.5rem" }}>
              Expozice:
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(Number(e.target.value))}
            />
            <span style={{ color: "#fff", marginLeft: "0.5rem" }}>
              {exposure.toFixed(1)}
            </span>
          </div>
          
          {/* Přiblížení */}
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
          
          {/* Výška kamery */}
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
                  const boundingBox = new THREE.Box3().setFromObject(gltfSceneRef.current);
                  const center = boundingBox.getCenter(new THREE.Vector3());
                  
                  controlsRef.current.reset();
                  
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
    </>
  );
}