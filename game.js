const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const balanceEl = document.getElementById("balance");
const nearbyTableEl = document.getElementById("nearbyTable");

const modalBackdrop = document.getElementById("modalBackdrop");
const roulettePanel = document.getElementById("roulettePanel");
const slotsPanel = document.getElementById("slotsPanel");
const blackjackPanel = document.getElementById("blackjackPanel");
const pokerPanel = document.getElementById("pokerPanel");
const barPanel = document.getElementById("barPanel");
const buyDrinkBtn = document.getElementById("buyDrinkBtn");
const barDrinkNameEl = document.getElementById("barDrinkName");
const barThemeNameEl = document.getElementById("barThemeName");
const barResultEl = document.getElementById("barResult");
const barShelfEl = document.getElementById("barShelf");
const coinFlipPanel = document.getElementById("coinFlipPanel");
const baccaratPanel = document.getElementById("baccaratPanel");
const checkinPanel = document.getElementById("checkinPanel");
const elevatorPanel = document.getElementById("elevatorPanel");
const floor7Panel = document.getElementById("floor7Panel");
const floor12Panel = document.getElementById("floor12Panel");
const floor24Panel = document.getElementById("floor24Panel");

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
const blackjackBetInput = document.getElementById("blackjackBet");
const blackjackHands = document.getElementById("blackjackHands");
const blackjackResult = document.getElementById("blackjackResult");
const dealBlackjackBtn = document.getElementById("dealBlackjackBtn");
const hitBlackjackBtn = document.getElementById("hitBlackjackBtn");
const standBlackjackBtn = document.getElementById("standBlackjackBtn");
const dealerBlackjackCards = document.getElementById("dealerBlackjackCards");
const playerBlackjackCards = document.getElementById("playerBlackjackCards");
const pokerBetInput = document.getElementById("pokerBet");
const pokerHands = document.getElementById("pokerHands");
const pokerResult = document.getElementById("pokerResult");
const dealPokerBtn = document.getElementById("dealPokerBtn");
const callPokerBtn = document.getElementById("callPokerBtn");
const checkPokerBtn = document.getElementById("checkPokerBtn");
const raisePokerBtn = document.getElementById("raisePokerBtn");
const foldPokerBtn = document.getElementById("foldPokerBtn");
const pokerBoardCards = document.getElementById("pokerBoardCards");
const pokerPlayerCards = document.getElementById("pokerPlayerCards");
const pokerNpcRows = document.getElementById("pokerNpcRows");
const joystickBase = document.getElementById("joystickBase");
const joystickThumb = document.getElementById("joystickThumb");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ZOOM = 2;
const STAFF_MAX_SPEED = 0.42;
const CUSTOMER_MAX_SPEED = 0.5;
const INTERACT_KEY = "e";
const INTERACT_KEY_TEXT = INTERACT_KEY.toUpperCase();

const player = {
  x: 50,
  y: 345,
  size: 20,
  speed: 3.2,
  color: "#f4f7ff"
};

// Returns the visual height of a humanoid drawn by drawHumanoid(x, y, size, …).
// The figure spans from y+size/16 (head top) to y+35.5*(size/16) (leg bottom).
function humanoidHitboxH(size) {
  return Math.round(34.5 * (size / 16));
}
const PLAYER_HITBOX_H = humanoidHitboxH(player.size); // ≈ 43 for size 20

const tables = [
  {
    id: "roulette",
    name: "Roulette Table",
    x: 170,
    y: 30,
    width: 210,
    height: 130,
    color: "#8f2f2f",
    label: "Roulette",
    hitbox: { x: 170, y: 30, width: 210, height: 130 }
  },
  {
    id: "coinflip",
    name: "Coin Flip Table",
    x: 490,
    y: 30,
    width: 210,
    height: 130,
    color: "#3f2a6a",
    label: "Coin Flip",
    hitbox: { x: 490, y: 30, width: 210, height: 130 }
  },
  {
    id: "blackjack",
    name: "Blackjack Table",
    x: 810,
    y: 30,
    width: 210,
    height: 130,
    color: "#2f7a4f",
    label: "Blackjack",
    hitbox: { x: 810, y: 30, width: 210, height: 130 }
  },
  {
    id: "poker",
    name: "Poker Table",
    x: 170,
    y: 560,
    width: 210,
    height: 130,
    color: "#7a4f2f",
    label: "Poker",
    hitbox: { x: 170, y: 560, width: 210, height: 130 }
  },
  {
    id: "baccarat",
    name: "Baccarat Table",
    x: 490,
    y: 560,
    width: 210,
    height: 130,
    color: "#1a3a5a",
    label: "Baccarat",
    hitbox: { x: 490, y: 560, width: 210, height: 130 }
  },
  {
    id: "slots",
    name: "Slot Machine",
    x: 810,
    y: 560,
    width: 210,
    height: 130,
    color: "#2f6b9a",
    label: "Slots",
    hitbox: { x: 810, y: 560, width: 210, height: 130 }
  }
];

const centerBar = {
  id: "bar",
  name: "Center Bar",
  label: "Center Bar",
  x: 370,
  y: 265,
  width: 540,
  height: 140,
  hitbox: {
    x: 370,
    y: 265,
    width: 540,
    height: 140
  }
};

const performanceStage = {
  x: 0,
  y: 220,
  width: 110,
  height: 280,
  hitbox: { x: 0, y: 220, width: 110, height: 280 }
};

const entrance = {
  x: 1210,
  y: 290,
  width: 70,
  height: 140
};

const backgroundLightSources = [
  ...tables.map((table) => ({
    x: table.x + table.width / 2,
    y: table.y + table.height / 2,
    radius: Math.max(table.width, table.height) * 0.8
  })),
  {
    x: centerBar.x + centerBar.width / 2,
    y: centerBar.y + centerBar.height / 2,
    radius: 180
  }
].map((source) => {
  const gradient = ctx.createRadialGradient(source.x, source.y, 12, source.x, source.y, source.radius);
  gradient.addColorStop(0, "rgba(255, 230, 150, 0.16)");
  gradient.addColorStop(0.45, "rgba(255, 176, 96, 0.08)");
  gradient.addColorStop(1, "rgba(255, 176, 96, 0)");
  return { ...source, gradient };
});

let wisTokens = 1000;
let activePanel = null;
let nearbyTable = null;
let isRouletteSpinning = false;
let isSlotsSpinning = false;
let blackjackRound = null;
let pokerRound = null;
let baccaratDealing = false;
let isCoinFlipping = false;
let coinChoice = "heads";
let rouletteWheelRotation = 0;
let rouletteBallAngle = 0;
let joystickPointerId = null;
let currentDrinkOffer = null;
const joystickVector = { x: 0, y: 0 };
const joystickMaxDistance = 36;

