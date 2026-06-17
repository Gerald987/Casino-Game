const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const balanceEl = document.getElementById("balance");
const nearbyTableEl = document.getElementById("nearbyTable");

const modalBackdrop = document.getElementById("modalBackdrop");
const roulettePanel = document.getElementById("roulettePanel");
const slotsPanel = document.getElementById("slotsPanel");

const rouletteBetInput = document.getElementById("rouletteBet");
const rouletteChoiceSelect = document.getElementById("rouletteChoice");
const rouletteNumberRow = document.getElementById("rouletteNumberRow");
const rouletteNumberInput = document.getElementById("rouletteNumber");
const rouletteResult = document.getElementById("rouletteResult");
const rouletteWheel = document.getElementById("rouletteWheel");
const rouletteBall = document.getElementById("rouletteBall");
const rouletteSpinStatus = document.getElementById("rouletteSpinStatus");

const slotsBetInput = document.getElementById("slotsBet");
const slotReels = document.getElementById("slotReels");
const slotsResult = document.getElementById("slotsResult");
const slotReelEls = ["reel1", "reel2", "reel3"].map((id) => document.getElementById(id));

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const player = {
  x: 120,
  y: 280,
  size: 20,
  speed: 2.6,
  color: "#f4f7ff"
};

const tables = [
  {
    id: "roulette",
    name: "Roulette Table",
    x: 220,
    y: 105,
    width: 220,
    height: 140,
    color: "#8f2f2f",
    label: "Roulette",
    hitbox: {
      x: 220,
      y: 105,
      width: 220,
      height: 140
    }
  },
  {
    id: "slots",
    name: "Slot Machine",
    x: 590,
    y: 280,
    width: 190,
    height: 150,
    color: "#2f6b9a",
    label: "Slots",
    hitbox: {
      x: 590,
      y: 280,
      width: 190,
      height: 150
    }
  }
];

let wisTokens = 1000;
let activePanel = null;
let nearbyTable = null;
let isRouletteSpinning = false;
let isSlotsSpinning = false;
let rouletteWheelRotation = 0;

const SLOT_SYMBOLS = ["🍒", "🍋", "⭐", "🔔"];
const SLOT_CELL_HEIGHT = 74;

const keyState = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function updateBalanceText() {
  balanceEl.textContent = `${wisTokens.toLocaleString()} WIS Tokens`;
}

function updateNearbyText() {
  nearbyTableEl.textContent = nearbyTable ? nearbyTable.name : "None";
}

function distanceToRect(pointX, pointY, rect) {
  const nearestX = clamp(pointX, rect.x, rect.x + rect.width);
  const nearestY = clamp(pointY, rect.y, rect.y + rect.height);
  const dx = pointX - nearestX;
  const dy = pointY - nearestY;
  return Math.hypot(dx, dy);
}

function intersectsRect(a, b) {
  return !(a.x + a.width <= b.x || a.x >= b.x + b.width || a.y + a.height <= b.y || a.y >= b.y + b.height);
}

function collidesWithTable(x, y) {
  const playerRect = {
    x,
    y,
    width: player.size,
    height: player.size
  };

  for (const table of tables) {
    if (intersectsRect(playerRect, table.hitbox)) {
      return true;
    }
  }
  return false;
}

function resolveNearbyTable() {
  const playerCenterX = player.x + player.size / 2;
  const playerCenterY = player.y + player.size / 2;
  const interactDistance = 28;

  nearbyTable = null;
  for (const table of tables) {
    const dist = distanceToRect(playerCenterX, playerCenterY, table.hitbox);
    if (dist <= interactDistance) {
      nearbyTable = table;
      break;
    }
  }
  updateNearbyText();
}

function openPanel(tableId) {
  activePanel = tableId;
  modalBackdrop.classList.remove("hidden");
  roulettePanel.classList.add("hidden");
  slotsPanel.classList.add("hidden");

  if (tableId === "roulette") {
    roulettePanel.classList.remove("hidden");
  }
  if (tableId === "slots") {
    slotsPanel.classList.remove("hidden");
  }
}

function closePanel() {
  activePanel = null;
  modalBackdrop.classList.add("hidden");
}

