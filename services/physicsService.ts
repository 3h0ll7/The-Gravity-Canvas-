import { Particle, GravityWell, Vector2, SimulationConfig } from '../types';

export const updateParticle = (
  p: Particle,
  wells: GravityWell[],
  config: SimulationConfig,
  width: number,
  height: number
): Particle => {
  let fx = 0;
  let fy = 0;

  // Calculate gravitational force from each well
  wells.forEach(well => {
    const dx = well.position.x - p.position.x;
    const dy = well.position.y - p.position.y;
    const distSq = dx * dx + dy * dy;
    
    // Soften distance to avoid singularity (infinity) at closest approach
    const softenedDistSq = Math.max(distSq, 1000); 
    const dist = Math.sqrt(softenedDistSq);

    // F = G * (m1 * m2) / r^2
    // We assume particle mass is 1
    const force = (config.gravityConstant * well.mass) / softenedDistSq;

    fx += (dx / dist) * force;
    fy += (dy / dist) * force;
  });

  // Update velocity
  const newVx = (p.velocity.x + fx) * config.friction;
  const newVy = (p.velocity.y + fy) * config.friction;

  // Update position
  let newX = p.position.x + newVx;
  let newY = p.position.y + newVy;

  // Wrap around screen (Toroidal topology) creates interesting infinite loops
  // Alternatively, we could bounce or kill. Wrapping feels most "void-like".
  if (newX < 0) newX = width;
  if (newX > width) newX = 0;
  if (newY < 0) newY = height;
  if (newY > height) newY = 0;

  return {
    ...p,
    velocity: { x: newVx, y: newVy },
    position: { x: newX, y: newY },
    life: p.life + 1
  };
};

export const checkCollisions = (particles: Particle[]): Vector2 | null => {
  // Simple O(n^2) check - acceptable for < 1000 particles in this visual demo
  // Returns a position if a collision happened to spawn a well
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const p1 = particles[i];
      const p2 = particles[j];
      
      const dx = p1.position.x - p2.position.x;
      const dy = p1.position.y - p2.position.y;
      // Collision threshold squared (assuming roughly 2px radius)
      if (dx * dx + dy * dy < 16) {
        return { x: (p1.position.x + p2.position.x) / 2, y: (p1.position.y + p2.position.y) / 2 };
      }
    }
  }
  return null;
};