const SLOT_SYMBOLS = ["🍒", "🍋", "⭐", "🔔"];
const SLOT_CELL_HEIGHT = 65;
const SLOT_ROWS = 3;
const SLOT_COLS = 3;
const SLOT_PAYLINES = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]]
];
const SLOT_LINE_MULTIPLIERS = {
  "🍒": 3,
  "🍋": 4,
  "⭐": 8,
  "🔔": 15
};
const POKER_NPC_NAMES = ["Maya", "Rico", "Skye", "Juno", "Vince", "Nina", "Axel", "Iris"];
const POKER_STREET_LABELS = ["Preflop", "Flop", "Turn", "River"];
const BAR_DRINK_NAMES = [
  "Lucky Lantern",
  "Neon Clover",
  "Golden Fizz",
  "Seven Star Sour",
  "Dealer's Twist",
  "Moonlit Tonic",
  "Emerald Rush",
  "House Edge Cooler"
];
const CASINO_THEMES = [
  {
    name: "Ruby Lounge",
    vars: {
      "--bg-deep": "#14070d",
      "--bg-mid": "#26111d",
      "--bg-radial-a": "rgba(255, 98, 120, 0.28)",
      "--bg-radial-b": "rgba(255, 180, 90, 0.22)",
      "--ambient-glow-a": "rgba(247, 91, 120, 0.22)",
      "--ambient-glow-b": "rgba(255, 205, 120, 0.18)",
      "--hud-border": "rgba(255, 176, 148, 0.42)",
      "--hud-bg-a": "rgba(45, 16, 28, 0.9)",
      "--hud-bg-b": "rgba(56, 22, 34, 0.82)",
      "--stat-border": "rgba(248, 170, 142, 0.3)",
      "--stat-bg": "rgba(49, 22, 34, 0.9)",
      "--shell-border": "rgba(251, 190, 147, 0.36)",
      "--help-bg-a": "rgba(40, 17, 27, 0.85)",
      "--help-bg-b": "rgba(57, 22, 35, 0.85)"
    }
  },
  {
    name: "Emerald Hall",
    vars: {
      "--bg-deep": "#04110e",
      "--bg-mid": "#10231f",
      "--bg-radial-a": "rgba(80, 231, 169, 0.22)",
      "--bg-radial-b": "rgba(82, 192, 255, 0.2)",
      "--ambient-glow-a": "rgba(85, 221, 172, 0.2)",
      "--ambient-glow-b": "rgba(139, 221, 188, 0.16)",
      "--hud-border": "rgba(142, 224, 180, 0.42)",
      "--hud-bg-a": "rgba(11, 34, 29, 0.9)",
      "--hud-bg-b": "rgba(19, 46, 40, 0.82)",
      "--stat-border": "rgba(140, 214, 179, 0.32)",
      "--stat-bg": "rgba(14, 42, 36, 0.9)",
      "--shell-border": "rgba(148, 225, 183, 0.35)",
      "--help-bg-a": "rgba(13, 36, 30, 0.85)",
      "--help-bg-b": "rgba(21, 48, 42, 0.85)"
    }
  },
  {
    name: "Sapphire Pulse",
    vars: {
      "--bg-deep": "#050d1d",
      "--bg-mid": "#112645",
      "--bg-radial-a": "rgba(75, 163, 255, 0.25)",
      "--bg-radial-b": "rgba(142, 119, 255, 0.2)",
      "--ambient-glow-a": "rgba(67, 156, 246, 0.2)",
      "--ambient-glow-b": "rgba(122, 196, 255, 0.17)",
      "--hud-border": "rgba(144, 201, 255, 0.42)",
      "--hud-bg-a": "rgba(17, 33, 65, 0.9)",
      "--hud-bg-b": "rgba(28, 50, 86, 0.82)",
      "--stat-border": "rgba(139, 197, 255, 0.3)",
      "--stat-bg": "rgba(18, 43, 75, 0.9)",
      "--shell-border": "rgba(157, 205, 255, 0.35)",
      "--help-bg-a": "rgba(15, 34, 64, 0.85)",
      "--help-bg-b": "rgba(25, 46, 81, 0.85)"
    }
  },
  {
    name: "Sunset Velvet",
    vars: {
      "--bg-deep": "#170d08",
      "--bg-mid": "#3a1d15",
      "--bg-radial-a": "rgba(255, 143, 86, 0.28)",
      "--bg-radial-b": "rgba(255, 219, 126, 0.2)",
      "--ambient-glow-a": "rgba(255, 145, 80, 0.21)",
      "--ambient-glow-b": "rgba(255, 202, 113, 0.16)",
      "--hud-border": "rgba(255, 196, 137, 0.42)",
      "--hud-bg-a": "rgba(51, 27, 19, 0.9)",
      "--hud-bg-b": "rgba(67, 37, 27, 0.82)",
      "--stat-border": "rgba(239, 187, 129, 0.3)",
      "--stat-bg": "rgba(59, 33, 24, 0.9)",
      "--shell-border": "rgba(251, 198, 139, 0.35)",
      "--help-bg-a": "rgba(47, 27, 20, 0.85)",
      "--help-bg-b": "rgba(64, 35, 24, 0.85)"
    }
  },
  {
    name: "Amethyst Aurora",
    vars: {
      "--bg-deep": "#130a23",
      "--bg-mid": "#2b1850",
      "--bg-radial-a": "rgba(178, 112, 255, 0.28)",
      "--bg-radial-b": "rgba(255, 148, 225, 0.22)",
      "--ambient-glow-a": "rgba(161, 110, 255, 0.23)",
      "--ambient-glow-b": "rgba(255, 171, 239, 0.18)",
      "--hud-border": "rgba(210, 170, 255, 0.42)",
      "--hud-bg-a": "rgba(43, 23, 81, 0.9)",
      "--hud-bg-b": "rgba(57, 33, 96, 0.82)",
      "--stat-border": "rgba(205, 167, 255, 0.32)",
      "--stat-bg": "rgba(48, 30, 88, 0.9)",
      "--shell-border": "rgba(213, 177, 255, 0.35)",
      "--help-bg-a": "rgba(41, 23, 76, 0.85)",
      "--help-bg-b": "rgba(56, 33, 90, 0.85)"
    }
  },
  {
    name: "Cyan Current",
    vars: {
      "--bg-deep": "#05131b",
      "--bg-mid": "#0e3344",
      "--bg-radial-a": "rgba(79, 231, 255, 0.28)",
      "--bg-radial-b": "rgba(120, 201, 255, 0.24)",
      "--ambient-glow-a": "rgba(96, 230, 255, 0.22)",
      "--ambient-glow-b": "rgba(125, 255, 231, 0.18)",
      "--hud-border": "rgba(152, 235, 255, 0.42)",
      "--hud-bg-a": "rgba(14, 52, 70, 0.9)",
      "--hud-bg-b": "rgba(19, 67, 88, 0.82)",
      "--stat-border": "rgba(150, 224, 248, 0.32)",
      "--stat-bg": "rgba(18, 60, 79, 0.9)",
      "--shell-border": "rgba(160, 233, 255, 0.35)",
      "--help-bg-a": "rgba(16, 54, 72, 0.85)",
      "--help-bg-b": "rgba(22, 69, 90, 0.85)"
    }
  },
  {
    name: "Rose Gold Room",
    vars: {
      "--bg-deep": "#1b0f14",
      "--bg-mid": "#3b1f2d",
      "--bg-radial-a": "rgba(255, 152, 167, 0.29)",
      "--bg-radial-b": "rgba(255, 199, 146, 0.24)",
      "--ambient-glow-a": "rgba(253, 154, 178, 0.24)",
      "--ambient-glow-b": "rgba(255, 214, 172, 0.19)",
      "--hud-border": "rgba(255, 199, 178, 0.42)",
      "--hud-bg-a": "rgba(63, 30, 42, 0.9)",
      "--hud-bg-b": "rgba(80, 41, 56, 0.82)",
      "--stat-border": "rgba(240, 183, 169, 0.32)",
      "--stat-bg": "rgba(68, 35, 49, 0.9)",
      "--shell-border": "rgba(255, 204, 182, 0.36)",
      "--help-bg-a": "rgba(57, 28, 39, 0.85)",
      "--help-bg-b": "rgba(74, 37, 51, 0.85)"
    }
  },
  {
    name: "Obsidian Fire",
    vars: {
      "--bg-deep": "#120b08",
      "--bg-mid": "#2f1812",
      "--bg-radial-a": "rgba(255, 111, 67, 0.3)",
      "--bg-radial-b": "rgba(255, 168, 75, 0.25)",
      "--ambient-glow-a": "rgba(255, 123, 70, 0.24)",
      "--ambient-glow-b": "rgba(255, 173, 97, 0.2)",
      "--hud-border": "rgba(255, 177, 123, 0.42)",
      "--hud-bg-a": "rgba(54, 27, 19, 0.9)",
      "--hud-bg-b": "rgba(70, 35, 24, 0.82)",
      "--stat-border": "rgba(242, 170, 113, 0.32)",
      "--stat-bg": "rgba(60, 31, 21, 0.9)",
      "--shell-border": "rgba(255, 186, 128, 0.36)",
      "--help-bg-a": "rgba(48, 25, 17, 0.85)",
      "--help-bg-b": "rgba(65, 33, 22, 0.85)"
    }
  },
  {
    name: "Arctic Mint",
    vars: {
      "--bg-deep": "#071418",
      "--bg-mid": "#17353b",
      "--bg-radial-a": "rgba(135, 255, 240, 0.28)",
      "--bg-radial-b": "rgba(176, 232, 255, 0.24)",
      "--ambient-glow-a": "rgba(133, 246, 236, 0.23)",
      "--ambient-glow-b": "rgba(173, 225, 255, 0.18)",
      "--hud-border": "rgba(173, 242, 231, 0.42)",
      "--hud-bg-a": "rgba(24, 62, 69, 0.9)",
      "--hud-bg-b": "rgba(31, 79, 86, 0.82)",
      "--stat-border": "rgba(166, 228, 218, 0.32)",
      "--stat-bg": "rgba(27, 70, 77, 0.9)",
      "--shell-border": "rgba(181, 241, 233, 0.35)",
      "--help-bg-a": "rgba(24, 63, 69, 0.85)",
      "--help-bg-b": "rgba(32, 78, 85, 0.85)"
    }
  },
  {
    name: "Electric Lime",
    vars: {
      "--bg-deep": "#0e1605",
      "--bg-mid": "#253c0f",
      "--bg-radial-a": "rgba(198, 255, 82, 0.28)",
      "--bg-radial-b": "rgba(123, 239, 117, 0.24)",
      "--ambient-glow-a": "rgba(188, 255, 102, 0.22)",
      "--ambient-glow-b": "rgba(139, 239, 133, 0.18)",
      "--hud-border": "rgba(204, 243, 125, 0.42)",
      "--hud-bg-a": "rgba(40, 63, 20, 0.9)",
      "--hud-bg-b": "rgba(51, 80, 26, 0.82)",
      "--stat-border": "rgba(187, 223, 118, 0.32)",
      "--stat-bg": "rgba(44, 71, 24, 0.9)",
      "--shell-border": "rgba(206, 243, 132, 0.35)",
      "--help-bg-a": "rgba(38, 62, 20, 0.85)",
      "--help-bg-b": "rgba(49, 78, 26, 0.85)"
    }
  },
  {
    name: "Violet Noir",
    vars: {
      "--bg-deep": "#120818",
      "--bg-mid": "#2e1642",
      "--bg-radial-a": "rgba(184, 124, 255, 0.29)",
      "--bg-radial-b": "rgba(121, 99, 255, 0.24)",
      "--ambient-glow-a": "rgba(185, 129, 255, 0.23)",
      "--ambient-glow-b": "rgba(146, 122, 255, 0.19)",
      "--hud-border": "rgba(198, 168, 255, 0.42)",
      "--hud-bg-a": "rgba(43, 23, 64, 0.9)",
      "--hud-bg-b": "rgba(56, 31, 82, 0.82)",
      "--stat-border": "rgba(191, 162, 248, 0.32)",
      "--stat-bg": "rgba(47, 28, 74, 0.9)",
      "--shell-border": "rgba(202, 173, 255, 0.35)",
      "--help-bg-a": "rgba(40, 22, 61, 0.85)",
      "--help-bg-b": "rgba(53, 31, 78, 0.85)"
    }
  },
  {
    name: "Polar Dawn",
    vars: {
      "--bg-deep": "#0b1424",
      "--bg-mid": "#213960",
      "--bg-radial-a": "rgba(133, 198, 255, 0.28)",
      "--bg-radial-b": "rgba(185, 214, 255, 0.23)",
      "--ambient-glow-a": "rgba(136, 197, 255, 0.22)",
      "--ambient-glow-b": "rgba(175, 220, 255, 0.18)",
      "--hud-border": "rgba(170, 214, 255, 0.42)",
      "--hud-bg-a": "rgba(30, 54, 93, 0.9)",
      "--hud-bg-b": "rgba(39, 68, 112, 0.82)",
      "--stat-border": "rgba(162, 200, 242, 0.32)",
      "--stat-bg": "rgba(33, 61, 99, 0.9)",
      "--shell-border": "rgba(177, 218, 255, 0.35)",
      "--help-bg-a": "rgba(28, 53, 89, 0.85)",
      "--help-bg-b": "rgba(38, 67, 108, 0.85)"
    }
  },
  {
    name: "Coral Tide",
    vars: {
      "--bg-deep": "#1b0f12",
      "--bg-mid": "#402128",
      "--bg-radial-a": "rgba(255, 132, 122, 0.29)",
      "--bg-radial-b": "rgba(255, 191, 126, 0.24)",
      "--ambient-glow-a": "rgba(255, 130, 126, 0.24)",
      "--ambient-glow-b": "rgba(255, 199, 140, 0.19)",
      "--hud-border": "rgba(251, 186, 152, 0.42)",
      "--hud-bg-a": "rgba(69, 34, 39, 0.9)",
      "--hud-bg-b": "rgba(86, 45, 49, 0.82)",
      "--stat-border": "rgba(236, 173, 145, 0.32)",
      "--stat-bg": "rgba(73, 39, 43, 0.9)",
      "--shell-border": "rgba(252, 196, 163, 0.35)",
      "--help-bg-a": "rgba(62, 32, 37, 0.85)",
      "--help-bg-b": "rgba(79, 43, 47, 0.85)"
    }
  },
  {
    name: "Midnight Teal",
    vars: {
      "--bg-deep": "#071217",
      "--bg-mid": "#11323b",
      "--bg-radial-a": "rgba(79, 225, 210, 0.27)",
      "--bg-radial-b": "rgba(98, 162, 255, 0.22)",
      "--ambient-glow-a": "rgba(85, 225, 204, 0.22)",
      "--ambient-glow-b": "rgba(108, 175, 255, 0.18)",
      "--hud-border": "rgba(145, 226, 208, 0.42)",
      "--hud-bg-a": "rgba(18, 52, 61, 0.9)",
      "--hud-bg-b": "rgba(24, 65, 78, 0.82)",
      "--stat-border": "rgba(138, 210, 195, 0.32)",
      "--stat-bg": "rgba(21, 58, 68, 0.9)",
      "--shell-border": "rgba(154, 229, 213, 0.35)",
      "--help-bg-a": "rgba(17, 51, 60, 0.85)",
      "--help-bg-b": "rgba(23, 64, 76, 0.85)"
    }
  },
  {
    name: "Champagne Spark",
    vars: {
      "--bg-deep": "#1a130a",
      "--bg-mid": "#3f2d17",
      "--bg-radial-a": "rgba(255, 206, 128, 0.3)",
      "--bg-radial-b": "rgba(255, 170, 111, 0.24)",
      "--ambient-glow-a": "rgba(255, 211, 140, 0.25)",
      "--ambient-glow-b": "rgba(255, 182, 118, 0.2)",
      "--hud-border": "rgba(255, 218, 156, 0.42)",
      "--hud-bg-a": "rgba(72, 52, 26, 0.9)",
      "--hud-bg-b": "rgba(89, 64, 33, 0.82)",
      "--stat-border": "rgba(239, 204, 149, 0.32)",
      "--stat-bg": "rgba(76, 57, 30, 0.9)",
      "--shell-border": "rgba(255, 221, 165, 0.35)",
      "--help-bg-a": "rgba(66, 49, 24, 0.85)",
      "--help-bg-b": "rgba(83, 60, 32, 0.85)"
    }
  },
  {
    name: "Neon Plum",
    vars: {
      "--bg-deep": "#170b1f",
      "--bg-mid": "#35184a",
      "--bg-radial-a": "rgba(217, 122, 255, 0.29)",
      "--bg-radial-b": "rgba(255, 120, 198, 0.24)",
      "--ambient-glow-a": "rgba(213, 126, 255, 0.23)",
      "--ambient-glow-b": "rgba(255, 143, 208, 0.19)",
      "--hud-border": "rgba(227, 173, 255, 0.42)",
      "--hud-bg-a": "rgba(53, 28, 78, 0.9)",
      "--hud-bg-b": "rgba(68, 37, 96, 0.82)",
      "--stat-border": "rgba(216, 164, 248, 0.32)",
      "--stat-bg": "rgba(58, 34, 86, 0.9)",
      "--shell-border": "rgba(230, 179, 255, 0.35)",
      "--help-bg-a": "rgba(48, 26, 73, 0.85)",
      "--help-bg-b": "rgba(63, 35, 89, 0.85)"
    }
  },
  {
    name: "Lagoon Spark",
    vars: {
      "--bg-deep": "#08161a",
      "--bg-mid": "#194149",
      "--bg-radial-a": "rgba(96, 255, 219, 0.28)",
      "--bg-radial-b": "rgba(100, 201, 255, 0.23)",
      "--ambient-glow-a": "rgba(104, 248, 220, 0.23)",
      "--ambient-glow-b": "rgba(120, 205, 255, 0.18)",
      "--hud-border": "rgba(166, 240, 228, 0.42)",
      "--hud-bg-a": "rgba(24, 65, 72, 0.9)",
      "--hud-bg-b": "rgba(31, 81, 89, 0.82)",
      "--stat-border": "rgba(156, 225, 213, 0.32)",
      "--stat-bg": "rgba(27, 73, 80, 0.9)",
      "--shell-border": "rgba(173, 243, 231, 0.35)",
      "--help-bg-a": "rgba(23, 64, 71, 0.85)",
      "--help-bg-b": "rgba(30, 79, 87, 0.85)"
    }
  },
  {
    name: "Crimson Night",
    vars: {
      "--bg-deep": "#1b070c",
      "--bg-mid": "#45111f",
      "--bg-radial-a": "rgba(255, 88, 112, 0.31)",
      "--bg-radial-b": "rgba(255, 141, 102, 0.24)",
      "--ambient-glow-a": "rgba(255, 91, 121, 0.24)",
      "--ambient-glow-b": "rgba(255, 162, 108, 0.2)",
      "--hud-border": "rgba(255, 152, 142, 0.42)",
      "--hud-bg-a": "rgba(72, 20, 33, 0.9)",
      "--hud-bg-b": "rgba(91, 27, 41, 0.82)",
      "--stat-border": "rgba(244, 144, 137, 0.32)",
      "--stat-bg": "rgba(77, 24, 36, 0.9)",
      "--shell-border": "rgba(255, 166, 156, 0.35)",
      "--help-bg-a": "rgba(66, 18, 30, 0.85)",
      "--help-bg-b": "rgba(85, 26, 39, 0.85)"
    }
  },
  {
    name: "Aurora Drift",
    vars: {
      "--bg-deep": "#0a1224",
      "--bg-mid": "#20325f",
      "--bg-radial-a": "rgba(131, 171, 255, 0.29)",
      "--bg-radial-b": "rgba(116, 255, 202, 0.23)",
      "--ambient-glow-a": "rgba(129, 171, 255, 0.23)",
      "--ambient-glow-b": "rgba(132, 247, 208, 0.18)",
      "--hud-border": "rgba(165, 208, 255, 0.42)",
      "--hud-bg-a": "rgba(34, 53, 98, 0.9)",
      "--hud-bg-b": "rgba(42, 69, 120, 0.82)",
      "--stat-border": "rgba(158, 198, 247, 0.32)",
      "--stat-bg": "rgba(37, 60, 106, 0.9)",
      "--shell-border": "rgba(176, 219, 255, 0.35)",
      "--help-bg-a": "rgba(32, 52, 95, 0.85)",
      "--help-bg-b": "rgba(41, 68, 116, 0.85)"
    }
  },
  {
    name: "Copper Crown",
    vars: {
      "--bg-deep": "#1a100a",
      "--bg-mid": "#3d2618",
      "--bg-radial-a": "rgba(255, 166, 103, 0.3)",
      "--bg-radial-b": "rgba(255, 123, 92, 0.24)",
      "--ambient-glow-a": "rgba(255, 170, 111, 0.24)",
      "--ambient-glow-b": "rgba(255, 146, 102, 0.19)",
      "--hud-border": "rgba(248, 188, 136, 0.42)",
      "--hud-bg-a": "rgba(70, 44, 28, 0.9)",
      "--hud-bg-b": "rgba(88, 56, 36, 0.82)",
      "--stat-border": "rgba(234, 176, 127, 0.32)",
      "--stat-bg": "rgba(75, 50, 32, 0.9)",
      "--shell-border": "rgba(252, 197, 144, 0.35)",
      "--help-bg-a": "rgba(64, 41, 27, 0.85)",
      "--help-bg-b": "rgba(82, 53, 35, 0.85)"
    }
  },
  {
    name: "Mint Royale",
    vars: {
      "--bg-deep": "#0a1714",
      "--bg-mid": "#20433d",
      "--bg-radial-a": "rgba(120, 255, 198, 0.28)",
      "--bg-radial-b": "rgba(166, 255, 220, 0.23)",
      "--ambient-glow-a": "rgba(117, 249, 198, 0.23)",
      "--ambient-glow-b": "rgba(173, 255, 225, 0.18)",
      "--hud-border": "rgba(166, 245, 212, 0.42)",
      "--hud-bg-a": "rgba(31, 72, 63, 0.9)",
      "--hud-bg-b": "rgba(38, 90, 79, 0.82)",
      "--stat-border": "rgba(154, 230, 199, 0.32)",
      "--stat-bg": "rgba(35, 79, 70, 0.9)",
      "--shell-border": "rgba(177, 255, 222, 0.35)",
      "--help-bg-a": "rgba(30, 69, 61, 0.85)",
      "--help-bg-b": "rgba(38, 86, 76, 0.85)"
    }
  },
  {
    name: "Orchid Storm",
    vars: {
      "--bg-deep": "#140a1d",
      "--bg-mid": "#33194f",
      "--bg-radial-a": "rgba(221, 132, 255, 0.29)",
      "--bg-radial-b": "rgba(143, 119, 255, 0.23)",
      "--ambient-glow-a": "rgba(222, 145, 255, 0.24)",
      "--ambient-glow-b": "rgba(156, 136, 255, 0.19)",
      "--hud-border": "rgba(221, 179, 255, 0.42)",
      "--hud-bg-a": "rgba(56, 31, 86, 0.9)",
      "--hud-bg-b": "rgba(70, 41, 106, 0.82)",
      "--stat-border": "rgba(209, 170, 248, 0.32)",
      "--stat-bg": "rgba(61, 37, 94, 0.9)",
      "--shell-border": "rgba(225, 186, 255, 0.35)",
      "--help-bg-a": "rgba(52, 29, 81, 0.85)",
      "--help-bg-b": "rgba(66, 40, 101, 0.85)"
    }
  },
  {
    name: "Azure Ember",
    vars: {
      "--bg-deep": "#0d1324",
      "--bg-mid": "#27385d",
      "--bg-radial-a": "rgba(120, 180, 255, 0.27)",
      "--bg-radial-b": "rgba(255, 154, 98, 0.22)",
      "--ambient-glow-a": "rgba(125, 183, 255, 0.22)",
      "--ambient-glow-b": "rgba(255, 166, 107, 0.18)",
      "--hud-border": "rgba(173, 204, 251, 0.42)",
      "--hud-bg-a": "rgba(41, 59, 102, 0.9)",
      "--hud-bg-b": "rgba(56, 76, 122, 0.82)",
      "--stat-border": "rgba(167, 194, 237, 0.32)",
      "--stat-bg": "rgba(45, 66, 111, 0.9)",
      "--shell-border": "rgba(186, 215, 255, 0.35)",
      "--help-bg-a": "rgba(38, 56, 99, 0.85)",
      "--help-bg-b": "rgba(53, 73, 117, 0.85)"
    }
  },
  {
    name: "Golden Harbor",
    vars: {
      "--bg-deep": "#181307",
      "--bg-mid": "#3f3512",
      "--bg-radial-a": "rgba(255, 219, 114, 0.3)",
      "--bg-radial-b": "rgba(255, 171, 93, 0.24)",
      "--ambient-glow-a": "rgba(255, 223, 120, 0.25)",
      "--ambient-glow-b": "rgba(255, 187, 106, 0.2)",
      "--hud-border": "rgba(251, 224, 147, 0.42)",
      "--hud-bg-a": "rgba(73, 62, 22, 0.9)",
      "--hud-bg-b": "rgba(91, 77, 29, 0.82)",
      "--stat-border": "rgba(236, 208, 134, 0.32)",
      "--stat-bg": "rgba(78, 68, 25, 0.9)",
      "--shell-border": "rgba(255, 228, 154, 0.35)",
      "--help-bg-a": "rgba(67, 58, 20, 0.85)",
      "--help-bg-b": "rgba(86, 73, 28, 0.85)"
    }
  },
  {
    name: "Frostbite Neon",
    vars: {
      "--bg-deep": "#091526",
      "--bg-mid": "#1d3f66",
      "--bg-radial-a": "rgba(145, 201, 255, 0.29)",
      "--bg-radial-b": "rgba(148, 255, 234, 0.23)",
      "--ambient-glow-a": "rgba(144, 201, 255, 0.23)",
      "--ambient-glow-b": "rgba(156, 255, 237, 0.19)",
      "--hud-border": "rgba(181, 222, 255, 0.42)",
      "--hud-bg-a": "rgba(33, 70, 111, 0.9)",
      "--hud-bg-b": "rgba(43, 88, 131, 0.82)",
      "--stat-border": "rgba(168, 210, 248, 0.32)",
      "--stat-bg": "rgba(36, 76, 119, 0.9)",
      "--shell-border": "rgba(190, 231, 255, 0.35)",
      "--help-bg-a": "rgba(31, 68, 107, 0.85)",
      "--help-bg-b": "rgba(41, 85, 126, 0.85)"
    }
  },
  {
    name: "Scarlet Ice",
    vars: {
      "--bg-deep": "#1a0d14",
      "--bg-mid": "#3f1f34",
      "--bg-radial-a": "rgba(255, 112, 130, 0.3)",
      "--bg-radial-b": "rgba(152, 214, 255, 0.22)",
      "--ambient-glow-a": "rgba(255, 118, 138, 0.24)",
      "--ambient-glow-b": "rgba(162, 221, 255, 0.18)",
      "--hud-border": "rgba(255, 173, 181, 0.42)",
      "--hud-bg-a": "rgba(69, 33, 52, 0.9)",
      "--hud-bg-b": "rgba(85, 41, 64, 0.82)",
      "--stat-border": "rgba(246, 164, 170, 0.32)",
      "--stat-bg": "rgba(73, 37, 57, 0.9)",
      "--shell-border": "rgba(255, 185, 193, 0.35)",
      "--help-bg-a": "rgba(63, 31, 49, 0.85)",
      "--help-bg-b": "rgba(79, 39, 61, 0.85)"
    }
  },
  {
    name: "Jade Inferno",
    vars: {
      "--bg-deep": "#0f140a",
      "--bg-mid": "#2b3514",
      "--bg-radial-a": "rgba(140, 255, 149, 0.28)",
      "--bg-radial-b": "rgba(255, 165, 84, 0.23)",
      "--ambient-glow-a": "rgba(136, 250, 146, 0.22)",
      "--ambient-glow-b": "rgba(255, 180, 96, 0.19)",
      "--hud-border": "rgba(181, 240, 150, 0.42)",
      "--hud-bg-a": "rgba(47, 60, 23, 0.9)",
      "--hud-bg-b": "rgba(61, 76, 30, 0.82)",
      "--stat-border": "rgba(173, 226, 142, 0.32)",
      "--stat-bg": "rgba(52, 67, 27, 0.9)",
      "--shell-border": "rgba(196, 251, 163, 0.35)",
      "--help-bg-a": "rgba(44, 57, 22, 0.85)",
      "--help-bg-b": "rgba(58, 73, 29, 0.85)"
    }
  },
  {
    name: "Twilight Sangria",
    vars: {
      "--bg-deep": "#1b0a12",
      "--bg-mid": "#45142d",
      "--bg-radial-a": "rgba(255, 102, 156, 0.31)",
      "--bg-radial-b": "rgba(255, 122, 98, 0.24)",
      "--ambient-glow-a": "rgba(255, 114, 165, 0.24)",
      "--ambient-glow-b": "rgba(255, 140, 104, 0.19)",
      "--hud-border": "rgba(255, 160, 188, 0.42)",
      "--hud-bg-a": "rgba(74, 24, 49, 0.9)",
      "--hud-bg-b": "rgba(92, 30, 60, 0.82)",
      "--stat-border": "rgba(245, 152, 179, 0.32)",
      "--stat-bg": "rgba(79, 27, 53, 0.9)",
      "--shell-border": "rgba(255, 177, 203, 0.35)",
      "--help-bg-a": "rgba(67, 22, 44, 0.85)",
      "--help-bg-b": "rgba(86, 29, 56, 0.85)"
    }
  },
  {
    name: "Cobalt Reef",
    vars: {
      "--bg-deep": "#081127",
      "--bg-mid": "#1a3470",
      "--bg-radial-a": "rgba(108, 165, 255, 0.3)",
      "--bg-radial-b": "rgba(83, 240, 255, 0.23)",
      "--ambient-glow-a": "rgba(113, 168, 255, 0.23)",
      "--ambient-glow-b": "rgba(103, 243, 255, 0.18)",
      "--hud-border": "rgba(156, 199, 255, 0.42)",
      "--hud-bg-a": "rgba(30, 58, 125, 0.9)",
      "--hud-bg-b": "rgba(39, 73, 148, 0.82)",
      "--stat-border": "rgba(145, 186, 245, 0.32)",
      "--stat-bg": "rgba(33, 64, 134, 0.9)",
      "--shell-border": "rgba(170, 212, 255, 0.35)",
      "--help-bg-a": "rgba(28, 55, 120, 0.85)",
      "--help-bg-b": "rgba(37, 70, 141, 0.85)"
    }
  },
  {
    name: "Velvet Orchard",
    vars: {
      "--bg-deep": "#141108",
      "--bg-mid": "#2f3b15",
      "--bg-radial-a": "rgba(196, 255, 111, 0.28)",
      "--bg-radial-b": "rgba(255, 203, 118, 0.23)",
      "--ambient-glow-a": "rgba(197, 245, 114, 0.22)",
      "--ambient-glow-b": "rgba(255, 212, 127, 0.18)",
      "--hud-border": "rgba(215, 243, 150, 0.42)",
      "--hud-bg-a": "rgba(53, 65, 24, 0.9)",
      "--hud-bg-b": "rgba(68, 82, 31, 0.82)",
      "--stat-border": "rgba(201, 227, 143, 0.32)",
      "--stat-bg": "rgba(57, 72, 27, 0.9)",
      "--shell-border": "rgba(224, 250, 166, 0.35)",
      "--help-bg-a": "rgba(49, 61, 22, 0.85)",
      "--help-bg-b": "rgba(64, 78, 30, 0.85)"
    }
  },
  {
    name: "Cherry Chrome",
    vars: {
      "--bg-deep": "#190a0e",
      "--bg-mid": "#431622",
      "--bg-radial-a": "rgba(255, 105, 122, 0.31)",
      "--bg-radial-b": "rgba(193, 216, 255, 0.22)",
      "--ambient-glow-a": "rgba(255, 112, 129, 0.24)",
      "--ambient-glow-b": "rgba(203, 220, 255, 0.18)",
      "--hud-border": "rgba(255, 171, 177, 0.42)",
      "--hud-bg-a": "rgba(72, 24, 35, 0.9)",
      "--hud-bg-b": "rgba(90, 31, 44, 0.82)",
      "--stat-border": "rgba(246, 162, 167, 0.32)",
      "--stat-bg": "rgba(76, 27, 39, 0.9)",
      "--shell-border": "rgba(255, 183, 189, 0.35)",
      "--help-bg-a": "rgba(64, 22, 32, 0.85)",
      "--help-bg-b": "rgba(82, 29, 42, 0.85)"
    }
  },
  {
    name: "Aqua Royale",
    vars: {
      "--bg-deep": "#06161d",
      "--bg-mid": "#17404e",
      "--bg-radial-a": "rgba(96, 247, 255, 0.28)",
      "--bg-radial-b": "rgba(121, 255, 205, 0.23)",
      "--ambient-glow-a": "rgba(102, 244, 255, 0.23)",
      "--ambient-glow-b": "rgba(129, 255, 212, 0.18)",
      "--hud-border": "rgba(163, 245, 236, 0.42)",
      "--hud-bg-a": "rgba(25, 71, 84, 0.9)",
      "--hud-bg-b": "rgba(33, 88, 101, 0.82)",
      "--stat-border": "rgba(151, 228, 220, 0.32)",
      "--stat-bg": "rgba(28, 78, 91, 0.9)",
      "--shell-border": "rgba(178, 255, 243, 0.35)",
      "--help-bg-a": "rgba(24, 68, 80, 0.85)",
      "--help-bg-b": "rgba(32, 85, 98, 0.85)"
    }
  },
  {
    name: "Solar Ember",
    vars: {
      "--bg-deep": "#1a0f06",
      "--bg-mid": "#47270f",
      "--bg-radial-a": "rgba(255, 186, 78, 0.31)",
      "--bg-radial-b": "rgba(255, 125, 70, 0.24)",
      "--ambient-glow-a": "rgba(255, 193, 88, 0.25)",
      "--ambient-glow-b": "rgba(255, 140, 79, 0.2)",
      "--hud-border": "rgba(255, 206, 138, 0.42)",
      "--hud-bg-a": "rgba(79, 45, 20, 0.9)",
      "--hud-bg-b": "rgba(97, 56, 25, 0.82)",
      "--stat-border": "rgba(243, 194, 127, 0.32)",
      "--stat-bg": "rgba(84, 49, 23, 0.9)",
      "--shell-border": "rgba(255, 214, 149, 0.36)",
      "--help-bg-a": "rgba(72, 41, 18, 0.85)",
      "--help-bg-b": "rgba(90, 53, 24, 0.85)"
    }
  },
  {
    name: "Opal Mist",
    vars: {
      "--bg-deep": "#0f131c",
      "--bg-mid": "#2b364a",
      "--bg-radial-a": "rgba(196, 214, 255, 0.26)",
      "--bg-radial-b": "rgba(205, 255, 241, 0.22)",
      "--ambient-glow-a": "rgba(194, 212, 255, 0.2)",
      "--ambient-glow-b": "rgba(205, 255, 239, 0.17)",
      "--hud-border": "rgba(212, 224, 250, 0.42)",
      "--hud-bg-a": "rgba(53, 66, 91, 0.9)",
      "--hud-bg-b": "rgba(69, 83, 107, 0.82)",
      "--stat-border": "rgba(197, 210, 236, 0.32)",
      "--stat-bg": "rgba(57, 72, 98, 0.9)",
      "--shell-border": "rgba(220, 232, 255, 0.35)",
      "--help-bg-a": "rgba(49, 62, 86, 0.85)",
      "--help-bg-b": "rgba(65, 79, 102, 0.85)"
    }
  },
  {
    name: "Forest Luxe",
    vars: {
      "--bg-deep": "#0b140d",
      "--bg-mid": "#213b24",
      "--bg-radial-a": "rgba(124, 230, 132, 0.28)",
      "--bg-radial-b": "rgba(163, 255, 191, 0.22)",
      "--ambient-glow-a": "rgba(124, 226, 139, 0.22)",
      "--ambient-glow-b": "rgba(168, 255, 196, 0.18)",
      "--hud-border": "rgba(167, 238, 173, 0.42)",
      "--hud-bg-a": "rgba(36, 69, 41, 0.9)",
      "--hud-bg-b": "rgba(46, 85, 51, 0.82)",
      "--stat-border": "rgba(157, 222, 161, 0.32)",
      "--stat-bg": "rgba(40, 75, 45, 0.9)",
      "--shell-border": "rgba(183, 252, 189, 0.35)",
      "--help-bg-a": "rgba(34, 66, 39, 0.85)",
      "--help-bg-b": "rgba(44, 82, 48, 0.85)"
    }
  },
  {
    name: "Violet Mirage",
    vars: {
      "--bg-deep": "#100a1f",
      "--bg-mid": "#2d1f48",
      "--bg-radial-a": "rgba(190, 132, 255, 0.3)",
      "--bg-radial-b": "rgba(118, 164, 255, 0.24)",
      "--ambient-glow-a": "rgba(191, 120, 255, 0.24)",
      "--ambient-glow-b": "rgba(137, 205, 255, 0.2)",
      "--hud-border": "rgba(197, 170, 255, 0.42)",
      "--hud-bg-a": "rgba(38, 24, 67, 0.9)",
      "--hud-bg-b": "rgba(52, 34, 88, 0.82)",
      "--stat-border": "rgba(189, 162, 247, 0.32)",
      "--stat-bg": "rgba(42, 29, 72, 0.9)",
      "--shell-border": "rgba(201, 176, 255, 0.36)",
      "--help-bg-a": "rgba(36, 23, 63, 0.85)",
      "--help-bg-b": "rgba(49, 31, 83, 0.85)"
    }
  },
  {
    name: "Arctic Neon",
    vars: {
      "--bg-deep": "#07131f",
      "--bg-mid": "#16344b",
      "--bg-radial-a": "rgba(110, 224, 255, 0.3)",
      "--bg-radial-b": "rgba(154, 190, 255, 0.24)",
      "--ambient-glow-a": "rgba(120, 236, 255, 0.24)",
      "--ambient-glow-b": "rgba(141, 201, 255, 0.21)",
      "--hud-border": "rgba(164, 227, 255, 0.42)",
      "--hud-bg-a": "rgba(16, 46, 66, 0.9)",
      "--hud-bg-b": "rgba(29, 64, 91, 0.82)",
      "--stat-border": "rgba(154, 214, 241, 0.32)",
      "--stat-bg": "rgba(19, 54, 78, 0.9)",
      "--shell-border": "rgba(170, 231, 255, 0.36)",
      "--help-bg-a": "rgba(15, 45, 65, 0.85)",
      "--help-bg-b": "rgba(26, 59, 84, 0.85)"
    }
  },
  {
    name: "Crimson Royale",
    vars: {
      "--bg-deep": "#1a090e",
      "--bg-mid": "#451520",
      "--bg-radial-a": "rgba(255, 105, 122, 0.32)",
      "--bg-radial-b": "rgba(255, 171, 124, 0.24)",
      "--ambient-glow-a": "rgba(255, 114, 132, 0.25)",
      "--ambient-glow-b": "rgba(255, 180, 131, 0.2)",
      "--hud-border": "rgba(255, 183, 157, 0.43)",
      "--hud-bg-a": "rgba(66, 22, 34, 0.9)",
      "--hud-bg-b": "rgba(84, 28, 42, 0.82)",
      "--stat-border": "rgba(244, 168, 149, 0.32)",
      "--stat-bg": "rgba(73, 24, 38, 0.9)",
      "--shell-border": "rgba(255, 195, 171, 0.37)",
      "--help-bg-a": "rgba(62, 21, 32, 0.85)",
      "--help-bg-b": "rgba(80, 27, 40, 0.85)"
    }
  },
  {
    name: "Mint Voltage",
    vars: {
      "--bg-deep": "#061615",
      "--bg-mid": "#15453f",
      "--bg-radial-a": "rgba(115, 255, 202, 0.32)",
      "--bg-radial-b": "rgba(127, 231, 255, 0.24)",
      "--ambient-glow-a": "rgba(104, 245, 194, 0.25)",
      "--ambient-glow-b": "rgba(116, 231, 255, 0.2)",
      "--hud-border": "rgba(162, 249, 216, 0.43)",
      "--hud-bg-a": "rgba(18, 63, 56, 0.9)",
      "--hud-bg-b": "rgba(30, 84, 74, 0.82)",
      "--stat-border": "rgba(152, 236, 207, 0.33)",
      "--stat-bg": "rgba(22, 71, 63, 0.9)",
      "--shell-border": "rgba(176, 255, 223, 0.37)",
      "--help-bg-a": "rgba(18, 60, 54, 0.85)",
      "--help-bg-b": "rgba(28, 79, 70, 0.85)"
    }
  },
  {
    name: "Ivory Glow",
    vars: {
      "--bg-deep": "#1b1408",
      "--bg-mid": "#4e3b1f",
      "--bg-radial-a": "rgba(255, 207, 118, 0.33)",
      "--bg-radial-b": "rgba(255, 166, 104, 0.25)",
      "--ambient-glow-a": "rgba(255, 214, 122, 0.26)",
      "--ambient-glow-b": "rgba(255, 178, 108, 0.21)",
      "--hud-border": "rgba(255, 222, 165, 0.44)",
      "--hud-bg-a": "rgba(71, 54, 27, 0.9)",
      "--hud-bg-b": "rgba(91, 70, 35, 0.82)",
      "--stat-border": "rgba(245, 214, 159, 0.33)",
      "--stat-bg": "rgba(78, 60, 30, 0.9)",
      "--shell-border": "rgba(255, 225, 170, 0.38)",
      "--help-bg-a": "rgba(66, 51, 27, 0.85)",
      "--help-bg-b": "rgba(85, 65, 34, 0.85)"
    }
  },
  {
    name: "Cobalt Dream",
    vars: {
      "--bg-deep": "#081227",
      "--bg-mid": "#183a69",
      "--bg-radial-a": "rgba(89, 162, 255, 0.3)",
      "--bg-radial-b": "rgba(95, 119, 255, 0.24)",
      "--ambient-glow-a": "rgba(96, 170, 255, 0.24)",
      "--ambient-glow-b": "rgba(127, 153, 255, 0.2)",
      "--hud-border": "rgba(160, 194, 255, 0.43)",
      "--hud-bg-a": "rgba(24, 51, 93, 0.9)",
      "--hud-bg-b": "rgba(36, 69, 117, 0.82)",
      "--stat-border": "rgba(149, 186, 246, 0.33)",
      "--stat-bg": "rgba(27, 57, 102, 0.9)",
      "--shell-border": "rgba(172, 205, 255, 0.37)",
      "--help-bg-a": "rgba(24, 50, 89, 0.85)",
      "--help-bg-b": "rgba(33, 65, 109, 0.85)"
    }
  },
  {
    name: "Coral Heat",
    vars: {
      "--bg-deep": "#1a100e",
      "--bg-mid": "#4a2b23",
      "--bg-radial-a": "rgba(255, 138, 111, 0.33)",
      "--bg-radial-b": "rgba(255, 196, 111, 0.25)",
      "--ambient-glow-a": "rgba(255, 147, 116, 0.25)",
      "--ambient-glow-b": "rgba(255, 205, 121, 0.21)",
      "--hud-border": "rgba(255, 193, 152, 0.43)",
      "--hud-bg-a": "rgba(73, 43, 33, 0.9)",
      "--hud-bg-b": "rgba(93, 55, 42, 0.82)",
      "--stat-border": "rgba(244, 182, 145, 0.33)",
      "--stat-bg": "rgba(81, 47, 36, 0.9)",
      "--shell-border": "rgba(255, 204, 165, 0.37)",
      "--help-bg-a": "rgba(69, 40, 31, 0.85)",
      "--help-bg-b": "rgba(86, 50, 39, 0.85)"
    }
  },
  {
    name: "Cyber Lime",
    vars: {
      "--bg-deep": "#0d1806",
      "--bg-mid": "#2a4f13",
      "--bg-radial-a": "rgba(174, 255, 96, 0.32)",
      "--bg-radial-b": "rgba(112, 255, 175, 0.24)",
      "--ambient-glow-a": "rgba(164, 247, 87, 0.24)",
      "--ambient-glow-b": "rgba(104, 248, 166, 0.2)",
      "--hud-border": "rgba(197, 255, 145, 0.43)",
      "--hud-bg-a": "rgba(43, 76, 21, 0.9)",
      "--hud-bg-b": "rgba(58, 100, 27, 0.82)",
      "--stat-border": "rgba(186, 241, 136, 0.33)",
      "--stat-bg": "rgba(48, 85, 24, 0.9)",
      "--shell-border": "rgba(206, 255, 157, 0.37)",
      "--help-bg-a": "rgba(41, 72, 20, 0.85)",
      "--help-bg-b": "rgba(54, 92, 26, 0.85)"
    }
  },
  {
    name: "Noir Teal",
    vars: {
      "--bg-deep": "#041316",
      "--bg-mid": "#174048",
      "--bg-radial-a": "rgba(85, 225, 217, 0.3)",
      "--bg-radial-b": "rgba(94, 176, 255, 0.24)",
      "--ambient-glow-a": "rgba(73, 212, 204, 0.24)",
      "--ambient-glow-b": "rgba(103, 184, 255, 0.2)",
      "--hud-border": "rgba(149, 228, 229, 0.42)",
      "--hud-bg-a": "rgba(20, 62, 67, 0.9)",
      "--hud-bg-b": "rgba(32, 80, 88, 0.82)",
      "--stat-border": "rgba(139, 216, 219, 0.32)",
      "--stat-bg": "rgba(24, 68, 74, 0.9)",
      "--shell-border": "rgba(164, 238, 240, 0.36)",
      "--help-bg-a": "rgba(19, 58, 63, 0.85)",
      "--help-bg-b": "rgba(30, 74, 81, 0.85)"
    }
  },
  {
    name: "Rose Quartz",
    vars: {
      "--bg-deep": "#190f19",
      "--bg-mid": "#472a4a",
      "--bg-radial-a": "rgba(255, 160, 201, 0.32)",
      "--bg-radial-b": "rgba(195, 157, 255, 0.24)",
      "--ambient-glow-a": "rgba(255, 158, 200, 0.24)",
      "--ambient-glow-b": "rgba(187, 152, 255, 0.2)",
      "--hud-border": "rgba(239, 188, 233, 0.43)",
      "--hud-bg-a": "rgba(69, 40, 72, 0.9)",
      "--hud-bg-b": "rgba(90, 54, 94, 0.82)",
      "--stat-border": "rgba(227, 178, 222, 0.33)",
      "--stat-bg": "rgba(76, 44, 79, 0.9)",
      "--shell-border": "rgba(246, 197, 241, 0.37)",
      "--help-bg-a": "rgba(65, 38, 68, 0.85)",
      "--help-bg-b": "rgba(83, 49, 88, 0.85)"
    }
  },
  {
    name: "Electric Orchid",
    vars: {
      "--bg-deep": "#150a22",
      "--bg-mid": "#3a1e61",
      "--bg-radial-a": "rgba(212, 112, 255, 0.33)",
      "--bg-radial-b": "rgba(109, 126, 255, 0.24)",
      "--ambient-glow-a": "rgba(198, 99, 255, 0.25)",
      "--ambient-glow-b": "rgba(124, 139, 255, 0.2)",
      "--hud-border": "rgba(215, 170, 255, 0.43)",
      "--hud-bg-a": "rgba(58, 30, 98, 0.9)",
      "--hud-bg-b": "rgba(74, 39, 124, 0.82)",
      "--stat-border": "rgba(204, 160, 247, 0.33)",
      "--stat-bg": "rgba(64, 34, 106, 0.9)",
      "--shell-border": "rgba(224, 182, 255, 0.37)",
      "--help-bg-a": "rgba(54, 28, 91, 0.85)",
      "--help-bg-b": "rgba(69, 36, 116, 0.85)"
    }
  },
  {
    name: "Bronze Mirage",
    vars: {
      "--bg-deep": "#1a1209",
      "--bg-mid": "#4b3018",
      "--bg-radial-a": "rgba(229, 168, 94, 0.32)",
      "--bg-radial-b": "rgba(255, 210, 141, 0.24)",
      "--ambient-glow-a": "rgba(222, 159, 89, 0.24)",
      "--ambient-glow-b": "rgba(248, 202, 133, 0.2)",
      "--hud-border": "rgba(233, 190, 136, 0.43)",
      "--hud-bg-a": "rgba(73, 46, 23, 0.9)",
      "--hud-bg-b": "rgba(93, 59, 30, 0.82)",
      "--stat-border": "rgba(219, 179, 128, 0.33)",
      "--stat-bg": "rgba(80, 51, 26, 0.9)",
      "--shell-border": "rgba(242, 201, 146, 0.37)",
      "--help-bg-a": "rgba(68, 43, 21, 0.85)",
      "--help-bg-b": "rgba(85, 55, 27, 0.85)"
    }
  },
  {
    name: "Moonsteel",
    vars: {
      "--bg-deep": "#0d121b",
      "--bg-mid": "#273448",
      "--bg-radial-a": "rgba(168, 190, 223, 0.29)",
      "--bg-radial-b": "rgba(132, 168, 255, 0.23)",
      "--ambient-glow-a": "rgba(157, 182, 218, 0.23)",
      "--ambient-glow-b": "rgba(129, 165, 247, 0.19)",
      "--hud-border": "rgba(194, 208, 229, 0.42)",
      "--hud-bg-a": "rgba(42, 55, 77, 0.9)",
      "--hud-bg-b": "rgba(56, 73, 99, 0.82)",
      "--stat-border": "rgba(183, 199, 219, 0.32)",
      "--stat-bg": "rgba(46, 61, 85, 0.9)",
      "--shell-border": "rgba(205, 219, 240, 0.36)",
      "--help-bg-a": "rgba(39, 51, 71, 0.85)",
      "--help-bg-b": "rgba(52, 68, 92, 0.85)"
    }
  },
  {
    name: "Tropical Mint",
    vars: {
      "--bg-deep": "#071712",
      "--bg-mid": "#1f5544",
      "--bg-radial-a": "rgba(95, 255, 196, 0.33)",
      "--bg-radial-b": "rgba(126, 255, 164, 0.24)",
      "--ambient-glow-a": "rgba(101, 247, 194, 0.25)",
      "--ambient-glow-b": "rgba(124, 248, 161, 0.2)",
      "--hud-border": "rgba(167, 255, 209, 0.43)",
      "--hud-bg-a": "rgba(30, 87, 67, 0.9)",
      "--hud-bg-b": "rgba(40, 109, 84, 0.82)",
      "--stat-border": "rgba(155, 243, 197, 0.33)",
      "--stat-bg": "rgba(33, 96, 74, 0.9)",
      "--shell-border": "rgba(182, 255, 221, 0.37)",
      "--help-bg-a": "rgba(28, 82, 64, 0.85)",
      "--help-bg-b": "rgba(37, 100, 78, 0.85)"
    }
  },
  {
    name: "Sunburst Flare",
    vars: {
      "--bg-deep": "#1d0f05",
      "--bg-mid": "#5b2f13",
      "--bg-radial-a": "rgba(255, 168, 77, 0.34)",
      "--bg-radial-b": "rgba(255, 117, 68, 0.26)",
      "--ambient-glow-a": "rgba(255, 172, 85, 0.26)",
      "--ambient-glow-b": "rgba(255, 124, 74, 0.22)",
      "--hud-border": "rgba(255, 195, 133, 0.44)",
      "--hud-bg-a": "rgba(87, 45, 21, 0.9)",
      "--hud-bg-b": "rgba(112, 57, 26, 0.82)",
      "--stat-border": "rgba(246, 182, 126, 0.34)",
      "--stat-bg": "rgba(95, 50, 23, 0.9)",
      "--shell-border": "rgba(255, 205, 144, 0.38)",
      "--help-bg-a": "rgba(80, 42, 20, 0.85)",
      "--help-bg-b": "rgba(103, 52, 24, 0.85)"
    }
  },
  {
    name: "Violet Nightfall",
    vars: {
      "--bg-deep": "#120b1f",
      "--bg-mid": "#36295c",
      "--bg-radial-a": "rgba(170, 118, 255, 0.31)",
      "--bg-radial-b": "rgba(108, 169, 255, 0.24)",
      "--ambient-glow-a": "rgba(165, 110, 253, 0.24)",
      "--ambient-glow-b": "rgba(123, 184, 255, 0.2)",
      "--hud-border": "rgba(195, 173, 255, 0.43)",
      "--hud-bg-a": "rgba(53, 39, 89, 0.9)",
      "--hud-bg-b": "rgba(69, 51, 113, 0.82)",
      "--stat-border": "rgba(183, 164, 242, 0.33)",
      "--stat-bg": "rgba(59, 44, 97, 0.9)",
      "--shell-border": "rgba(210, 188, 255, 0.37)",
      "--help-bg-a": "rgba(50, 37, 83, 0.85)",
      "--help-bg-b": "rgba(64, 47, 105, 0.85)"
    }
  }
];

