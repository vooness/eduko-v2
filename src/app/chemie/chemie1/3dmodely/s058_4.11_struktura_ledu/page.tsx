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

  // UNIVERZÁLNÍ výchozí hodnoty osvětlení pro lepší vzhled
  const [ambientIntensity, setAmbientIntensity] = useState(0.6); // Zvýšeno z 0.4
  const [directionalIntensity, setDirectionalIntensity] = useState(1.2); // Zvýšeno z 1.0
  
  // Reference na světla
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  
  // Pole pro dodatečná světla
  const spotLightsRef = useRef<THREE.SpotLight[]>([]);
  const pointLightsRef = useRef<THREE.PointLight[]>([]);
  
  // UNIVERZÁLNÍ intenzity světel pre kovový vzhled
  const [spotLightIntensity, setSpotLightIntensity] = useState(0.5); // Zvýšené
  const [pointLightIntensity, setPointLightIntensity] = useState(0.4); // Zvýšené

  // UNIVERZÁLNÍ pozadí scény
  const [sceneBg, setSceneBg] = useState("#2a2a2a");

  // PEVNÉ materiálové vlastnosti pro kovový vzhled
  const [modelRoughness, setModelRoughness] = useState(0.27); // Velmi lesklý
  const [modelMetalness, setModelMetalness] = useState(1.0); // Velmi kovový

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

  // UNIVERZÁLNÍ exposure pro lepší vzhled
  const [exposure, setExposure] = useState(1.5); // Zvýšeno z 1.0
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  
  // Reference na OrbitControls
  const controlsRef = useRef<any>(null);
  
  // Přiblížení kamery a pozice
  const [initialZoom, setInitialZoom] = useState(3.5);
  const [cameraY, setCameraY] = useState(0.5);
  
  // Cesta k modelu
  const modelPath = "/3DModel/s058_4.11_struktura_ledu.glb";

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
    
    // UNIVERZÁLNÍ nastavení rendereru
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

    // PRIDAŤ environment mapu pre reflections
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      
      // Vytvořit jednoduchú environment mapu pre reflections
      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x666666);
      const envTexture = pmremGenerator.fromScene(envScene).texture;
      scene.environment = envTexture;
      
      pmremGenerator.dispose();
    } catch (error) {
      console.log("Environment map not available in this Three.js version");
    }

    // UNIVERZÁLNÍ osvětlení
    const ambientLight = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // Hlavní směrové světlo - neutrální bílé
    const directionalLight = new THREE.DirectionalLight(0xffffff, directionalIntensity);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    // UNIVERZÁLNÍ dodatečná světla
    const spotPositions = [
      { pos: new THREE.Vector3(5, 5, 0), color: 0xffffff },
      { pos: new THREE.Vector3(-5, 5, 0), color: 0xffffff },
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

    // SESKUPOVÁNÍ podle barev materiálů, ne jednotlivých objektů
    function detectModelParts(model: THREE.Group) {
      const foundParts: {[key: string]: {name: string, color: string}} = {};
      const colorGroups = new Map<string, {count: number, sampleName: string}>();
      
      // Projít model a seskupit podle barev
      model.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          const material = mesh.material as THREE.MeshStandardMaterial;
          
          if (!material || !material.color) return;
          
          // Seskupit podle barvy materiálu
          const colorHex = material.color.getHexString();
          
          // Uložit původní materiál podle barvy
          if (!originalMaterialsRef.current.has(colorHex)) {
            const clonedMaterial = material.clone();
            originalMaterialsRef.current.set(colorHex, clonedMaterial);
          }
          
          // Počítat objekty se stejnou barvou
          if (colorGroups.has(colorHex)) {
            colorGroups.get(colorHex)!.count++;
          } else {
            colorGroups.set(colorHex, { 
              count: 1, 
              sampleName: mesh.name || 'Unknown' 
            });
          }
        }
      });
      
      // Vytvořit skupiny podle barev
      let groupIndex = 0;
      colorGroups.forEach((value, colorHex) => {
        const groupName = formatGroupName(colorHex, value.sampleName, value.count, groupIndex++);
        
        foundParts[colorHex] = {
          name: groupName,
          color: "#" + colorHex
        };
      });
      
      // Pokud nejsou nalezeny žádné části, vytvořit generickou
      if (Object.keys(foundParts).length === 0) {
        foundParts["888888"] = {
          name: "Model",
          color: "#888888"
        };
      }
      
      console.log("Detekované skupiny materiálů:", foundParts);
      setModelParts(foundParts);
      return foundParts;
    }
    
    // Pojmenování skupin podle barvy a typu
    function formatGroupName(colorHex: string, sampleName: string, count: number, index: number): string {
      const name = sampleName.toLowerCase();
      const colorValue = parseInt(colorHex, 16);
      
      // Rozpoznání typu podle názvu nebo barvy
      if (name.includes('sphere') || name.includes('atom') || name.includes('ball')) {
        if (colorValue < 0x666666) return `Tmavé atomy (${count}×)`;
        if (colorValue > 0xaaaaaa) return `Světlé atomy (${count}×)`;
        return `Atomy (${count}×)`;
      }
      
      if (name.includes('cylinder') || name.includes('bond') || name.includes('stick')) {
        return `Vazby (${count}×)`;
      }
      
      // Rozpoznání podle barvy
      if (colorValue < 0x333333) return `Černé části (${count}×)`;
      if (colorValue < 0x666666) return `Tmavé části (${count}×)`;
      if (colorValue < 0x999999) return `Šedé části (${count}×)`;
      if (colorValue < 0xcccccc) return `Světlé části (${count}×)`;
      if (colorValue > 0x00aa00 && colorValue < 0x00ff00) return `Zelené části (${count}×)`;
      if (colorValue > 0xffdd00 && colorValue < 0xffff00) return `Zlaté části (${count}×)`;
      
      return `Skupina ${index + 1} (${count}×)`;
    }

    // Načtení modelu s dynamicky načteným GLTFLoader
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf: GLTFResult) => {
        console.log("Model loaded, analyzing structure:");
        gltf.scene.traverse((child: THREE.Object3D) => {
          console.log("Node name:", child.name, "Type:", child.type);
        });

        // VŽDY aplikovat kovové materiálové vlastnosti
        gltf.scene.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            // VŽDY aplikovat lesklé kovové vlastnosti
            if (mesh.material) {
              const material = mesh.material as THREE.MeshStandardMaterial;
              
              // Aplikovat lesklé kovové vlastnosti na všechny materiály
              material.metalness = modelMetalness;
              material.roughness = modelRoughness;
              material.envMapIntensity = 1.5; // Zvýšiť environment map intenzitu
              
              material.needsUpdate = true;
            }
          }
        });

        // Detekovat části modelu
        const detectedParts = detectModelParts(gltf.scene);
        console.log("Detected model parts:", detectedParts);

        // UNIVERZÁLNÍ vycentrování modelu
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

        // UNIVERZÁLNÍ animace
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixerRef.current = mixer;

          // Přehrát první dostupnou animaci
          const clip = gltf.animations[0];
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
    
    // VŽDY aplikovať materiálové vlastnosti
    if (gltfSceneRef.current) {
      gltfSceneRef.current.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.MeshStandardMaterial;
            material.roughness = modelRoughness;
            material.metalness = modelMetalness;
            material.envMapIntensity = 1.5; // Environment map intenzita
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
    modelMetalness
  ]);

  // RESET BAREV podle skupin - zachová kovové vlastnosti
  const resetColors = () => {
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    const originalColors: {[key: string]: string} = {};
    
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        const colorHex = material.color.getHexString();
        
        if (originalMaterialsRef.current.has(colorHex)) {
          const originalMaterial = originalMaterialsRef.current.get(colorHex);
          if (originalMaterial) {
            // Resetovat iba farbu, nie materiálové vlastnosti
            material.color.copy(originalMaterial.color);
            originalColors[colorHex] = "#" + originalMaterial.color.getHexString();
          }
        }
        
        // VŽDY zachovať kovové vlastnosti
        material.metalness = modelMetalness;
        material.roughness = modelRoughness;
        material.envMapIntensity = 1.5;
        material.needsUpdate = true;
      }
    });
    
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

  // ZMĚNA BARVY podle skupin (barvy materiálů)
  function changePartColor(colorKey: string, newColorValue: string): void {
    const updatedParts = { ...modelParts };
    if (updatedParts[colorKey]) {
      updatedParts[colorKey] = {
        ...updatedParts[colorKey],
        color: newColorValue
      };
      setModelParts(updatedParts);
    }
    
    const scene = gltfSceneRef.current;
    if (!scene) return;
    
    const newColor = new THREE.Color(newColorValue);
    
    // Změnit barvu všech objektů se stejnou původní barvou
    scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;
        
        if (!material || !material.color) return;
        
        // Porovnat podle původní barvy materiálu
        const currentColorHex = material.color.getHexString();
        
        if (currentColorHex === colorKey) {
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
              max="3"
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

          {/* Materiálové vlastnosti */}
          <div style={{ borderTop: "1px solid #666", paddingTop: "0.5rem" }}>
            <h4 style={{ color: "#fff", margin: "0 0 0.5rem 0" }}>Materiálové vlastnosti</h4>
            
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
            </div>

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

          {/* Univerzální barevné ovládací prvky */}
          <div style={{ borderTop: "1px solid #666", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>Barvy materiálů:</h3>
            
            {Object.entries(modelParts).map(([key, part]) => (
              <div key={key} style={{ marginBottom: "0.5rem" }}>
                <label style={{ color: "#fff", marginRight: "0.5rem" }}>
                  {part.name}:
                </label>
                <input
                  type="color"
                  value={part.color}
                  onChange={(e) => changePartColor(key, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Ovládací tlačítka */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button
              style={{
                backgroundColor: "#444",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                flex: 1
              }}
              onClick={resetColors}
            >
              Reset barev
            </button>
            
            <button
              style={{
                backgroundColor: "#444",
                color: "#fff",
                border: "none",
                padding: "0.5rem",
                borderRadius: "0.25rem",
                cursor: "pointer",
                flex: 1
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