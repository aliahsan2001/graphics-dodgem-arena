function screenToArena(x, y) {
  return {
    x: (x - arenaLeft) / arenaScale,
    y: (y - arenaTop) / arenaScale
  };
}

function insideArena(x, y) {
  return x >= 0 && x <= ARENA_W && y >= 0 && y <= ARENA_H;
}

function insideStartZone(x, y) {
  return x >= 0 && x <= START_ZONE_W && y >= 0 && y <= ARENA_H;
}

function isSpawnClear(x, y, minDist) {
  for (const car of cars) {
    const carX = car.body.position.x;
    const carY = car.body.position.y;
    const xTooClose = abs(x - carX) < CAR_W;
    const yTooClose = abs(y - carY) < CAR_H;

    if (xTooClose && yTooClose) {
      return false;
    }

    if (dist(x, y, carX, carY) < minDist) {
      return false;
    }
  }

  return true;
}

function normalizeAngle(a) {
  while (a < 0) a += TWO_PI;
  while (a >= TWO_PI) a -= TWO_PI;
  return a;
}

function lerpAngle(a, b, t) {
  const diff = atan2(sin(b - a), cos(b - a));
  return a + diff * t;
}
