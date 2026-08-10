class DodgemCar {
  constructor(x, y, type, isPlayer, isStatic) {
    this.type = type;
    this.isPlayer = isPlayer;
    this.heading = 0;
    this.trajectory = null;
    this.boostUntil = 0;
    this.slowUntil = 0;
    this.lastPadAt = 0;

    const slow = type === "slow";

    this.baseFrictionAir = 0.025;
    this.engineForce = 0.0022;
    this.maxForward = 6.5;
    this.maxReverse = 2.5;
    this.cruiseSpeed = 4.6;
    this.turnRate = 0.045;
    this.color = color(232, 76, 83);
    this.trim = color(44, 48, 55);
    this.restitution = 0.8;
    this.friction = 0.1;
    this.density = 0.0025;

    if (slow) {
      this.baseFrictionAir = 0.035;
      this.engineForce = 0.0017;
      this.maxForward = 4.5;
      this.cruiseSpeed = 3;
      this.turnRate = 0.035;
      this.color = color(245, 173, 57);
      this.restitution = 0.7;
      this.friction = 0.15;
      this.density = 0.004;
    }

    if (isPlayer) {
      this.engineForce = 0.002;
      this.maxForward = 6;
      this.maxReverse = 3;
      this.color = color(30, 174, 255);
      this.trim = color(244, 250, 255);
    }

    let bodyLabel = "opponentCar";
    if (this.isPlayer) {
      bodyLabel = "playerCar";
    }

    this.body = Bodies.rectangle(x, y, CAR_W, CAR_H, {
      chamfer: { radius: 14 },
      restitution: this.restitution,
      friction: this.friction,
      frictionAir: this.baseFrictionAir,
      density: this.density,
      isStatic: Boolean(isStatic),
      label: bodyLabel
    });

    this.body.plugin.car = this;
    World.add(world, this.body);
  }

  isBoosted() {
    return millis() < this.boostUntil;
  }

  isSlowed() {
    return millis() < this.slowUntil;
  }

  forwardVector() {
    return Vector.create(cos(this.body.angle), sin(this.body.angle));
  }

  updateBoostPhysics() {
    this.body.frictionAir = this.baseFrictionAir;

    if (this.isBoosted()) {
      this.body.frictionAir = this.baseFrictionAir * 0.55;
    }

    if (this.isSlowed()) {
      this.body.frictionAir = this.baseFrictionAir * 2.2;
    }
  }

  boostFromPad() {
    this.boostUntil = millis() + 1100;
    this.slowUntil = 0;
    this.lastPadAt = millis();
    const push = Vector.create(cos(this.body.angle), sin(this.body.angle));
    Body.applyForce(this.body, this.body.position, Vector.mult(push, this.body.mass * 0.0038));
  }

  drainFromPad() {
    this.slowUntil = millis() + 1200;
    this.boostUntil = 0;
    this.lastPadAt = millis();
    Body.setVelocity(this.body, {
      x: this.body.velocity.x * 0.45,
      y: this.body.velocity.y * 0.45
    });
  }

  handlePlayerInput() {
    if (!this.isPlayer) {
      return;
    }

    const forward = this.forwardVector();
    const forwardSpeed = Vector.dot(this.body.velocity, forward);
    let boost = 1;
    if (this.isBoosted()) {
      boost = 1.45;
    }
    if (this.isSlowed()) {
      boost = 0.55;
    }
    const force = this.engineForce * boost * this.body.mass;

    if (keyIsDown(UP_ARROW) && forwardSpeed < this.maxForward * boost) {
      Body.applyForce(this.body, this.body.position, Vector.mult(forward, force));
    }
    if (keyIsDown(DOWN_ARROW) && forwardSpeed > -this.maxReverse) {
      Body.applyForce(this.body, this.body.position, Vector.mult(forward, -force * 0.78));
    }

    const speedFactor = constrain(this.body.speed / 7, 0.35, 1);
    if (keyIsDown(LEFT_ARROW)) {
      Body.setAngularVelocity(this.body, -this.turnRate * speedFactor);
    }

    if (keyIsDown(RIGHT_ARROW)) {
      Body.setAngularVelocity(this.body, this.turnRate * speedFactor);
    }

    if (!keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
      Body.setAngularVelocity(this.body, this.body.angularVelocity * 0.82);
    }
  }

  updateOpponent() {
    if (this.isPlayer || this.body.isStatic) {
      return;
    }

    if (this.trajectory) {
      this.followTrajectory();
    }

    Body.setAngle(this.body, lerpAngle(this.body.angle, this.heading, 0.08));
    this.setCruiseVelocity(this.cruiseSpeed);
  }

  followTrajectory() {
    const p = this.body.position;
    this.trajectory.advanceIfClose(p);

    const target = this.trajectory.currentTarget();
    this.heading = atan2(target.y - p.y, target.x - p.x);
  }

  setCruiseVelocity(speed) {
    let boost = 1;
    if (this.isBoosted()) {
      boost = 1.35;
    }
    if (this.isSlowed()) {
      boost = 0.55;
    }
    Body.setVelocity(this.body, {
      x: cos(this.heading) * speed * boost,
      y: sin(this.heading) * speed * boost
    });
  }

  reverseHeading() {
    if (this.isPlayer || this.body.isStatic) {
      return;
    }
    if (this.trajectory) {
      this.trajectory.reverse();
    }
    this.heading = normalizeAngle(this.heading + PI);
    Body.setAngle(this.body, this.heading);
    this.setCruiseVelocity(this.cruiseSpeed);
  }

  rotateAfterHit(dir) {
    if (this.isPlayer || this.body.isStatic) {
      return;
    }
    this.heading = normalizeAngle(this.heading + dir * HALF_PI);
    Body.setAngle(this.body, this.heading);
    this.setCruiseVelocity(this.cruiseSpeed);
  }

  draw() {
    const p = this.body.position;
    push();
    translate(p.x, p.y);
    rotate(this.body.angle);

    if (this.isBoosted()) {
      noStroke();
      fill(114, 255, 202, 65);
      rect(0, 0, CAR_W + 24, CAR_H + 22, 19);
    }

    if (this.isSlowed()) {
      noStroke();
      fill(255, 91, 91, 70);
      rect(0, 0, CAR_W + 22, CAR_H + 20, 19);
    }

    fill(30, 32, 37);
    noStroke();
    rect(0, 0, CAR_W + 10, CAR_H + 10, 18);

    fill(this.color);
    rect(0, 0, CAR_W, CAR_H, 14);

    let windowAlpha = 170;
    if (this.isPlayer) {
      windowAlpha = 225;
    }
    fill(255, 255, 255, windowAlpha);
    rect(12, 0, 28, 25, 8);

    fill(this.trim);
    rect(-22, 0, 19, 30, 7);

    fill(255, 245, 164);
    circle(CAR_W / 2 - 9, -11, 8);
    circle(CAR_W / 2 - 9, 11, 8);

    fill(14, 16, 20);
    rect(-CAR_W / 2 + 6, 0, 7, CAR_H - 8, 4);
    rect(CAR_W / 2 - 3, 0, 6, CAR_H - 6, 4);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    let label = "N";
    if (this.type === "slow") {
      label = "S";
    }
    if (this.isPlayer) {
      label = "P";
    }
    text(label, 0, 0);
    pop();
  }
}

