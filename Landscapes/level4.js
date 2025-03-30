// level4.js
// Defines the loadLevel4 function for Level 4.
// This level uses "sri lanka.png" as its background. Make sure your game.js level transition logic uses levelData.background.
// It includes additional platforms—including a vertical chain for reaching the top for an extra life—and faster enemies.

function loadLevel4(player, canvas) {
  const levelData = {
    // World width: slightly larger than level3.
    worldWidth: 13000 * 4,
    
    // Platforms array. The first platform is the ground.
    platforms: [
      { x: 0, y: canvas.height - 20, width: 13000 * 4, height: 20, type: 'ground' },
      
      // Regular platforms
      { x: 600 * 4, y: 350, width: 120, height: 10, type: 'platform' },
      { x: 1000 * 4, y: 320, width: 150, height: 10, type: 'platform' },
      { x: 1500 * 4, y: 280, width: 150, height: 10, type: 'platform' },
      { x: 2100 * 4, y: 250, width: 120, height: 10, type: 'platform' },
      
      // Vertical chain of platforms for extra life opportunity
      { x: 2500 * 4, y: 220, width: 100, height: 10, type: 'platform' },
      { x: 2700 * 4, y: 180, width: 100, height: 10, type: 'platform' },
      { x: 2900 * 4, y: 140, width: 100, height: 10, type: 'platform' },
      { x: 3100 * 4, y: 100, width: 100, height: 10, type: 'platform' },
      { x: 3300 * 4, y: 60, width: 100, height: 10, type: 'platform' },
      
      // Additional platforms further in the level
      { x: 4000 * 4, y: 300, width: 150, height: 10, type: 'platform' },
      { x: 4500 * 4, y: 260, width: 150, height: 10, type: 'platform' },
      { x: 5000 * 4, y: 220, width: 150, height: 10, type: 'platform' },
      { x: 6000 * 4, y: 340, width: 150, height: 10, type: 'platform' },
      { x: 6800 * 4, y: 300, width: 150, height: 10, type: 'platform' },
      { x: 7500 * 4, y: 260, width: 150, height: 10, type: 'platform' },
      { x: 8200 * 4, y: 220, width: 150, height: 10, type: 'platform' },
      { x: 9000 * 4, y: 280, width: 150, height: 10, type: 'platform' },
      { x: 10000 * 4, y: 240, width: 150, height: 10, type: 'platform' }
    ],
    
    // Enemies array. They are set with slightly higher speeds.
    enemies: [
      { x: 800 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.5 },
      { x: 1800 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 3.0 },
      { x: 2600 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.5 },
      { x: 3600 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 3.0 },
      { x: 4600 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.5 },
      { x: 6000 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 3.0 },
      { x: 8000 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.5 }
    ],
    
    // Boss configuration
    boss: { x: 7000 * 4, y: canvas.height - 80, health: 7 },
    
    // Power-ups: one extra life placed high up and one invincibility.
    powerUps: [
      { x: 3320 * 4, y: 20, type: 'life' },
      { x: 8000 * 4, y: 180, type: 'invincibility' }
    ],
    
    // Hoverboard position
    hoverboard: { x: 4000 * 4, y: 300 },
    
    // Door for level completion placed near the level's end.
    door: { x: 11000 * 4, y: canvas.height - 100, width: 50, height: 80 },
    
    // Starting position for the player.
    playerStart: { x: 50, y: canvas.height - 50 },
    
    // Background property to be used by the game logic to update the landscape.
    background: "Landscapes/sri lanka.png"
  };

  // Reset the player's position for Level 4.
  player.x = levelData.playerStart.x;
  player.y = levelData.playerStart.y;

  return levelData;
}

// Expose loadLevel4 globally so game.js can call it.
window.loadLevel4 = loadLevel4;
