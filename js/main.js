function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(RADIANS);
  textFont("Arial");
  resetSimulation(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function resetSimulation(newMode) {
  mode = newMode;
  spawnArmed = false;
  player = null;
  cars = [];
  trails = [];
  impactFlashes = [];
  barrierPulses = [];
  padParticles = [];
  rechargePads = makeRechargePads();

  engine = Engine.create();
  world = engine.world;
  engine.gravity.y = 0;
  walls = createArenaWalls();

  if (mode === 1) {
    createParkedPracticeCars();
  } else {
    createRandomOpponents(mode === 3);
  }

  Events.on(engine, "collisionStart", handleCollisions);
}

function draw() {
  background(15, 17, 20);
  updateViewport();
  Engine.update(engine, deltaTime || 16.666);

  handlePlayerControls();
  updateOpponents();
  updateRechargePads();
  updateAnimations();

  push();
  translate(arenaLeft, arenaTop);
  scale(arenaScale);
  drawArena();
  drawRechargePads();
  drawTrails();
  drawCars();
  drawImpacts();
  drawBarrierPulses();
  pop();

  drawHud();
}

function updateViewport() {
  const margin = 64;
  arenaScale = min((width - margin) / ARENA_W, (height - margin) / ARENA_H, 1);
  arenaLeft = (width - ARENA_W * arenaScale) * 0.5;
  arenaTop = (height - ARENA_H * arenaScale) * 0.55;
}

function keyPressed() {
  if (key === "1") {
    resetSimulation(1);
  }

  if (key === "2") {
    resetSimulation(2);
  }

  if (key === "3") {
    resetSimulation(3);
  }

  if (key === "i" || key === "I") {
    spawnArmed = true;
  }
}

function mousePressed() {
  if (!spawnArmed || player) {
    return;
  }

  const p = screenToArena(mouseX, mouseY);

  if (!insideArena(p.x, p.y) || !insideStartZone(p.x, p.y)) {
    return;
  }

  if (!isSpawnClear(p.x, p.y, 88)) {
    return;
  }

  player = createCar(p.x, p.y, "standard", true, false);
  cars.push(player);
  spawnArmed = false;
}
