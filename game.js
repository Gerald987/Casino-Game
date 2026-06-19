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
const refreshDrinkBtn = document.getElementById("refreshDrinkBtn");
const buyDrinkBtn = document.getElementById("buyDrinkBtn");
const barDrinkNameEl = document.getElementById("barDrinkName");
const barResultEl = document.getElementById("barResult");

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
    x: 205,
    y: 92,
    width: 188,
    height: 120,
    color: "#8f2f2f",
    label: "Roulette",
    hitbox: {
      x: 205,
      y: 92,
      width: 188,
      height: 120
    }
  },
  {
    id: "slots",
    name: "Slot Machine",
    x: 620,
    y: 326,
    width: 166,
    height: 126,
    color: "#2f6b9a",
    label: "Slots",
    hitbox: {
      x: 620,
      y: 326,
      width: 166,
      height: 126
    }
  },
  {
    id: "blackjack",
    name: "Blackjack Table",
    x: 600,
    y: 94,
    width: 188,
    height: 120,
    color: "#2f7a4f",
    label: "Blackjack",
    hitbox: {
      x: 600,
      y: 94,
      width: 188,
      height: 120
    }
  },
  {
    id: "poker",
    name: "Poker Table",
    x: 180,
    y: 326,
    width: 188,
    height: 120,
    color: "#7a4f2f",
    label: "Poker",
    hitbox: {
      x: 180,
      y: 326,
      width: 188,
      height: 120
    }
  }
];

const centerBar = {
  id: "bar",
  name: "Center Bar",
  label: "Center Bar",
  x: 398,
  y: 220,
  width: 164,
  height: 132,
  hitbox: {
    x: 398,
    y: 220,
    width: 164,
    height: 132
  }
};

