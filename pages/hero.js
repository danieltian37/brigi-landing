import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import styles from '../styles/Hero.module.css';
import FridgeOpen from '../components/fridgeOpen';

export default function Hero() {
    const [currentWord, setCurrentWord] = useState(0);
    const [animate, setAnimate] = useState(false);
    const words = ["home cooking", "close community", "your virtual fridge"];
    const mountRef1 = useRef(null);
    const mountRef2 = useRef(null);
    const titleRef = useRef(null);
    const logoRef = useRef(null);
    const subLogoRef = useRef(null);
    const objectRefs1 = useRef([]);
    const objectRefs2 = useRef([]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const index = Math.min(Math.floor(Math.abs((scrollPosition / 500) - 0.1)), words.length - 1);
            console.log(scrollPosition);
            if (scrollPosition > 2000) {
                logoRef.current.style.top = `${45 - (scrollPosition - 2000)/6}%`
                titleRef.current.style.fontSize = `${2 + (scrollPosition - 1550)/150}vw`
                titleRef.current.style.width = `${70 + (scrollPosition - 1550)/4}vw`
                titleRef.current.style.top = `${30 - (scrollPosition - 1550)/20}%`
                titleRef.current.style.opacity = `${Math.max(0, 1 - (scrollPosition - 1550)/50)}`;
                console.log("crazy");
            } else if (scrollPosition > 1550) {
                titleRef.current.style.fontSize = `${2 + (scrollPosition - 1550)/150}vw`
                titleRef.current.style.width = `${70 + (scrollPosition - 1550)/4}vw`
                titleRef.current.style.top = `${30 - (scrollPosition - 1550)/20}%`
                titleRef.current.style.opacity = `${Math.max(0, 1 - (scrollPosition - 1550)/80)}`;
                logoRef.current.style.opacity = `${Math.min(1, 0 + (scrollPosition - 1630)/100)}`;
                logoRef.current.style.width = `${Math.min(50, 40 + (scrollPosition - 1630)/30)}vw`;
                logoRef.current.style.top = `45%`
                subLogoRef.current.style.opacity = `${Math.min(1, 0 + (scrollPosition - 1630)/100)}`;
                subLogoRef.current.style.fontSize = `${Math.min(1.875 , 1.5 + (scrollPosition - 1630)/800)}rem`;
            } else {
                titleRef.current.style.width = '70vw';
                titleRef.current.style.top = `30%`
                titleRef.current.style.opacity = '1';
                titleRef.current.style.fontSize = '2vw';
                logoRef.current.style.opacity = '0';
                logoRef.current.style.width = '40vw';
                logoRef.current.style.top = `45%`
                subLogoRef.current.style.opacity = '0';
                subLogoRef.current.style.fontSize = '1.5rem';
            }

            if (index !== currentWord) {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        setAnimate(true);
                    }, 0);
                });

                setTimeout(() => {
                    setAnimate(false);
                    setCurrentWord(index);
                }, 170);
            }

            objectRefs1.current.forEach(({ object, position }) => {
                if (object) {
                    object.position.y = scrollPosition * 0.04 + position.y;
                }
            });

            objectRefs2.current.forEach(({ object, position }) => {
                if (object) {
                    object.position.y = scrollPosition * 0.02 + position.y;
                }
            });

            objectRefs1.current.forEach(({ object }) => {
                if (object) {
                    object.rotation.x = scrollPosition * 0.005;
                    object.rotation.y = scrollPosition * 0.01;
                }
            });

            objectRefs2.current.forEach(({ object }) => {
                if (object) {
                    object.rotation.x = -scrollPosition * 0.005;
                    object.rotation.y = -scrollPosition * 0.01;
                }
            });

            const initialFaderElement = document.querySelector(`.${styles.initialFader}`);
            if (scrollPosition >= 1300 && scrollPosition <= 1500) {
                initialFaderElement.style.color = 'white';
            } else {
                initialFaderElement.style.color = ''; // Reset to the original color
            }
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [currentWord]);

    const setupScene = (mountRef, models, id) => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        mountRef.current.appendChild(renderer.domElement);

        // Lighting
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const loader = new FBXLoader();

        // Load each model
        models.forEach((modelInfo) => {
            loader.load(modelInfo.path, (object) => {
                object.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                object.position.set(modelInfo.position.x, modelInfo.position.y, modelInfo.position.z);
                if (id === 1) {
                    object.scale.set(15, 20, 15);
                }
                if (id === 2) {
                    object.scale.set(0.01, 0.01, 0.01);
                }
                scene.add(object);

                if (modelInfo.id % 2 === 0) {
                    objectRefs1.current.push({ object: object, position: modelInfo.position });
                } else {
                    objectRefs2.current.push({ object: object, position: modelInfo.position });
                }
            });
        });

        camera.position.z = 10;

        const animate = () => {
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    };

    function getRandomPosition() {
        const xRange = [-10, 10];
        const yRange = [-10, -8];
        const zRange = [-3, 3];

        return {
            x: getRandomWithinRange(xRange[0], xRange[1]),
            y: getRandomWithinRange(yRange[0], yRange[1]),
            z: getRandomWithinRange(zRange[0], zRange[1]),
        };
    }

    function getRandomPosition2() {
        const xRange = [-10, 10];
        const yRange = [-18, -15];
        const zRange = [-3, 3];

        return {
            x: getRandomWithinRange(xRange[0], xRange[1]),
            y: getRandomWithinRange(yRange[0], yRange[1]),
            z: getRandomWithinRange(zRange[0], zRange[1]),
        };
    }

    function getRandomWithinRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const models1 = [
        { path: '/3D/apple.fbx', position: getRandomPosition(), id: 1 },
        { path: '/3D/banana.fbx', position: getRandomPosition(), id: 2 },
        { path: '/3D/carrot.fbx', position: getRandomPosition(), id: 3 },
        { path: '/3D/eggplant.fbx', position: getRandomPosition(), id: 4 },
        { path: '/3D/fish.fbx', position: getRandomPosition(), id: 5 },
        { path: '/3D/oil.fbx', position: getRandomPosition(), id: 6 },
        { path: '/3D/tomato.fbx', position: getRandomPosition(), id: 7 },
        { path: '/3D/yogurt.fbx', position: getRandomPosition(), id: 8 },
    ];

    const models2 = [
        { path: '/3D/Traffic_cone.fbx', position: getRandomPosition2(), id: 1 },
    ];

    useEffect(() => {
        setupScene(mountRef1, models1, 1);
    }, []);

    useEffect(() => {
        setupScene(mountRef2, models2, 2);
    }, []);

    return (
        <>
            <div ref={mountRef1} className={styles.sceneContainer}></div>
            <div ref={mountRef2} className={styles.sceneContainer}></div>
            <FridgeOpen />
            <div className={styles.heroIntro} ref={titleRef}>
                <h1 className={styles.titleOne}>your bridge to</h1>
                <h1 className={`${styles.initialFader} ${animate ? styles.fadeOut : ''}`}>{words[currentWord]}</h1>
            </div>
            <div ref={logoRef} className={styles.logoIntro}>
                <img src="/ponti.png" alt="PONTI" />
                <p className={styles.subLogo} ref={subLogoRef}>Cook. Share. Connect. </p>
            </div>
            <div style={{ height: '25rem' }}></div>
        </>
    );
}
