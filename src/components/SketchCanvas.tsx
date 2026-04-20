import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RenderMode } from '../types';
import { useSketch } from '../hooks/useSketch';

interface SketchCanvasProps {
  imageSrc: string | null;
  effectMode: RenderMode;
  onReady: (ready: boolean) => void;
  hasStarted: boolean;
}

const SketchCanvas: React.FC<SketchCanvasProps> = ({ 
  imageSrc, 
  effectMode, 
  onReady, 
  hasStarted 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isP5Ready, setIsP5Ready] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  // Phase 3: Synchronized Loading
  const loadingTimerFinished = useRef(false);

  const handleLoadingProgress = useCallback((pct: number) => {
    setProgress(pct);
  }, []);

  const handleReady = useCallback(() => {
    setIsP5Ready(true);
  }, []);

  const { startExperience, updateCustomImage, setEffectMode } = useSketch(
    containerRef,
    handleLoadingProgress,
    handleReady
  );


  useEffect(() => {
    // Start 2.5s minimum loading timer
    const timer = setTimeout(() => {
      loadingTimerFinished.current = true;
      if (isP5Ready) {
        onReady(true);
      } else if (!hasError) {
        // If p5 is not ready after 2.5s, show error
        setHasError(true);
        onReady(true); // Still mark as ready to show the UI
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isP5Ready, onReady, hasError]);

  // Synchronize start signal
  useEffect(() => {
    if (hasStarted) {
      startExperience();
    }
  }, [hasStarted, startExperience]);

  useEffect(() => {
    updateCustomImage(imageSrc);
  }, [imageSrc, updateCustomImage]);

  useEffect(() => {
    setEffectMode(effectMode);
  }, [effectMode, setEffectMode]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {hasError && !hasStarted && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontFamily: 'Courier New, monospace',
          textAlign: 'center',
          zIndex: 1000
        }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Unable to load canvas</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>
            Try refreshing the page or use a different device
          </div>
        </div>
      )}
      <div id="loader" className={hasStarted ? 'fade' : ''}>
        <div className="title">LOADING</div>
        <div className="bar-bg">
          <div 
            className="bar-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="pct">{Math.floor(progress)}%</div>
      </div>
    </div>
  );
};

export default SketchCanvas;
