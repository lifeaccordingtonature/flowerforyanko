import { useState, useRef, useEffect, lazy, Suspense } from 'react';
const SketchCanvas = lazy(() => import('./components/SketchCanvas'));
import { RenderMode } from './types';
import Controls from './components/Controls';

function App() {
  const [effectMode, setEffectMode] = useState<RenderMode>(0);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Phase 3: Start Experience
  const startExperience = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setHasStarted(true);
  };

  // Auto-start experience when ready
  useEffect(() => {
    if (isReady && !hasStarted) {
      startExperience();
    }
  }, [isReady, hasStarted, startExperience]);

  return (
    <div className="app-container">
      <Suspense fallback={<div className="canvas-placeholder"></div>}>
        <SketchCanvas 
          imageSrc={null} 
          effectMode={effectMode}
          onReady={(ready) => setIsReady(ready)}
          hasStarted={hasStarted}
        />
      </Suspense>

      <audio 
        ref={audioRef} 
        src={`${import.meta.env.BASE_URL}music.mp3`} 
        loop 
      />

      {/* Modern UI Overlay (Main Controls) */}
      <div className={`ui-overlay ${!hasStarted ? 'hidden' : ''}`}>
        
        <div className="controls-panel-desktop">
          <Controls 
            effectMode={effectMode}
            setEffectMode={setEffectMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
