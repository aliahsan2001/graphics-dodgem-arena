function createArenaWalls() {
  const wallOptions = {
    isStatic: true,
    restitution: 0.94,
    friction: 0.08,
    label: "barrier"
  };
  const half = WALL_THICKNESS / 2;
  const made = [
    Bodies.rectangle(ARENA_W / 2, -half, ARENA_W + WALL_THICKNESS * 2, WALL_THICKNESS, wallOptions),
    Bodies.rectangle(ARENA_W / 2, ARENA_H + half, ARENA_W + WALL_THICKNESS * 2, WALL_THICKNESS, wallOptions),
    Bodies.rectangle(-half, ARENA_H / 2, WALL_THICKNESS, ARENA_H + WALL_THICKNESS * 2, wallOptions),
    Bodies.rectangle(ARENA_W + half, ARENA_H / 2, WALL_THICKNESS, ARENA_H + WALL_THICKNESS * 2, wallOptions)
  ];
  World.add(world, made);
  return made;
}

function makeRechargePads() {
  return [
    { x: 420, y: 150, r: 38, type: "boost", phase: random(TWO_PI) },
    { x: 860, y: 560, r: 38, type: "boost", phase: random(TWO_PI) },
    { x: 660, y: 365, r: 38, type: "drain", phase: random(TWO_PI) },
    { x: 1180, y: 250, r: 38, type: "drain", phase: random(TWO_PI) }
  ];
}

function updateRechargePads() {
  for (const car of cars) {
    const p = car.body.position;
    for (const pad of rechargePads) {
      const inside = dist(p.x, p.y, pad.x, pad.y) < pad.r + 22;
      if (inside && millis() - car.lastPadAt > 650) {
        if (pad.type === "boost") {
          car.boostFromPad();
        }

        if (pad.type === "drain") {
          car.drainFromPad();
        }

        for (let i = 0; i < 9; i++) {
          let particleColor = color(120, 255, 204);
          if (pad.type === "drain") {
            particleColor = color(255, 105, 105);
          }

          padParticles.push({
            x: p.x + random(-24, 24),
            y: p.y + random(-18, 18),
            vx: random(-1.3, 1.3),
            vy: random(-1.3, 1.3),
            life: 28,
            c: particleColor
          });
        }
      }
    }
  }
}

function drawArena() {
  noStroke();
  fill(31, 35, 42);
  rect(ARENA_W / 2, ARENA_H / 2, ARENA_W, ARENA_H, 18);

  fill(39, 44, 52);
  for (let y = 20; y < ARENA_H; y += 48) {
    rect(START_ZONE_W, y, 3, 26, 2);
  }

  fill(23, 91, 130, 90);
  rect(START_ZONE_W / 2, ARENA_H / 2, START_ZONE_W, ARENA_H);

  stroke(120, 211, 255, 145);
  strokeWeight(3);
  line(START_ZONE_W, 0, START_ZONE_W, ARENA_H);
  noStroke();

  fill(19, 20, 24);
  rect(ARENA_W / 2, -WALL_THICKNESS / 2, ARENA_W + WALL_THICKNESS, WALL_THICKNESS);
  rect(ARENA_W / 2, ARENA_H + WALL_THICKNESS / 2, ARENA_W + WALL_THICKNESS, WALL_THICKNESS);
  rect(-WALL_THICKNESS / 2, ARENA_H / 2, WALL_THICKNESS, ARENA_H + WALL_THICKNESS);
  rect(ARENA_W + WALL_THICKNESS / 2, ARENA_H / 2, WALL_THICKNESS, ARENA_H + WALL_THICKNESS);

  stroke(245, 220, 125);
  strokeWeight(8);
  noFill();
  rect(ARENA_W / 2, ARENA_H / 2, ARENA_W, ARENA_H, 8);

  noStroke();
  fill(255, 255, 255, 90);
  textAlign(LEFT, TOP);
  textSize(18);
  text("START ZONE", 24, 18);
}

function drawRechargePads() {
  for (const pad of rechargePads) {
    const glow = 120 + sin(frameCount * 0.08 + pad.phase) * 60;
    let padColor = color(95, 245, 178);
    let label = "BOOST";

    if (pad.type === "drain") {
      padColor = color(245, 82, 82);
      label = "DRAIN";
    }

    noStroke();
    fill(red(padColor), green(padColor), blue(padColor), glow * 0.25);
    circle(pad.x, pad.y, pad.r * 2.65);

    fill(red(padColor), green(padColor), blue(padColor), glow);
    circle(pad.x, pad.y, pad.r * 2);

    noStroke();
    fill(12, 15, 18, 215);
    circle(pad.x, pad.y, pad.r * 1.12);

    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(13);
    text(label, pad.x, pad.y + 1);
    textStyle(NORMAL);
  }

  for (const p of padParticles) {
    fill(red(p.c), green(p.c), blue(p.c), map(p.life, 0, 28, 0, 190));
    noStroke();
    circle(p.x, p.y, p.life * 0.45);
    p.x += p.vx;
    p.y += p.vy;
  }
}
