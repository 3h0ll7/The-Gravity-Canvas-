export const INITIAL_CONFIG = {
  gravityConstant: 0.5,
  friction: 0.999, // Very low friction for space-like movement
  trailFade: 0.05, // Lower = longer trails
  particleSpawnRate: 5,
  maxParticles: 800,
};

export const COLOR_PALETTES = [
  ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6'], // Neon Pink/Purple
  ['#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'], // Cyber Blue
  ['#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4'], // Matrix Green
  ['#f59e0b', '#f97316', '#ef4444', '#dc2626', '#b91c1c'], // Magma
];

export const DEFAULT_WELLS = [
  { id: 'w1', position: { x: 0.5, y: 0.5 }, mass: 2000, color: '#ffffff' }
];
