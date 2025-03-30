/*********************************
 * Basic Setup
 *********************************/
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bgMusic = document.getElementById('bgMusic');

// Load the player sprite
const playerSprite = new Image();
playerSprite.src = "Character sprites/Player.png";

// Load the enemy sprite
const enemySprite = new Image();
enemySprite.src = "Character sprites/enemy.png";

// Load additional sprites
const keySprite = new Image();
keySprite.src = "Assets/key.png";

const doorSprite = new Image();
doorSprite.src = "Assets/door.png";

const powerUpSprite = new Image();
powerUpSprite.src = "Assets/power up.png";

const bossSprite = new Image();
bossSprite.src = "Character sprites/boss.png";

/*********************************
 * Global Game Variables
 *********************************/
let gameState = "TITLE"; // TITLE, PLAYING, GAME_OVER, LEVEL_COMPLETE
const GRAVITY = 0.4;
const FRICTION = 0.92;
let worldWidth = 8000;  // UPDATED: Changed from const to let to allow updating for level 2
let cameraX = 0;

/*********************************
 * Player Class
 *********************************/
class Player {
  constructor() {
    this.width = 30;
    this.height = 40;
    this.x = 50;
    this.y = canvas.height - this.height - 50; // on ground
    this.velocityX = 0;
    this.velocityY = 0;
    this.baseSpeed = 4;
    this.speed = this.baseSpeed;
    this.jumpPower = -7;
    this.lives = 3;
    this.isJumping = false;
    this.jumpCount = 0;
    this.maxJumps = 2;
    this.jumpHeld = false;
    this.isDashing = false;
    this.facingRight = true;

    // Invincibility states
    this.invFromPowerUp = false;
    this.invPowerTimer = 0;
    this.invFromHit = false;
    this.invHitTimer = 0;

    this.onHoverboard = false;

    // Tracks how many keys the player has
    this.hasKey = 0;
  }

  update() {
    // Gravity
    this.velocityY += GRAVITY;

    // Variable Jump
    if (this.jumpHeld && this.velocityY < -2) {
      this.velocityY -= 0.2;
    }

    // Apply velocity
    this.y += this.velocityY;
    this.x += this.velocityX;

    // Horizontal friction
    this.velocityX *= FRICTION;

    // Limit movement to world bounds
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > worldWidth) {
      this.x = worldWidth - this.width;
    }

    // Power-Up invincibility timer
    if (this.invFromPowerUp) {
      this.invPowerTimer--;
      if (this.invPowerTimer <= 0) {
        this.invFromPowerUp = false;
      }
    }

    // Post-Hit invincibility timer
    if (this.invFromHit) {
      this.invHitTimer--;
      if (this.invHitTimer <= 0) {
        this.invFromHit = false;
      }
    }

    // Check collision with floor (simple ground)
    if (this.y + this.height > canvas.height - 20) {
      this.y = canvas.height - 20 - this.height;
      this.velocityY = 0;
      this.jumpCount = 0; // reset jumps when on ground
    }
  }

  jump() {
    if (this.jumpCount < this.maxJumps) {
      this.velocityY = this.jumpPower;
      this.jumpCount++;
      this.jumpHeld = true;
    }
  }

  stopJump() {
    this.jumpHeld = false;
  }

  dash() {
    const dashSpeed = this.facingRight
      ? (this.onHoverboard ? this.baseSpeed * 2 * 2.5 : this.baseSpeed * 2.5)
      : (this.onHoverboard ? -this.baseSpeed * 2 * 2.5 : -this.baseSpeed * 2.5);
    this.velocityX = dashSpeed;
    if (!this.isDashing) {
      this.isDashing = true;
      setTimeout(() => { this.isDashing = false; }, 250);
    }
  }

  draw() {
    // Decide if we flicker (and how fast)
    let flickerInterval = 0;

    // Power-up invincibility flickers slower (100ms)
    if (this.invFromPowerUp) {
      flickerInterval = 100;
    }
    // Post-hit invincibility flickers faster (50ms)
    else if (this.invFromHit) {
      flickerInterval = 50;
    }

    if (flickerInterval > 0) {
      const flicker = Math.floor(Date.now() / flickerInterval) % 2 === 0;
      if (!flicker) return;
    }

    ctx.drawImage(playerSprite, this.x, this.y, this.width, this.height);
  }
}

/*********************************
 * Platform Class
 *********************************/
const platformImg = new Image();
platformImg.src = "Assets/platform.png";

