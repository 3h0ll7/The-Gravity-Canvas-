import React, { useRef, useEffect } from 'react';
import { Particle, GravityWell, SimulationConfig, Vector2 } from '../types';
import { updateParticle, checkCollisions } from '../services/physicsService';
import { COLOR_PALETTES } from '../constants';

interface CanvasProps {
  wells: GravityWell[];
  setWells: React.Dispatch<React.SetStateAction<GravityWell[]>>;
  config: SimulationConfig;
  palette: string[];
  isPaused: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ wells, setWells, config, palette, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>();
  const frameCountRef = useRef<number>(0);

  // Initialize canvas size
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Simulation Loop
  const animate = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const width = canvasRef.current.width;
    const height = canvasRef.current.height;

    // 1. Trail Effect (Fade out previous frame)
    // Using 'destination-out' or simply drawing a transparent rectangle over top
    ctx.fillStyle = `rgba(0, 0, 0, ${config.trailFade})`;
    ctx.fillRect(0, 0, width, height);

    // 2. Render Gravity Wells
    wells.forEach(well => {
      ctx.beginPath();
      // Create a glow effect
      const gradient = ctx.createRadialGradient(
        well.position.x, well.position.y, 0,
        well.position.x, well.position.y, 20
      );
      gradient.addColorStop(0, well.color);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.arc(well.position.x, well.position.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Core
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(well.position.x, well.position.y, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!isPaused) {
      // 3. Spawn Particles
      frameCountRef.current++;
      if (frameCountRef.current % config.particleSpawnRate === 0 && particlesRef.current.length < config.maxParticles) {
        const spawnEdge = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
        let px, py, vx, vy;
        
        // Spawn logic: Shoot from edges towards center generally
        const speed = 2;
        
        if (spawnEdge === 0) { px = Math.random() * width; py = 0; vx = (Math.random() - 0.5) * speed; vy = speed; }
        else if (spawnEdge === 1) { px = width; py = Math.random() * height; vx = -speed; vy = (Math.random() - 0.5) * speed; }
        else if (spawnEdge === 2) { px = Math.random() * width; py = height; vx = (Math.random() - 0.5) * speed; vy = -speed; }
        else { px = 0; py = Math.random() * height; vx = speed; vy = (Math.random() - 0.5) * speed; }

        particlesRef.current.push({
          id: Math.random().toString(36).substr(2, 9),
          position: { x: px, y: py },
          velocity: { x: vx, y: vy },
          color: palette[Math.floor(Math.random() * palette.length)],
          size: Math.random() * 1.5 + 0.5,
          life: 0
        });
      }

      // 4. Update Particles
      particlesRef.current = particlesRef.current.map(p => 
        updateParticle(p, wells, config, width, height)
      );

      // 5. Draw Particles (Additive blending for glowing look)
      ctx.globalCompositeOperation = 'lighter';
      particlesRef.current.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.position.x, p.position.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';

      // 6. Collision Logic (Optional burst event)
      // If two particles collide, small chance to create a temporary micro-well
      // To save performance, we only check a subset or use a probabilistic approach
      if (frameCountRef.current % 10 === 0) {
         const collisionPoint = checkCollisions(particlesRef.current);
         if (collisionPoint && Math.random() > 0.8) {
             // Visual burst
             ctx.beginPath();
             ctx.strokeStyle = '#fff';
             ctx.lineWidth = 2;
             ctx.arc(collisionPoint.x, collisionPoint.y, 10, 0, Math.PI * 2);
             ctx.stroke();
             
             // Remove some particles to keep performance up if we wanted
         }
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wells, config, isPaused, palette]); // Re-bind loop when critical state changes

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setWells(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        position: { x, y },
        mass: Math.random() * 1000 + 1000,
        color: '#ffffff'
      }
    ]);
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="absolute top-0 left-0 w-full h-full cursor-crosshair"
    />
  );
};

export default Canvas;