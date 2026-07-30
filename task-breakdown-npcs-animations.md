# Full Task Breakdown: NPC Variants + Animated Interactables

## Phase 0: Setup (shared engine changes, must be done first by one machine)

### Task 0.1 — Add NPC `type` field to data arrays
**File:** `game.js`
**Estimate:** 30 min
**What:**
- Add `type:` field to every NPC object in all arrays:
  - `npcs` (28 casino floor NPCs)
  - `lobbyNpcs` (10 lobby NPCs)
  - `backstageNpcs` (6 backstage NPCs)
- Values: `"male"`, `"female"`, `"child"`
- Staff: mix male/female
- Customers: mix of all three
- Children placed near: lobby sofas, pool area (floor 7)

### Task 0.2 — Modify `drawHumanoid` to accept `type` parameter
**File:** `game.js` around line 3393
**Estimate:** 2 hr
**What:**
- Add `type` parameter (default `"male"`)
- Add switch/if-else at the start of the function that adjusts proportions:
  - **male**: current dimensions (torso 10s×12s, legs 4s×11s, head r=5.5s)
  - **female**: torso 8s×11s, hips 10s wide, waist indent, optional skirt triangle
  - **child**: total height 70%, head r=7s (bigger ratio), torso 8s×8s, shorter limbs
- Update staff badge rendering to show on all types (not just "male" body)

### Task 0.3 — Add interaction state machine variables
**File:** `game.js` near line 214
**Estimate:** 15 min
**What:**
- Add globals: `interactionState` ("idle" | "animating"), `interactionTimer` (0), `interactionType` ("")
- Add `interactionLockInput` flag — when true, handleKeyDown ignores movement keys

### Task 0.4 — Modify `gameLoop` to decrement interaction timer
**File:** `game.js` in gameLoop function
**Estimate:** 5 min
**What:**
- If `interactionState === "animating"`, decrement timer each frame
- When timer reaches 0, set state to "idle", show text, unlock input

---

## Phase 1: NPC Type Assignment (parallel-friendly)

### Task 1.1 — Casino floor NPCs (28 NPCs)
**File:** `game.js` (~lines 1236-1267)
**Estimate:** 30 min (manual, tedious but straightforward)
**Assignment guidelines:**
- 8 staff → 4 male, 4 female
- 20 customers → ~8 male, ~8 female, ~4 child
- Children at: x=148, x=385, x=640, x=1172 rows (near open areas, not near tables)

### Task 1.2 — Lobby NPCs (10 NPCs)
**File:** `game.js` (~lines 1308-1322)
**Estimate:** 10 min
- 3 receptionists + 1 concierge → 2 female, 2 male
- 6 guests → 2 male, 2 female, 2 child

### Task 1.3 — Backstage NPCs (6 NPCs)
**File:** `game.js` (~lines 1335-1345)
**Estimate:** 5 min
- 2 stage techs → 2 male
- 2 performers → 2 female
- 2 crew → 1 male, 1 female

---

## Phase 2: Animation Implementations (parallel-friendly)

### Task 2.1 — Interaction state machine wiring
**File:** `game.js`
**Estimate:** 1 hr
**What:**
- Modify `handleKeyDown` for floor interactables: instead of showing text, set `interactionState = "animating"`, `interactionTimer = 30` (or appropriate frame count), `interactionType = "swim"`
- During animation: block movement keys
- Add `drawInteractionOverlay(ctx)` function that renders the current animation frame based on timer + type
- Call it from `gameLoop` after `drawPrompt`

### Task 2.2 — Pool swim animation
**File:** `game.js` inside `drawInteractionOverlay`
**Estimate:** 1 hr
**Animation (30 frames, ~0.5s):**
- Player sprite translates from current position toward pool center (x=680, y=430) over 15 frames
- 8–12 blue `fillCircle` bubbles spawn each frame at random x,y near the player, radius decreasing, y decreasing (rising)
- Frames 16–30: player bobs up/down by 2px sine wave
- At frame 30: show "You dive into the pool. The water is perfectly heated."