class Platform {
  constructor(x, y, width, height, type = 'platform') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 'ground' or 'platform'
  }

  draw() {
    if (this.type === 'ground') {
      ctx.fillStyle = '#A3D6E8';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(platformImg, this.x, this.y, this.width, this.height);
    }
  }
}

/*********************************
 * Enemy Class
 *********************************/
class Enemy {
  constructor(x, y, type = 'patrol') {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = type === 'chaser' ? 2.5 : 1.5;
    this.type = type;
    this.patrolDir = 1;
    this.patrolDistance = 100;
    this.startX = x;
    this.health = 1;
  }

  update() {
    if (this.type === 'chaser' && Math.abs(player.x - this.x) < 250) {
      this.x += (player.x > this.x ? this.speed : -this.speed);
    } else {
      this.x += this.patrolDir * this.speed;
      if (Math.abs(this.x - this.startX) > this.patrolDistance) {
        this.patrolDir *= -1;
      }
    }
  }

  draw() {
    if (this.health <= 0) return;
    ctx.drawImage(enemySprite, this.x, this.y, this.width, this.height);
  }
}

/*********************************
 * Boss Class
 *********************************/
class Boss {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 60;
    this.health = 3;
    this.phase = 1;
    this.alive = true;
  }

  update() {
    if (!this.alive) return;
    this.x += (this.phase === 1 ? 2 : 3) * Math.sin(Date.now() * 0.002);
  }

  draw() {
    if (!this.alive) return;
    ctx.drawImage(bossSprite, this.x, this.y, this.width, this.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y - 10, this.width * (this.health / 3), 5);
  }
}

/*********************************
 * PowerUp Class
 *********************************/
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    this.type = type;
    this.active = true;
  }

  draw() {
    if (!this.active) return;
    if (this.type === 'key') {
      ctx.drawImage(keySprite, this.x, this.y, this.width, this.height);
    } else {
      ctx.drawImage(powerUpSprite, this.x, this.y, this.width, this.height);
    }
  }
}

/*********************************
 * Vehicle (Hoverboard)
 *********************************/
class Vehicle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 20;
    this.velocityX = 0;
    this.active = true;
    this.attached = false;
  }

  update() {
    if (!this.attached) {
      this.x += this.velocityX;
      this.velocityX *= 0.95;
    }
  }

  draw() {
    if (!this.active) return;
    const gradient = ctx.createLinearGradient(this.x, this.y, this.x + this.width, this.y);
    gradient.addColorStop(0, 'silver');
    gradient.addColorStop(1, 'gray');

    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/*********************************
 * Door Class
 *********************************/
class Door {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isOpen = false;
  }
  
  draw() {
    ctx.drawImage(doorSprite, this.x, this.y, this.width, this.height);
  }
}

/*********************************
 * Level Data and Initial Entities
 *********************************/
const player = new Player();

const platforms = [
  new Platform(0, canvas.height - 20, worldWidth, 20, 'ground'),
  new Platform(200 * 4, 300, 100, 10),
  new Platform(400 * 4, 250, 100, 10),
  new Platform(600 * 4, 200, 100, 10),
  new Platform(850 * 4, 300, 100, 10),
  new Platform(1100 * 4, 270, 100, 10),
  new Platform(1300 * 4, 220, 100, 10),
  new Platform(1500 * 4, 180, 100, 10),
  new Platform(1800 * 4, 220, 100, 10),
  new Platform(1000 * 4, 260, 100, 10),
  new Platform(1700 * 4, 210, 100, 10)
];

const enemies = [
  new Enemy(300 * 4, canvas.height - 50, 'patrol'),
  new Enemy(800 * 4, canvas.height - 50, 'chaser'),
  new Enemy(1200 * 4, canvas.height - 50, 'patrol'),
  new Enemy(1400 * 4, canvas.height - 50, 'patrol'),
  new Enemy(1600 * 4, canvas.height - 50, 'chaser')
];

const boss = new Boss(1850 * 4, canvas.height - 80);

const powerUps = [
  new PowerUp(420 * 4, 220, 'life'),
  new PowerUp(620 * 4, 170, 'invincibility'),
  new PowerUp(1500 * 4, 140, 'key')
];

const hoverboard = new Vehicle(950 * 4, 280);

let door = new Door(1900 * 4, canvas.height - 100, 50, 80);

/*********************************
 * Input Handling
 *********************************/