function validateBet(rawBet) {
  const bet = Number(rawBet);
  if (!Number.isInteger(bet) || bet < 1) {
    return { valid: false, message: "Bet must be a whole number of at least 1." };
  }
  if (bet > wisTokens) {
    return { valid: false, message: "Not enough WIS Tokens for that bet." };
  }
  return { valid: true, bet };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rouletteColorFromNumber(number) {
  if (number === 0) {
    return "green";
  }
  return number % 2 === 0 ? "black" : "red";
}

function rouletteNumberToAngle(number) {
  return (number / 37) * 360;
}

async function animateRoulette(rolledNumber) {
  const targetAngle = rouletteNumberToAngle(rolledNumber);
  rouletteWheelRotation += 1800 + Math.random() * 360 + targetAngle;
  const ballAngle = -2160 - Math.random() * 420 - targetAngle;

  rouletteWheel.style.transform = `rotate(${rouletteWheelRotation.toFixed(2)}deg)`;
  rouletteBall.style.setProperty("--ball-angle", `${ballAngle.toFixed(2)}deg`);
  rouletteSpinStatus.textContent = "Wheel spinning...";

  await sleep(4300);
}

async function spinRoulette() {
  if (isRouletteSpinning) {
    return;
  }

  const validation = validateBet(rouletteBetInput.value);
  if (!validation.valid) {
    rouletteResult.textContent = validation.message;
    rouletteResult.style.color = "#ff8787";
    return;
  }

  const choice = rouletteChoiceSelect.value;
  let pickedNumber = null;
  if (choice === "number") {
    pickedNumber = Number(rouletteNumberInput.value);
    if (!Number.isInteger(pickedNumber) || pickedNumber < 0 || pickedNumber > 36) {
      rouletteResult.textContent = "Pick a valid roulette number from 0 to 36.";
      rouletteResult.style.color = "#ff8787";
      return;
    }
  }

  const rolledNumber = Math.floor(Math.random() * 37);
  const rolledColor = rouletteColorFromNumber(rolledNumber);

  isRouletteSpinning = true;
  await animateRoulette(rolledNumber);

  wisTokens -= validation.bet;

  let won = false;
  let payout = 0;

  if (choice === "number") {
    if (pickedNumber === rolledNumber) {
      won = true;
      payout = validation.bet * 36;
    }
  } else if (choice === rolledColor) {
    won = true;
    payout = validation.bet * 2;
  }

  if (won) {
    wisTokens += payout;
    const profit = payout - validation.bet;
    rouletteResult.textContent = `Ball landed on ${rolledNumber} (${rolledColor}). You won ${profit} WIS Tokens.`;
    rouletteResult.style.color = "#9af5a8";
    rouletteSpinStatus.textContent = `Result: ${rolledNumber} ${rolledColor.toUpperCase()}`;
  } else {
    rouletteResult.textContent = `Ball landed on ${rolledNumber} (${rolledColor}). You lost ${validation.bet} WIS Tokens.`;
    rouletteResult.style.color = "#ff8787";
    rouletteSpinStatus.textContent = `Result: ${rolledNumber} ${rolledColor.toUpperCase()}`;
  }

  updateBalanceText();
  isRouletteSpinning = false;
}

function createReelSequence(targetSymbol, minCycles) {
  const sequence = [];
  for (let cycle = 0; cycle < minCycles; cycle += 1) {
    for (const symbol of SLOT_SYMBOLS) {
      sequence.push(symbol);
    }
  }
  sequence.push(targetSymbol);
  return sequence;
}

function renderReelStrip(reelEl, sequence) {
  reelEl.innerHTML = sequence
    .map((symbol) => `<div class="reel-symbol">${symbol}</div>`)
    .join("");
}

async function animateSlots(finalSymbols) {
  const animationPromises = slotReelEls.map((reelEl, index) => {
    const minCycles = 10 + index * 2;
    const sequence = createReelSequence(finalSymbols[index], minCycles);
    renderReelStrip(reelEl, sequence);
    reelEl.classList.add("spinning");

    reelEl.style.transitionDuration = `${1500 + index * 500}ms`;
    reelEl.style.transform = "translateY(0px)";

    const travel = (sequence.length - 1) * SLOT_CELL_HEIGHT;

    requestAnimationFrame(() => {
      reelEl.style.transform = `translateY(-${travel}px)`;
    });

    return sleep(1600 + index * 520);
  });

  await Promise.all(animationPromises);

  for (const reelEl of slotReelEls) {
    reelEl.classList.remove("spinning");
  }
}

async function spinSlots() {
  if (isSlotsSpinning) {
    return;
  }

  const validation = validateBet(slotsBetInput.value);
  if (!validation.valid) {
    slotsResult.textContent = validation.message;
    slotsResult.style.color = "#ff8787";
    return;
  }

  isSlotsSpinning = true;

  const reels = [0, 0, 0].map(() => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)]);
  await animateSlots(reels);

  slotReels.textContent = reels.join(" | ");

  wisTokens -= validation.bet;
  let payout = 0;

  if (reels[0] === reels[1] && reels[1] === reels[2]) {
    const multiplierBySymbol = {
      "🍒": 4,
      "🍋": 5,
      "⭐": 10,
      "🔔": 20
    };
    payout = validation.bet * multiplierBySymbol[reels[0]];
  } else {
    const cherryCount = reels.filter((symbol) => symbol === "🍒").length;
    if (cherryCount === 2) {
      payout = validation.bet * 2;
    }
  }

  wisTokens += payout;
  const net = payout - validation.bet;

  if (net >= 0) {
    slotsResult.textContent = `Reels: ${reels.join(" ")} | You won ${net} WIS Tokens.`;
    slotsResult.style.color = "#9af5a8";
  } else {
    slotsResult.textContent = `Reels: ${reels.join(" ")} | You lost ${validation.bet} WIS Tokens.`;
    slotsResult.style.color = "#ff8787";
  }

  updateBalanceText();
  isSlotsSpinning = false;
}

