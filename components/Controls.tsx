import React, { useState } from 'react';
import { SimulationConfig, GeminiThemeResponse } from '../types';

interface ControlsProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
  onClear: () => void;
  onGenerate: (prompt: string) => Promise<void>;
  isGenerating: boolean;
  currentTheme: GeminiThemeResponse | null;
}

const Controls: React.FC<ControlsProps> = ({ 
  config, 
  setConfig, 
  onClear, 
  onGenerate, 
  isGenerating,
  currentTheme 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
    }
  };

  return (
    <div className={`absolute top-4 left-4 max-w-xs w-full z-10 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-80'}`}>
      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl text-white overflow-hidden">
        
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h1 className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Gravity Canvas
          </h1>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-xs text-gray-400 hover:text-white"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </button>
        </div>

        {isExpanded && (
          <div className="p-4 space-y-5">
            
            {/* AI Generation Section */}
            <form onSubmit={handleSubmit} className="space-y-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">AI Theme Generator</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'Binary Star System' or 'Chaos'"
                  className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isGenerating}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded px-3 py-2 text-sm font-medium transition-colors"
                >
                  {isGenerating ? '...' : 'Go'}
                </button>
              </div>
              {currentTheme && (
                <div className="text-xs text-gray-300 italic mt-1 border-l-2 border-purple-500 pl-2">
                  Loaded: {currentTheme.themeName}
                </div>
              )}
            </form>

            <div className="h-px bg-white/10"></div>

            {/* Physics Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Gravity Strength</span>
                  <span>{config.gravityConstant.toFixed(1)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="2.0" 
                  step="0.1"
                  value={config.gravityConstant}
                  onChange={(e) => setConfig({...config, gravityConstant: parseFloat(e.target.value)})}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Trail Persistence</span>
                  <span>{((1 - config.trailFade) * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.2" 
                  step="0.01"
                  // Reverse logic for UI: Slider Left = Short trails (High fade), Right = Long trails (Low fade)
                  value={0.21 - config.trailFade}
                  onChange={(e) => setConfig({...config, trailFade: 0.21 - parseFloat(e.target.value)})}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

               <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Max Particles</span>
                  <span>{config.maxParticles}</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="3000" 
                  step="100"
                  value={config.maxParticles}
                  onChange={(e) => setConfig({...config, maxParticles: parseInt(e.target.value)})}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
              </div>
            </div>

            <button 
              onClick={onClear}
              className="w-full border border-white/20 hover:bg-white/10 text-white rounded px-3 py-2 text-sm transition-colors"
            >
              Clear Canvas
            </button>
            
            <p className="text-[10px] text-gray-500 text-center">
              Click anywhere to add a gravity well.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Controls;