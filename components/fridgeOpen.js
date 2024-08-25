import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import style from "../styles/Hero.module.css";
import * as TWEEN from "@tweenjs/tween.js";

function throttle(fn, wait) {
  let time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  };
}


const FridgeOpen = () => {
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const mixerRef = useRef(null);

  useEffect(() => {
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current.appendChild(renderer.domElement);

    if (rendererRef.current) {
      rendererRef.current.appendChild(renderer.domElement);
    }

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(20, 10, -10);
    cameraRef.current = camera;

    // Setup orbit controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enabled = false;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(1, 0, 0);
    scene.add(directionalLight);

    const sunlight = new THREE.DirectionalLight(0xffffff, 1);
    sunlight.position.set(1, 0.3, 1);
    scene.add(sunlight);

    // Load GLTF model
    const assetLoader = new GLTFLoader();
    const monkeyUrl = new URL("../public/myfridgeOC2.glb", import.meta.url);
    assetLoader.load(
      monkeyUrl.href,
      function (gltf) {
        const model = gltf.scene;

        // Apply basic material to each mesh in the model
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              metalness: 1,
              roughness: 0.4,
            });
          }
        });
        model.position.y += 1;
        scene.add(model);

        mixerRef.current = new THREE.AnimationMixer(model);
        const clips = gltf.animations;

        // Prepare the animations
        clips.forEach(function (clip) {
          const action = mixerRef.current.clipAction(clip);
          action.loop = THREE.LoopOnce;
          action.clampWhenFinished = true;
          action.play();
          action.paused = true;
        });
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    // Setup clock
    const clock = new THREE.Clock();

    // Animation loop
    const animate = () => {
      if (mixerRef.current) {
        mixerRef.current.update(clock.getDelta());
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      const container = rendererRef.current;
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

const initialPosition = { x: 20, y: 10, z: -10 };
const middlePosition = { x: 10, y: 5, z: 5 };
const finalPosition = { x: -10, y: -5, z: -5 };
const initialTarget = { x: 0, y: 0, z: 0 };
const finalTarget = { x: -5, y: 1, z: -1 }; // New target when zooming in

    useEffect(() => {
        const handleScroll = throttle(() => {
            const scrollTop = window.scrollY;
            const maxScroll = 14487;

            if (scrollTop > 1100) {
                const scrollFraction = Math.min(50 * (scrollTop - 1100) / (maxScroll - 1100), 1.6); // Adjusted max to 2 for full range

                let currentPosition = { x: 0, y: 0, z: 0 };
                let currentTarget = { x: 0, y: 0, z: 0 };

                if (scrollFraction < 1) {
                  // Transition from initialPosition to middlePosition
                  currentPosition = {
                      x: initialPosition.x + (middlePosition.x - initialPosition.x) * scrollFraction,
                      y: initialPosition.y + (middlePosition.y - initialPosition.y) * scrollFraction,
                      z: initialPosition.z + (middlePosition.z - initialPosition.z) * scrollFraction,
                  };
                  currentTarget = initialTarget; // Keep looking at the initial target
                } else {
                  // Transition from middlePosition to finalPosition
                  const adjustedFraction = scrollFraction - 1; // Normalize to 0-1 range for this phase
                  currentPosition = {
                      x: middlePosition.x + (finalPosition.x - middlePosition.x) * adjustedFraction,
                      y: middlePosition.y + (finalPosition.y - middlePosition.y) * adjustedFraction,
                      z: middlePosition.z + (finalPosition.z - middlePosition.z) * adjustedFraction,
                  };

                  // Transition the target from the initial target to the final target
                  currentTarget = {
                      x: initialTarget.x + (finalTarget.x - initialTarget.x) * adjustedFraction,
                      y: initialTarget.y + (finalTarget.y - initialTarget.y) * adjustedFraction,
                      z: initialTarget.z + (finalTarget.z - initialTarget.z) * adjustedFraction,
                  };

                  // Zoom in effect
                  cameraRef.current.updateProjectionMatrix(); // Update the camera projection matrix
                }

                // Update camera position
                cameraRef.current.position.set(
                    currentPosition.x,
                    currentPosition.y,
                    currentPosition.z
                );
                // Update camera target
                cameraRef.current.lookAt(
                    currentTarget.x,
                    currentTarget.y,
                    currentTarget.z
                );

                if (mixerRef.current) {
                    const normalizedScrollFraction = Math.min(scrollFraction, 1); // Use 0-1 range for animation

                    // Set the time for each action based on scrollFraction
                    mixerRef.current._actions.forEach((action) => {
                      const duration = action._clip.duration;
                      action.time = normalizedScrollFraction * duration;
                      action.paused = true;  // Ensure the action is not paused
                    });

                    // Update the mixer
                    mixerRef.current.update(0); // Force update the mixer immediately
                }
            }
        }, 5);

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return <div ref={rendererRef} className={style.fridge}></div>;
};

export default FridgeOpen;