function createParkedPracticeCars() {
  const spacing = ARENA_H / (carNumbers + 1);
  for (let i = 0; i < carNumbers; i++) {
    let type = "standard";
    if (i >= 2) {
      type = "slow";
    }
    const car = createCar(START_ZONE_W * 0.52, spacing * (i + 1), type, false, true);
    Body.setAngle(car.body, HALF_PI);
    cars.push(car);
  }
}

function createRandomOpponents(advanced) {
  let placed = 0;
  let attempts = 0;
  while (placed < carNumbers && attempts < 800) {
    attempts++;
    const x = random(START_ZONE_W + 120, ARENA_W - 120);
    const y = random(90, ARENA_H - 90);
    if (!isSpawnClear(x, y, 105)) {
      continue;
    }

    let type = "standard";
    if (placed >= 2) {
      type = "slow";
    }
    const car = createCar(x, y, type, false, false);
    const angle = random(TWO_PI);
    car.heading = angle;

    if (advanced) {
      const path = MODE_THREE_TRAJECTORIES[placed % MODE_THREE_TRAJECTORIES.length];
      car.trajectory = new PredefinedTrajectory(path);
    }

    Body.setAngle(car.body, angle);
    car.setCruiseVelocity(car.cruiseSpeed);
    cars.push(car);
    placed++;
  }
}

function createCar(x, y, type, isPlayer, isStatic) {
  return new DodgemCar(x, y, type, isPlayer, isStatic);
}

function removeCar(car) {
  World.remove(world, car.body);

  const index = cars.indexOf(car);
  if (index !== -1) {
    cars.splice(index, 1);
  }

  if (player === car) {
    player = null;
  }
}

function handlePlayerControls() {
  if (player) {
    player.handlePlayerInput();
  }
}

function updateOpponents() {
  for (const car of cars) {
    car.updateBoostPhysics();
    car.updateOpponent();
  }
}

function handleCollisions(event) {
  for (const pair of event.pairs) {
    const a = pair.bodyA;
    const b = pair.bodyB;
    const carA = a.plugin.car;
    const carB = b.plugin.car;
    let barrier = null;
    if (a.label === "barrier") {
      barrier = a;
    }
    if (b.label === "barrier") {
      barrier = b;
    }

    if (barrier && (carA || carB)) {
      const car = carA || carB;
      car.reverseHeading();
      const p = collisionPoint(pair);
      barrierPulses.push({ x: p.x, y: p.y, life: 34, maxLife: 34 });
    }

    if (carA && carB) {
      const p = collisionPoint(pair);
      impactFlashes.push({ x: p.x, y: p.y, life: 26, maxLife: 26 });
      carA.rotateAfterHit(-1);
      carB.rotateAfterHit(1);
    }
  }
}

function collisionPoint(pair) {
  if (pair.collision.supports && pair.collision.supports.length) {
    const p = pair.collision.supports[0];
    return { x: p.x, y: p.y };
  }
  return {
    x: (pair.bodyA.position.x + pair.bodyB.position.x) * 0.5,
    y: (pair.bodyA.position.y + pair.bodyB.position.y) * 0.5
  };
}

function drawCars() {
  for (const car of cars) {
    car.draw();
  }
}