function drawBackground() {
  const floorGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  floorGradient.addColorStop(0, "#20253d");
  floorGradient.addColorStop(0.55, "#1b1f33");
  floorGradient.addColorStop(1, "#161a2b");
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(244, 201, 92, 0.07)";
  for (let i = 0; i < 14; i += 1) {
    const x = 40 + i * 70;
    const y = 40 + (i % 3) * 180;
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(255, 226, 160, 0.1)";
  ctx.lineWidth = 1;

  for (let x = 0; x <= WIDTH; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
    ctx.stroke();
  }

  for (let y = 0; y <= HEIGHT; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
}

function drawRouletteTable(table, isNearby) {
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;
  const radius = 54;

  ctx.fillStyle = "#223b2f";
  ctx.fillRect(table.x, table.y, table.width, table.height);

  ctx.strokeStyle = isNearby ? "#f7d683" : "#e8ecff";
  ctx.lineWidth = isNearby ? 4 : 2;
  ctx.strokeRect(table.x, table.y, table.width, table.height);

  ctx.beginPath();
  ctx.fillStyle = "#5c2d2d";
  ctx.arc(cx, cy, radius + 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#101010";
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < 37; i += 1) {
    const start = (Math.PI * 2 * i) / 37;
    const end = (Math.PI * 2 * (i + 1)) / 37;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius - 6, start, end);
    if (i === 0) {
      ctx.fillStyle = "#2f8d4a";
    } else {
      ctx.fillStyle = i % 2 === 0 ? "#1b1b1b" : "#af2a2a";
    }
    ctx.fill();
  }

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 18px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawSlotsTable(table, isNearby) {
  ctx.fillStyle = "#2b193d";
  ctx.fillRect(table.x, table.y, table.width, table.height);

  ctx.strokeStyle = isNearby ? "#f7d683" : "#e8ecff";
  ctx.lineWidth = isNearby ? 4 : 2;
  ctx.strokeRect(table.x, table.y, table.width, table.height);

  const machineY = table.y + 20;
  const machineHeight = 78;
  const pad = 18;
  const totalWidth = table.width - pad * 2;
  const reelWidth = (totalWidth - 14) / 3;

  ctx.fillStyle = "#7a2d42";
  ctx.fillRect(table.x + 12, machineY - 12, table.width - 24, machineHeight + 22);

  for (let i = 0; i < 3; i += 1) {
    const rx = table.x + pad + i * (reelWidth + 7);
    ctx.fillStyle = "#0f1a2f";
    ctx.fillRect(rx, machineY, reelWidth, machineHeight);

    ctx.strokeStyle = "rgba(207, 231, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, machineY, reelWidth, machineHeight);

    ctx.fillStyle = "#f9cf73";
    ctx.font = "28px Segoe UI Emoji";
    ctx.textAlign = "center";
    ctx.fillText(["🍒", "⭐", "🔔"][i], rx + reelWidth / 2, machineY + 49);
  }

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 18px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawTable(table, isNearby) {
  if (table.id === "roulette") {
    drawRouletteTable(table, isNearby);
    return;
  }
  if (table.id === "slots") {
    drawSlotsTable(table, isNearby);
    return;
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.strokeStyle = "#061823";
  ctx.lineWidth = 2;
  ctx.strokeRect(player.x, player.y, player.size, player.size);

  ctx.fillStyle = "#061823";
  ctx.fillRect(player.x + 4, player.y + 5, 4, 4);
  ctx.fillRect(player.x + 12, player.y + 5, 4, 4);
}

function drawPrompt() {
  if (!nearbyTable || activePanel) {
    return;
  }

  const text = `Press E to play ${nearbyTable.label}`;
  ctx.font = "bold 18px Segoe UI";
  const textWidth = ctx.measureText(text).width;
  const promptWidth = textWidth + 24;
  const promptHeight = 34;
  const px = WIDTH / 2 - promptWidth / 2;
  const py = HEIGHT - 80;

  ctx.fillStyle = "rgba(3, 12, 21, 0.85)";
  ctx.fillRect(px, py, promptWidth, promptHeight);
  ctx.strokeStyle = "#87dfff";
  ctx.strokeRect(px, py, promptWidth, promptHeight);

  ctx.fillStyle = "#dff4ff";
  ctx.textAlign = "left";
  ctx.fillText(text, px + 12, py + 22);
}

function updatePlayerPosition() {
  if (activePanel) {
    return;
  }

  let dx = 0;
  let dy = 0;

  if (keyState.ArrowLeft || keyState.a) {
    dx -= player.speed;
  }
  if (keyState.ArrowRight || keyState.d) {
    dx += player.speed;
  }
  if (keyState.ArrowUp || keyState.w) {
    dy -= player.speed;
  }
  if (keyState.ArrowDown || keyState.s) {
    dy += player.speed;
  }

  if (dx !== 0 && dy !== 0) {
    const invSqrt2 = 0.7071;
    dx *= invSqrt2;
    dy *= invSqrt2;
  }

  const nextX = clamp(player.x + dx, 0, WIDTH - player.size);
  if (!collidesWithTable(nextX, player.y)) {
    player.x = nextX;
  }

  const nextY = clamp(player.y + dy, 0, HEIGHT - player.size);
  if (!collidesWithTable(player.x, nextY)) {
    player.y = nextY;
  }
}

function gameLoop() {
  updatePlayerPosition();
  resolveNearbyTable();

  drawBackground();

  for (const table of tables) {
    drawTable(table, nearbyTable?.id === table.id);
  }

  drawPlayer();
  drawPrompt();

  requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key in keyState) {
    keyState[key] = true;
  }

  if (key === "e" && nearbyTable && !activePanel) {
    openPanel(nearbyTable.id);
  }

  if (key === "Escape" && activePanel) {
    closePanel();
  }
}

function handleKeyUp(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key in keyState) {
    keyState[key] = false;
  }
}

rouletteChoiceSelect.addEventListener("change", () => {
  rouletteNumberRow.classList.toggle("hidden", rouletteChoiceSelect.value !== "number");
});

document.getElementById("spinRouletteBtn").addEventListener("click", spinRoulette);
document.getElementById("spinSlotsBtn").addEventListener("click", spinSlots);

document.querySelectorAll("[data-close-panel]").forEach((button) => {
  button.addEventListener("click", closePanel);
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

slotReelEls.forEach((reelEl) => {
  renderReelStrip(reelEl, ["🍒"]);
});

updateBalanceText();
updateNearbyText();
rouletteNumberRow.classList.add("hidden");
gameLoop();