const decorativeTables = [
  { x: 285, y: 115, radius: 22, color: "#4f2f45" },
  { x: 695, y: 115, radius: 20, color: "#3f3b59" },
  { x: 1125, y: 115, radius: 22, color: "#3a4b63" },
  { x: 285, y: 615, radius: 22, color: "#4e3b2c" },
  { x: 695, y: 615, radius: 22, color: "#3a4b63" },
  { x: 1125, y: 615, radius: 22, color: "#4a3a5a" },
  { x: 148, y: 360, radius: 21, color: "#5a3a42" },
  { x: 1148, y: 360, radius: 22, color: "#445254" },
  { x: 310, y: 248, radius: 20, color: "#3f4a5a" },
  { x: 1050, y: 248, radius: 20, color: "#5a3f3f" },
  { x: 310, y: 472, radius: 20, color: "#3a5a3a" },
  { x: 1050, y: 472, radius: 20, color: "#4a3a5a" },
  { x: 640, y: 172, radius: 19, color: "#4a2a4a" },
  { x: 640, y: 548, radius: 19, color: "#2a4a3a" },
  { x: 640, y: 345, radius: 18, color: "#3f3b59" },
];

const npcs = [
  // Staff (8) — white uniforms, anchored near tables/bar
  { x: 455, y: 330, size: 16, vx: 0.3, vy: 0.22, moodTime: 0, color: "#f0f0fa", skin: "#f7ddc2", role: "staff", anchor: { x: 455, y: 330 }, roamRadius: 55 },
  { x: 825, y: 330, size: 16, vx: -0.3, vy: 0.22, moodTime: 0, color: "#f0f0fa", skin: "#dba88a", role: "staff", anchor: { x: 825, y: 330 }, roamRadius: 55 },
  { x: 280, y: 200, size: 16, vx: 0.28, vy: -0.22, moodTime: 0, color: "#f0f0fa", skin: "#c47a52", role: "staff", anchor: { x: 280, y: 200 }, roamRadius: 65 },
  { x: 1015, y: 200, size: 16, vx: -0.28, vy: 0.22, moodTime: 0, color: "#f0f0fa", skin: "#f7ddc2", role: "staff", anchor: { x: 1015, y: 200 }, roamRadius: 65 },
  { x: 640, y: 200, size: 16, vx: 0.25, vy: -0.25, moodTime: 0, color: "#f0f0fa", skin: "#8a5a38", role: "staff", anchor: { x: 640, y: 200 }, roamRadius: 60 },
  { x: 640, y: 490, size: 16, vx: 0.25, vy: 0.25, moodTime: 0, color: "#f0f0fa", skin: "#dba88a", role: "staff", anchor: { x: 640, y: 490 }, roamRadius: 60 },
  { x: 280, y: 480, size: 16, vx: -0.28, vy: 0.22, moodTime: 0, color: "#f0f0fa", skin: "#f7ddc2", role: "staff", anchor: { x: 280, y: 480 }, roamRadius: 58 },
  { x: 1015, y: 480, size: 16, vx: 0.28, vy: -0.22, moodTime: 0, color: "#f0f0fa", skin: "#c47a52", role: "staff", anchor: { x: 1015, y: 480 }, roamRadius: 58 },
  // Customers (20) — colourful clothing, roaming the full map
  { x: 385, y: 120, size: 16, vx: 0.38, vy: 0.28, moodTime: 0, color: "#f7cb6f", skin: "#f7ddc2", role: "customer" },
  { x: 750, y: 120, size: 16, vx: -0.32, vy: 0.3, moodTime: 0, color: "#95d8ff", skin: "#dba88a", role: "customer" },
  { x: 1080, y: 120, size: 16, vx: -0.28, vy: -0.38, moodTime: 0, color: "#dcb2ff", skin: "#c47a52", role: "customer" },
  { x: 385, y: 468, size: 16, vx: -0.28, vy: -0.38, moodTime: 0, color: "#dcb2ff", skin: "#c47a52", role: "customer" },
  { x: 750, y: 468, size: 16, vx: 0.35, vy: -0.3, moodTime: 0, color: "#ffb8c0", skin: "#f7ddc2", role: "customer" },
  { x: 1080, y: 468, size: 16, vx: 0.38, vy: 0.22, moodTime: 0, color: "#ffdb93", skin: "#dba88a", role: "customer" },
  { x: 148, y: 120, size: 16, vx: 0.3, vy: 0.4, moodTime: 0, color: "#bde3a6", skin: "#8a5a38", role: "customer" },
  { x: 148, y: 600, size: 16, vx: 0.38, vy: 0.22, moodTime: 0, color: "#ffdb93", skin: "#dba88a", role: "customer" },
  { x: 1172, y: 120, size: 16, vx: -0.35, vy: 0.3, moodTime: 0, color: "#96f0df", skin: "#f7ddc2", role: "customer" },
  { x: 1172, y: 600, size: 16, vx: -0.3, vy: 0.35, moodTime: 0, color: "#b8c7ff", skin: "#c47a52", role: "customer" },
  { x: 1140, y: 600, size: 16, vx: -0.38, vy: 0.25, moodTime: 0, color: "#ffd1df", skin: "#f7ddc2", role: "customer" },
  { x: 50, y: 600, size: 16, vx: 0.32, vy: 0.3, moodTime: 0, color: "#ffe3a1", skin: "#dba88a", role: "customer" },
  { x: 640, y: 440, size: 16, vx: -0.28, vy: 0.38, moodTime: 0, color: "#abd3f4", skin: "#8a5a38", role: "customer" },
  { x: 655, y: 220, size: 16, vx: 0.3, vy: 0.32, moodTime: 0, color: "#f0b8d2", skin: "#f7ddc2", role: "customer" },
  { x: 250, y: 360, size: 16, vx: 0.35, vy: 0.28, moodTime: 0, color: "#c5ef9b", skin: "#dba88a", role: "customer" },
  { x: 1060, y: 355, size: 16, vx: -0.3, vy: -0.28, moodTime: 0, color: "#f2d1a8", skin: "#c47a52", role: "customer" },
  { x: 390, y: 480, size: 16, vx: 0.38, vy: -0.32, moodTime: 0, color: "#a6e6ff", skin: "#f7ddc2", role: "customer" },
  { x: 900, y: 480, size: 16, vx: -0.3, vy: -0.35, moodTime: 0, color: "#d8c2ff", skin: "#8a5a38", role: "customer" },
  { x: 430, y: 200, size: 16, vx: 0.28, vy: -0.3, moodTime: 0, color: "#f7c88f", skin: "#dba88a", role: "customer" },
  { x: 870, y: 200, size: 16, vx: -0.32, vy: -0.28, moodTime: 0, color: "#bceea7", skin: "#f7ddc2", role: "customer" },
];

// ── Room system ───────────────────────────────────────────────────────────────
let currentRoom = "lobby"; // "casino" | "lobby" | "backstage"

// Door interactables: press E near these to change rooms
const casinoDoors = [
  { id: "doorTolobby",    name: "Hotel Lobby",   label: "Go to Lobby",    zone: { x: 1218, y: 280, width: 62, height: 130 }, targetRoom: "lobby",     targetX: 46, targetY: 345 },
  { id: "doorTobackstage", name: "Backstage",     label: "Go Backstage",  zone: { x: 0,    y: 90,  width: 22, height: 130 }, targetRoom: "backstage", targetX: 1240, targetY: 345 }
];
const lobbyDoors = [
  { id: "doorTocasino",    name: "Casino Floor",  label: "Go to Casino",  zone: { x: 2, y: 280, width: 34, height: 120 }, targetRoom: "casino",    targetX: 1190, targetY: 345 }
];
const backstageDoors = [
  { id: "doorTocasino",    name: "Casino Floor",  label: "Go to Casino",  zone: { x: 1256, y: 285, width: 24, height: 130 }, targetRoom: "casino",    targetX: 38, targetY: 95 }
];

// ── Floor room doors (back to lobby only) ──
const floor7Doors = [
  { id: "doorTolobby", name: "Hotel Lobby", label: "Back to Lobby", zone: { x: 600, y: 650, width: 80, height: 60 }, targetRoom: "lobby", targetX: 400, targetY: 400 }
];
const floor12Doors = [
  { id: "doorTolobby", name: "Hotel Lobby", label: "Back to Lobby", zone: { x: 600, y: 650, width: 80, height: 60 }, targetRoom: "lobby", targetX: 400, targetY: 400 }
];
const floor24Doors = [
  { id: "doorTolobby", name: "Hotel Lobby", label: "Back to Lobby", zone: { x: 600, y: 650, width: 80, height: 60 }, targetRoom: "lobby", targetX: 400, targetY: 400 }
];

// Transition zones: used by door interactables only (not automatic)
const ROOM_TRANSITIONS = {
  casino: [].concat(casinoDoors),
  lobby: [].concat(lobbyDoors),
  backstage: [].concat(backstageDoors),
  floor7: [].concat(floor7Doors),
  floor12: [].concat(floor12Doors),
  floor24: [].concat(floor24Doors)
};

// ── Lobby data ────────────────────────────────────────────────────────────────
const lobbyObstacles = [
  { x: 60,  y: 70,  width: 120, height: 140 }, // Lift shaft 1 (shrunk)
  { x: 200, y: 70,  width: 120, height: 140 }, // Lift shaft 2 (shrunk)
  { x: 380, y: 80,  width: 640, height: 80  }, // Check-in desk
  // Left sofa — slim armrest posts
  { x: 90,  y: 320, width: 16,  height: 40 }, // armrest top
  { x: 90,  y: 540, width: 16,  height: 40 }, // base bottom
  { x: 210, y: 320, width: 16,  height: 40 }, // armrest top
  { x: 210, y: 540, width: 16,  height: 40 }, // base bottom
  // Right sofa — slim armrest posts
  { x: 880, y: 320, width: 16,  height: 40 },
  { x: 880, y: 540, width: 16,  height: 40 },
  { x: 1000, y: 320, width: 16,  height: 40 },
  { x: 1000, y: 540, width: 16,  height: 40 },
  { x: 465, y: 390, width: 80,  height: 30 }, // Coffee table L
  { x: 725, y: 390, width: 80,  height: 30 }, // Coffee table R
  { x: 1060, y: 80,  width: 140, height: 150 }, // Concierge desk
];

const lobbyInteractables = [
  { id: "elevator", name: "Hotel Lifts",     label: "Take Lift",  hitbox: { x: 60,  y: 70, width: 260, height: 140 } },
  { id: "checkin",  name: "Check-in Desk",   label: "Check In",   hitbox: { x: 380, y: 80, width: 640, height: 80  } }
];

