import React, { useEffect, useState } from 'react';

const FRAME_START = 1;
const FRAME_END = 145;
const TOTAL_FRAMES = FRAME_END - FRAME_START + 1; // 145 frames

const Loader = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const images = [];
    let loadedCount = 0;
    let successCount = 0;

    const preloadImages = async () => {
      const promises = [];

      for (let i = FRAME_START; i <= FRAME_END; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(8, '0');
        img.src = `/frames/${frameIndex}.jpg`;
        images.push(img);

        const promise = new Promise((resolve) => {
          img.onload = () => {
            loadedCount++;
            successCount++;
            const percentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);
            setProgress(percentage);
            resolve();
          };

          img.onerror = () => {
            loadedCount++;
            const percentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);
            setProgress(percentage);
            // Do NOT count as success
            resolve();
          };

          // decode() can help surface decode errors
          if ('decode' in img) {
            img.decode().catch(() => {});
          }
        });

        promises.push(promise);
      }

      await Promise.all(promises);

      // Small delay so the progress bar is visible at 100%
      setTimeout(() => {
        onLoaded(images);
      }, 650);
    };

    preloadImages();
  }, [onLoaded]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      color: '#D4AF37',
    }}>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        MAISON DE LUXE
      </div>
      <div style={{ width: '200px', height: '2px', background: '#333', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: '100%',
          background: '#D4AF37',
          transform: `scaleX(${progress / 100})`, transformOrigin: 'left', transition: 'transform 0.1s linear'
        }} />
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{progress}%</div>
    </div>
  );
};

export default Loader;