### Task 2.3 — Bar pour animation (casino bar + floor 12 bar)
**Line:** `drawInteractionOverlay`
**Estimate:** 45 min
**Animation (20 frames, ~0.3s):**
- Frame 0-5: player doesn't move (at bar)
- A bottle shape (small rect at bartender position) tilts from 0° to 35° using `ctx.rotate`
- A yellow `fillRect` inside the glass on the bar counter grows from bottom up over frames 5-18
- Frame 19-20: sparkle (single small white circle) appears on filled glass
- At frame 20: show "A bartender pours you a complimentary cocktail."

### Task 2.4 — Bed sleep animation (floor 24)
**Line:** `drawInteractionOverlay`
**Estimate:** 1 hr
**Animation (25 frames, ~0.4s):**
- Frame 0-5: player sprite walks toward bed center (x=330, y=300)
- Frame 6-15: player rotates to horizontal using `ctx.rotate(Math.PI/2)` and translates onto bed area (use save/restore)
- Frame 16-20: duvet rises (translates up 4px), player partially hidden by duvet
- Frame 21-25: duvet settles back, player still horizontal
- At frame 25: show "You sink into the king bed. Pure luxury."

### Task 2.5 — Balcony view animation (floor 24)
**Line:** `drawInteractionOverlay`
**Estimate:** 30 min
**Animation (30 frames, ~0.5s):**
- Frame 0-10: player walks toward balcony (y=30 area)
- Frame 11-25: camera zoom simulation — draw a dark vignette border around edges (full-screen black rect with alpha gradient, inner circle transparent)
- Frame 11-25: player stands at railing, sways slightly (sine x-shift ±1px)
- Frame 26-30: vignette fades
- At frame 30: show "The city stretches endlessly below. Stunning view."

### Task 2.6 — Casino bar drink animation
**Line:** `drawInteractionOverlay`
**Estimate:** 15 min
**What:** Same as Task 2.3 (floor 12 bar), reuse the same function with a flag.

---

## Summary Table

| Task | Time | Depends on | Parallel? |
|---|---|---|---|
| 0.1 NPC type field | 30 min | — | Must be first |
| 0.2 drawHumanoid types | 2 hr | 0.1 | Must be first |
| 0.3 State machine vars | 15 min | — | Must be first |
| 0.4 gameLoop timer | 5 min | 0.3 | Must be first |
| 1.1 Casino NPCs | 30 min | 0.1, 0.2 | ✅ Yes |
| 1.2 Lobby NPCs | 10 min | 0.1, 0.2 | ✅ Yes |
| 1.3 Backstage NPCs | 5 min | 0.1, 0.2 | ✅ Yes |
| 2.1 Wire state machine | 1 hr | 0.3, 0.4 | Must be after Phase 0 |
| 2.2 Pool swim | 1 hr | 2.1 | ✅ Yes |
| 2.3 Bar pour | 45 min | 2.1 | ✅ Yes |
| 2.4 Bed sleep | 1 hr | 2.1 | ✅ Yes |
| 2.5 Balcony view | 30 min | 2.1 | ✅ Yes |
| 2.6 Casino bar pour | 15 min | 2.1 | ✅ Yes |

**Total: ~8.5 hours wall clock** with two machines working in parallel after Phase 0.

```
Machine A ── Phase 0 (2.5h)
         │
         ├── Task 1.1 (30m)
         ├── Task 1.2 (10m)
         ├── Task 2.3 (45m)
         └── Task 2.4 (1h)
         └── Task 2.6 (15m)

Machine B ── (starts after Phase 0)
         ├── Task 1.3 (5m)
         ├── Task 2.1 (1h) ── needs Phase 0 done
         ├── Task 2.2 (1h)
         └── Task 2.5 (30m)
```
