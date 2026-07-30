## Phase Plan: NPC Variants + Animated Interactables

### NPC Variants (~4 hrs)
- Modify `drawHumanoid` to draw 3 body types: male (broad shoulders), female (narrower shoulders, wider hips, dress/skirt option), child (shorter, larger head, rounder)
- Add `type` field to NPC data arrays (28 casino + 10 lobby + 6 backstage + floor room NPCs)
- Assign sensible types: staff=male/female mix, customers=mix, children near sofas/pool

### Animated Interactables (~6 hrs)
- Add player interaction state machine: IDLE / ANIMATING / DONE
- Floor 7 pool: player sprite moves into pool area, splash particles (small circles), then reset
- Floor 12 bar: bartender arm (small rect) moves up/down, glass fills (growing rect), then reset  
- Floor 24 bed: player sprite shifts to horizontal over bed, blanket rises, then reset
- Floor 24 balcony: player walks to balcony edge, pause, then reset
- Casino bar drink: bartender pours animation

### Total: ~10 hrs across both machines