const lobbyNpcs = [
  // Receptionists anchored behind desk
  { x: 490, y: 162, size: 16, vx: 0.12, vy: 0.08, moodTime: 0, color: "#eeeef8", skin: "#f7ddc2", role: "staff", anchor: { x: 490, y: 162 }, roamRadius: 52 },
  { x: 640, y: 162, size: 16, vx: -0.12, vy: 0.08, moodTime: 0, color: "#eeeef8", skin: "#dba88a", role: "staff", anchor: { x: 640, y: 162 }, roamRadius: 52 },
  { x: 800, y: 162, size: 16, vx: 0.14, vy: 0.1,  moodTime: 0, color: "#eeeef8", skin: "#c47a52", role: "staff", anchor: { x: 800, y: 162 }, roamRadius: 52 },
  // Concierge near desk
  { x: 1090, y: 185, size: 16, vx: 0.18, vy: 0.14, moodTime: 0, color: "#d4a84a", skin: "#f7ddc2", role: "staff", anchor: { x: 1090, y: 185 }, roamRadius: 42 },
  // Guests walking around (adjusted for no fountain)
  { x: 400, y: 400, size: 16, vx: 0.3,  vy: 0.22, moodTime: 0, color: "#ff9dac", skin: "#f7ddc2", role: "customer" },
  { x: 660, y: 525, size: 16, vx: -0.28, vy: 0.2, moodTime: 0, color: "#95d8ff", skin: "#dba88a", role: "customer" },
  { x: 880, y: 445, size: 16, vx: 0.22, vy: -0.28, moodTime: 0, color: "#dcb2ff", skin: "#c47a52", role: "customer" },
  { x: 450, y: 595, size: 16, vx: 0.28, vy: -0.2, moodTime: 0, color: "#f7cb6f", skin: "#dba88a", role: "customer" },
  { x: 785, y: 315, size: 16, vx: 0.2,  vy: 0.28, moodTime: 0, color: "#bde3a6", skin: "#8a5a38", role: "customer" },
  { x: 1025, y: 580, size: 16, vx: -0.25, vy: -0.2, moodTime: 0, color: "#ffb8c0", skin: "#f7ddc2", role: "customer" }
];

// ── Floor room data ───────────────────────────────────────────────────────────
const floor7Obstacles = [
  { x: 180, y: 200, width: 1000, height: 430 }, // Pool
  { x: 30,  y: 50,  width: 140, height: 150 },  // Changing room 1
  { x: 30,  y: 230, width: 140, height: 150 },  // Changing room 2
  { x: 30,  y: 410, width: 140, height: 150 },  // Changing room 3
];
const floor12Obstacles = [
  { x: 80,  y: 180, width: 170, height: 100 }, // Table 1
  { x: 380, y: 180, width: 170, height: 100 }, // Table 2
  { x: 680, y: 180, width: 170, height: 100 }, // Table 3
  { x: 980, y: 180, width: 170, height: 100 }, // Table 4
  { x: 900, y: 400, width: 280, height: 100 }, // Kitchen wall
  { x: 400, y: 500, width: 480, height: 100 }, // Bar counter
];
const floor24Obstacles = [
  { x: 200, y: 180, width: 340, height: 260 }, // King bed
  { x: 950, y: 80,  width: 280, height: 350 }, // Bathroom
  { x: 80,  y: 540, width: 300, height: 100 }, // Couch
];

// ── Backstage data ────────────────────────────────────────────────────────────
const backstageObstacles = [
  { x: 50,  y: 80,  width: 290, height: 100 }, // Dressing tables left
  { x: 420, y: 80,  width: 290, height: 100 }, // Dressing tables right
  { x: 780, y: 80,  width: 320, height: 100 }, // Equipment rack
  { x: 50,  y: 335, width: 260, height: 160 }, // Break area sofa
  { x: 650, y: 335, width: 220, height: 130 }, // Mixing desk
  { x: 960, y: 255, width: 240, height: 170 }, // Storage boxes
  { x: 1090, y: 80, width: 150, height: 160 }, // Amp stack
];

const backstageNpcs = [
  // Stage techs near equipment
  { x: 885, y: 145, size: 16, vx: 0.18, vy: 0.12, moodTime: 0, color: "#333344", skin: "#f7ddc2", role: "staff", anchor: { x: 885, y: 145 }, roamRadius: 65 },
  { x: 980, y: 150, size: 16, vx: -0.2, vy: 0.14, moodTime: 0, color: "#2a2a3a", skin: "#dba88a", role: "staff", anchor: { x: 980, y: 150 }, roamRadius: 65 },
  // Performers at dressing tables
  { x: 145, y: 155, size: 16, vx: 0.14, vy: 0.1,  moodTime: 0, color: "#ff9dac", skin: "#c47a52", role: "customer", anchor: { x: 145, y: 155 }, roamRadius: 46 },
  { x: 440, y: 158, size: 16, vx: -0.14, vy: 0.1, moodTime: 0, color: "#a0d8ff", skin: "#8a5a38", role: "customer", anchor: { x: 440, y: 158 }, roamRadius: 46 },
  // Crew in break area
  { x: 185, y: 435, size: 16, vx: 0.22, vy: 0.18, moodTime: 0, color: "#889099", skin: "#f7ddc2", role: "staff", anchor: { x: 185, y: 435 }, roamRadius: 72 },
  { x: 270, y: 460, size: 16, vx: -0.18, vy: 0.22, moodTime: 0, color: "#667788", skin: "#dba88a", role: "staff", anchor: { x: 270, y: 460 }, roamRadius: 72 }
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

function applyCasinoTheme(theme) {
  if (!theme?.vars) {
    return;
  }
  for (const [name, value] of Object.entries(theme.vars)) {
    document.documentElement.style.setProperty(name, value);
  }
}

function generateDrinkOffer() {
  const name = BAR_DRINK_NAMES[Math.floor(Math.random() * BAR_DRINK_NAMES.length)];
  const theme = CASINO_THEMES[Math.floor(Math.random() * CASINO_THEMES.length)];
  currentDrinkOffer = {
    name,
    theme
  };
}

function renderDrinkOffer() {
  if (!barDrinkNameEl) {
    return;
  }
  if (!currentDrinkOffer) {
    generateDrinkOffer();
  }

  barDrinkNameEl.textContent = currentDrinkOffer.name;
  if (barThemeNameEl) {
    barThemeNameEl.textContent = currentDrinkOffer.theme.name;
  }
}

function extractThemeRgb(cssValue) {
  const match = cssValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    return "#888";
  }
  return `rgb(${match[1]},${match[2]},${match[3]})`;
}

function renderBarShelf() {
  if (!barShelfEl) {
    return;
  }
  barShelfEl.innerHTML = "";

  CASINO_THEMES.forEach((theme, index) => {
    const bottleColor = extractThemeRgb(theme.vars["--bg-radial-a"]);
    const glowColor = extractThemeRgb(theme.vars["--ambient-glow-a"]);
    const hudColor = extractThemeRgb(theme.vars["--hud-border"]);

    const bottle = document.createElement("div");
    bottle.className = "shelf-bottle";
    bottle.style.setProperty("--bottle-color", bottleColor);
    bottle.dataset.themeIndex = index;
    bottle.title = theme.name;

    bottle.innerHTML = `
      <div class="bottle-cap"></div>
      <div class="bottle-neck"></div>
      <div class="bottle-body"></div>
      <div class="bottle-tooltip">
        <div style="font-weight:700;margin-bottom:3px">${theme.name}</div>
        <div class="theme-color-dots">
          <div class="theme-dot" style="background:${bottleColor}"></div>
          <div class="theme-dot" style="background:${glowColor}"></div>
          <div class="theme-dot" style="background:${hudColor}"></div>
        </div>
      </div>`;

    bottle.addEventListener("click", () => {
      const drinkName = BAR_DRINK_NAMES[Math.floor(Math.random() * BAR_DRINK_NAMES.length)];
      currentDrinkOffer = { name: drinkName, theme };
      applyCasinoTheme(theme);
      if (barDrinkNameEl) {
        barDrinkNameEl.textContent = drinkName;
      }
      if (barThemeNameEl) {
        barThemeNameEl.textContent = theme.name;
      }
      if (barResultEl) {
        barResultEl.textContent = `You enjoyed a ${drinkName}. ${theme.name} now fills the casino!`;
        barResultEl.style.color = "#9af5a8";
      }
      barShelfEl.querySelectorAll(".shelf-bottle").forEach((b) => b.classList.remove("selected"));
      bottle.classList.add("selected");
    });

    barShelfEl.appendChild(bottle);
  });

  // Highlight current theme if set
  if (currentDrinkOffer) {
    const idx = CASINO_THEMES.indexOf(currentDrinkOffer.theme);
    if (idx >= 0) {
      const bottles = barShelfEl.querySelectorAll(".shelf-bottle");
      if (bottles[idx]) {
        bottles[idx].classList.add("selected");
      }
    }
  }
}

function refreshDrinkOffer() {
  generateDrinkOffer();
  renderDrinkOffer();
  if (barResultEl) {
    barResultEl.textContent = "Bartender mixed a fresh drink special.";
    barResultEl.style.color = "#f7d683";
  }
}