const keys = {};

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  if (gameState === "TITLE" && e.code === 'Enter') {
    startGame();
  } else if (gameState === "GAME_OVER" && e.code === 'Enter') {
    resetGame();
  } else if (gameState === "LEVEL_COMPLETE" && e.code === 'Enter') {
    // Push [Enter] to Continue: load level 2 using loadLevel2 from level2.js
    const level2Data = loadLevel2(player, canvas);

    // UPDATED: Update worldWidth to match level 2 configuration
    worldWidth = level2Data.worldWidth;

    // Update platforms based on level2 configuration
    platforms.length = 0;
    level2Data.platforms.forEach(pl => {
      platforms.push(new Platform(pl.x, pl.y, pl.width, pl.height, pl.type));
    });

    // Update enemies
    enemies.length = 0;
    level2Data.enemies.forEach(en => {
      let enemy = new Enemy(en.x, canvas.height - 50, en.type);
      enemy.health = en.health;
      enemy.speed = en.speed;
      enemies.push(enemy);
    });

    // Update boss
    boss.x = level2Data.boss.x;
    boss.y = level2Data.boss.y;
    boss.health = level2Data.boss.health;
    boss.alive = true;

    // Update power-ups
    powerUps.length = 0;
    level2Data.powerUps.forEach(pu => {
      powerUps.push(new PowerUp(pu.x, pu.y, pu.type));
    });

    // Update hoverboard
    hoverboard.x = level2Data.hoverboard.x;
    hoverboard.y = level2Data.hoverboard.y;
    hoverboard.active = true;
    hoverboard.attached = false;

    // Update door
    door = new Door(level2Data.door.x, level2Data.door.y, level2Data.door.width, level2Data.door.height);

    // Update player starting position for level 2
    player.x = level2Data.playerStart.x;
    player.y = level2Data.playerStart.y;

    // Update level label and background image for level 2
    document.getElementById('level').innerText = 'Level 2';
    document.getElementById('game-container').style.backgroundImage = "url('Landscapes/Brekon-Beacons.png')";

    // Hide the level complete screen and resume gameplay.
    document.getElementById('level-complete-screen').style.visibility = 'hidden';
    gameState = "PLAYING";
  }
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
  if (e.code === 'ArrowUp') {
    player.stopJump();
  }
});

/*********************************
 * Game Loop
 *********************************/
function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (gameState !== "PLAYING") return;
  updateGame();
  renderGame();
}

/*********************************
 * Update Game Logic
 *********************************/
function updateGame() {
  handlePlayerInput();
  player.update();
  checkPlatformCollisions(player, platforms);

  enemies.forEach(enemy => {
    enemy.update();
    checkEnemyCollision(enemy);
  });

  boss.update();
  checkBossCollision(boss);

  powerUps.forEach(p => {
    checkPowerUpCollision(p);
  });

  hoverboard.update();
  checkHoverboardCollision(hoverboard);

  if (hoverboard.attached) {
    hoverboard.x = player.x + player.width / 2 - hoverboard.width / 2;
    hoverboard.y = player.y + player.height - hoverboard.height;
  }

  cameraX = Math.max(0, Math.min(player.x - canvas.width / 2, worldWidth - canvas.width));
  
  // Update parallax background position for the container
  const parallaxRatio = (1600 - 800) / (worldWidth - 800);
  document.getElementById("game-container").style.backgroundPositionX = (-cameraX * parallaxRatio) + "px";

  if (!boss.alive) {
    checkDoorCollision(door);
  }

  // Check for game over condition
  if (player.lives <= 0) {
    gameOver();
  }

  document.getElementById('lives').innerText = 'Lives: ' + player.lives;
  document.getElementById('keys').innerText = 'Keys: ' + player.hasKey;
}

/*********************************
 * Render / Draw
 *********************************/
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-cameraX, 0);
  platforms.forEach(p => p.draw());
  if (hoverboard.active) hoverboard.draw();
  enemies.forEach(enemy => enemy.draw());
  boss.draw();
  if (!boss.alive) door.draw();
  powerUps.forEach(p => p.draw());
  player.draw();
  ctx.restore();
}

/*********************************
 * Player Input
 *********************************/
function handlePlayerInput() {
  if (keys['Space'] && player.onHoverboard) {
    player.onHoverboard = false;
    hoverboard.attached = false;
    hoverboard.active = false;
    keys['Space'] = false;
  }

  let moveSpeed = player.onHoverboard ? player.baseSpeed * 2 : player.baseSpeed;
  if (keys['ArrowLeft'] || keys['KeyA']) {
    player.velocityX = -moveSpeed;
    player.facingRight = false;
  }
  if (keys['ArrowRight'] || keys['KeyD']) {
    player.velocityX = moveSpeed;
    player.facingRight = true;
  }
  if (keys['ShiftLeft'] || keys['ShiftRight']) {
    player.dash();
  }
  if (keys['ArrowUp'] && !player.isJumping) {
    player.isJumping = true;
    player.jump();
  }
  if (!keys['ArrowUp']) {
    player.isJumping = false;
  }
}

