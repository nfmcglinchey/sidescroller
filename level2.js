// Level2.js
// This file defines the loadLevel2 function for loading level 2 when the player pushes [Enter] to continue.

function loadLevel2(player, canvas) {
  // Level 2 configuration with expanded world
  const levelData = {
    worldWidth: 10000 * 4,  // Make the world 4 times wider
    platforms: [
      { x: 0, y: canvas.height - 20, width: 10000 * 4, height: 20, type: 'ground' },
      { x: 400 * 4, y: 320, width: 120, height: 10, type: 'platform' },
      { x: 800 * 4, y: 280, width: 100, height: 10, type: 'platform' },
      { x: 1200 * 4, y: 240, width: 100, height: 10, type: 'platform' },
      { x: 1800 * 4, y: 300, width: 100, height: 10, type: 'platform' },
      { x: 2500 * 4, y: 260, width: 120, height: 10, type: 'platform' },
      { x: 3200 * 4, y: 220, width: 100, height: 10, type: 'platform' },
      { x: 4000 * 4, y: 200, width: 100, height: 10, type: 'platform' },
    ],
    enemies: [
      { x: 600 * 4, y: canvas.height - 50, type: 'patrol', health: 2, speed: 2.0 },
      { x: 1000 * 4, y: canvas.height - 50, type: 'chaser', health: 2, speed: 2.0 },
      { x: 1400 * 4, y: canvas.height - 50, type: 'patrol', health: 2, speed: 2.0 },
      { x: 2000 * 4, y: canvas.height - 50, type: 'chaser', health: 2, speed: 2.0 },
      { x: 2600 * 4, y: canvas.height - 50, type: 'patrol', health: 2, speed: 2.0 },
    ],
    boss: { x: 4500 * 4, y: canvas.height - 80, health: 5 },
    powerUps: [
      { x: 700 * 4, y: 300, type: 'life' },
      { x: 1500 * 4, y: 250, type: 'invincibility' },
      { x: 3500 * 4, y: 180, type: 'key' },
    ],
    hoverboard: { x: 2000 * 4, y: 300 },
    door: { x: 4800 * 4, y: canvas.height - 100, width: 50, height: 80 },
    playerStart: { x: 50, y: canvas.height - 50 }  // Player start remains the same, adjust if desired
  };

  // Reset player's position for level 2
  player.x = levelData.playerStart.x;
  player.y = levelData.playerStart.y;

  return levelData;
}

// Expose loadLevel2 globally so game.js can call it when [Enter] is pressed.
window.loadLevel2 = loadLevel2;
