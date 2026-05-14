import React, { useEffect, useState } from 'react';

const CanvasPreview = ({ imageSrc, filters, jpegSettings, canvasRef }) => {
  const [imageObj, setImageObj] = useState(null);

  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => setImageObj(img);
      img.src = imageSrc;
    }
  }, [imageSrc]);

  useEffect(() => {
    if (!imageObj || !canvasRef.current) return;

    let isCancelled = false;

    const renderCanvas = async () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      // Set max dimensions based on maxResolution (megapixels)
      let maxPixels = jpegSettings.maxResolution === 'original' ? Infinity : jpegSettings.maxResolution * 1000000;
      
      if (filters.cursedColors && filters.cursedColors.active) {
        // Force very low resolution for extreme blockiness to match reference image
        maxPixels = Math.min(maxPixels, 0.03 * 1000000); 
      }
      
      let width = imageObj.width;
      let height = imageObj.height;
      const currentPixels = width * height;
  
      if (currentPixels > maxPixels) {
        const scale = Math.sqrt(maxPixels / currentPixels);
        width = Math.floor(width * scale);
        height = Math.floor(height * scale);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw initial image
      ctx.drawImage(imageObj, 0, 0, width, height);

      // Apply filters
      let imageData = ctx.getImageData(0, 0, width, height);
      let data = imageData.data;

      // Helper functions
      const applyDeepFry = (intensity) => {
        const factor = (259 * (intensity + 255)) / (255 * (259 - intensity));
        for (let i = 0; i < data.length; i += 4) {
          data[i] = factor * (data[i] - 128) + 128;
          data[i+1] = factor * (data[i+1] - 128) + 128;
          data[i+2] = factor * (data[i+2] - 128) + 128;
          const max = Math.max(data[i], data[i+1], data[i+2]);
          if (data[i] === max) data[i] += intensity;
          if (data[i+1] === max) data[i+1] += intensity;
          const noise = (Math.random() - 0.5) * intensity;
          data[i] += noise;
          data[i+1] += noise;
          data[i+2] += noise;
          data[i] += intensity * 0.5;
        }
      };

      const applyGlitch = (intensity) => {
        const shiftAmount = Math.floor((intensity / 100) * 20);
        const newImageData = new Uint8ClampedArray(data);
        for (let i = 0; i < data.length; i += 4) {
          if (i + shiftAmount * 4 < data.length) newImageData[i] = data[i + shiftAmount * 4];
          if (i - shiftAmount * 4 >= 0) newImageData[i+2] = data[i - shiftAmount * 4 + 2];
        }
        const numSlices = Math.floor((intensity / 100) * 50);
        for (let s = 0; s < numSlices; s++) {
          const sliceY = Math.floor(Math.random() * height);
          const sliceHeight = Math.floor(Math.random() * 10) + 1;
          const sliceShift = Math.floor((Math.random() - 0.5) * intensity);
          for (let y = sliceY; y < sliceY + sliceHeight && y < height; y++) {
            for (let x = 0; x < width; x++) {
              const srcIdx = (y * width + x) * 4;
              let dstX = x + sliceShift;
              if (dstX >= width) dstX -= width;
              if (dstX < 0) dstX += width;
              const dstIdx = (y * width + dstX) * 4;
              newImageData[dstIdx] = newImageData[srcIdx];
              newImageData[dstIdx+1] = newImageData[srcIdx+1];
              newImageData[dstIdx+2] = newImageData[srcIdx+2];
              newImageData[dstIdx+3] = newImageData[srcIdx+3];
            }
          }
        }
        data.set(newImageData);
      };

      const applyWave = (intensity) => {
        const newImageData = new Uint8ClampedArray(data);
        const amplitude = (intensity / 100) * 50;
        const frequency = (intensity / 100) * 0.1;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const shiftY = Math.floor(Math.sin(x * frequency) * amplitude);
            let srcY = y + shiftY;
            if (srcY < 0) srcY = 0;
            if (srcY >= height) srcY = height - 1;
            const dstIdx = (y * width + x) * 4;
            const srcIdx = (srcY * width + x) * 4;
            newImageData[dstIdx] = data[srcIdx];
            newImageData[dstIdx+1] = data[srcIdx+1];
            newImageData[dstIdx+2] = data[srcIdx+2];
            newImageData[dstIdx+3] = data[srcIdx+3];
          }
        }
        data.set(newImageData);
      };

      const applyPixelate = (intensity) => {
        const blockSize = Math.max(1, Math.floor((intensity / 100) * 30));
        if (blockSize === 1) return;
        for (let y = 0; y < height; y += blockSize) {
          for (let x = 0; x < width; x += blockSize) {
            const pixelIdx = (y * width + x) * 4;
            const r = data[pixelIdx];
            const g = data[pixelIdx+1];
            const b = data[pixelIdx+2];
            for (let dy = 0; dy < blockSize && y + dy < height; dy++) {
              for (let dx = 0; dx < blockSize && x + dx < width; dx++) {
                const fillIdx = ((y + dy) * width + (x + dx)) * 4;
                data[fillIdx] = r;
                data[fillIdx+1] = g;
                data[fillIdx+2] = b;
              }
            }
          }
        }
      };

      // True Colour effect does not alter the pixel data natively,
      // it only applies the low resolution limit and the heavy JPEG loop below.

      if (filters.deepFry.active) applyDeepFry(filters.deepFry.intensity);
      if (filters.glitch.active) applyGlitch(filters.glitch.intensity);
      if (filters.wave.active) applyWave(filters.wave.intensity);
      if (filters.pixelate.active) applyPixelate(filters.pixelate.intensity);

      if (filters.frying && filters.frying.active) {
        applyDeepFry(100);
      }

      if (filters.cursedColors && filters.cursedColors.active) {
        // "True Colour" - we do not alter the pixel data colors here.
      }

      if (isCancelled) return;
      ctx.putImageData(imageData, 0, 0);

      const isFrying = filters.frying && filters.frying.active;
      const isCursed = filters.cursedColors && filters.cursedColors.active;

      if (isFrying || isCursed) {
        const passes = isCursed ? 20 : 15;
        const quality = isCursed ? 0.01 : 0.02;
        
        for (let i = 0; i < passes; i++) {
          if (isCancelled) break;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          await new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
              if (isCancelled) return resolve();
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              if (i % 2 === 0) {
                ctx.drawImage(img, 1, 1, canvas.width - 2, canvas.height - 2);
              } else {
                ctx.drawImage(img, -1, -1, canvas.width + 2, canvas.height + 2);
              }
              resolve();
            };
            img.src = dataUrl;
          });
        }
      }

      // Async JPEG crush
      if (jpegSettings.active) {
        const iterations = jpegSettings.fryCount;
        const quality = jpegSettings.fryQuality / 100;
        
        for (let i = 0; i < iterations; i++) {
          if (isCancelled) break;
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          await new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
              if (isCancelled) return resolve();
              // Prevent transparency layering
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              // Subtly alter size each pass to break JPEG idempotency and force compression artifacts
              if (i % 2 === 0) {
                ctx.drawImage(img, 1, 1, canvas.width - 2, canvas.height - 2);
              } else {
                ctx.drawImage(img, -1, -1, canvas.width + 2, canvas.height + 2);
              }
              resolve();
            };
            img.src = dataUrl;
          });
        }
      }
    };

    renderCanvas();
    
    return () => {
      isCancelled = true;
    };
  }, [imageObj, filters, jpegSettings, canvasRef]);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasPreview;
