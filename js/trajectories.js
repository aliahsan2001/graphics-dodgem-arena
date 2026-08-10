const MODE_THREE_TRAJECTORIES = [
  [
    { x: 330, y: 170 },
    { x: 500, y: 260 },
    { x: 670, y: 170 },
    { x: 840, y: 260 },
    { x: 1010, y: 170 },
    { x: 1180, y: 260 },
    { x: 1260, y: 430 },
    { x: 1090, y: 520 },
    { x: 920, y: 430 },
    { x: 750, y: 520 },
    { x: 580, y: 430 },
    { x: 410, y: 520 }
  ],
  [
    { x: 1220, y: 540 },
    { x: 1050, y: 450 },
    { x: 880, y: 540 },
    { x: 710, y: 450 },
    { x: 540, y: 540 },
    { x: 370, y: 450 },
    { x: 330, y: 260 },
    { x: 500, y: 170 },
    { x: 670, y: 260 },
    { x: 840, y: 170 },
    { x: 1010, y: 260 },
    { x: 1180, y: 170 }
  ]
];

class PredefinedTrajectory {
  constructor(points) {
    this.points = [];
    for (let i = 0; i < points.length; i++) {
      this.points.push({
        x: points[i].x,
        y: points[i].y
      });
    }

    this.currentIndex = 0;
    this.direction = 1;
  }

  currentTarget() {
    return this.points[this.currentIndex];
  }

  advanceIfClose(position) {
    const target = this.currentTarget();
    if (dist(position.x, position.y, target.x, target.y) < 38) {
      this.currentIndex += this.direction;

      if (this.currentIndex >= this.points.length) {
        this.currentIndex = 0;
      }

      if (this.currentIndex < 0) {
        this.currentIndex = this.points.length - 1;
      }
    }
  }

  reverse() {
    this.direction *= -1;
  }
}
