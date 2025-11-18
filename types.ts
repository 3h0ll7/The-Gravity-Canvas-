export interface Vector2 {
  x: number;
  y: number;
}

export interface GravityWell {
  id: string;
  position: Vector2;
  mass: number; // Affects pull strength
  color: string; // For visualization/debugging
  pulsing?: boolean;
}

export interface Particle {
  id: string;
  position: Vector2;
  velocity: Vector2;
  color: string;
  size: number;
  life: number; // Frames existed
}

export interface SimulationConfig {
  gravityConstant: number;
  friction: number;
  trailFade: number; // 0.0 to 1.0 (opacity of clearing rect)
  particleSpawnRate: number; // Frames between spawns
  maxParticles: number;
}

export interface GeminiThemeResponse {
  themeName: string;
  description: string;
  wells: {
    x: number; // 0-1 normalized
    y: number; // 0-1 normalized
    mass: number; // Relative strength
    color: string;
  }[];
  backgroundStyle: string; // Hex color
}