function buyDrink() {
  if (!currentDrinkOffer) {
    generateDrinkOffer();
  }

  applyCasinoTheme(currentDrinkOffer.theme);

  if (barDrinkNameEl) {
    barDrinkNameEl.textContent = currentDrinkOffer.name;
  }
  if (barThemeNameEl) {
    barThemeNameEl.textContent = currentDrinkOffer.theme.name;
  }
  if (barResultEl) {
    barResultEl.textContent = `You enjoyed a free ${currentDrinkOffer.name}. ${currentDrinkOffer.theme.name} now lights up the casino.`;
    barResultEl.style.color = "#9af5a8";
  }

  generateDrinkOffer();
  renderDrinkOffer();
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

function rectIntersectsCircle(rect, cx, cy, radius) {
  const nearestX = clamp(cx, rect.x, rect.x + rect.width);
  const nearestY = clamp(cy, rect.y, rect.y + rect.height);
  const dx = cx - nearestX;
  const dy = cy - nearestY;
  return dx * dx + dy * dy <= radius * radius;
}

function collidesWithWorldRect(rect, options = {}) {
  const ignoreNpcIndex = options.ignoreNpcIndex ?? -1;
  const includePlayer = options.includePlayer ?? false;
  const skipNpcs = options.skipNpcs ?? false;

  for (const table of tables) {
    if (intersectsRect(rect, table.hitbox)) {
      return true;
    }
  }

  if (intersectsRect(rect, centerBar.hitbox)) {
    return true;
  }

  if (intersectsRect(rect, performanceStage.hitbox)) {
    return true;
  }

  for (const deco of decorativeTables) {
    if (rectIntersectsCircle(rect, deco.x, deco.y, deco.radius + 2)) {
      return true;
    }
  }

  if (!skipNpcs) {
    for (let i = 0; i < npcs.length; i += 1) {
      if (i === ignoreNpcIndex) {
        continue;
      }
      const npc = npcs[i];
      const npcRect = { x: npc.x, y: npc.y, width: npc.size, height: npc.size };
      if (intersectsRect(rect, npcRect)) {
        return true;
      }
    }
  }

  if (includePlayer) {
    const playerRect = { x: player.x, y: player.y, width: player.size, height: player.size };
    if (intersectsRect(rect, playerRect)) {
      return true;
    }
  }

  return false;
}

function getCurrentRoomDoors() {
  if (currentRoom === "casino") return casinoDoors;
  if (currentRoom === "lobby") return lobbyDoors;
  if (currentRoom === "backstage") return backstageDoors;
  if (currentRoom === "floor7") return floor7Doors;
  if (currentRoom === "floor12") return floor12Doors;
  if (currentRoom === "floor24") return floor24Doors;
  return [];
}

function resolveNearbyTable() {
  const playerCenterX = player.x + player.size / 2;
  const playerCenterY = player.y + player.size / 2;
  const interactDistance = 28;

  nearbyTable = null;

  // Check doors first (doors are passable, so check them regardless of obstacles)
  const doors = getCurrentRoomDoors();
  for (const door of doors) {
    const dist = distanceToRect(playerCenterX, playerCenterY, door.zone);
    if (dist <= interactDistance) {
      nearbyTable = { id: door.id, name: door.name, label: door.label, isDoor: true, door };
      break;
    }
  }

  if (!nearbyTable) {
    if (currentRoom === "casino") {
      for (const table of tables) {
        const dist = distanceToRect(playerCenterX, playerCenterY, table.hitbox);
        if (dist <= interactDistance) {
          nearbyTable = table;
          break;
        }
      }
      if (!nearbyTable) {
        const barDist = distanceToRect(playerCenterX, playerCenterY, centerBar.hitbox);
        if (barDist <= interactDistance) {
          nearbyTable = centerBar;
        }
      }
    } else if (currentRoom === "lobby") {
      for (const lbItem of lobbyInteractables) {
        const dist = distanceToRect(playerCenterX, playerCenterY, lbItem.hitbox);
        if (dist <= interactDistance) {
          nearbyTable = lbItem;
          break;
        }
      }
    }
  }

  updateNearbyText();
}

function openPanel(tableId) {
  activePanel = tableId;
  modalBackdrop.classList.remove("hidden");
  roulettePanel.classList.add("hidden");
  slotsPanel.classList.add("hidden");
  blackjackPanel.classList.add("hidden");
  pokerPanel.classList.add("hidden");
  barPanel.classList.add("hidden");
  if (coinFlipPanel) {
    coinFlipPanel.classList.add("hidden");
  }
  if (baccaratPanel) {
    baccaratPanel.classList.add("hidden");
  }
  if (checkinPanel) {
    checkinPanel.classList.add("hidden");
  }
  if (elevatorPanel) {
    elevatorPanel.classList.add("hidden");
  }
  if (floor7Panel) {
    floor7Panel.classList.add("hidden");
  }
  if (floor12Panel) {
    floor12Panel.classList.add("hidden");
  }
  if (floor24Panel) {
    floor24Panel.classList.add("hidden");
  }

  if (tableId === "roulette") {
    roulettePanel.classList.remove("hidden");
  }
  if (tableId === "slots") {
    slotsPanel.classList.remove("hidden");
  }
  if (tableId === "blackjack") {
    blackjackPanel.classList.remove("hidden");
  }
  if (tableId === "poker") {
    pokerPanel.classList.remove("hidden");
  }
  if (tableId === "coinflip" && coinFlipPanel) {
    coinFlipPanel.classList.remove("hidden");
    const statusEl = document.getElementById("coinFlipStatus");
    if (statusEl) {
      statusEl.textContent = "Ready to flip";
    }
  }
  if (tableId === "baccarat" && baccaratPanel) {
    baccaratPanel.classList.remove("hidden");
    const handsEl = document.getElementById("baccaratHands");
    const resultEl = document.getElementById("baccaratResult");
    const bankerEl = document.getElementById("bankerBaccaratCards");
    const playerEl = document.getElementById("playerBaccaratCards");
    if (handsEl) {
      handsEl.textContent = "";
    }
    if (resultEl) {
      resultEl.textContent = "";
    }
    if (bankerEl) {
      bankerEl.innerHTML = "";
    }
    if (playerEl) {
      playerEl.innerHTML = "";
    }
  }
  if (tableId === "bar") {
    barPanel.classList.remove("hidden");
    renderBarShelf();
    renderDrinkOffer();
    if (barResultEl) {
      barResultEl.textContent = "The bartender smiles. Pick any drink on the shelf.";
      barResultEl.style.color = "#f7d683";
    }
  }
  // ── Lobby interactables ──
  if (tableId === "checkin" && checkinPanel) {
    checkinPanel.classList.remove("hidden");
  }
  if (tableId === "elevator" && elevatorPanel) {
    elevatorPanel.classList.remove("hidden");
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

// ── Coin Flip ──────────────────────────────────────────────────────────────

async function animateCoinFlip() {
  const coinEl = document.getElementById("coinEl");
  const coinFlipStatus = document.getElementById("coinFlipStatus");
  if (coinFlipStatus) {
    coinFlipStatus.textContent = "Flipping…";
  }
  if (coinEl) {
    coinEl.style.animation = "coinFlipSpin 0.85s ease-out both";
    await sleep(860);
    coinEl.style.animation = "";
  } else {
    await sleep(600);
  }
}

async function flipCoin() {
  if (isCoinFlipping) {
    return;
  }
  const betInput = document.getElementById("coinBet");
  const resultEl = document.getElementById("coinFlipResult");
  const flipStatus = document.getElementById("coinFlipStatus");

  const validation = validateBet(betInput ? betInput.value : "0");
  if (!validation.valid) {
    if (resultEl) {
      resultEl.textContent = validation.message;
      resultEl.style.color = "#ff8787";
    }
    return;
  }

  isCoinFlipping = true;
  const flipBtn = document.getElementById("flipCoinBtn");
  if (flipBtn) {
    flipBtn.disabled = true;
  }

  await animateCoinFlip();

  const result = Math.random() < 0.5 ? "heads" : "tails";
  const won = result === coinChoice;

  wisTokens -= validation.bet;
  if (won) {
    wisTokens += validation.bet * 2;
    if (resultEl) {
      resultEl.textContent = `It's ${result}! You won ${validation.bet} WIS Tokens.`;
      resultEl.style.color = "#9af5a8";
    }
  } else {
    if (resultEl) {
      resultEl.textContent = `It's ${result}! You lost ${validation.bet} WIS Tokens.`;
      resultEl.style.color = "#ff8787";
    }
  }

  if (flipStatus) {
    flipStatus.textContent = `Result: ${result.toUpperCase()}`;
  }
  updateBalanceText();

  if (flipBtn) {
    flipBtn.disabled = false;
  }
  isCoinFlipping = false;
}

// ── Baccarat ───────────────────────────────────────────────────────────────

function baccaratCardValue(card) {
  if (card.rank === "A") {
    return 1;
  }
  if (["10", "J", "Q", "K"].includes(card.rank)) {
    return 0;
  }
  return Number(card.rank);
}

function baccaratHandTotal(cards) {
  return cards.reduce((sum, c) => sum + baccaratCardValue(c), 0) % 10;
}

async function startBaccarat() {
  if (baccaratDealing) {
    return;
  }
  const betInput = document.getElementById("baccaratBet");
  const choiceEl = document.getElementById("baccaratChoice");
  const resultEl = document.getElementById("baccaratResult");
  const handsEl = document.getElementById("baccaratHands");
  const bankerCardsEl = document.getElementById("bankerBaccaratCards");
  const playerCardsEl = document.getElementById("playerBaccaratCards");
  const dealBtn = document.getElementById("dealBaccaratBtn");

  const validation = validateBet(betInput ? betInput.value : "0");
  if (!validation.valid) {
    if (resultEl) {
      resultEl.textContent = validation.message;
      resultEl.style.color = "#ff8787";
    }
    if (handsEl) {
      handsEl.textContent = "";
    }
    return;
  }

  baccaratDealing = true;
  if (dealBtn) {
    dealBtn.disabled = true;
  }
  if (bankerCardsEl) {
    bankerCardsEl.innerHTML = "";
  }
  if (playerCardsEl) {
    playerCardsEl.innerHTML = "";
  }
  if (handsEl) {
    handsEl.textContent = "";
  }
  if (resultEl) {
    resultEl.textContent = "";
  }

  const choice = choiceEl ? choiceEl.value : "player";
  const deck = createDeck();
  const playerCards = [drawCard(deck), drawCard(deck)];
  const bankerCards = [drawCard(deck), drawCard(deck)];

  wisTokens -= validation.bet;
  updateBalanceText();

  // Animate card deal
  if (playerCardsEl) {
    playerCards.forEach((card, i) => {
      playerCardsEl.appendChild(
        createPlayingCardElement(`${card.rank}${card.suit}`, { animate: true, delayMs: 60 + i * 70 })
      );
    });
  }
  if (bankerCardsEl) {
    bankerCards.forEach((card, i) => {
      bankerCardsEl.appendChild(
        createPlayingCardElement(`${card.rank}${card.suit}`, { animate: true, delayMs: i * 70 })
      );
    });
  }
  await sleep(350);

  const playerNatural = baccaratHandTotal(playerCards) >= 8;
  const bankerNatural = baccaratHandTotal(bankerCards) >= 8;

  if (!playerNatural && !bankerNatural) {
    // Player draws if total ≤ 5
    let playerThirdCardValue = null;
    if (baccaratHandTotal(playerCards) <= 5) {
      const newCard = drawCard(deck);
      playerCards.push(newCard);
      playerThirdCardValue = baccaratCardValue(newCard);
      if (playerCardsEl) {
        playerCardsEl.appendChild(
          createPlayingCardElement(`${newCard.rank}${newCard.suit}`, { animate: true, delayMs: 0 })
        );
      }
      await sleep(250);
    }

    // Banker draw rules depend on banker total and player's third card (if drawn)
    const bankerTotal = baccaratHandTotal(bankerCards);
    let bankerDraws = false;
    if (playerThirdCardValue === null) {
      // Player stood — banker draws on ≤ 5
      bankerDraws = bankerTotal <= 5;
    } else {
      // Standard third-card rules
      switch (bankerTotal) {
        case 0: case 1: case 2:
          bankerDraws = true;
          break;
        case 3:
          bankerDraws = playerThirdCardValue !== 8;
          break;
        case 4:
          bankerDraws = playerThirdCardValue >= 2 && playerThirdCardValue <= 7;
          break;
        case 5:
          bankerDraws = playerThirdCardValue >= 4 && playerThirdCardValue <= 7;
          break;
        case 6:
          bankerDraws = playerThirdCardValue === 6 || playerThirdCardValue === 7;
          break;
        default:
          bankerDraws = false;
      }
    }

    if (bankerDraws) {
      const newCard = drawCard(deck);
      bankerCards.push(newCard);
      if (bankerCardsEl) {
        bankerCardsEl.appendChild(
          createPlayingCardElement(`${newCard.rank}${newCard.suit}`, { animate: true, delayMs: 0 })
        );
      }
      await sleep(250);
    }
  }

  const finalPlayer = baccaratHandTotal(playerCards);
  const finalBanker = baccaratHandTotal(bankerCards);

  if (handsEl) {
    handsEl.textContent = `Player: ${finalPlayer}  |  Banker: ${finalBanker}`;
  }

  let outcome = "tie";
  if (finalPlayer > finalBanker) {
    outcome = "player";
  } else if (finalBanker > finalPlayer) {
    outcome = "banker";
  }

  if (outcome === "tie" && choice === "tie") {
    const payout = validation.bet * 9;
    wisTokens += payout;
    if (resultEl) {
      resultEl.textContent = `Tie at ${finalPlayer}! You win ${payout - validation.bet} WIS Tokens.`;
      resultEl.style.color = "#9af5a8";
    }
  } else if (outcome === "tie") {
    wisTokens += validation.bet;
    if (resultEl) {
      resultEl.textContent = `Tie at ${finalPlayer}. Bet returned.`;
      resultEl.style.color = "#f7d683";
    }
  } else if (outcome === choice) {
    let payout = 0;
    if (choice === "banker") {
      payout = Math.floor(validation.bet * 0.95);
      wisTokens += validation.bet + payout;
      if (resultEl) {
        resultEl.textContent = `Banker wins ${finalBanker} vs ${finalPlayer}! You win ${payout} WIS Tokens.`;
        resultEl.style.color = "#9af5a8";
      }
    } else {
      wisTokens += validation.bet * 2;
      if (resultEl) {
        resultEl.textContent = `Player wins ${finalPlayer} vs ${finalBanker}! You win ${validation.bet} WIS Tokens.`;
        resultEl.style.color = "#9af5a8";
      }
    }
  } else {
    const winnerLabel = outcome === "player" ? "Player" : "Banker";
    if (resultEl) {
      resultEl.textContent = `${winnerLabel} wins. You lost ${validation.bet} WIS Tokens.`;
      resultEl.style.color = "#ff8787";
    }
  }

  updateBalanceText();
  baccaratDealing = false;
  if (dealBtn) {
    dealBtn.disabled = false;
  }
}

function rouletteColorFromNumber(number) {
  if (number === 0) {
    return "green";
  }
  // European wheel: red numbers are 1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return redNumbers.includes(number) ? "red" : "black";
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

function randomSlotSymbol(weighted = false) {
  if (!weighted) {
    return SLOT_SYMBOLS[Math.floor(Math.random() * SLOT_SYMBOLS.length)];
  }

  const roll = Math.random();
  if (roll < 0.44) {
    return "🍒";
  }
  if (roll < 0.74) {
    return "🍋";
  }
  if (roll < 0.93) {
    return "⭐";
  }
  return "🔔";
}

function forcePatternOnGrid(grid, weightedSymbols = false) {
  const line = SLOT_PAYLINES[Math.floor(Math.random() * SLOT_PAYLINES.length)];
  const symbol = randomSlotSymbol(weightedSymbols);
  for (const [row, col] of line) {
    grid[row][col] = symbol;
  }
}

function generateSlotGrid() {
  return Array.from({ length: SLOT_ROWS }, () =>
    Array.from({ length: SLOT_COLS }, () => randomSlotSymbol(false))
  );
}

function evaluateSlotGridPayout(grid, bet) {
  let payout = 0;
  let winningLines = 0;

  for (const line of SLOT_PAYLINES) {
    const symbols = line.map(([row, col]) => grid[row][col]);
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      payout += bet * SLOT_LINE_MULTIPLIERS[symbols[0]];
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

function createDeck() {
  const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const suits = ["♠", "♥", "♦", "♣"];
  const deck = [];
  for (const rank of ranks) {
    for (const suit of suits) {
      let value = Number(rank);
      if (rank === "A") {
        value = 11;
      } else if (["J", "Q", "K"].includes(rank)) {
        value = 10;
      }
      deck.push({ rank, suit, value });
    }
  }
  return deck;
}

function drawCard(deck) {
  const index = Math.floor(Math.random() * deck.length);
  const [card] = deck.splice(index, 1);
  return card;
}

function handTotal(cards) {
  let total = cards.reduce((sum, card) => sum + card.value, 0);
  let aces = cards.filter((card) => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function formatCards(cards) {
  return cards.map((card) => `${card.rank}${card.suit}`).join(" ");
}

function createPlayingCardElement(content, options = {}) {
  const cardEl = document.createElement("div");
  cardEl.className = "playing-card";
  if (options.facedown) {
    cardEl.classList.add("facedown");
    cardEl.textContent = "";
  } else {
    cardEl.textContent = content;
  }
  if (options.animate) {
    cardEl.classList.add("deal-in");
    if (options.delayMs) {
      cardEl.style.animationDelay = `${options.delayMs}ms`;
    }
  }
  return cardEl;
}

function renderBlackjackVisual(hideDealerHole = true, animate = false) {
  if (!dealerBlackjackCards || !playerBlackjackCards) {
    return;
  }

  dealerBlackjackCards.innerHTML = "";
  playerBlackjackCards.innerHTML = "";

  if (!blackjackRound) {
    return;
  }

  blackjackRound.dealerCards.forEach((card, index) => {
    const facedown = hideDealerHole && index === 1;
    dealerBlackjackCards.appendChild(
      createPlayingCardElement(`${card.rank}${card.suit}`, {
        facedown,
        animate,
        delayMs: index * 60
      })
    );
  });

  blackjackRound.playerCards.forEach((card, index) => {
    playerBlackjackCards.appendChild(
      createPlayingCardElement(`${card.rank}${card.suit}`, {
        animate,
        delayMs: 120 + index * 60
      })
    );
  });
}

function setBlackjackButtonsInRound(inRound) {
  dealBlackjackBtn.disabled = inRound;
  hitBlackjackBtn.disabled = !inRound;
  standBlackjackBtn.disabled = !inRound;
}

function renderBlackjackHands(hideDealerHole = true) {
  if (!blackjackRound) {
    blackjackHands.textContent = "";
    if (dealerBlackjackCards) {
      dealerBlackjackCards.innerHTML = "";
    }
    if (playerBlackjackCards) {
      playerBlackjackCards.innerHTML = "";
    }
    return;
  }

  renderBlackjackVisual(hideDealerHole, false);

  const playerTotal = handTotal(blackjackRound.playerCards);
  if (hideDealerHole) {
    const visibleDealer = `${blackjackRound.dealerCards[0].rank}${blackjackRound.dealerCards[0].suit} ??`;
    blackjackHands.textContent = `Your hand: ${formatCards(blackjackRound.playerCards)} (${playerTotal}) | Dealer: ${visibleDealer}`;
    return;
  }

  const dealerTotal = handTotal(blackjackRound.dealerCards);
  blackjackHands.textContent = `Your hand: ${formatCards(blackjackRound.playerCards)} (${playerTotal}) | Dealer: ${formatCards(blackjackRound.dealerCards)} (${dealerTotal})`;
}

function finishBlackjackRound(totalMultiplier, message, tone) {
  if (!blackjackRound) {
    return;
  }

  wisTokens += Math.round(blackjackRound.bet * totalMultiplier);
  renderBlackjackHands(false);
  blackjackResult.textContent = message;
  blackjackResult.style.color = tone;
  blackjackRound = null;
  setBlackjackButtonsInRound(false);
  updateBalanceText();
}

async function startBlackjackRound() {
  if (blackjackRound) {
    return;
  }

  const validation = validateBet(blackjackBetInput.value);
  if (!validation.valid) {
    blackjackResult.textContent = validation.message;
    blackjackResult.style.color = "#ff8787";
    blackjackHands.textContent = "";
    return;
  }

  const deck = createDeck();
  blackjackRound = {
    bet: validation.bet,
    deck,
    playerCards: [drawCard(deck), drawCard(deck)],
    dealerCards: [drawCard(deck), drawCard(deck)]
  };

  wisTokens -= validation.bet;
  setBlackjackButtonsInRound(true);
  renderBlackjackVisual(true, true);
  renderBlackjackHands(true);

  const playerTotal = handTotal(blackjackRound.playerCards);
  const dealerTotal = handTotal(blackjackRound.dealerCards);
  const playerNatural = blackjackRound.playerCards.length === 2 && playerTotal === 21;
  const dealerNatural = blackjackRound.dealerCards.length === 2 && dealerTotal === 21;

  if (playerNatural || dealerNatural) {
    if (playerNatural && dealerNatural) {
      finishBlackjackRound(1, "Both have blackjack. Push.", "#f7d683");
      return;
    }
    if (playerNatural) {
      finishBlackjackRound(2.5, "Blackjack! You win 1.5x your bet.", "#9af5a8");
      return;
    }
    finishBlackjackRound(0, "Dealer has blackjack. You lost the hand.", "#ff8787");
    return;
  }

  blackjackResult.textContent = "Your move: Hit or Stand.";
  blackjackResult.style.color = "#f7d683";
  updateBalanceText();
}

function hitBlackjack() {
  if (!blackjackRound) {
    return;
  }

  blackjackRound.playerCards.push(drawCard(blackjackRound.deck));
  renderBlackjackVisual(true, true);
  const playerTotal = handTotal(blackjackRound.playerCards);
  renderBlackjackHands(true);

  if (playerTotal > 21) {
    finishBlackjackRound(0, `Bust at ${playerTotal}. You lost ${blackjackRound.bet} WIS Tokens.`, "#ff8787");
    return;
  }

  if (playerTotal === 21) {
    standBlackjack();
    return;
  }

  blackjackResult.textContent = `You drew to ${playerTotal}. Hit or Stand.`;
  blackjackResult.style.color = "#f7d683";
}

async function standBlackjack() {
  if (!blackjackRound) {
    return;
  }

  while (handTotal(blackjackRound.dealerCards) < 17) {
    blackjackRound.dealerCards.push(drawCard(blackjackRound.deck));
    renderBlackjackVisual(false, true);
    renderBlackjackHands(false);
    await sleep(280);
  }

  const playerTotal = handTotal(blackjackRound.playerCards);
  const dealerTotal = handTotal(blackjackRound.dealerCards);

  if (dealerTotal > 21 || playerTotal > dealerTotal) {
    const netProfit = blackjackRound.bet;
    finishBlackjackRound(2, `You win ${netProfit} WIS Tokens (${playerTotal} vs ${dealerTotal}).`, "#9af5a8");
    return;
  }

  if (playerTotal === dealerTotal) {
    finishBlackjackRound(1, `Push at ${playerTotal}. Your bet was returned.`, "#f7d683");
    return;
  }

  finishBlackjackRound(0, `Dealer wins ${dealerTotal} to ${playerTotal}. You lost ${blackjackRound.bet} WIS Tokens.`, "#ff8787");
}

function setPokerButtonsInRound(inRound) {
  dealPokerBtn.disabled = inRound;
  if (!inRound) {
    callPokerBtn.disabled = true;
    checkPokerBtn.disabled = true;
    raisePokerBtn.disabled = true;
    foldPokerBtn.disabled = true;
    return;
  }

  const requiredCall = Math.max(0, pokerRound.currentStreetBet - pokerRound.playerStreetContribution);
  const raiseTo = pokerRound.currentStreetBet + pokerRound.ante;
  const canCall = requiredCall > 0 && wisTokens >= requiredCall;
  const canCheck = requiredCall === 0;
  const canRaise = wisTokens >= (raiseTo - pokerRound.playerStreetContribution);

  callPokerBtn.disabled = !canCall;
  checkPokerBtn.disabled = !canCheck;
  raisePokerBtn.disabled = !canRaise;
  foldPokerBtn.disabled = false;
}

function getRandomNpcNames(count) {
  const shuffled = [...POKER_NPC_NAMES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function formatCommunityCards(cards, revealCount) {
  return cards
    .map((card, index) => (index < revealCount ? `${card.rank}${card.suit}` : "??"))
    .join(" ");
}

function renderPokerVisual(showdown = false, animate = false) {
  if (!pokerBoardCards || !pokerPlayerCards || !pokerNpcRows) {
    return;
  }

  pokerBoardCards.innerHTML = "";
  pokerPlayerCards.innerHTML = "";
  pokerNpcRows.innerHTML = "";

  if (!pokerRound) {
    return;
  }

  pokerRound.communityCards.forEach((card, index) => {
    const isRevealed = index < (pokerRound.revealCount || 0);
    pokerBoardCards.appendChild(
      createPlayingCardElement(`${card.rank}${card.suit}`, {
        facedown: !isRevealed,
        animate,
        delayMs: 40 * index
      })
    );
  });

  pokerRound.playerCards.forEach((card, index) => {
    pokerPlayerCards.appendChild(
      createPlayingCardElement(`${card.rank}${card.suit}`, {
        animate,
        delayMs: 30 * index
      })
    );
  });

  pokerRound.opponents.forEach((opponent, rowIndex) => {
    const row = document.createElement("div");
    row.className = "npc-row";

    const name = document.createElement("div");
    name.className = "npc-name";
    name.textContent = opponent.name;
    row.appendChild(name);

    opponent.cards.forEach((card, cardIndex) => {
      row.appendChild(
        createPlayingCardElement(`${card.rank}${card.suit}`, {
          facedown: !showdown,
          animate,
          delayMs: rowIndex * 35 + cardIndex * 25
        })
      );
    });

    pokerNpcRows.appendChild(row);
  });
}

function renderPokerHands(showdown = false) {
  if (!pokerRound) {
    pokerHands.textContent = "";
    renderPokerVisual(false, false);
    return;
  }

  renderPokerVisual(showdown, false);

  const board = formatCommunityCards(pokerRound.communityCards, pokerRound.revealCount || 0);

  if (!showdown) {
    const opponents = pokerRound.opponents
      .map((opponent) => `${opponent.name}${opponent.folded ? " (folded)" : ""}: ?? ??`)
      .join(" | ");
    pokerHands.textContent = `Your hole cards: ${formatCards(pokerRound.playerCards)} | Board: ${board} | Opponents: ${opponents}`;
    return;
  }

  const opponents = pokerRound.opponents
    .map((opponent) => {
      if (opponent.folded) {
        return `${opponent.name}: Folded`;
      }
      return `${opponent.name}: ${formatCards(opponent.cards)} (${opponent.hand.label})`;
    })
    .join(" | ");
  pokerHands.textContent = `Your hole cards: ${formatCards(pokerRound.playerCards)} (${pokerRound.playerHand.label}) | Board: ${board} | ${opponents}`;
}

function finishPokerRound(totalMultiplierOnAnte, message, tone) {
  if (!pokerRound) {
    return;
  }

  wisTokens += Math.round(pokerRound.ante * totalMultiplierOnAnte);
  pokerRound = null;
  setPokerButtonsInRound(false);
  pokerResult.textContent = message;
  pokerResult.style.color = tone;
  updateBalanceText();
}

async function startPokerRound() {
  if (pokerRound) {
    return;
  }

  const validation = validateBet(pokerBetInput.value);
  if (!validation.valid) {
    pokerResult.textContent = validation.message;
    pokerResult.style.color = "#ff8787";
    pokerHands.textContent = "";
    return;
  }

  const deck = createDeck();
  const playerCards = [drawCard(deck), drawCard(deck)];
  const npcNames = getRandomNpcNames(3);
  const opponents = npcNames.map((name) => ({
    name,
    cards: [drawCard(deck), drawCard(deck)],
    folded: false,
    chips: 1000,
    totalContrib: 0
  }));
  const communityCards = [drawCard(deck), drawCard(deck), drawCard(deck), drawCard(deck), drawCard(deck)];

  wisTokens -= validation.bet;
  pokerRound = {
    ante: validation.bet,
    pot: validation.bet,
    playerCards,
    opponents,
    communityCards,
    revealCount: 0,
    streetIndex: 0,
    currentStreetBet: 0,
    playerStreetContribution: 0,
    playerTotalContrib: validation.bet,
    actionLocked: false,
    playerHand: null
  };

  beginPokerStreet(true);
  renderPokerVisual(false, true);
  renderPokerHands(false);
  updatePokerPrompt();
  updateBalanceText();
}

function getRankValue(rank) {
  if (rank === "A") {
    return 14;
  }
  if (rank === "K") {
    return 13;
  }
  if (rank === "Q") {
    return 12;
  }
  if (rank === "J") {
    return 11;
  }
  return Number(rank);
}

function evaluateFiveCardHand(cards) {
  const values = cards.map((card) => getRankValue(card.rank)).sort((a, b) => b - a);
  const suits = cards.map((card) => card.suit);
  const isFlush = suits.every((suit) => suit === suits[0]);

  const uniqueDesc = [...new Set(values)];
  let straightHigh = 0;
  if (uniqueDesc.length === 5) {
    const max = uniqueDesc[0];
    const min = uniqueDesc[4];
    if (max - min === 4) {
      straightHigh = max;
    } else if (JSON.stringify(uniqueDesc) === JSON.stringify([14, 5, 4, 3, 2])) {
      straightHigh = 5;
    }
  }
  const isStraight = straightHigh > 0;

  const countsMap = {};
  for (const value of values) {
    countsMap[value] = (countsMap[value] || 0) + 1;
  }
  const groups = Object.entries(countsMap)
    .map(([value, count]) => ({ value: Number(value), count }))
    .sort((a, b) => (b.count !== a.count ? b.count - a.count : b.value - a.value));

  if (isStraight && isFlush) {
    return { rank: 8, label: "Straight Flush", tieBreak: [straightHigh] };
  }
  if (groups[0].count === 4) {
    return { rank: 7, label: "Four of a Kind", tieBreak: [groups[0].value, groups[1].value] };
  }
  if (groups[0].count === 3 && groups[1].count === 2) {
    return { rank: 6, label: "Full House", tieBreak: [groups[0].value, groups[1].value] };
  }
  if (isFlush) {
    return { rank: 5, label: "Flush", tieBreak: values };
  }
  if (isStraight) {
    return { rank: 4, label: "Straight", tieBreak: [straightHigh] };
  }
  if (groups[0].count === 3) {
    const kickers = groups.filter((group) => group.count === 1).map((group) => group.value).sort((a, b) => b - a);
    return { rank: 3, label: "Three of a Kind", tieBreak: [groups[0].value, ...kickers] };
  }
  if (groups[0].count === 2 && groups[1].count === 2) {
    const highPair = Math.max(groups[0].value, groups[1].value);
    const lowPair = Math.min(groups[0].value, groups[1].value);
    const kicker = groups.find((group) => group.count === 1).value;
    return { rank: 2, label: "Two Pair", tieBreak: [highPair, lowPair, kicker] };
  }
  if (groups[0].count === 2) {
    const kickers = groups.filter((group) => group.count === 1).map((group) => group.value).sort((a, b) => b - a);
    return { rank: 1, label: "Pair", tieBreak: [groups[0].value, ...kickers] };
  }
  return { rank: 0, label: "High Card", tieBreak: values };
}

function evaluateBestPokerHand(sevenCards) {
  let best = null;

  for (let i = 0; i < sevenCards.length - 4; i += 1) {
    for (let j = i + 1; j < sevenCards.length - 3; j += 1) {
      for (let k = j + 1; k < sevenCards.length - 2; k += 1) {
        for (let l = k + 1; l < sevenCards.length - 1; l += 1) {
          for (let m = l + 1; m < sevenCards.length; m += 1) {
            const candidate = evaluateFiveCardHand([
              sevenCards[i],
              sevenCards[j],
              sevenCards[k],
              sevenCards[l],
              sevenCards[m]
            ]);
            if (!best || comparePokerHands(candidate, best) > 0) {
              best = candidate;
            }
          }
        }
      }
    }
  }

  return best;
}

function comparePokerHands(playerHand, dealerHand) {
  if (playerHand.rank !== dealerHand.rank) {
    return playerHand.rank > dealerHand.rank ? 1 : -1;
  }

  const maxTieLength = Math.max(playerHand.tieBreak.length, dealerHand.tieBreak.length);
  for (let i = 0; i < maxTieLength; i += 1) {
    const playerTie = playerHand.tieBreak[i];
    const dealerTie = dealerHand.tieBreak[i];
    if (playerTie === undefined || dealerTie === undefined) {
      continue;
    }
    if (playerTie !== dealerTie) {
      return playerTie > dealerTie ? 1 : -1;
    }
  }
  return 0;
}

function findPokerWinners(players) {
  let bestHand = players[0].hand;
  let winners = [players[0]];

  for (let i = 1; i < players.length; i += 1) {
    const contender = players[i];
    const comparison = comparePokerHands(contender.hand, bestHand);
    if (comparison > 0) {
      bestHand = contender.hand;
      winners = [contender];
    } else if (comparison === 0) {
      winners.push(contender);
    }
  }

  return winners;
}

function getActiveOpponents() {
  return pokerRound.opponents.filter((opponent) => !opponent.folded);
}

function getNpcHandStrength(opponent) {
  // If no community cards revealed yet, evaluate hole cards only
  const revealedCount = pokerRound.revealCount || 0;
  if (revealedCount === 0) {
    // Preflop: evaluate hole cards
    const [c1, c2] = opponent.cards;
    const r1 = getRankValue(c1.rank), r2 = getRankValue(c2.rank);
    const high = Math.max(r1, r2), low = Math.min(r1, r2);
    const paired = r1 === r2;
    const suited = c1.suit === c2.suit;
    const gap = high - low - 1;
    // Score 0-10 where 10 is strongest
    if (paired && high >= 11) return high >= 13 ? 9 : 7;  // AA/KK = 9, QQ/JJ = 7
    if (paired) return 5;  // low pair
    if (high === 14 && low >= 11) return suited ? 8 : 7;  // AK/AQ
    if (high === 14) return suited ? 5 : 4;
    if (high >= 12 && low >= 10) return suited ? 6 : 5;
    if (high >= 12 && gap <= 2 && suited) return 4;
    if (high >= 10 && low >= 8) return 3;
    return 2;
  }
  // Later streets: evaluate actual best hand
  const allCards = [...opponent.cards, ...pokerRound.communityCards.slice(0, revealedCount)];
  if (allCards.length < 5) return 3;
  const best = evaluateBestPokerHand(allCards);
  const rank = best ? best.rank : 0;
  // Map 0-8 to 0-10
  return Math.min(10, rank + 2);
}

function beginPokerStreet(isFirstStreet = false) {
  if (!pokerRound) {
    return;
  }

  pokerRound.playerStreetContribution = 0;
  const activeOpponents = getActiveOpponents();

  if (activeOpponents.length === 0) {
    const payoutFromPot = pokerRound.pot;
    wisTokens += payoutFromPot;
    pokerResult.textContent = `All NPCs folded. You win ${payoutFromPot} WIS Tokens.`;
    pokerResult.style.color = "#9af5a8";
    pokerRound = null;
    setPokerButtonsInRound(false);
    renderPokerHands(false);
    renderPokerVisual(false, false);
    updateBalanceText();
    return;
  }

  // NPCs decide street bet based on hand strength
  let streetBet = 0;
  const betChance = isFirstStreet ? 0.55 : pokerRound.streetIndex === 3 ? 0.42 : 0.50;

  for (const opponent of activeOpponents) {
    const strength = getNpcHandStrength(opponent);
    // Stronger hands bet more and more often; weaker hands fold sometimes
    const foldChance = isFirstStreet ? 0.05 : Math.max(0, (1 - strength / 10) * 0.4);
    if (Math.random() < foldChance) {
      opponent.folded = true;
      // Their contributions stay in the pot
      continue;
    }
    const shouldBet = Math.random() < (betChance + strength * 0.03);
    if (shouldBet && opponent.chips >= pokerRound.ante) {
      const multiplier = Math.random() < strength / 12 ? 2 : 1;
      const betAmount = Math.min(pokerRound.ante * multiplier, opponent.chips);
      opponent.chips -= betAmount;
      opponent.totalContrib += betAmount;
      pokerRound.pot += betAmount;
      if (betAmount > streetBet) {
        streetBet = betAmount;
      }
    }
  }

  // Re-check after possible folds
  if (getActiveOpponents().length === 0) {
    const payoutFromPot = pokerRound.pot;
    wisTokens += payoutFromPot;
    pokerResult.textContent = `All NPCs folded. You win ${payoutFromPot} WIS Tokens.`;
    pokerResult.style.color = "#9af5a8";
    pokerRound = null;
    setPokerButtonsInRound(false);
    renderPokerHands(false);
    renderPokerVisual(false, false);
    updateBalanceText();
    return;
  }

  pokerRound.currentStreetBet = streetBet;

  setPokerButtonsInRound(true);
}

function updatePokerPrompt() {
  if (!pokerRound) {
    return;
  }

  const streetLabel = POKER_STREET_LABELS[pokerRound.streetIndex] || "Showdown";
  const toCall = Math.max(0, pokerRound.currentStreetBet - pokerRound.playerStreetContribution);
  if (toCall > 0) {
    pokerResult.textContent = `${streetLabel} betting: Call ${toCall}, Raise ${pokerRound.ante}, or Fold.`;
    pokerResult.style.color = "#f7d683";
  } else {
    pokerResult.textContent = `${streetLabel} betting: Check, Raise ${pokerRound.ante}, or Fold.`;
    pokerResult.style.color = "#b8e7ff";
  }
}

async function revealNextStreet() {
  if (!pokerRound) {
    return;
  }

  if (pokerRound.streetIndex === 0) {
    pokerRound.streetIndex = 1;
    pokerRound.revealCount = 3;
    pokerResult.textContent = "Flop...";
    pokerResult.style.color = "#f7d683";
    renderPokerVisual(false, true);
    renderPokerHands(false);
    await sleep(380);
  } else if (pokerRound.streetIndex === 1) {
    pokerRound.streetIndex = 2;
    pokerRound.revealCount = 4;
    pokerResult.textContent = "Turn...";
    pokerResult.style.color = "#f7d683";
    renderPokerVisual(false, true);
    renderPokerHands(false);
    await sleep(320);
  } else if (pokerRound.streetIndex === 2) {
    pokerRound.streetIndex = 3;
    pokerRound.revealCount = 5;
    pokerResult.textContent = "River...";
    pokerResult.style.color = "#f7d683";
    renderPokerVisual(false, true);
    renderPokerHands(false);
    await sleep(340);
  } else {
    pokerRound.streetIndex = 4;
  }
}

async function advancePokerRoundOrShowdown() {
  if (!pokerRound) {
    return;
  }

  if (pokerRound.streetIndex < 3) {
    await revealNextStreet();
    if (!pokerRound) {
      return;
    }
    beginPokerStreet(false);
    if (pokerRound) {
      updatePokerPrompt();
      renderPokerHands(false);
    }
    return;
  }

  const activeOpponents = getActiveOpponents();
  pokerRound.playerHand = evaluateBestPokerHand([...pokerRound.playerCards, ...pokerRound.communityCards]);
  for (const opponent of activeOpponents) {
    opponent.hand = evaluateBestPokerHand([...opponent.cards, ...pokerRound.communityCards]);
  }

  const contenders = [
    { name: "You", hand: pokerRound.playerHand, isPlayer: true },
    ...activeOpponents.map((opponent) => ({ name: opponent.name, hand: opponent.hand, isPlayer: false }))
  ];
  const winners = findPokerWinners(contenders);
  const playerIsWinner = winners.some((winner) => winner.isPlayer);
  const splitCount = winners.length;

  renderPokerVisual(true, true);
  renderPokerHands(true);

  if (playerIsWinner) {
    const share = Math.round(pokerRound.pot / splitCount);
    wisTokens += share;
    if (splitCount === 1) {
      pokerResult.textContent = `You win the pot of ${pokerRound.pot} WIS Tokens with ${pokerRound.playerHand.label}.`;
      pokerResult.style.color = "#9af5a8";
    } else {
      const winnerNames = winners.map((winner) => winner.name).join(", ");
      pokerResult.textContent = `Split pot: ${winnerNames}. You receive ${share} WIS Tokens.`;
      pokerResult.style.color = "#f7d683";
    }
  } else {
    const winnerNames = winners.map((winner) => winner.name).join(", ");
    pokerResult.textContent = `${winnerNames} win the pot. Your ${pokerRound.playerHand.label} was beaten.`;
    pokerResult.style.color = "#ff8787";
  }

  pokerRound = null;
  setPokerButtonsInRound(false);
  updateBalanceText();
}

function foldPoker() {
  if (!pokerRound) {
    return;
  }

  const lostContrib = pokerRound.playerTotalContrib || pokerRound.ante;
  // Find the best remaining opponent — they effectively win the pot
  const activeOpponents = pokerRound.opponents.filter((o) => !o.folded);
  let winnerName = "the house";
  let winnerContrib = 0;
  for (const opp of activeOpponents) {
    if (opp.totalContrib > winnerContrib) {
      winnerContrib = opp.totalContrib;
      winnerName = opp.name;
    }
  }
  // Evaluate hands to find the strongest
  if (activeOpponents.length > 0 && pokerRound.revealCount > 0) {
    let bestRank = -1;
    for (const opp of activeOpponents) {
      const allCards = [...opp.cards, ...pokerRound.communityCards.slice(0, pokerRound.revealCount)];
      if (allCards.length >= 5) {
        const hand = evaluateBestPokerHand(allCards);
        if (hand && hand.rank > bestRank) {
          bestRank = hand.rank;
          winnerName = `${opp.name} (${hand.label})`;
        }
      }
    }
  }
  pokerRound = null;
  setPokerButtonsInRound(false);
  pokerResult.textContent = `You folded and lost ${lostContrib} WIS Tokens. ${winnerName} takes the pot.`;
  pokerResult.style.color = "#ff8787";
  pokerHands.textContent = "";
  renderPokerVisual(false, false);
}

async function callPoker() {
  if (!pokerRound) {
    return;
  }

  if (pokerRound.actionLocked) {
    return;
  }
  pokerRound.actionLocked = true;

  const toCall = Math.max(0, pokerRound.currentStreetBet - pokerRound.playerStreetContribution);
  if (toCall <= 0) {
    pokerRound.actionLocked = false;
    await checkPoker();
    return;
  }

  const callValidation = validateBet(toCall);
  if (!callValidation.valid) {
    pokerResult.textContent = `Need ${toCall} WIS Tokens to call.`;
    pokerResult.style.color = "#ff8787";
    pokerRound.actionLocked = false;
    return;
  }

  wisTokens -= toCall;
  pokerRound.playerStreetContribution += toCall;
  pokerRound.playerTotalContrib += toCall;
  pokerRound.pot += toCall;
  updateBalanceText();
  await advancePokerRoundOrShowdown();
  if (pokerRound) {
    pokerRound.actionLocked = false;
    setPokerButtonsInRound(true);
  }
}

async function checkPoker() {
  if (!pokerRound) {
    return;
  }

  if (pokerRound.actionLocked) {
    return;
  }

  const toCall = Math.max(0, pokerRound.currentStreetBet - pokerRound.playerStreetContribution);
  if (toCall > 0) {
    pokerResult.textContent = `Cannot check. Need to call ${toCall} WIS Tokens or fold.`;
    pokerResult.style.color = "#ff8787";
    return;
  }

  pokerRound.actionLocked = true;
  await advancePokerRoundOrShowdown();
  if (pokerRound) {
    pokerRound.actionLocked = false;
    setPokerButtonsInRound(true);
  }
}

async function raisePoker() {
  if (!pokerRound) {
    return;
  }

  if (pokerRound.actionLocked) {
    return;
  }
  pokerRound.actionLocked = true;

  const newStreetBet = pokerRound.currentStreetBet + pokerRound.ante;
  const additionalFromPlayer = newStreetBet - pokerRound.playerStreetContribution;
  const raiseValidation = validateBet(additionalFromPlayer);
  if (!raiseValidation.valid) {
    pokerResult.textContent = `Need ${additionalFromPlayer} WIS Tokens to raise.`;
    pokerResult.style.color = "#ff8787";
    pokerRound.actionLocked = false;
    return;
  }

  wisTokens -= additionalFromPlayer;
  pokerRound.playerStreetContribution = newStreetBet;
  pokerRound.playerTotalContrib += additionalFromPlayer;
  pokerRound.currentStreetBet = newStreetBet;
  pokerRound.pot += additionalFromPlayer;

  const activeOpponents = getActiveOpponents();
  for (const opponent of activeOpponents) {
    const strength = getNpcHandStrength(opponent);
    const foldChance = newStreetBet >= pokerRound.ante * 2 ? 0.38 : 0.22;
    if (Math.random() < (foldChance - strength * 0.015)) {
      opponent.folded = true;
      continue;
    }
    // Match the raise: pay the difference between their current street contribution and newStreetBet
    const toMatch = newStreetBet - (opponent.totalContrib % (pokerRound.ante || 1));
    const matchAmount = Math.min(Math.max(0, toMatch), opponent.chips);
    if (matchAmount > 0) {
      opponent.chips -= matchAmount;
      opponent.totalContrib += matchAmount;
      pokerRound.pot += matchAmount;
    }
  }

  updateBalanceText();
  renderPokerHands(false);

  if (getActiveOpponents().length === 0) {
    const payout = pokerRound.pot;
    wisTokens += payout;
    pokerResult.textContent = `Your raise forced everyone out. You win ${payout} WIS Tokens.`;
    pokerResult.style.color = "#9af5a8";
    pokerRound = null;
    setPokerButtonsInRound(false);
    renderPokerVisual(false, false);
    updateBalanceText();
    return;
  }

  await advancePokerRoundOrShowdown();
  if (pokerRound) {
    pokerRound.actionLocked = false;
    setPokerButtonsInRound(true);
  }
}

async function playPoker() {
  await startPokerRound();
}

async function playBlackjack() {
  await startBlackjackRound();
}

function roundedRectPath(x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function fillRoundedRect(x, y, width, height, radius, fillStyle) {
  roundedRectPath(x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundedRect(x, y, width, height, radius, strokeStyle, lineWidth = 1) {
  roundedRectPath(x, y, width, height, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function fillCircle(x, y, radius, fillStyle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeCircle(x, y, radius, strokeStyle, lineWidth = 1) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawChip(x, y, radius, baseColor, ringColor) {
  fillCircle(x, y, radius + 3, "rgba(0, 0, 0, 0.28)");
  fillCircle(x, y, radius, baseColor);
  strokeCircle(x, y, radius - 2, ringColor, 2);
  strokeCircle(x, y, radius - 6, ringColor, 1.5);
}

function drawHumanoid(x, y, size, bodyColor, skinColor, legColor, isStaff) {
  const cx = x + size / 2;
  const s = size / 16;

  const headR = 5.5 * s;
  const headCY = y + headR + s;

  const torsoW = 10 * s;
  const torsoH = 12 * s;
  const torsoY = headCY + headR + 2 * s;

  const armW = 3.5 * s;
  const armH = 10 * s;
  const armY = torsoY + s;

  const legW = 4 * s;
  const legH = 11 * s;
  const legY = torsoY + torsoH - 1.5 * s;
  const legGap = 1.5 * s;

  // Shadow
  fillCircle(cx, legY + legH + 3, size * 0.62, "rgba(0,0,0,0.2)");

  // Legs
  fillRoundedRect(cx - legW - legGap, legY, legW, legH, legW * 0.45, legColor);
  fillRoundedRect(cx + legGap, legY, legW, legH, legW * 0.45, legColor);

  // Arms (skin-coloured, outside the torso)
  fillRoundedRect(cx - torsoW / 2 - armW + s * 0.8, armY, armW, armH, armW * 0.5, skinColor);
  fillRoundedRect(cx + torsoW / 2 - s * 0.8, armY, armW, armH, armW * 0.5, skinColor);

  // Torso
  fillRoundedRect(cx - torsoW / 2, torsoY, torsoW, torsoH, 3 * s, bodyColor);

  // Staff badge
  if (isStaff) {
    fillRoundedRect(cx + torsoW * 0.05, torsoY + 2.5 * s, 3.5 * s, 2.5 * s, 0.8 * s, "rgba(255,220,110,0.85)");
  }

  // Head
  fillCircle(cx, headCY, headR, skinColor);

  // Eyes
  fillCircle(cx - headR * 0.36, headCY + headR * 0.1, headR * 0.22, "#1a1220");
  fillCircle(cx + headR * 0.36, headCY + headR * 0.1, headR * 0.22, "#1a1220");
}

function drawBackground() {
  const floorGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  floorGradient.addColorStop(0, "#251929");
  floorGradient.addColorStop(0.28, "#1b2233");
  floorGradient.addColorStop(0.72, "#111926");
  floorGradient.addColorStop(1, "#0b1018");
  ctx.fillStyle = floorGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const wallGlow = ctx.createLinearGradient(0, 0, WIDTH, 0);
  wallGlow.addColorStop(0, "rgba(235, 182, 83, 0.16)");
  wallGlow.addColorStop(0.5, "rgba(255, 246, 214, 0.06)");
  wallGlow.addColorStop(1, "rgba(103, 150, 255, 0.12)");
  ctx.fillStyle = wallGlow;
  ctx.fillRect(0, 0, WIDTH, 44);
  ctx.fillRect(0, HEIGHT - 40, WIDTH, 40);

  const runnerGradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  runnerGradient.addColorStop(0, "#5a1424");
  runnerGradient.addColorStop(0.5, "#391322");
  runnerGradient.addColorStop(1, "#1e1020");
  fillRoundedRect(76, 46, WIDTH - 152, HEIGHT - 92, 68, runnerGradient);
  strokeRoundedRect(82, 52, WIDTH - 164, HEIGHT - 104, 62, "rgba(255, 215, 132, 0.18)", 2);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 224, 161, 0.07)";
  ctx.lineWidth = 2;
  for (let i = -2; i < 17; i += 1) {
    const x = 90 + i * 62;
    ctx.beginPath();
    ctx.moveTo(x, 54);
    ctx.lineTo(x + 70, HEIGHT - 54);
    ctx.stroke();
  }
  for (let i = 0; i < 7; i += 1) {
    const y = 110 + i * 68;
    ctx.beginPath();
    ctx.moveTo(96, y);
    ctx.lineTo(WIDTH - 96, y);
    ctx.stroke();
  }
  ctx.restore();

  for (const source of backgroundLightSources) {
    ctx.fillStyle = source.gradient;
    ctx.beginPath();
    ctx.arc(source.x, source.y, source.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawDecorativeTables() {
  for (const deco of decorativeTables) {
    fillCircle(deco.x, deco.y + deco.radius + 6, deco.radius * 0.92, "rgba(0, 0, 0, 0.24)");
    fillCircle(deco.x, deco.y, deco.radius + 6, "#4c2d22");
    fillCircle(deco.x, deco.y, deco.radius, deco.color);
    strokeCircle(deco.x, deco.y, deco.radius + 2, "rgba(255, 227, 162, 0.35)", 2);

    fillRoundedRect(deco.x - 4, deco.y - deco.radius - 18, 8, 26, 4, "rgba(255, 245, 210, 0.18)");
    drawChip(deco.x - deco.radius * 0.34, deco.y + 2, 6, "#b23f54", "#f9d98f");
    drawChip(deco.x + deco.radius * 0.22, deco.y - 4, 6, "#226f89", "#d3f0ff");
  }
}

function drawCenterBar() {
  const cx = centerBar.x + centerBar.width / 2;
  const cy = centerBar.y + centerBar.height / 2;

  fillRoundedRect(centerBar.x, centerBar.y, centerBar.width, centerBar.height, 28, "#26161f");
  strokeRoundedRect(centerBar.x, centerBar.y, centerBar.width, centerBar.height, 28, "rgba(255, 221, 153, 0.55)", 2);
  fillRoundedRect(centerBar.x + 10, centerBar.y + 14, centerBar.width - 20, centerBar.height - 28, 22, "#543122");

  // Counter shelf
  fillRoundedRect(centerBar.x + 18, centerBar.y + 20, centerBar.width - 36, 18, 9, "#9d6a3e");
  fillRoundedRect(centerBar.x + 18, centerBar.y + 20, centerBar.width - 36, 5, 5, "rgba(255, 242, 195, 0.38)");

  // Back wall / bottle shelf
  fillRoundedRect(centerBar.x + 24, centerBar.y + 46, centerBar.width - 48, centerBar.height - 66, 14, "#2d1920");

  // Back shelf plank
  fillRoundedRect(centerBar.x + 28, centerBar.y + 70, centerBar.width - 56, 7, 3, "#7b4a22");
  fillRoundedRect(centerBar.x + 28, centerBar.y + 70, centerBar.width - 56, 2, 3, "rgba(255, 235, 190, 0.25)");

  // Bottles on shelf
  const bottleColors = ["#7ac4ff", "#f6ce76", "#b89dff", "#8fe5c8", "#ff9dac", "#ffd080", "#90d8a0", "#ff9070"];
  const bottleCount = 8;
  const shelfLeft = centerBar.x + 34;
  const shelfWidth = centerBar.width - 68;
  for (let i = 0; i < bottleCount; i += 1) {
    const bx = shelfLeft + i * (shelfWidth / (bottleCount - 1)) - 6;
    const by = centerBar.y + 48;
    fillRoundedRect(bx, by, 12, 20, 4, bottleColors[i % bottleColors.length]);
    fillRoundedRect(bx + 3, by + 2, 3, 7, 1.5, "rgba(255,255,255,0.28)");
    fillRoundedRect(bx + 2, by - 4, 8, 6, 2, "#f5ead0");
  }

  // Bar stools (10: 5 top, 5 bottom)
  const stoolOffsets = [
    [-110, -87], [-55, -87], [0, -87], [55, -87], [110, -87],
    [-110, 87], [-55, 87], [0, 87], [55, 87], [110, 87]
  ];

  for (const [ox, oy] of stoolOffsets) {
    fillCircle(cx + ox, cy + oy + 12, 11, "rgba(0, 0, 0, 0.24)");
    fillCircle(cx + ox, cy + oy, 12, "#51365a");
    strokeCircle(cx + ox, cy + oy, 12, "rgba(208, 196, 255, 0.5)", 1.5);
    fillRoundedRect(cx + ox - 2, cy + oy + 10, 4, 14, 2, "#cab3ff");
  }

  ctx.fillStyle = "#f6e4be";
  ctx.font = "bold 15px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("BAR", cx, centerBar.y + centerBar.height - 12);
}

function drawPerformanceStage() {
  const sx = performanceStage.x;
  const sy = performanceStage.y;
  const sw = performanceStage.width;
  const sh = performanceStage.height;
  const cx = sx + sw / 2;

  // ── Backstage door above stage ──
  const bdX = 0, bdY = 90, bdW = 22, bdH = 130;
  fillRoundedRect(bdX, bdY + 2, bdW, bdH - 2, 4, "#1a1020");
  strokeRoundedRect(bdX, bdY + 2, bdW, bdH - 2, 4, "rgba(255,215,100,0.5)", 2);
  ctx.save();
  ctx.shadowColor = "#aa66ff";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#cc88ff";
  ctx.font = "bold 7px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("STAGE", bdX + bdW / 2, bdY - 4);
  ctx.fillText("DOOR", bdX + bdW / 2, bdY + 8);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Shadow
  fillRoundedRect(sx + 4, sy + 6, sw, sh, 8, "rgba(0,0,0,0.38)");
  // Wooden floor boards
  fillRoundedRect(sx, sy, sw, sh, 8, "#3a2010");
  ctx.fillStyle = "rgba(255,200,140,0.06)";
  for (let i = 0; i < 6; i += 2) {
    ctx.fillRect(sx + 2, sy + i * (sh / 6), sw - 4, sh / 6);
  }
  // Gold edge trim
  strokeRoundedRect(sx, sy, sw, sh, 8, "rgba(255,215,100,0.72)", 2);
  fillRoundedRect(sx, sy, sw, 6, 4, "rgba(255,215,100,0.5)");

  // LED dots along bottom edge
  const ledColors = ["#ff4466", "#ff9900", "#ffff44", "#44ff88", "#44aaff", "#aa44ff", "#ff44cc", "#ff8833"];
  for (let i = 0; i < 8; i += 1) {
    const lx = sx + 6 + i * ((sw - 12) / 7);
    fillCircle(lx, sy + sh - 6, 3, ledColors[i]);
  }

  // Microphone stand
  ctx.save();
  ctx.strokeStyle = "#b0b0b0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, sy + sh * 0.76);
  ctx.lineTo(cx, sy + sh * 0.44);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 9, sy + sh * 0.76);
  ctx.lineTo(cx + 9, sy + sh * 0.76);
  ctx.stroke();
  ctx.restore();
  fillCircle(cx, sy + sh * 0.40, 6, "#777");
  strokeCircle(cx, sy + sh * 0.40, 6, "#ccc", 1);

  // Spotlight beam
  ctx.save();
  ctx.globalAlpha = 0.07;
  const beamGrad = ctx.createLinearGradient(cx, sy - 50, cx, sy + 30);
  beamGrad.addColorStop(0, "#ffffff");
  beamGrad.addColorStop(1, "rgba(255,255,200,0)");
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 28, sy - 50);
  ctx.lineTo(cx - 10, sy);
  ctx.lineTo(cx + 10, sy);
  ctx.lineTo(cx + 28, sy - 50);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = "rgba(255,220,120,0.9)";
  ctx.font = "bold 9px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("STAGE", cx, sy + sh - 14);
}

function drawEntrance() {
  const ex = entrance.x;
  const ey = entrance.y;
  const ew = entrance.width;
  const eh = entrance.height;
  const cx = ex + ew / 2;
  const cy = ey + eh / 2;

  // Door frame
  fillRoundedRect(ex, ey, ew, eh, 6, "#1a1020");
  strokeRoundedRect(ex, ey, ew, eh, 6, "rgba(255,215,100,0.65)", 3);

  // Two door panels
  const panelW = ew / 2 - 5;
  fillRoundedRect(ex + 4, ey + 8, panelW, eh - 16, 4, "#2a1828");
  fillRoundedRect(ex + ew / 2 + 1, ey + 8, panelW, eh - 16, 4, "#2a1828");
  strokeRoundedRect(ex + 4, ey + 8, panelW, eh - 16, 4, "rgba(255,200,100,0.3)", 1);
  strokeRoundedRect(ex + ew / 2 + 1, ey + 8, panelW, eh - 16, 4, "rgba(255,200,100,0.3)", 1);

  // Door handles
  fillCircle(ex + ew / 2 - 4, cy, 4, "#d4a840");
  fillCircle(ex + ew / 2 + 4, cy, 4, "#d4a840");

  // Neon EXIT sign above door
  ctx.save();
  ctx.shadowColor = "#ff3333";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "#ff5555";
  ctx.font = "bold 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("EXIT", cx, ey - 6);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Arrow pointing right (→)
  ctx.save();
  ctx.strokeStyle = "rgba(255,140,140,0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 26);
  ctx.lineTo(cx + 10, cy + 26);
  ctx.lineTo(cx + 5, cy + 20);
  ctx.moveTo(cx + 10, cy + 26);
  ctx.lineTo(cx + 5, cy + 32);
  ctx.stroke();
  ctx.restore();
}

// ── Lobby rendering ──────────────────────────────────────────────────────────
function drawLobbyBackground() {
  // Warm hotel palette
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, "#1a1210");
  bgGrad.addColorStop(0.3, "#241c18");
  bgGrad.addColorStop(0.7, "#1e1814");
  bgGrad.addColorStop(1, "#0f0d0b");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Tile floor checker
  ctx.save();
  ctx.globalAlpha = 0.06;
  const tileSize = 42;
  for (let row = 0; row < Math.ceil(HEIGHT / tileSize); row++) {
    for (let col = 0; col < Math.ceil(WIDTH / tileSize); col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillStyle = "#fff8ee";
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }
  }
  ctx.restore();

  // Rug under seating area
  fillRoundedRect(280, 340, 720, 250, 18, "rgba(120, 30, 20, 0.22)");
  strokeRoundedRect(280, 340, 720, 250, 18, "rgba(180, 140, 100, 0.2)", 2);
}

function drawLobby() {
  drawLobbyBackground();

  // ── Left wall casino door ──
  const doorX = 2, doorY = 280, doorW = 34, doorH = 120;
  fillRoundedRect(doorX, doorY, doorW, doorH, 4, "#1a1020");
  strokeRoundedRect(doorX, doorY, doorW, doorH, 4, "rgba(255,215,100,0.5)", 2);
  ctx.save();
  ctx.shadowColor = "#ff3333";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ff5555";
  ctx.font = "bold 9px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("CASINO", doorX + doorW / 2, doorY - 4);
  ctx.shadowBlur = 0;
  ctx.restore();

  // ── Lift shafts ──
  for (let li = 0; li < 2; li++) {
    const lx = li === 0 ? 60 : 200;
    const ly = 70, lw = 120, lh = 140;
    fillRoundedRect(lx, ly, lw, lh, 10, "#1a1a2e");
    strokeRoundedRect(lx, ly, lw, lh, 10, "rgba(180,190,220,0.55)", 2);
    // Lift doors
    fillRoundedRect(lx + 6, ly + 10, 48, lh - 20, 5, "#2a2a4a");
    fillRoundedRect(lx + 66, ly + 10, 48, lh - 20, 5, "#2a2a4a");
    fillCircle(lx + lw / 2, ly - 4, 6, "#4a4");
    ctx.save();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 8px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("▲▼", lx + lw / 2, ly + 14);
    ctx.restore();
  }

  // ── Check-in desk ──
  const dkX = 380, dkY = 80, dkW = 640, dkH = 80;
  fillRoundedRect(dkX, dkY, dkW, dkH, 14, "#4a3020");
  strokeRoundedRect(dkX, dkY, dkW, dkH, 14, "rgba(220,180,120,0.6)", 2);
  fillRoundedRect(dkX + 10, dkY + 8, dkW - 20, 14, 7, "rgba(255,220,150,0.25)");
  ctx.fillStyle = "#d4b88c";
  ctx.font = "italic 14px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("GRAND NEON HOTEL · CHECK-IN", dkX + dkW / 2, dkY + 42);
  fillCircle(dkX + 60, dkY + 10, 8, "rgba(255,230,140,0.6)");
  fillCircle(dkX + dkW - 60, dkY + 10, 8, "rgba(255,230,140,0.6)");

  // ── Left sofa group (slim) ──
  const sf1X = 90, sf1Y = 320, sf1W = 120, sf1H = 240;
  fillRoundedRect(sf1X, sf1Y, sf1W, sf1H, 14, "#3a2028");
  strokeRoundedRect(sf1X, sf1Y, sf1W, sf1H, 14, "rgba(200,150,140,0.3)", 1);
  // Cushions
  fillRoundedRect(sf1X + 15, sf1Y + 15, 90, 60, 10, "#7a3a3a");
  fillRoundedRect(sf1X + 15, sf1Y + 85, 90, 60, 10, "#7a3a3a");
  fillRoundedRect(sf1X + 15, sf1Y + 155, 90, 60, 10, "#7a3a3a");

  // ── Right sofa group (slim) ──
  const sf2X = 880, sf2Y = 320, sf2W = 120, sf2H = 240;
  fillRoundedRect(sf2X, sf2Y, sf2W, sf2H, 14, "#2a2038");
  strokeRoundedRect(sf2X, sf2Y, sf2W, sf2H, 14, "rgba(160,150,200,0.3)", 1);
  fillRoundedRect(sf2X + 15, sf2Y + 15, 90, 60, 10, "#5a5a8a");
  fillRoundedRect(sf2X + 15, sf2Y + 85, 90, 60, 10, "#5a5a8a");
  fillRoundedRect(sf2X + 15, sf2Y + 155, 90, 60, 10, "#5a5a8a");

  // ── Coffee tables ──
  for (const ct of [{ x: 465, y: 382, w: 90, h: 68 }, { x: 725, y: 382, w: 90, h: 68 }]) {
    fillRoundedRect(ct.x, ct.y, ct.w, ct.h, 8, "#3a2818");
    strokeRoundedRect(ct.x, ct.y, ct.w, ct.h, 8, "rgba(200,160,100,0.4)", 1);
    fillCircle(ct.x + ct.w / 2, ct.y + ct.h / 2, 5, "#fff");
  }

  // ── Concierge desk ──
  const cdX = 1050, cdY = 80, cdW = 150, cdH = 150;
  fillRoundedRect(cdX, cdY, cdW, cdH, 12, "#2a2018");
  strokeRoundedRect(cdX, cdY, cdW, cdH, 12, "rgba(200,160,99,0.5)", 2);
  ctx.fillStyle = "#c0a070";
  ctx.font = "bold 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("CONCIERGE", cdX + cdW / 2, cdY + cdH / 2 + 4);

  // ── Draw lobby NPCs ──
  for (const npc of lobbyNpcs) {
    const isStaff = npc.role === "staff";
    const bodyColor = isStaff ? "#eeeef8" : npc.color;
    const legColor = isStaff ? "#1e2a42" : "#18182a";
    drawHumanoid(npc.x, npc.y, npc.size, bodyColor, npc.skin || "#f7ddc2", legColor, isStaff);
  }
}

// ── Backstage rendering ──────────────────────────────────────────────────────
function drawBackstageBackground() {
  // Gritty dark backstage
  const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bgGrad.addColorStop(0, "#121014");
  bgGrad.addColorStop(0.5, "#0f0d12");
  bgGrad.addColorStop(1, "#0a080c");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Concrete floor lines
  ctx.save();
  ctx.strokeStyle = "rgba(180,170,160,0.04)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 24; i++) {
    const y = 60 + i * 30;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawBackstage() {
  drawBackstageBackground();

  // ── Right wall stage door back to casino ──
  const sDoorX = 1256, sDoorY = 285, sDoorW = 24, sDoorH = 150;
  fillRoundedRect(sDoorX, sDoorY, sDoorW, sDoorH, 4, "#1a1020");
  strokeRoundedRect(sDoorX, sDoorY, sDoorW, sDoorH, 4, "rgba(255,215,100,0.5)", 2);
  ctx.save();
  ctx.shadowColor = "#ff3333";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#ff5555";
  ctx.font = "bold 8px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("CASINO", sDoorX + sDoorW / 2, sDoorY - 4);
  ctx.shadowBlur = 0;
  ctx.restore();

  // ── Dressing tables (2) ──
  for (const dt of [{ x: 50, y: 80, w: 290, h: 100 }, { x: 420, y: 80, w: 290, h: 100 }]) {
    fillRoundedRect(dt.x, dt.y, dt.w, dt.h, 10, "#1a181a");
    strokeRoundedRect(dt.x, dt.y, dt.w, dt.h, 10, "rgba(180,180,200,0.3)", 1);
    // Mirror
    fillRoundedRect(dt.x + dt.w / 2 - 40, dt.y + 6, 80, 55, 8, "rgba(200,220,255,0.12)");
    strokeRoundedRect(dt.x + dt.w / 2 - 40, dt.y + 6, 80, 55, 8, "rgba(180,200,240,0.3)", 1);
    // Mirror light bulbs
    for (let b = 0; b < 5; b++) {
      fillCircle(dt.x + dt.w / 2 - 30 + b * 15, dt.y + 12, 4, "#ffdd88");
    }
    // Table surface
    fillRoundedRect(dt.x + 10, dt.y + 70, dt.w - 20, 16, 5, "#332222");
  }

  // ── Equipment rack ──
  const erX = 780, erY = 80, erW = 320, erH = 100;
  fillRoundedRect(erX, erY, erW, erH, 10, "#14141a");
  strokeRoundedRect(erX, erY, erW, erH, 10, "rgba(100,120,140,0.3)", 1);
  for (let r = 0; r < 3; r++) {
    fillRoundedRect(erX + 10, erY + 10 + r * 28, erW - 20, 22, 5, "#1a1a22");
    // Knobs
    for (let k = 0; k < 12; k++) {
      fillCircle(erX + 30 + k * 24, erY + 21 + r * 28, 3, "#556");
    }
  }

  // ── Break area sofa ──
  const baX = 50, baY = 335, baW = 260, baH = 160;
  fillRoundedRect(baX, baY, baW, baH, 14, "#1a1510");
  strokeRoundedRect(baX, baY, baW, baH, 14, "rgba(150,130,110,0.25)", 1);
  fillRoundedRect(baX + 15, baY + 40, 22, baH - 80, 8, "#333");
  fillRoundedRect(baX + baW - 37, baY + 40, 22, baH - 80, 8, "#333");
  fillRoundedRect(baX + 40, baY + baH - 32, baW - 80, 20, 8, "#333");
  fillRoundedRect(baX + 25, baY + 12, 60, 35, 10, "#4a4a3a");
  fillRoundedRect(baX + baW - 85, baY + 12, 60, 35, 10, "#4a4a3a");
  fillRoundedRect(baX + baW - 85, baY + baH - 45, 60, 35, 10, "#4a4a3a");

  // ── Mixing desk ──
  const mdX = 650, mdY = 335, mdW = 220, mdH = 130;
  fillRoundedRect(mdX, mdY, mdW, mdH, 10, "#10101a");
  strokeRoundedRect(mdX, mdY, mdW, mdH, 10, "rgba(100,120,140,0.3)", 1);
  // Faders
  for (let f = 0; f < 8; f++) {
    const fy = mdY + 15 + Math.random() * 40;
    fillRoundedRect(mdX + 18 + f * 26, fy, 5, 40, 2, "#448");
    fillCircle(mdX + 20 + f * 26, fy + 2, 4, "#99a");
  }

  // ── Storage boxes ──
  const sbX = 960, sbY = 255, sbW = 240, sbH = 170;
  for (let b = 0; b < 3; b++) {
    fillRoundedRect(sbX + 8 + b * 78, sbY + 20, 70, sbH - 30, 8, "#1a1a1a");
    strokeRoundedRect(sbX + 8 + b * 78, sbY + 20, 70, sbH - 30, 8, "rgba(150,150,150,0.2)", 1);
    ctx.fillStyle = "#ffd700";
    ctx.font = "bold 9px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(`CASE ${b + 1}`, sbX + 43 + b * 78, sbY + sbH / 2);
  }

  // ── Amp stack ──
  const asX = 1090, asY = 80, asW = 150, asH = 160;
  for (let a = 0; a < 3; a++) {
    fillRoundedRect(asX + 10, asY + 8 + a * 50, asW - 20, 44, 6, "#0a0a0f");
    strokeRoundedRect(asX + 10, asY + 8 + a * 50, asW - 20, 44, 6, "rgba(200,200,200,0.2)", 1);
    fillCircle(asX + asW / 2, asY + 30 + a * 50, 8, a === 0 ? "#0f0" : "#444");
  }

  // ── Draw backstage NPCs ──
  for (const npc of backstageNpcs) {
    const isStaff = npc.role === "staff";
    const bodyColor = isStaff ? "#333344" : npc.color;
    const legColor = isStaff ? "#1e1e2e" : "#18182a";
    drawHumanoid(npc.x, npc.y, npc.size, bodyColor, npc.skin || "#f7ddc2", legColor, isStaff);
  }
}

// ── Floor 7: Spa & Pool ──────────────────────────────────────────────────────
function drawFloor7() {
  // Cyan-blue tile background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, "#0a1a24"); bg.addColorStop(0.5, "#0d2430"); bg.addColorStop(1, "#061016");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // Tile floor
  ctx.save(); ctx.globalAlpha = 0.06;
  for (let r = 0; r < 22; r++) for (let c = 0; c < 38; c++) {
    if ((r+c)%2===0) { ctx.fillStyle = "#80c8e0"; ctx.fillRect(c*34, r*34, 34, 34); }
  } ctx.restore();

  // Pool — large water-filled basin
  fillRoundedRect(180, 220, 960, 420, 36, "#0a1a2a");
  strokeRoundedRect(180, 220, 960, 420, 36, "rgba(70,200,240,0.55)", 5);
  // Pool deck tiles around edge
  fillRoundedRect(180, 220, 960, 24, 18, "#1a2a3a");
  strokeRoundedRect(180, 220, 960, 24, 18, "rgba(100,200,240,0.3)", 2);
  // Water gradient
  const waterGrad = ctx.createLinearGradient(660, 244, 660, 640);
  waterGrad.addColorStop(0, "#0a3448"); waterGrad.addColorStop(0.5, "#0c4058"); waterGrad.addColorStop(1, "#06202c");
  fillRoundedRect(196, 244, 928, 380, 28, waterGrad);
  // Water surface ripples
  ctx.save(); ctx.globalAlpha = 0.06;
  for (let s = 0; s < 18; s++) {
    fillRoundedRect(230 + s * 55, 260 + (s%4) * 60, 36, 12, 6, "#a0eeff");
  } ctx.restore();
  // Lane lines painted on pool floor
  ctx.save(); ctx.strokeStyle = "rgba(160,220,255,0.1)"; ctx.lineWidth = 2; ctx.setLineDash([20, 30]);
  for (let l = 0; l < 5; l++) {
    ctx.beginPath(); ctx.moveTo(220, 300 + l * 70); ctx.lineTo(1120, 300 + l * 70); ctx.stroke();
  } ctx.setLineDash([]); ctx.restore();
  // Pool ladder
  for (let ld = 0; ld < 2; ld++) {
    const lx = ld ? 1120 : 210;
    ctx.strokeStyle = "#8899aa"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(lx, 250); ctx.lineTo(lx, 370); ctx.stroke();
    for (let r = 0; r < 5; r++) {
      ctx.beginPath(); ctx.moveTo(lx, 255 + r * 25); ctx.lineTo(lx + (ld ? -14 : 14), 255 + r * 25); ctx.stroke();
    }
  }
  // Pool depth markers — small tile at left edge
  ctx.fillStyle = "#99aabb"; ctx.font = "9px Segoe UI";
  ctx.textAlign = "right";
  ctx.fillText("1.2m", 225, 350);
  ctx.fillText("2.5m", 1140, 500);

  // 3 Changing rooms along left wall
  for (let cr = 0; cr < 3; cr++) {
    const cy = 40 + cr * 190;
    // Room frame
    fillRoundedRect(22, cy, 146, 168, 12, "#1a2030");
    strokeRoundedRect(22, cy, 146, 168, 12, "rgba(140,170,210,0.5)", 2);
    // Louver door
    fillRoundedRect(38, cy + 100, 34, 56, 6, "#2a3a50");
    strokeRoundedRect(38, cy + 100, 34, 56, 6, "rgba(180,200,240,0.3)", 1);
    // Door handle
    fillCircle(62, cy + 128, 4, "#d0c8b0");
    // Door slats
    for (let sl = 0; sl < 4; sl++) {
      fillRoundedRect(41, cy + 106 + sl * 13, 28, 4, 2, "#3a4a60");
    }
    // Room number plate
    fillRoundedRect(55, cy + 12, 30, 18, 4, "#d4c8a0");
    ctx.fillStyle = "#1a2030"; ctx.font = "bold 11px Segoe UI"; ctx.textAlign = "center";
    ctx.fillText(String(cr+1), 70, cy + 26);
    // Bench inside
    fillRoundedRect(85, cy + 60, 70, 22, 6, "#3a2a20");
    // Towel hook
    ctx.fillStyle = "#fff";
    fillRoundedRect(90, cy + 20, 3, 10, 2, "#fff");
  }

  // Exit door
  fillRoundedRect(590, 640, 100, 70, 10, "#1a2830");
  strokeRoundedRect(590, 640, 100, 70, 10, "rgba(220,200,120,0.65)", 3);
  fillCircle(605, 675, 3, "#d4c090");
  ctx.fillStyle = "#e0c080"; ctx.font = "bold 12px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("LOBBY", 640, 683);
}

// ── Floor 12: Restaurant ──────────────────────────────────────────────────────
function drawFloor12() {
  // Warm amber background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, "#1a1008"); bg.addColorStop(0.5, "#281808"); bg.addColorStop(1, "#0e0804");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // Checkered tile floor
  ctx.save(); ctx.globalAlpha = 0.06;
  for (let r = 0; r < 20; r++) for (let c = 0; c < 36; c++) {
    if ((r+c)%2===0) { ctx.fillStyle = "#ffe8c0"; ctx.fillRect(c*36, r*38, 36, 38); }
  } ctx.restore();

  // 4 Dining tables with chairs
  const tableXs = [80, 380, 680, 980];
  for (const tx of tableXs) {
    // Shadow under table
    fillRoundedRect(tx + 4, 194, 170, 100, 16, "rgba(0,0,0,0.3)");
    // Tablecloth — cream with edge detail
    fillRoundedRect(tx, 190, 170, 100, 14, "#ebe0d0");
    strokeRoundedRect(tx, 190, 170, 100, 14, "rgba(180,140,80,0.5)", 2);
    // Table legs
    fillRoundedRect(tx + 12, 274, 8, 16, 3, "#5a3a1a");
    fillRoundedRect(tx + 150, 274, 8, 16, 3, "#5a3a1a");
    // Place setting — plate
    fillCircle(tx + 85, 250, 10, "#eee");
    strokeCircle(tx + 85, 250, 10, "#ccc", 1);
    fillCircle(tx + 85, 250, 5, "#f8f4f0");
    // Fork (left)
    ctx.fillStyle = "#c0c0c0"; ctx.fillRect(tx + 68, 248, 2, 12);
    ctx.fillRect(tx + 65, 248, 8, 2);
    // Knife (right)
    ctx.fillRect(tx + 98, 248, 2, 12);
    ctx.fillRect(tx + 96, 258, 8, 2);
    // Wine glass
    ctx.strokeStyle = "rgba(200,200,220,0.6)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(tx + 105, 242, 5, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(tx + 103, 242); ctx.lineTo(tx + 103, 254); ctx.stroke();
    // Chairs — 4 wooden chairs around the table
    const chairs = [[tx+25,190],[tx+119,190],[tx+25,280],[tx+119,280]];
    for (const [cx, cy] of chairs) {
      fillRoundedRect(cx, cy, 24, 8, 4, "#4a2a18"); // seat
      fillRoundedRect(cx, cy - 14, 3, 16, 1, "#3a1a0a"); // backrest post
      fillRoundedRect(cx + 21, cy - 14, 3, 16, 1, "#3a1a0a");
      fillRoundedRect(cx + 2, cy - 16, 20, 4, 2, "#4a2a18"); // backrest top
      fillRoundedRect(cx + 3, cy + 8, 3, 12, 1, "#3a1a0a"); // leg
      fillRoundedRect(cx + 18, cy + 8, 3, 12, 1, "#3a1a0a");
    }
  }

  // Kitchen area — right side
  fillRoundedRect(900, 410, 320, 140, 16, "#1a1510");
  strokeRoundedRect(900, 410, 320, 140, 16, "rgba(200,150,80,0.5)", 2);
  // Serving pass-through window
  fillRoundedRect(928, 430, 110, 34, 8, "#2a1a10");
  strokeRoundedRect(928, 430, 110, 34, 8, "rgba(220,180,120,0.4)", 2);
  // Counter inside
  fillRoundedRect(928, 470, 80, 12, 5, "#3a2a1a");
  // Stove elements
  fillCircle(1080, 460, 12, "#222"); fillCircle(1080, 460, 8, "#f44");
  fillCircle(1120, 460, 12, "#222"); fillCircle(1120, 460, 8, "#333");
  // Hanging shelf
  fillRoundedRect(1050, 425, 140, 6, 3, "#3a2a1a");
  for (let p = 0; p < 5; p++) fillRoundedRect(1060 + p*26, 415, 10, 14, 3, "#5a4a3a");
  // Kitchen sign
  ctx.fillStyle = "#d4b088"; ctx.font = "bold 11px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("KITCHEN", 1060, 500);

  // Bar counter — spanning center bottom
  fillRoundedRect(320, 530, 640, 110, 18, "#2a1510");
  strokeRoundedRect(320, 530, 640, 110, 18, "rgba(220,160,80,0.6)", 3);
  // Bar top surface
  fillRoundedRect(320, 530, 640, 16, 10, "rgba(240,200,140,0.35)");
  // Glass shelf behind bar
  fillRoundedRect(340, 545, 600, 6, 3, "#3a2a1a");
  // Bottles on shelf
  for (let b = 0; b < 14; b++) {
    const bx = 350 + b * 42;
    fillRoundedRect(bx, 530, 12, 18, 3, "#6a4a30");
    fillRoundedRect(bx + 2, 520, 5, 12, 2, "#886830");
  }
  // Bar stools — 7 stools
  for (let st = 0; st < 7; st++) {
    const sx = 370 + st * 80;
    fillCircle(sx, 600, 9, "#4a3020");
    strokeCircle(sx, 600, 9, "rgba(180,140,80,0.3)", 1);
    fillRoundedRect(sx-1, 585, 3, 16, 2, "#6a5040");
  }
  // Bar sign
  ctx.fillStyle = "#e8d0a0"; ctx.font = "bold 18px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("BAR", 640, 575);

  // Exit door
  fillRoundedRect(590, 640, 100, 70, 10, "#1a2018");
  strokeRoundedRect(590, 640, 100, 70, 10, "rgba(220,200,120,0.65)", 3);
  fillCircle(605, 675, 3, "#d4c090");
  ctx.fillStyle = "#e0c080"; ctx.font = "bold 12px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("LOBBY", 640, 683);
}

// ── Floor 24: Penthouse Suite ─────────────────────────────────────────────────
function drawFloor24() {
  // Dark purple luxury background
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, "#0c0610"); bg.addColorStop(0.5, "#160a1e"); bg.addColorStop(1, "#08040c");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // Plush carpet pattern
  ctx.save(); ctx.globalAlpha = 0.04;
  for (let r = 0; r < 20; r++) for (let c = 0; c < 36; c++) {
    if ((r+c)%3!==0) { ctx.fillStyle = "#d0b8e0"; ctx.fillRect(c*38, r*38, 38, 38); }
  } ctx.restore();

  // Balcony — glass railing across the top
  fillRoundedRect(30, 24, 1220, 96, 12, "#0c0818");
  strokeRoundedRect(30, 24, 1220, 96, 12, "rgba(160,140,200,0.5)", 3);
  // Glass panels in railing
  for (let p = 0; p < 11; p++) {
    const px = 48 + p * 108;
    fillRoundedRect(px, 36, 50, 68, 6, "rgba(140,130,180,0.15)");
    strokeRoundedRect(px, 36, 50, 68, 6, "rgba(160,150,190,0.35)", 1);
    // Glass reflection streak
    ctx.save(); ctx.globalAlpha = 0.1;
    fillRoundedRect(px+4, 44, 6, 50, 3, "#fff");
    ctx.restore();
  }
  // Balcony floor tiles
  ctx.save(); ctx.globalAlpha = 0.04;
  for (let t = 0; t < 36; t++) { ctx.fillStyle = "#a090b0"; ctx.fillRect(t*36, 80, 36, 48); }
  ctx.restore();
  // City skyline silhouette in distance
  ctx.save(); ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#302040";
  for (let b = 0; b < 16; b++) {
    const bh = 20 + Math.sin(b*1.7)*15;
    ctx.fillRect(60 + b*76, 80-bh, 40, bh);
  }
  ctx.restore();

  // King size bed — left center
  fillRoundedRect(140, 160, 380, 280, 24, "#1a1030");
  strokeRoundedRect(140, 160, 380, 280, 24, "rgba(200,180,240,0.45)", 2);
  // Headboard
  fillRoundedRect(140, 130, 380, 40, 14, "#2a1850");
  strokeRoundedRect(140, 130, 380, 40, 14, "rgba(220,200,255,0.3)", 1);
  // Tufted headboard pattern
  ctx.save(); ctx.globalAlpha = 0.15;
  for (let hb=0;hb<7;hb++) {
    fillCircle(180+hb*52, 148, 12, "#8060c0");
    fillCircle(180+hb*52, 148, 4, "#a080d0");
  } ctx.restore();
  // Bedside tables
  fillRoundedRect(120, 200, 30, 50, 8, "#1a1020");
  fillRoundedRect(510, 200, 30, 50, 8, "#1a1020");
  // Lamps on bedside tables
  fillRoundedRect(132, 190, 6, 16, 2, "#886020");
  fillCircle(135, 185, 8, "rgba(255,220,160,0.4)");
  strokeCircle(135, 185, 10, "rgba(255,200,120,0.2)", 1);
  fillRoundedRect(522, 190, 6, 16, 2, "#886020");
  fillCircle(525, 185, 8, "rgba(255,220,160,0.4)");
  strokeCircle(525, 185, 10, "rgba(255,200,120,0.2)", 1);
  // Pillows
  for (let pi = 0; pi < 3; pi++) {
    fillRoundedRect(168 + pi*130, 178, 100, 56, 14, "#e8e0f0");
    strokeRoundedRect(168 + pi*130, 178, 100, 56, 14, "rgba(220,200,240,0.5)", 1);
  }
  // Duvet / blanket
  fillRoundedRect(160, 250, 340, 176, 16, "#3a2058");
  strokeRoundedRect(160, 250, 340, 176, 16, "rgba(180,160,220,0.3)", 1);
  // Duvet fold line
  ctx.save(); ctx.globalAlpha = 0.15;
  fillRoundedRect(160, 310, 340, 4, 2, "#604080");
  ctx.restore();

  // Couch — bottom left
  fillRoundedRect(80, 520, 340, 110, 18, "#2a1840");
  strokeRoundedRect(80, 520, 340, 110, 18, "rgba(200,180,240,0.4)", 2);
  // Cushions
  fillRoundedRect(95, 540, 90, 70, 12, "#4a2860");
  fillRoundedRect(200, 540, 90, 70, 12, "#4a2860");
  fillRoundedRect(305, 540, 90, 70, 12, "#4a2860");
  // Couch backrest
  fillRoundedRect(85, 520, 330, 20, 6, "#3a2060");
  // Armrests
  fillRoundedRect(80, 520, 20, 110, 8, "#2a1840");
  fillRoundedRect(400, 520, 20, 110, 8, "#2a1840");

  // Bathroom — right wall suite
  fillRoundedRect(920, 140, 310, 410, 18, "#100c14");
  strokeRoundedRect(920, 140, 310, 410, 18, "rgba(180,200,220,0.5)", 2);
  // Bathroom door
  fillRoundedRect(940, 450, 50, 90, 8, "#1a1420");
  strokeRoundedRect(940, 450, 50, 90, 8, "rgba(200,200,220,0.3)", 1);
  fillCircle(975, 495, 3, "#c0b8a0");
  // Shower cubicle
  fillRoundedRect(1040, 160, 90, 140, 12, "#080a14");
  strokeRoundedRect(1040, 160, 90, 140, 12, "rgba(140,180,220,0.35)", 2);
  // Shower head
  fillCircle(1085, 172, 6, "#aaa");
  for (let d = 0; d < 5; d++) {
    ctx.save(); ctx.globalAlpha = 0.08; ctx.strokeStyle = "#88c8ff"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(1085, 180); ctx.lineTo(1080+d*2, 210+d*6); ctx.stroke();
    ctx.restore();
  }
  // Shower glass door
  strokeRoundedRect(1130, 160, 8, 140, 4, "rgba(160,200,240,0.25)", 2);
  // Sink and mirror
  fillRoundedRect(960, 220, 60, 16, 6, "#fff");
  fillRoundedRect(1030, 220, 60, 16, 6, "#fff");
  // Mirror above sinks
  fillRoundedRect(950, 160, 150, 55, 8, "rgba(200,210,240,0.25)");
  strokeRoundedRect(950, 160, 150, 55, 8, "rgba(180,190,220,0.5)", 2);
  // Toilet
  fillRoundedRect(1060, 350, 60, 80, 14, "#fff");
  fillRoundedRect(1050, 380, 10, 50, 5, "#eee");
  // Toilet seat oval
  ctx.strokeStyle = "#ddd"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(1090, 370, 22, 8, 0, 0, Math.PI*2); ctx.stroke();
  // Heated towel rack
  ctx.strokeStyle = "#bbb"; ctx.lineWidth = 2;
  for (let tr = 0; tr < 3; tr++) {
    ctx.beginPath(); ctx.moveTo(1180, 200+tr*20); ctx.lineTo(1210, 200+tr*20); ctx.stroke();
  }
  ctx.save(); ctx.globalAlpha = 0.3;
  fillRoundedRect(1182, 197, 26, 26, 4, "#e8e0e0");
  ctx.restore();

  // Exit door
  fillRoundedRect(590, 640, 100, 70, 10, "#1a1820");
  strokeRoundedRect(590, 640, 100, 70, 10, "rgba(220,200,120,0.65)", 3);
  fillCircle(605, 675, 3, "#d4c090");
  ctx.fillStyle = "#e0c080"; ctx.font = "bold 12px Segoe UI"; ctx.textAlign = "center";
  ctx.fillText("LOBBY", 640, 683);
}

function updateNpcList(npcList, obstacles) {
  for (let i = 0; i < npcList.length; i += 1) {
    const npc = npcList[i];
    npc.moodTime -= 1;
    if (npc.moodTime <= 0) {
      const maxSpeed = npc.role === "staff" ? STAFF_MAX_SPEED : CUSTOMER_MAX_SPEED;
      npc.vx = randomFloat(-maxSpeed, maxSpeed);
      npc.vy = randomFloat(-maxSpeed, maxSpeed);
      npc.moodTime = npc.role === "customer"
        ? 200 + Math.floor(Math.random() * 300)
        : 60 + Math.floor(Math.random() * 80);
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

    if (npc.anchor) {
      const dist = Math.hypot(nextX + npc.size / 2 - npc.anchor.x, nextY + npc.size / 2 - npc.anchor.y);
      if (dist > npc.roamRadius) {
        const angle = Math.atan2(npc.anchor.y - (npc.y + npc.size / 2), npc.anchor.x - (npc.x + npc.size / 2));
        const speed = Math.hypot(npc.vx, npc.vy) || STAFF_MAX_SPEED * 0.5;
        npc.vx = Math.cos(angle) * speed;
        npc.vy = Math.sin(angle) * speed;
        nextX = npc.x + npc.vx;
        nextY = npc.y + npc.vy;
      }
    }

    const npcRect = { x: nextX, y: nextY, width: npc.size, height: npc.size };
    let blocked = collidesWithWorldRect(npcRect, { ignoreNpcIndex: i, includePlayer: true, skipNpcs: obstacles != null });
    // Check obstacles for lobby/backstage
    if (!blocked && obstacles) {
      for (const obs of obstacles) {
        if (intersectsRect(npcRect, obs)) { blocked = true; break; }
      }
    }
    // NPC-on-NPC collision within the same room's NPC list
    if (!blocked) {
      for (let j = 0; j < npcList.length; j += 1) {
        if (j === i) continue;
        const otherRect = { x: npcList[j].x, y: npcList[j].y, width: npcList[j].size, height: npcList[j].size };
        if (intersectsRect(npcRect, otherRect)) { blocked = true; break; }
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
    const isStaff = npc.role === "staff";
    const bodyColor = isStaff ? "#eeeef8" : npc.color;
    const legColor = isStaff ? "#1e2a42" : "#18182a";
    drawHumanoid(npc.x, npc.y, npc.size, bodyColor, npc.skin || "#f7ddc2", legColor, isStaff);
  }
}

function drawRouletteTable(table, isNearby) {
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2;
  const radius = Math.min(table.width, table.height) * 0.36;

  fillRoundedRect(table.x, table.y, table.width, table.height, 24, "#19261f");
  strokeRoundedRect(table.x, table.y, table.width, table.height, 24, isNearby ? "#f7d683" : "rgba(232, 236, 255, 0.75)", isNearby ? 4 : 2);
  fillRoundedRect(table.x + 10, table.y + 10, table.width - 20, table.height - 20, 20, "#275339");

  fillCircle(cx, cy, radius + 14, "#6e432f");
  fillCircle(cx, cy, radius + 8, "#1b1b1b");
  fillCircle(cx, cy, radius, "#0e1216");
  fillCircle(cx, cy, radius * 0.18, "#dcb670");

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

  drawChip(table.x + 28, table.y + table.height - 26, 8, "#c4454f", "#ffe8a4");
  drawChip(table.x + 48, table.y + table.height - 22, 8, "#2d7d9d", "#d8f2ff");
  fillRoundedRect(table.x + table.width - 66, table.y + 18, 40, 20, 10, "rgba(5, 10, 18, 0.45)");
  strokeRoundedRect(table.x + table.width - 66, table.y + 18, 40, 20, 10, "rgba(255, 239, 187, 0.24)");

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawSlotsTable(table, isNearby) {
  fillRoundedRect(table.x, table.y, table.width, table.height, 24, "#241733");
  strokeRoundedRect(table.x, table.y, table.width, table.height, 24, isNearby ? "#f7d683" : "rgba(232, 236, 255, 0.75)", isNearby ? 4 : 2);

  const machineY = table.y + 17;
  const machineHeight = 62;
  const pad = 12;
  const totalWidth = table.width - pad * 2;
  const reelWidth = (totalWidth - 12) / 3;

  fillRoundedRect(table.x + 8, machineY - 9, table.width - 16, machineHeight + 17, 18, "#8b2441");
  fillRoundedRect(table.x + 28, table.y + 10, table.width - 56, 12, 6, "#ffd97f");
  for (let i = 0; i < 5; i += 1) {
    fillCircle(table.x + 22 + i * 30, table.y + table.height - 30, 5, i % 2 === 0 ? "#ffd978" : "#9ecbff");
  }

  for (let i = 0; i < 3; i += 1) {
    const rx = table.x + pad + i * (reelWidth + 6);
    fillRoundedRect(rx, machineY, reelWidth, machineHeight, 10, "#101621");
    strokeRoundedRect(rx, machineY, reelWidth, machineHeight, 10, "rgba(207, 231, 255, 0.5)", 2);

    ctx.fillStyle = "#f9cf73";
    ctx.font = "22px Segoe UI Emoji";
    ctx.textAlign = "center";
    ctx.fillText(["🍒", "⭐", "🔔"][i], rx + reelWidth / 2, machineY + 39);
  }

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawCardTable(table, isNearby, accentColor) {
  fillRoundedRect(table.x, table.y, table.width, table.height, 24, "#2a2439");
  strokeRoundedRect(table.x, table.y, table.width, table.height, 24, isNearby ? "#f7d683" : "rgba(232, 236, 255, 0.75)", isNearby ? 4 : 2);
  fillRoundedRect(table.x + 10, table.y + 12, table.width - 20, table.height - 26, 18, "#3f281f");

  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2 - 6;
  const rx = table.width / 2 - 18;
  const ry = table.height / 2 - 24;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = accentColor;
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 229, 178, 0.22)";
  ctx.lineWidth = 2;
  ctx.stroke();

  fillRoundedRect(table.x + 18, table.y + 24, 20, 32, 6, "#f4ede1");
  fillRoundedRect(table.x + table.width - 38, table.y + 24, 20, 32, 6, "#f4ede1");
  drawChip(table.x + 42, table.y + table.height - 22, 8, "#286f89", "#dff6ff");
  drawChip(table.x + table.width - 40, table.y + table.height - 22, 8, "#c34652", "#ffe1a0");

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 14px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("♠ ♥ ♦ ♣", cx, cy + 6);

  ctx.font = "bold 16px Segoe UI";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawCoinFlipTable(table, isNearby) {
  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2 - 8;

  fillRoundedRect(table.x, table.y, table.width, table.height, 24, "#1a1230");
  strokeRoundedRect(table.x, table.y, table.width, table.height, 24, isNearby ? "#f7d683" : "rgba(232, 236, 255, 0.75)", isNearby ? 4 : 2);
  fillRoundedRect(table.x + 10, table.y + 12, table.width - 20, table.height - 26, 18, "#2d1d4a");

  // Coin body
  fillCircle(cx, cy + 3, 29, "rgba(0,0,0,0.3)");
  fillCircle(cx, cy, 28, "#a87820");
  fillCircle(cx, cy, 25, "#d4a030");
  fillCircle(cx, cy, 22, "#e8b840");

  // Coin edge notches
  ctx.save();
  ctx.strokeStyle = "rgba(200,155,40,0.55)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 24; i += 1) {
    const angle = (Math.PI * 2 * i) / 24;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 22, cy + Math.sin(angle) * 22);
    ctx.lineTo(cx + Math.cos(angle) * 26, cy + Math.sin(angle) * 26);
    ctx.stroke();
  }
  ctx.restore();

  // Star on coin face
  ctx.fillStyle = "#b88a20";
  ctx.font = "bold 18px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("★", cx, cy + 6);

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, cx, table.y + table.height - 14);
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
  if (table.id === "blackjack") {
    drawCardTable(table, isNearby, "#2d6e4f");
    return;
  }
  if (table.id === "poker") {
    drawCardTable(table, isNearby, "#6b4230");
    return;
  }
  if (table.id === "coinflip") {
    drawCoinFlipTable(table, isNearby);
    return;
  }
  if (table.id === "baccarat") {
    drawCardTable(table, isNearby, "#1a3f6a");
    return;
  }
}

function drawPlayer() {
  drawHumanoid(player.x, player.y, player.size, "#3d8eef", "#f5d9b8", "#1c2445", false);
  strokeCircle(player.x + player.size / 2, player.y + player.size / 2, player.size * 0.72, "rgba(93, 180, 255, 0.5)", 2);
}

function drawPrompt() {
  if (!nearbyTable || activePanel) {
    return;
  }

  const text = `${INTERACT_KEY_TEXT} - ${nearbyTable.label}`;
  ctx.font = "bold 18px Segoe UI";
  const textWidth = ctx.measureText(text).width;
  const promptWidth = textWidth + 28;
  const promptHeight = 40;
  const px = WIDTH / 2 - promptWidth / 2;
  const py = HEIGHT - 80;

  fillRoundedRect(px, py, promptWidth, promptHeight, 18, "rgba(3, 12, 21, 0.88)");
  strokeRoundedRect(px, py, promptWidth, promptHeight, 18, "rgba(247, 214, 131, 0.78)", 2);

  ctx.fillStyle = "#dff4ff";
  ctx.textAlign = "left";
  ctx.fillText(text, px + 14, py + 25);
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
  const nextY = clamp(player.y + dy, 0, HEIGHT - player.size);

  // Room-specific collision check
  let blocked = false;
  if (currentRoom === "casino") {
    const checkX = { x: nextX, y: player.y, width: player.size, height: PLAYER_HITBOX_H };
    const checkY = { x: player.x, y: nextY, width: player.size, height: PLAYER_HITBOX_H };
    blocked = collidesWithWorldRect(checkX, { skipNpcs: false });
    if (!blocked) {
      blocked = collidesWithWorldRect(checkY, { skipNpcs: false });
    }
  } else {
    let obstacles;
    if (currentRoom === "lobby") obstacles = lobbyObstacles;
    else if (currentRoom === "backstage") obstacles = backstageObstacles;
    else if (currentRoom === "floor7") obstacles = floor7Obstacles;
    else if (currentRoom === "floor12") obstacles = floor12Obstacles;
    else if (currentRoom === "floor24") obstacles = floor24Obstacles;
    else obstacles = [];
    const checkX = { x: nextX, y: player.y, width: player.size, height: PLAYER_HITBOX_H };
    const checkY = { x: player.x, y: nextY, width: player.size, height: PLAYER_HITBOX_H };
    for (const obs of obstacles) {
      if (intersectsRect(checkX, obs)) { blocked = true; break; }
    }
    if (!blocked) {
      for (const obs of obstacles) {
        if (intersectsRect(checkY, obs)) { blocked = true; break; }
      }
    }
  }

  if (!blocked) {
    player.x = nextX;
    player.y = nextY;
  }

  // ── Room transitions are handled via E key on doors ──
}

function gameLoop() {
  updatePlayerPosition();

  // Update NPCs for the current room
  if (currentRoom === "casino") {
    updateNpcList(npcs, null);
  } else if (currentRoom === "lobby") {
    updateNpcList(lobbyNpcs, lobbyObstacles);
  } else if (currentRoom === "backstage") {
    updateNpcList(backstageNpcs, backstageObstacles);
  } else if (currentRoom === "floor7") {
    updateNpcList([], floor7Obstacles);
  } else if (currentRoom === "floor12") {
    updateNpcList([], floor12Obstacles);
  } else if (currentRoom === "floor24") {
    updateNpcList([], floor24Obstacles);
  }

  resolveNearbyTable();

  const viewW = WIDTH / ZOOM;
  const viewH = HEIGHT / ZOOM;
  const camX = clamp(player.x + player.size / 2 - viewW / 2, 0, WIDTH - viewW);
  const camY = clamp(player.y + player.size / 2 - viewH / 2, 0, HEIGHT - viewH);

  ctx.save();
  ctx.scale(ZOOM, ZOOM);
  ctx.translate(-camX, -camY);

  if (currentRoom === "casino") {
    drawBackground();
    drawPerformanceStage();
    drawEntrance();
    drawDecorativeTables();
    drawCenterBar();

    for (const table of tables) {
      drawTable(table, nearbyTable?.id === table.id);
    }

    drawNpcs();
    drawPlayer();
  } else if (currentRoom === "lobby") {
    drawLobby();
    drawPlayer();
  } else if (currentRoom === "backstage") {
    drawBackstage();
    drawPlayer();
  } else if (currentRoom === "floor7") {
    drawFloor7();
    drawPlayer();
  } else if (currentRoom === "floor12") {
    drawFloor12();
    drawPlayer();
  } else if (currentRoom === "floor24") {
    drawFloor24();
    drawPlayer();
  }

  ctx.restore();

  drawPrompt();

  requestAnimationFrame(gameLoop);
}

function handleKeyDown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key in keyState) {
    keyState[key] = true;
  }

  if (key === INTERACT_KEY && nearbyTable && !activePanel) {
    if (nearbyTable.isDoor) {
      // Room transition via door
      const door = nearbyTable.door;
      currentRoom = door.targetRoom;
      player.x = door.targetX;
      player.y = door.targetY;
      nearbyTable = null;
      updateNearbyText();
    } else {
      openPanel(nearbyTable.id);
    }
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

function updateResponsivePanelScale() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isLandscape = viewportWidth > viewportHeight;
  const isMobileish = viewportWidth <= 1200;
  const isDesktopLayout = viewportWidth >= 821;

  let panelScale = 1;
  if (isLandscape && isMobileish) {
    const widthScale = viewportWidth / WIDTH;
    const heightScale = viewportHeight / HEIGHT;
    panelScale = clamp(Math.min(widthScale, heightScale), 0.55, 1);
  }

  const reservedHeight = isDesktopLayout ? 220 : 250;
  const fitWidthFromHeight = Math.max(600, (viewportHeight - reservedHeight) * (WIDTH / HEIGHT));
  const fitWidthFromViewport = viewportWidth * 0.96;
  const appMaxWidth = clamp(Math.min(WIDTH, fitWidthFromHeight, fitWidthFromViewport), 600, WIDTH);

  document.documentElement.style.setProperty("--panel-ui-scale", panelScale.toFixed(3));
  document.documentElement.style.setProperty("--app-max-width", `${appMaxWidth.toFixed(0)}px`);
}

rouletteChoiceSelect.addEventListener("change", () => {
  rouletteNumberRow.classList.toggle("hidden", rouletteChoiceSelect.value !== "number");
});

document.getElementById("spinRouletteBtn").addEventListener("click", spinRoulette);
document.getElementById("spinSlotsBtn").addEventListener("click", spinSlots);
dealBlackjackBtn.addEventListener("click", playBlackjack);
hitBlackjackBtn.addEventListener("click", hitBlackjack);
standBlackjackBtn.addEventListener("click", standBlackjack);
dealPokerBtn.addEventListener("click", playPoker);
callPokerBtn.addEventListener("click", callPoker);
checkPokerBtn.addEventListener("click", checkPoker);
raisePokerBtn.addEventListener("click", raisePoker);
foldPokerBtn.addEventListener("click", foldPoker);
if (buyDrinkBtn) {
  buyDrinkBtn.addEventListener("click", buyDrink);
}

// Coin flip listeners
const flipCoinBtn = document.getElementById("flipCoinBtn");
const coinHeadsBtn = document.getElementById("coinHeadsBtn");
const coinTailsBtn = document.getElementById("coinTailsBtn");
if (flipCoinBtn) {
  flipCoinBtn.addEventListener("click", flipCoin);
}
if (coinHeadsBtn) {
  coinHeadsBtn.addEventListener("click", () => {
    coinChoice = "heads";
    coinHeadsBtn.classList.add("active");
    if (coinTailsBtn) {
      coinTailsBtn.classList.remove("active");
    }
  });
}
if (coinTailsBtn) {
  coinTailsBtn.addEventListener("click", () => {
    coinChoice = "tails";
    coinTailsBtn.classList.add("active");
    if (coinHeadsBtn) {
      coinHeadsBtn.classList.remove("active");
    }
  });
}

// Baccarat listener
const dealBaccaratBtn = document.getElementById("dealBaccaratBtn");
if (dealBaccaratBtn) {
  dealBaccaratBtn.addEventListener("click", startBaccarat);
}

// ── Lobby panel listeners ──
const checkinBtn = document.getElementById("checkinBtn");
const checkinResultEl = document.getElementById("checkinResult");
const checkinSuiteEl = document.getElementById("checkinSuite");
if (checkinBtn) {
  checkinBtn.addEventListener("click", () => {
    if (checkinResultEl) {
      checkinResultEl.textContent = "🛎️ Receptionist hands you a key card. Penthouse Suite on Floor 24 is ready!";
      checkinResultEl.style.color = "#9af5a8";
    }
    if (checkinBtn) { checkinBtn.disabled = true; checkinBtn.textContent = "Checked In ✓"; }
  });
}

const elevFloorEl = document.getElementById("elevatorFloor");
const elevResultEl = document.getElementById("elevatorResult");
function openElevatorFloor(floorId) {
  activePanel = null;
  modalBackdrop.classList.add("hidden");
  if (floorId === 7)  { currentRoom = "floor7";  player.x = 580; player.y = 100; }
  if (floorId === 12) { currentRoom = "floor12"; player.x = 640; player.y = 100; }
  if (floorId === 24) { currentRoom = "floor24"; player.x = 640; player.y = 100; }
  nearbyTable = null;
  updateNearbyText();
}
const floor7Btn = document.getElementById("elevFloor7");
const floor12Btn = document.getElementById("elevFloor12");
const floor24Btn = document.getElementById("elevFloor24");
if (floor7Btn) floor7Btn.addEventListener("click", () => openElevatorFloor(7));
if (floor12Btn) floor12Btn.addEventListener("click", () => openElevatorFloor(12));
if (floor24Btn) floor24Btn.addEventListener("click", () => openElevatorFloor(24));

// Back to Lifts buttons
const floor7Back = document.getElementById("floor7Back");
const floor12Back = document.getElementById("floor12Back");
const floor24Back = document.getElementById("floor24Back");
if (floor7Back) {
  floor7Back.addEventListener("click", () => {
    openPanel("elevator");
  });
}
if (floor12Back) {
  floor12Back.addEventListener("click", () => {
    openPanel("elevator");
  });
}
if (floor24Back) {
  floor24Back.addEventListener("click", () => {
    openPanel("elevator");
  });
}

generateDrinkOffer();

document.querySelectorAll("[data-close-panel]").forEach((button) => {
  button.addEventListener("click", closePanel);
});

window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);
window.addEventListener("resize", updateResponsivePanelScale);
window.addEventListener("orientationchange", updateResponsivePanelScale);

bindJoystick();
canvas.addEventListener("pointerdown", handleCanvasTapInteract);

slotReelEls.forEach((reelEl) => {
  renderReelStrip(reelEl, ["🍒", "🍋", "⭐"]);
});

updateBalanceText();
updateNearbyText();
rouletteNumberRow.classList.add("hidden");
setBlackjackButtonsInRound(false);
setPokerButtonsInRound(false);
updateResponsivePanelScale();
gameLoop();