/*********************************
 * Collision Helpers
 *********************************/
function checkPlatformCollisions(entity, platformArray) {
  platformArray.forEach(platform => {
    if (
      entity.x < platform.x + platform.width &&
      entity.x + entity.width > platform.x &&
      entity.y + entity.height > platform.y &&
      entity.y < platform.y + platform.height
    ) {
      // Colliding from above
      if (entity.y + entity.height - entity.velocityY <= platform.y) {
        entity.y = platform.y - entity.height;
        entity.velocityY = 0;
        entity.jumpCount = 0;
      } else {
        // Colliding from the sides
        if (entity.x < platform.x) {
          entity.x = platform.x - entity.width;
        } else {
          entity.x = platform.x + platform.width;
        }
      }
    }
  });
}

function checkEnemyCollision(enemy) {
  if (enemy.health <= 0) return;
  if (
    player.x < enemy.x + enemy.width &&
    player.x + player.width > enemy.x &&
    player.y < enemy.y + enemy.height &&
    player.y + player.height > enemy.y
  ) {
    // 1) If player is invincible from power-up, kill enemy.
    if (player.invFromPowerUp) {
      enemy.health = 0;
      return;
    }
    // 2) If player is in post-hit invincibility, do nothing.
    if (player.invFromHit) {
      return;
    }
    // 3) Check for stomp (player falling and hitting enemy)
    if (player.velocityY > 0 && (player.y + player.height - player.velocityY <= enemy.y + 10)) {
      enemy.health--;
      player.velocityY = player.jumpPower * 0.5;
      return;
    }
    // 4) Side collision
    if (player.onHoverboard) {
      player.lives--;
      if (player.lives <= 0) { gameOver(); return; }
      player.invFromHit = true;
      player.invHitTimer = 120;
      player.onHoverboard = false;
      hoverboard.attached = false;
      hoverboard.active = false;
    } else {
      player.lives--;
      if (player.lives <= 0) { gameOver(); return; }
      player.invFromHit = true;
      player.invHitTimer = 120;
      applyKnockback(player, enemy);
    }
  }
}

function checkBossCollision(boss) {
  if (!boss.alive) return;
  if (
    player.x < boss.x + boss.width &&
    player.x + player.width > boss.x &&
    player.y < boss.y + boss.height &&
    player.y + player.height > boss.y
  ) {
    if (player.invFromPowerUp) {
      boss.health = 0;
      boss.alive = false;
      return;
    }
    if (player.invFromHit) {
      return;
    }
    if (player.velocityY > 0 && (player.y + player.height - player.velocityY <= boss.y + 20)) {
      boss.health--;
      player.velocityY = player.jumpPower * 0.5;
      if (boss.health <= 0) {
        boss.alive = false;
      }
      return;
    }
    if (player.onHoverboard) {
      player.lives--;
      if (player.lives <= 0) { gameOver(); return; }
      player.invFromHit = true;
      player.invHitTimer = 120;
      player.onHoverboard = false;
      hoverboard.attached = false;
      hoverboard.active = false;
    } else {
      player.lives--;
      if (player.lives <= 0) { gameOver(); return; }
      player.invFromHit = true;
      player.invHitTimer = 120;
      applyKnockback(player, boss);
    }
  }
}

function applyKnockback(player, source) {
  const knockbackSpeed = 10;
  const bounceHeight = -5;

  const playerCenter = player.x + player.width / 2;
  const sourceCenter = source.x + source.width / 2;
  const direction = playerCenter < sourceCenter ? -1 : 1;

  if (direction === -1) {
    player.x = source.x - player.width;
  } else {
    player.x = source.x + source.width;
  }

  player.velocityX = knockbackSpeed * direction;
  player.velocityY = bounceHeight;

  player.inputDisabled = true;
  setTimeout(() => {
    player.inputDisabled = false;
  }, 2000);
}

