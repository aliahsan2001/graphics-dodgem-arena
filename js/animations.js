function updateAnimations() {
  for (const car of cars) {
    if (car.body.speed > 0.7 && frameCount % 2 === 0) {
      trails.push({
        x: car.body.position.x,
        y: car.body.position.y,
        angle: car.body.angle,
        color: car.color,
        life: map(constrain(car.body.speed, 0, 10), 0, 10, 18, 48),
        maxLife: 48,
        w: CAR_W,
        h: CAR_H
      });
    }
  }

  fadeList(trails);
  fadeList(impactFlashes);
  fadeList(barrierPulses);
  fadeList(padParticles);
}

function fadeList(items) {
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].life--;
    if (items[i].life <= 0) {
      items.splice(i, 1);
    }
  }
}

function drawTrails() {
  for (const t of trails) {
    push();
    translate(t.x, t.y);
    rotate(t.angle);
    const a = map(t.life, 0, t.maxLife, 0, 70);
    fill(red(t.color), green(t.color), blue(t.color), a);
    noStroke();
    rect(0, 0, t.w * 0.85, t.h * 0.82, 15);
    pop();
  }
}

function drawImpacts() {
  noFill();
  for (const flash of impactFlashes) {
    const progress = 1 - flash.life / flash.maxLife;
    stroke(255, 238, 124, map(flash.life, 0, flash.maxLife, 0, 230));
    strokeWeight(3);
    circle(flash.x, flash.y, 12 + progress * 62);
    stroke(255, 125, 66, map(flash.life, 0, flash.maxLife, 0, 160));
    circle(flash.x, flash.y, 5 + progress * 28);
  }
}

function drawBarrierPulses() {
  noFill();
  for (const pulse of barrierPulses) {
    const progress = 1 - pulse.life / pulse.maxLife;
    stroke(119, 211, 255, map(pulse.life, 0, pulse.maxLife, 0, 210));
    strokeWeight(5 - progress * 3);
    circle(pulse.x, pulse.y, 22 + progress * 72);
  }
}
