import React from 'react';
import { RenderMode } from '../types';

interface ControlsProps {
  effectMode: RenderMode;
  setEffectMode: (mode: RenderMode) => void;
  onCloseMenu?: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  effectMode,
  setEffectMode,
  onCloseMenu
}) => {
  const modes = ['ascii', 'dots', 'pixel', 'all'] as const;

  return (
    <>
      <div className="mode-group">
        <div className="label-small">Renderer</div>
        {modes.map((mode, index) => (
          <button
            key={mode}
            className={`text-btn ${effectMode === index ? 'active' : ''}`}
            onClick={() => { 
              setEffectMode(index as RenderMode); 
              onCloseMenu?.();
            }}
          >
            {mode}
          </button>
        ))}
      </div>
    </>
  );
};

export default Controls;
