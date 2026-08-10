function drawHud() {
  const panelW = min(650, width - 32);
  let insertText = "Press I to arm insert";
  let playerText = "Player not spawned";
  let playerColor = color(255, 205, 98);

  if (spawnArmed) {
    insertText = "Insert armed";
  }

  if (player) {
    playerText = "Player active";
    playerColor = color(115, 245, 178);
  }

  noStroke();
  fill(13, 15, 18, 210);
  rectMode(CORNER);
  rect(16, 16, panelW, 94, 8);
  rectMode(CENTER);

  fill(245);
  textAlign(LEFT, TOP);
  textSize(18);
  text("Mode " + mode + ": " + modeName() + "   |   " + insertText, 32, 28);
  textSize(13);
  fill(210);
  text("1/2/3 modes  |  I then click in Start Zone to spawn player  |  Arrow keys drive", 32, 58);
  fill(playerColor);
  text(playerText, 32, 82);
}

function modeName() {
  if (mode === 1) {
    return "Practice";
  }

  if (mode === 2) {
    return "Random Opponents";
  }

  return "Advanced Opponents";
}
