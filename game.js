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
const joystickBase = document.getElementById("joystickBase");
const joystickThumb = document.getElementById("joystickThumb");

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
let rouletteBallAngle = 0;
let joystickPointerId = null;
const joystickVector = { x: 0, y: 0 };
const joystickMaxDistance = 36;

const SLOT_SYMBOLS = ["🍒", "🍋", "⭐", "🔔"];
const SLOT_CELL_HEIGHT = 74;
const SLOT_ROWS = 3;
const SLOT_COLS = 3;

const decorativeTables = [
  { x: 125, y: 120, radius: 24, color: "#4f2f45" },
  { x: 510, y: 120, radius: 20, color: "#3f3b59" },
  { x: 845, y: 180, radius: 23, color: "#4e3b2c" },
  { x: 170, y: 450, radius: 22, color: "#3a4b63" },
  { x: 470, y: 430, radius: 24, color: "#5a3a42" },
  { x: 830, y: 460, radius: 20, color: "#445254" }
];

const npcs = [
  { x: 86, y: 76, size: 14, vx: 0.7, vy: 0.5, moodTime: 0, color: "#f7cb6f" },
  { x: 900, y: 90, size: 14, vx: -0.6, vy: 0.4, moodTime: 0, color: "#95d8ff" },
  { x: 890, y: 520, size: 14, vx: -0.5, vy: -0.6, moodTime: 0, color: "#dcb2ff" },
  { x: 72, y: 520, size: 14, vx: 0.55, vy: -0.45, moodTime: 0, color: "#ffb8c0" },
  { x: 460, y: 290, size: 14, vx: 0.45, vy: 0.65, moodTime: 0, color: "#bde3a6" },
  { x: 155, y: 78, size: 14, vx: 0.62, vy: 0.34, moodTime: 0, color: "#ffdb93" },
  { x: 300, y: 70, size: 14, vx: -0.58, vy: 0.42, moodTime: 0, color: "#96f0df" },
  { x: 500, y: 70, size: 14, vx: 0.4, vy: 0.58, moodTime: 0, color: "#b8c7ff" },
  { x: 650, y: 95, size: 14, vx: -0.65, vy: 0.3, moodTime: 0, color: "#ffd1df" },
  { x: 815, y: 95, size: 14, vx: 0.52, vy: 0.46, moodTime: 0, color: "#ffe3a1" },
  { x: 540, y: 250, size: 14, vx: -0.42, vy: 0.68, moodTime: 0, color: "#abd3f4" },
  { x: 835, y: 255, size: 14, vx: -0.5, vy: 0.5, moodTime: 0, color: "#f0b8d2" },
  { x: 845, y: 330, size: 14, vx: -0.56, vy: 0.38, moodTime: 0, color: "#c5ef9b" },
  { x: 90, y: 300, size: 14, vx: 0.6, vy: -0.36, moodTime: 0, color: "#f2d1a8" },
  { x: 145, y: 360, size: 14, vx: 0.48, vy: -0.52, moodTime: 0, color: "#a6e6ff" },
  { x: 515, y: 500, size: 14, vx: -0.6, vy: -0.44, moodTime: 0, color: "#d8c2ff" },
  { x: 680, y: 500, size: 14, vx: 0.54, vy: -0.41, moodTime: 0, color: "#f7c88f" },
  { x: 770, y: 520, size: 14, vx: -0.58, vy: -0.38, moodTime: 0, color: "#bceea7" }
];

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

function randomFloat(min, max) {
  return min + Math.random() * (max - min);
}

function rouletteColorFromNumber(number) {
  if (number === 0) {
    return "green";
  }
  return number % 2 === 0 ? "black" : "red";
}

function rouletteColumnFromNumber(number) {
  if (number < 1 || number > 36) {
    return 0;
  }
  return ((number - 1) % 3) + 1;
}

function rouletteNumberToAngle(number) {
  return (number / 37) * 360;
}

async function animateRoulette(rolledNumber) {
  const targetAngle = rouletteNumberToAngle(rolledNumber);
  const startWheel = rouletteWheelRotation;
  const startBall = rouletteBallAngle;
  rouletteWheelRotation += 1080 + Math.random() * 240 + targetAngle;
  rouletteBallAngle -= 1320 + Math.random() * 260 + targetAngle;

  rouletteSpinStatus.textContent = "Wheel spinning...";

  const wheelAnimation = rouletteWheel.animate(
    [
      { transform: `rotate(${startWheel.toFixed(2)}deg)` },
      { transform: `rotate(${rouletteWheelRotation.toFixed(2)}deg)` }
    ],
    {
      duration: 2600,
      easing: "cubic-bezier(0.16, 0.74, 0.1, 1)",
      fill: "forwards"
    }
  );

  const ballAnimation = rouletteBall.animate(
    [
      { transform: `rotate(${startBall.toFixed(2)}deg) translateY(-68px)` },
      { transform: `rotate(${rouletteBallAngle.toFixed(2)}deg) translateY(-68px)` }
    ],
    {
      duration: 2300,
      easing: "cubic-bezier(0.2, 0.72, 0.16, 1)",
      fill: "forwards"
    }
  );

  await Promise.all([
    wheelAnimation.finished.catch(() => null),
    ballAnimation.finished.catch(() => null)
  ]);

  rouletteWheel.style.transform = `rotate(${rouletteWheelRotation.toFixed(2)}deg)`;
  rouletteBall.style.transform = `rotate(${rouletteBallAngle.toFixed(2)}deg) translateY(-68px)`;
}

