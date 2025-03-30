// Level3.js
// This file defines the loadLevel3 function for loading level 3 after Level2 is completed.

function loadLevel3(player, canvas) {
  // Level 3 configuration with expanded world and increased difficulty.
  const levelData = {
    worldWidth: 12000 * 4,  // Expanded world width for Level 3.
    platforms: [
      { x: 0, y: canvas.height - 20, width: 12000 * 4, height: 20, type: 'ground' },
      { x: 500 * 4, y: 340, width: 150, height: 10, type: 'platform' },
      { x: 1000 * 4, y: 300, width: 120, height: 10, type: 'platform' },
      { x: 1500 * 4, y: 260, width: 150, height: 10, type: 'platform' },
      { x: 2200 * 4, y: 280, width: 100, height: 10, type: 'platform' },
      { x: 3000 * 4, y: 240, width: 150, height: 10, type: 'platform' },
      { x: 3700 * 4, y: 300, width: 120, height: 10, type: 'platform' },
      { x: 4400 * 4, y: 260, width: 150, height: 10, type: 'platform' },
      { x: 5200 * 4, y: 280, width: 100, height: 10, type: 'platform' },
    ],
    enemies: [
      { x: 800 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.0 },
      { x: 1300 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 2.5 },
      { x: 1900 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.0 },
      { x: 2500 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 2.5 },
      { x: 3100 * 4, y: canvas.height - 50, type: 'patrol', health: 3, speed: 2.0 },
      { x: 3700 * 4, y: canvas.height - 50, type: 'chaser', health: 3, speed: 2.5 },
    ],
    boss: { x: 5000 * 4, y: canvas.height - 80, health: 7 },
    powerUps: [
      { x: 900 * 4, y: 320, type: 'life' },
      { x: 2100 * 4, y: 260, type: 'invincibility' },
      { x: 4000 * 4, y: 220, type: 'key' },
    ],
    hoverboard: { x: 3500 * 4, y: 300 },
    door: { x: 5500 * 4, y: canvas.height - 100, width: 50, height: 80 },
    playerStart: { x: 50, y: canvas.height - 50 }
  };

  // Reset player's position for Level 3.
  player.x = levelData.playerStart.x;
  player.y = levelData.playerStart.y;

  return levelData;
}

// Expose loadLevel3 globally so game.js can call it when Level 3 is reached.
window.loadLevel3 = loadLevel3;
