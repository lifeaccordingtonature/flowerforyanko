import { useState, useRef, useEffect, lazy, Suspense } from 'react';
const SketchCanvas = lazy(() => import('./components/SketchCanvas'));
import { RenderMode } from './types';
import Controls from './components/Controls';

function App() {
  const [effectMode, setEffectMode] = useState<RenderMode>(0);
  const [isReady, setIsReady] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Phase 3: Start Experience
  const startExperience = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setHasStarted(true);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
    }
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
      <div 
        className={`ui-overlay ${!hasStarted ? 'hidden' : ''}`}
        onClick={() => mobileDrawerOpen && setMobileDrawerOpen(false)}
        style={{ pointerEvents: mobileDrawerOpen ? 'auto' : 'none' }}
      >
        
        <div className="controls-panel-desktop">
          <Controls 
            effectMode={effectMode}
            setEffectMode={setEffectMode}
          />
        </div>

        {/* Mobile Hamburger Menu */}
        <button 
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMobileDrawerOpen(!mobileDrawerOpen);
          }}
          aria-label="Menu"
          style={{ pointerEvents: 'auto' }}
        >
          ☰
        </button>

        {/* Mobile Drawer Menu */}
        <div 
          className={`mobile-drawer ${mobileDrawerOpen ? 'open' : ''}`}
          onClick={(e) => e.stopPropagation()}
          style={{ pointerEvents: mobileDrawerOpen ? 'auto' : 'none' }}
        >
          <Controls 
            effectMode={effectMode}
            setEffectMode={(mode) => {
              setEffectMode(mode);
              setMobileDrawerOpen(false);
            }}
          />
        </div>

        {/* Sound Button */}
        <button 
          className="sound-btn" 
          onClick={playAudio}
          aria-label="Play Audio"
          style={{ pointerEvents: 'auto' }}
        >
          🔊
        </button>
      </div>
    </div>
  );
}

export default App;