let wisTokens = 1000;
let activePanel = null;
let nearbyTable = null;
let isRouletteSpinning = false;
let isSlotsSpinning = false;
let blackjackRound = null;
let pokerRound = null;
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
    name: "Amethyst Mirage",
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
    name: "Champagne Glow",
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
    name: "Solar Flare",
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
    name: "Amethyst Mirage",
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
    name: "Champagne Glow",
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
    name: "Solar Flare",
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

  for (const table of tables) {
    if (intersectsRect(rect, table.hitbox)) {
      return true;
    }
  }

  if (intersectsRect(rect, centerBar.hitbox)) {
    return true;
  }

  for (const deco of decorativeTables) {
    if (rectIntersectsCircle(rect, deco.x, deco.y, deco.radius + 2)) {
      return true;
    }
  }

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

  if (includePlayer) {
    const playerRect = { x: player.x, y: player.y, width: player.size, height: player.size };
    if (intersectsRect(rect, playerRect)) {
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

  if (!nearbyTable) {
    const barDist = distanceToRect(playerCenterX, playerCenterY, centerBar.hitbox);
    if (barDist <= interactDistance) {
      nearbyTable = centerBar;
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
  if (tableId === "bar") {
    barPanel.classList.remove("hidden");
    renderDrinkOffer();
    if (barResultEl) {
      barResultEl.textContent = "The bartender smiles. First drink is on the house.";
      barResultEl.style.color = "#f7d683";
    }
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
    folded: false
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

  let streetBet = 0;
  const betChance = isFirstStreet ? 0.62 : pokerRound.streetIndex === 3 ? 0.48 : 0.56;
  if (Math.random() < betChance) {
    const multiplier = Math.random() < 0.33 ? 2 : 1;
    streetBet = pokerRound.ante * multiplier;
  }

  pokerRound.currentStreetBet = streetBet;
  for (const opponent of activeOpponents) {
    pokerRound.pot += streetBet;
  }

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

  const lostAnte = pokerRound.ante;
  pokerRound = null;
  setPokerButtonsInRound(false);
  pokerResult.textContent = `You folded and lost ${lostAnte} WIS Tokens.`;
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
  pokerRound.currentStreetBet = newStreetBet;
  pokerRound.pot += additionalFromPlayer;

  const activeOpponents = getActiveOpponents();
  for (const opponent of activeOpponents) {
    const foldChance = newStreetBet >= pokerRound.ante * 2 ? 0.36 : 0.24;
    if (Math.random() < foldChance) {
      opponent.folded = true;
      continue;
    }
    pokerRound.pot += newStreetBet;
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

function drawCenterBar() {
  const cx = centerBar.x + centerBar.width / 2;
  const cy = centerBar.y + centerBar.height / 2;

  ctx.fillStyle = "#2a1720";
  ctx.fillRect(centerBar.x, centerBar.y, centerBar.width, centerBar.height);

  ctx.strokeStyle = "rgba(255, 221, 153, 0.55)";
  ctx.lineWidth = 2;
  ctx.strokeRect(centerBar.x, centerBar.y, centerBar.width, centerBar.height);

  ctx.fillStyle = "#4f2a1f";
  ctx.fillRect(centerBar.x + 10, centerBar.y + 12, centerBar.width - 20, centerBar.height - 24);

  ctx.fillStyle = "#8a5d39";
  ctx.fillRect(centerBar.x + 18, centerBar.y + 18, centerBar.width - 36, 14);

  ctx.fillStyle = "rgba(255, 234, 177, 0.17)";
  ctx.fillRect(centerBar.x + 18, centerBar.y + 20, centerBar.width - 36, 4);

  const stoolOffsets = [
    [-58, -50],
    [0, -56],
    [58, -50],
    [-58, 50],
    [0, 56],
    [58, 50]
  ];

  for (const [ox, oy] of stoolOffsets) {
    ctx.beginPath();
    ctx.fillStyle = "#49324f";
    ctx.arc(cx + ox, cy + oy, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(208, 196, 255, 0.5)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = "#f6e4be";
  ctx.font = "bold 15px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("BAR", cx, centerBar.y + centerBar.height - 12);
}

function updateNpcs() {
  for (let i = 0; i < npcs.length; i += 1) {
    const npc = npcs[i];
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
    const blocked = collidesWithWorldRect(npcRect, { ignoreNpcIndex: i, includePlayer: true });

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
  const radius = Math.min(table.width, table.height) * 0.36;

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
  ctx.font = "bold 16px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(table.label, table.x + table.width / 2, table.y + table.height - 16);
}

function drawSlotsTable(table, isNearby) {
  ctx.fillStyle = "#2b193d";
  ctx.fillRect(table.x, table.y, table.width, table.height);

  ctx.strokeStyle = isNearby ? "#f7d683" : "#e8ecff";
  ctx.lineWidth = isNearby ? 4 : 2;
  ctx.strokeRect(table.x, table.y, table.width, table.height);

  const machineY = table.y + 17;
  const machineHeight = 62;
  const pad = 12;
  const totalWidth = table.width - pad * 2;
  const reelWidth = (totalWidth - 12) / 3;

  ctx.fillStyle = "#7a2d42";
  ctx.fillRect(table.x + 8, machineY - 9, table.width - 16, machineHeight + 17);

  for (let i = 0; i < 3; i += 1) {
    const rx = table.x + pad + i * (reelWidth + 6);
    ctx.fillStyle = "#0f1a2f";
    ctx.fillRect(rx, machineY, reelWidth, machineHeight);

    ctx.strokeStyle = "rgba(207, 231, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(rx, machineY, reelWidth, machineHeight);

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
  ctx.fillStyle = "#2a2439";
  ctx.fillRect(table.x, table.y, table.width, table.height);

  ctx.strokeStyle = isNearby ? "#f7d683" : "#e8ecff";
  ctx.lineWidth = isNearby ? 4 : 2;
  ctx.strokeRect(table.x, table.y, table.width, table.height);

  const cx = table.x + table.width / 2;
  const cy = table.y + table.height / 2 - 6;
  const rx = table.width / 2 - 18;
  const ry = table.height / 2 - 24;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = accentColor;
  ctx.fill();

  ctx.fillStyle = "#f4fbff";
  ctx.font = "bold 14px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("♠ ♥ ♦ ♣", cx, cy + 6);

  ctx.font = "bold 16px Segoe UI";
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
  if (table.id === "blackjack") {
    drawCardTable(table, isNearby, "#2d6e4f");
    return;
  }
  if (table.id === "poker") {
    drawCardTable(table, isNearby, "#6b4230");
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
  if (!collidesWithWorldRect({ x: nextX, y: player.y, width: player.size, height: player.size })) {
    player.x = nextX;
  }

  const nextY = clamp(player.y + dy, 0, HEIGHT - player.size);
  if (!collidesWithWorldRect({ x: player.x, y: nextY, width: player.size, height: player.size })) {
    player.y = nextY;
  }
}

function gameLoop() {
  updatePlayerPosition();
  updateNpcs();
  resolveNearbyTable();

  drawBackground();
  drawDecorativeTables();
  drawCenterBar();

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

function updateResponsivePanelScale() {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isLandscape = viewportWidth > viewportHeight;
  const isMobileish = viewportWidth <= 1200;
  const isDesktopLayout = viewportWidth >= 821;

  let panelScale = 1;
  if (isLandscape && isMobileish) {
    const widthScale = viewportWidth / 1080;
    const heightScale = viewportHeight / 650;
    panelScale = clamp(Math.min(widthScale, heightScale), 0.58, 1);
  }

  const reservedHeight = isDesktopLayout ? 220 : 250;
  const fitWidthFromHeight = Math.max(520, (viewportHeight - reservedHeight) * (WIDTH / HEIGHT));
  const fitWidthFromViewport = viewportWidth * 0.96;
  const appMaxWidth = clamp(Math.min(1080, fitWidthFromHeight, fitWidthFromViewport), 520, 1080);

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
if (refreshDrinkBtn) {
  refreshDrinkBtn.addEventListener("click", refreshDrinkOffer);
}
if (buyDrinkBtn) {
  buyDrinkBtn.addEventListener("click", buyDrink);
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
