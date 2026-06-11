import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_START = 1;
const FRAME_END = 145;
const TOTAL_FRAMES = FRAME_END - FRAME_START + 1; // 145 frames

const Hero = ({ preloadedImages }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imagesRef = useRef([]);
    const recoveredImagesRef = useRef(new Map()); // frameIdx -> recovered Image
    const [images, setImages] = useState(preloadedImages || []);

    // Keep a ref with the latest images so renderFrame + ScrollTrigger callbacks never close over stale data
    const updateImagesRef = (imgs) => {
        imagesRef.current = imgs || [];
        setImages(imgs || []);
    };

    useEffect(() => {
        if (preloadedImages && preloadedImages.length > 0) {
            updateImagesRef(preloadedImages);
            return;
        }
        const loadImages = () => {
            const imgs = [];
            for (let i = FRAME_START; i <= FRAME_END; i++) {
                const img = new Image();
                const frameIndex = i.toString().padStart(8, '0');
                img.src = `/frames/${frameIndex}.jpg`;
                imgs.push(img);
            }
            updateImagesRef(imgs);
        };
        loadImages();
    }, [preloadedImages]);

    useEffect(() => {
        const currentImages = imagesRef.current;
        if (!currentImages || currentImages.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d', { alpha: true });

        const renderFrame = (index) => {
            const imgs = imagesRef.current;
            const frameIdx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(index)));
            const img = imgs[frameIdx];

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!img || !img.complete || img.naturalWidth === 0) {
                // Try a recovered good image for this slot (from previous cache-bust attempt)
                const recovered = recoveredImagesRef.current.get(frameIdx);
                if (recovered && recovered.complete && recovered.naturalWidth > 0) {
                    const goodImg = recovered;
                    const hRatio = canvas.width / goodImg.width;
                    const vRatio = canvas.height / goodImg.height;
                    const ratio = Math.max(hRatio, vRatio);
                    const centerShift_x = (canvas.width - goodImg.width * ratio) / 2;
                    const centerShift_y = (canvas.height - goodImg.height * ratio) / 2;
                    context.drawImage(goodImg, 0, 0, goodImg.width, goodImg.height, centerShift_x, centerShift_y, goodImg.width * ratio, goodImg.height * ratio);
                    return;
                }

                // Attempt recovery load for this frame (cache-bust) so bad frames can still appear later
                if (img?.src && !recoveredImagesRef.current.has(frameIdx)) {
                    const fresh = new Image();
                    fresh.src = img.src + (img.src.includes('?') ? '&' : '?') + 't=' + Date.now();
                    fresh.onload = () => {
                        if (fresh.naturalWidth > 0) {
                            recoveredImagesRef.current.set(frameIdx, fresh);
                            renderFrame(frameIdx);
                        }
                    };
                    recoveredImagesRef.current.set(frameIdx, fresh);
                }
                return;
            }

            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;

            context.drawImage(
                img,
                0, 0, img.width, img.height,
                centerShift_x, centerShift_y,
                img.width * ratio, img.height * ratio
            );
        };

        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Start a bit into the sequence for a nicer initial pose
            const initialFrame = Math.min(22, TOTAL_FRAMES - 1);
            renderFrame(initialFrame);
        };

        window.addEventListener('resize', updateCanvasSize);
        updateCanvasSize();

        // Extra safety: force one more draw shortly after everything is wired (helps with StrictMode double-invoke / timing)
        setTimeout(() => {
            if (imagesRef.current.length > 0) {
                renderFrame(Math.min(22, TOTAL_FRAMES - 1));
            }
        }, 800);

        // Create the scroll-scrub timeline
        const scrubEnd = "+=250%"; // full sequence plays with reasonable scroll distance

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: scrubEnd,
                scrub: 1.1,
                pin: true,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    // Map progress across the full frame range
                    renderFrame(self.progress * (TOTAL_FRAMES - 1));
                }
            }
        });

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [images.length]); // re-init when we actually have frames

    return (
        <section ref={containerRef} style={{ height: '100vh', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#0b0e12' }}>
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

        </section>
    );
};

export default Hero;