function checkPowerUpCollision(powerUp) {
  if (!powerUp.active) return;
  if (
    player.x < powerUp.x + powerUp.width &&
    player.x + player.width > powerUp.x &&
    player.y < powerUp.y + powerUp.height &&
    player.y + player.height > powerUp.y
  ) {
    if (powerUp.type === 'invincibility') {
      player.invFromPowerUp = true;
      player.invPowerTimer = 180;
    } else if (powerUp.type === 'life') {
      player.lives++;
    } else if (powerUp.type === 'key') {
      player.hasKey++;
    }
    powerUp.active = false;
  }
}

function checkHoverboardCollision(vehicle) {
  if (!vehicle.active) return;
  if (
    player.x < vehicle.x + vehicle.width &&
    player.x + player.width > vehicle.x &&
    player.y + player.height > vehicle.y &&
    player.y < vehicle.y + vehicle.height
  ) {
    if (!player.onHoverboard) {
      player.onHoverboard = true;
      vehicle.attached = true;
      vehicle.x = player.x + player.width / 2 - vehicle.width / 2;
      vehicle.y = player.y + player.height - vehicle.height;
    }
  }
}

function checkDoorCollision(door) {
  if (
    player.x < door.x + door.width &&
    player.x + player.width > door.x &&
    player.y < door.y + door.height &&
    player.y + player.height > door.y
  ) {
    if (!door.isOpen && player.hasKey > 0) {
      door.isOpen = true;
      player.hasKey--;
    }
    if (door.isOpen) {
      gameState = "LEVEL_COMPLETE";
      document.getElementById('level-complete-screen').style.visibility = 'visible';
      bgMusic.pause();
    }
  }
}

/*********************************
 * Game Flow Controls
 *********************************/
function startGame() {
  document.getElementById('title-screen').style.visibility = 'hidden';
  goFullScreenScaled();
  gameState = "PLAYING";
  bgMusic.currentTime = 0;
  bgMusic.play();
}

function gameOver() {
  gameState = "GAME_OVER";
  document.getElementById('game-over-screen').style.visibility = 'visible';
  bgMusic.pause();
}

function resetGame() {
  document.getElementById('game-over-screen').style.visibility = 'hidden';
  document.getElementById('level-complete-screen').style.visibility = 'hidden';
  gameState = "TITLE";
  player.x = 50;
  player.y = canvas.height - player.height - 50;
  player.velocityX = 0;
  player.velocityY = 0;
  player.lives = 3;
  player.hasKey = 0;

  player.invFromPowerUp = false;
  player.invPowerTimer = 0;
  player.invFromHit = false;
  player.invHitTimer = 0;

  player.onHoverboard = false;

  const enemyStarts = [300 * 4, 800 * 4, 1200 * 4, 1400 * 4, 1600 * 4];
  enemies.forEach((enemy, index) => {
    enemy.x = enemyStarts[index];
    enemy.y = canvas.height - 50;
    enemy.health = 1;
  });

  boss.x = 1850 * 4;
  boss.y = canvas.height - 80;
  boss.health = 3;
  boss.phase = 1;
  boss.alive = true;

  powerUps.forEach((p, i) => {
    p.active = true;
    let coords = [[420 * 4, 220], [620 * 4, 170], [1500 * 4, 140]];
    p.x = coords[i][0];
    p.y = coords[i][1];
  });

  hoverboard.x = 950 * 4;
  hoverboard.y = 280;
  hoverboard.active = true;
  hoverboard.attached = false;

  door = new Door(1900 * 4, canvas.height - 100, 50, 80);

  // Reset level label and background to level 1 defaults
  document.getElementById('level').innerText = 'Level 1';
  document.getElementById('game-container').style.backgroundImage = "url('Landscapes/arctic.png')";

  document.getElementById('title-screen').style.visibility = 'visible';
}

/*********************************
 * Full-Screen Scaling
 *********************************/
function goFullScreenScaled() {
  const wrapper = document.getElementById('game-wrapper');
  
  if (wrapper.requestFullscreen) {
    wrapper.requestFullscreen();
  } else if (wrapper.webkitRequestFullscreen) {
    wrapper.webkitRequestFullscreen();
  } else if (wrapper.msRequestFullscreen) {
    wrapper.msRequestFullscreen();
  }
  
  setTimeout(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const scaleX = screenW / 800;
    const scaleY = screenH / 400;
    const scale = Math.min(scaleX, scaleY);
    
    wrapper.style.transform = `scale(${scale})`;
    wrapper.style.transformOrigin = 'top left';
  }, 100);
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    const wrapper = document.getElementById('game-wrapper');
    wrapper.style.transform = '';
  }
});

/*********************************
 * Initial Call
 *********************************/
document.getElementById('title-screen').style.visibility = 'visible';
gameLoop();
