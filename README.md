# Casino Game

This repository now includes:

- Web version: `index.html` + `game.js` + `styles.css`
- Native C version: `casino_game.c` (terminal-based, cross-platform C11)

## Build the C version

### macOS / Linux

```bash
make
./casino_game
```

### Windows (MinGW)

```bash
gcc -std=c11 -O2 -Wall -Wextra -pedantic -o casino_game.exe casino_game.c
casino_game.exe
```

## C game controls

- Select menu options by number
- Place bets with number input
- Exit with menu option `6`
