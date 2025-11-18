import React, { useState, useEffect } from 'react';
import Canvas from './components/Canvas';
import Controls from './components/Controls';
import { GravityWell, SimulationConfig, GeminiThemeResponse } from './types';
import { INITIAL_CONFIG, DEFAULT_WELLS, COLOR_PALETTES } from './constants';
import { generateTheme } from './services/geminiService';

const App: React.FC = () => {
  const [wells, setWells] = useState<GravityWell[]>([]);
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
  const [palette, setPalette] = useState<string[]>(COLOR_PALETTES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<GeminiThemeResponse | null>(null);

  // Initialize dimensions-dependent initial wells
  useEffect(() => {
    setWells([
      { 
        id: 'center', 
        position: { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 
        mass: 3000, 
        color: '#ffffff' 
      }
    ]);
  }, []);

  const handleClear = () => {
    // We keep the center well but remove others for a "clear" effect, or just remove all
    setWells([]);
  };

  const handleGenerateTheme = async (prompt: string) => {
    setIsGenerating(true);
    const theme = await generateTheme(prompt);
    setIsGenerating(false);

    if (theme) {
      setCurrentTheme(theme);
      // Map normalized coordinates to screen size
      const width = window.innerWidth;
      const height = window.innerHeight;

      const newWells: GravityWell[] = theme.wells.map((w, i) => ({
        id: `ai-${i}`,
        position: { x: w.x * width, y: w.y * height },
        mass: w.mass,
        color: w.color
      }));

      setWells(newWells);
      
      // Randomly pick a palette or generate one based on theme description? 
      // For now, cycle palettes randomly to simulate variety
      setPalette(COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans">
      <Canvas 
        wells={wells} 
        setWells={setWells} 
        config={config} 
        palette={palette}
        isPaused={false}
      />
      <Controls 
        config={config} 
        setConfig={setConfig} 
        onClear={handleClear}
        onGenerate={handleGenerateTheme}
        isGenerating={isGenerating}
        currentTheme={currentTheme}
      />
      
      {/* Subtle footer instruction */}
      <div className="absolute bottom-4 right-4 text-white/20 text-xs pointer-events-none select-none">
        Powered by Gemini 2.5 Flash • Physics Engine v1.0
      </div>
    </div>
  );
};

export default App;