function evaluateRouletteBet(choice, rolledNumber, rolledColor, pickedNumber) {
  switch (choice) {
    case "red":
    case "black":
      return { won: choice === rolledColor, totalMultiplier: 2 };
    case "odd":
      return { won: rolledNumber !== 0 && rolledNumber % 2 === 1, totalMultiplier: 2 };
    case "even":
      return { won: rolledNumber !== 0 && rolledNumber % 2 === 0, totalMultiplier: 2 };
    case "low":
      return { won: rolledNumber >= 1 && rolledNumber <= 18, totalMultiplier: 2 };
    case "high":
      return { won: rolledNumber >= 19 && rolledNumber <= 36, totalMultiplier: 2 };
    case "dozen1":
      return { won: rolledNumber >= 1 && rolledNumber <= 12, totalMultiplier: 3 };
    case "dozen2":
      return { won: rolledNumber >= 13 && rolledNumber <= 24, totalMultiplier: 3 };
    case "dozen3":
      return { won: rolledNumber >= 25 && rolledNumber <= 36, totalMultiplier: 3 };
    case "column1":
      return { won: rouletteColumnFromNumber(rolledNumber) === 1, totalMultiplier: 3 };
    case "column2":
      return { won: rouletteColumnFromNumber(rolledNumber) === 2, totalMultiplier: 3 };
    case "column3":
      return { won: rouletteColumnFromNumber(rolledNumber) === 3, totalMultiplier: 3 };
    case "number":
      return { won: pickedNumber === rolledNumber, totalMultiplier: 36 };
    default:
      return { won: false, totalMultiplier: 0 };
  }
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

  const result = evaluateRouletteBet(choice, rolledNumber, rolledColor, pickedNumber);
  const won = result.won;
  const payout = won ? validation.bet * result.totalMultiplier : 0;

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

function createReelSequence(finalTriplet, minCycles) {
  const sequence = [];
  for (let cycle = 0; cycle < minCycles; cycle += 1) {
    for (const symbol of SLOT_SYMBOLS) {
      sequence.push(symbol);
    }
  }
  sequence.push(...finalTriplet);
  return sequence;
}

function renderReelStrip(reelEl, sequence) {
  reelEl.innerHTML = sequence
    .map((symbol) => `<div class="reel-symbol">${symbol}</div>`)
    .join("");
}

async function animateSlots(finalSymbols) {
  const animationPromises = slotReelEls.map((reelEl, index) => {
    const minCycles = 6 + index;
    const finalTriplet = [
      finalSymbols[0][index],
      finalSymbols[1][index],
      finalSymbols[2][index]
    ];
    const sequence = createReelSequence(finalTriplet, minCycles);
    renderReelStrip(reelEl, sequence);

    reelEl.style.transform = "translateY(0px)";
    void reelEl.offsetHeight;

    const travel = (sequence.length - SLOT_ROWS) * SLOT_CELL_HEIGHT;

    const animation = reelEl.animate(
      [
        { transform: "translateY(0px)" },
        { transform: `translateY(-${travel}px)` }
      ],
      {
        duration: 900 + index * 260,
        easing: "cubic-bezier(0.14, 0.72, 0.18, 1)",
        fill: "forwards"
      }
    );

    animation.finished
      .then(() => {
        reelEl.style.transform = `translateY(-${travel}px)`;
      })
      .catch(() => null);

    return animation.finished.catch(() => null);
  });

  await Promise.all(animationPromises);
}

function generateSlotGrid() {
  return Array.from({ length: SLOT_ROWS }, () =>
    Array.from({ length: SLOT_COLS }, () => SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)])
  );
}

function evaluateSlotGridPayout(grid, bet) {
  const lineMultipliers = {
    "🍒": 3,
    "🍋": 4,
    "⭐": 8,
    "🔔": 15
  };

  const lines = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]
  ];

  let payout = 0;
  let winningLines = 0;

  for (const line of lines) {
    const symbols = line.map(([row, col]) => grid[row][col]);
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      payout += bet * lineMultipliers[symbols[0]];
      winningLines += 1;
    }
  }

  return { payout, winningLines };
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

  const grid = generateSlotGrid();
  await animateSlots(grid);

  slotReels.textContent = grid.map((row) => row.join(" ")).join("  |  ");

  wisTokens -= validation.bet;
  const score = evaluateSlotGridPayout(grid, validation.bet);
  const payout = score.payout;

  wisTokens += payout;
  const net = payout - validation.bet;

  if (net >= 0) {
    slotsResult.textContent = `3x3 board complete. Winning lines: ${score.winningLines}. You won ${net} WIS Tokens.`;
    slotsResult.style.color = "#9af5a8";
  } else {
    slotsResult.textContent = `No matching lines. You lost ${validation.bet} WIS Tokens.`;
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

function drawDecorativeTables() {
  for (const deco of decorativeTables) {
    ctx.beginPath();
    ctx.fillStyle = deco.color;
    ctx.arc(deco.x, deco.y, deco.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 227, 162, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 245, 210, 0.18)";
    ctx.fillRect(deco.x - 3, deco.y - deco.radius - 15, 6, 22);
  }
}

function updateNpcs() {
  for (const npc of npcs) {
    npc.moodTime -= 1;
    if (npc.moodTime <= 0) {
      npc.vx = randomFloat(-0.9, 0.9);
      npc.vy = randomFloat(-0.9, 0.9);
      npc.moodTime = 30 + Math.floor(Math.random() * 100);
    }

    let nextX = npc.x + npc.vx;
    let nextY = npc.y + npc.vy;

    if (nextX < 10 || nextX > WIDTH - npc.size - 10) {
      npc.vx *= -1;
      nextX = npc.x + npc.vx;
    }
    if (nextY < 10 || nextY > HEIGHT - npc.size - 10) {
      npc.vy *= -1;
      nextY = npc.y + npc.vy;
    }

    const npcRect = { x: nextX, y: nextY, width: npc.size, height: npc.size };
    let blocked = false;
    for (const table of tables) {
      if (intersectsRect(npcRect, table.hitbox)) {
        blocked = true;
        break;
      }
    }

    if (blocked) {
      npc.vx *= -1;
      npc.vy *= -1;
      continue;
    }

    npc.x = nextX;
    npc.y = nextY;
  }
}

function drawNpcs() {
  for (const npc of npcs) {
    ctx.fillStyle = npc.color;
    ctx.fillRect(npc.x, npc.y, npc.size, npc.size);

    ctx.fillStyle = "#101526";
    ctx.fillRect(npc.x + 3, npc.y + 4, 3, 3);
    ctx.fillRect(npc.x + npc.size - 6, npc.y + 4, 3, 3);
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

  const text = nearbyTable.label;
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

  if (Math.abs(joystickVector.x) > 0.01 || Math.abs(joystickVector.y) > 0.01) {
    dx += joystickVector.x * player.speed;
    dy += joystickVector.y * player.speed;
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
  updateNpcs();
  resolveNearbyTable();

  drawBackground();
  drawDecorativeTables();

  for (const table of tables) {
    drawTable(table, nearbyTable?.id === table.id);
  }

  drawNpcs();
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

function updateJoystickThumb(x, y) {
  if (!joystickThumb) {
    return;
  }
  joystickThumb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

function resetJoystick() {
  joystickVector.x = 0;
  joystickVector.y = 0;
  updateJoystickThumb(0, 0);
}

function setJoystickFromPointer(clientX, clientY) {
  if (!joystickBase) {
    return;
  }

  const rect = joystickBase.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  let dx = clientX - centerX;
  let dy = clientY - centerY;

  const distance = Math.hypot(dx, dy);
  if (distance > joystickMaxDistance) {
    const ratio = joystickMaxDistance / distance;
    dx *= ratio;
    dy *= ratio;
  }

  joystickVector.x = dx / joystickMaxDistance;
  joystickVector.y = dy / joystickMaxDistance;
  updateJoystickThumb(dx, dy);
}

function bindJoystick() {
  if (!joystickBase) {
    return;
  }

  joystickBase.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    joystickPointerId = event.pointerId;
    joystickBase.setPointerCapture(event.pointerId);
    setJoystickFromPointer(event.clientX, event.clientY);
  });

  joystickBase.addEventListener("pointermove", (event) => {
    if (joystickPointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    setJoystickFromPointer(event.clientX, event.clientY);
  });

  const release = (event) => {
    if (joystickPointerId !== event.pointerId) {
      return;
    }
    joystickPointerId = null;
    resetJoystick();
  };

  joystickBase.addEventListener("pointerup", release);
  joystickBase.addEventListener("pointercancel", release);
}

function handleCanvasTapInteract(event) {
  if (event.pointerType !== "touch") {
    return;
  }

  if (activePanel) {
    return;
  }

  if (nearbyTable) {
    event.preventDefault();
    openPanel(nearbyTable.id);
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

bindJoystick();
canvas.addEventListener("pointerdown", handleCanvasTapInteract);

slotReelEls.forEach((reelEl) => {
  renderReelStrip(reelEl, ["🍒", "🍋", "⭐"]);
});

updateBalanceText();
updateNearbyText();
rouletteNumberRow.classList.add("hidden");
gameLoop();
