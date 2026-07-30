#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct {
  int rank;
  int suit;
} Card;

#define MAX_BLACKJACK_CARDS 16
#define ROULETTE_EXACT_PAYOUT_MULTIPLIER 36 /* 35:1 winnings + original bet */
#define PROMPT_BUFFER_SIZE 96
#define RANK_ARRAY_SIZE 15
#define SUIT_ARRAY_SIZE 4
#define BLACKJACK_CARD_RANKS 13
#define ROULETTE_SLOTS 37
#define SLOT_SYMBOL_COUNT 4
#define BAR_DRINK_COUNT 8

enum {
  HAND_HIGH_CARD = 0,
  HAND_PAIR = 1,
  HAND_TWO_PAIR = 2,
  HAND_THREE_KIND = 3,
  HAND_STRAIGHT = 4,
  HAND_FLUSH = 5,
  HAND_FULL_HOUSE = 6,
  HAND_FOUR_KIND = 7,
  HAND_STRAIGHT_FLUSH = 8
};

static const char *RANK_NAMES[] = {
  "", "", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"
};
static const char *SUIT_NAMES[] = {"H", "D", "C", "S"};
static const char *BAR_DRINKS[] = {
  "Lucky Lantern", "Neon Clover", "Golden Fizz", "Seven Star Sour",
  "Dealer's Twist", "Moonlit Tonic", "Emerald Rush", "House Edge Cooler"
};
static const char *NPC_NAMES[] = {"Maya", "Rico", "Skye", "Juno", "Vince", "Nina", "Axel", "Iris"};
_Static_assert(BAR_DRINK_COUNT == (int)(sizeof(BAR_DRINKS) / sizeof(BAR_DRINKS[0])),
  "BAR_DRINK_COUNT must match BAR_DRINKS length");

static int uniform_random(int upper_bound) {
  if (upper_bound <= 1) return 0;
  int limit = RAND_MAX - (RAND_MAX % upper_bound);
  int value;
  do {
    value = rand();
  } while (value >= limit);
  return value % upper_bound;
}

static void clear_input(void) {
  int c;
  while ((c = getchar()) != '\n' && c != EOF) {}
}

static int read_int(const char *prompt, int min, int max) {
  int value;
  while (1) {
    printf("%s", prompt);
    if (scanf("%d", &value) == 1 && value >= min && value <= max) {
      clear_input();
      return value;
    }
    printf("Invalid input. Enter a number from %d to %d.\n", min, max);
    clear_input();
  }
}

static int read_bet(int balance) {
  char prompt[PROMPT_BUFFER_SIZE];
  snprintf(prompt, sizeof(prompt), "Enter bet (1-%d): ", balance);
  return read_int(prompt, 1, balance);
}

static int draw_blackjack_card_value(void) {
  int r = uniform_random(BLACKJACK_CARD_RANKS) + 1;
  if (r == 1) return 11;
  if (r >= 10) return 10;
  return r;
}

static int is_red_roulette_number(int number) {
  static const int red_numbers[] = {
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19,
    21, 23, 25, 27, 30, 32, 34, 36
  };
  if (number <= 0 || number > 36) return 0;
  for (size_t i = 0; i < sizeof(red_numbers) / sizeof(red_numbers[0]); i++) {
    if (red_numbers[i] == number) return 1;
  }
  return 0;
}

static int score_blackjack_hand(const int *cards, int count) {
  int total = 0;
  int aces = 0;
  for (int i = 0; i < count; i++) {
    total += cards[i];
    if (cards[i] == 11) aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

/* ── Coin Flip ─────────────────────────────────────────────────────── */
static void play_coin_flip(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  int choice = read_int("Pick: 1) Heads  2) Tails\nSelect: ", 1, 2);
  *balance -= bet;

  int result = uniform_random(2); /* 0 = heads, 1 = tails */
  const char *result_str = result == 0 ? "Heads" : "Tails";
  int won = (result == 0 && choice == 1) || (result == 1 && choice == 2);

  if (won) {
    int payout = bet * 2;
    *balance += payout;
    printf("Coin shows %s. You win %d tokens.\n", result_str, bet);
  } else {
    printf("Coin shows %s. You lost %d tokens.\n", result_str, bet);
  }
}

/* ── Baccarat ───────────────────────────────────────────────────────── */
static int baccarat_card_value(int rank) {
  if (rank == 1) return 1;         /* Ace */
  if (rank >= 10 && rank <= 13) return 0; /* 10, J, Q, K */
  return rank;                     /* 2-9 */
}

static int baccarat_total(const int *cards, int count) {
  int sum = 0;
  for (int i = 0; i < count; i++) {
    sum += baccarat_card_value(cards[i]);
  }
  return sum % 10;
}

static void play_baccarat(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  int choice = read_int(
    "Bet on: 1) Player (1:1)  2) Banker (0.95:1)  3) Tie (8:1)\nSelect: ",
    1, 3
  );
  *balance -= bet;

  /* Deal 2 cards each (rank 1-13, Ace=1, 2-10, J=11, Q=12, K=13) */
  int player_cards[4] = {0}, banker_cards[4] = {0};
  int player_count = 2, banker_count = 2;
  player_cards[0] = uniform_random(13) + 1;
  player_cards[1] = uniform_random(13) + 1;
  banker_cards[0] = uniform_random(13) + 1;
  banker_cards[1] = uniform_random(13) + 1;

  int player_natural = baccarat_total(player_cards, 2) >= 8;
  int banker_natural = baccarat_total(banker_cards, 2) >= 8;

  if (!player_natural && !banker_natural) {
    /* Player draws if total <= 5 */
    int player_third_value = -1;
    if (baccarat_total(player_cards, player_count) <= 5) {
      player_cards[player_count++] = uniform_random(13) + 1;
      player_third_value = baccarat_card_value(player_cards[player_count - 1]);
    }

    /* Banker draw: proper third-card rules */
    int banker_total = baccarat_total(banker_cards, banker_count);
    int banker_draws = 0;
    if (player_third_value < 0) {
      /* Player stood — banker draws on <= 5 */
      banker_draws = banker_total <= 5;
    } else {
      switch (banker_total) {
        case 0: case 1: case 2:
          banker_draws = 1;
          break;
        case 3:
          banker_draws = player_third_value != 8;
          break;
        case 4:
          banker_draws = player_third_value >= 2 && player_third_value <= 7;
          break;
        case 5:
          banker_draws = player_third_value >= 4 && player_third_value <= 7;
          break;
        case 6:
          banker_draws = player_third_value == 6 || player_third_value == 7;
          break;
        default:
          banker_draws = 0;
      }
    }
    if (banker_draws) {
      banker_cards[banker_count++] = uniform_random(13) + 1;
    }
  }

  int final_player = baccarat_total(player_cards, player_count);
  int final_banker = baccarat_total(banker_cards, banker_count);

  printf("Player: %d  |  Banker: %d\n", final_player, final_banker);

  int outcome = 0; /* 0 = tie, 1 = player, 2 = banker */
  if (final_player > final_banker) outcome = 1;
  else if (final_banker > final_player) outcome = 2;

  if (outcome == 0 && choice == 3) {
    int payout = bet * 9;
    *balance += payout;
    printf("Tie! You win %d tokens.\n", payout - bet);
  } else if (outcome == 0) {
    *balance += bet;
    printf("Tie. Bet returned.\n");
  } else if ((outcome == 1 && choice == 1) || (outcome == 2 && choice == 2)) {
    if (choice == 2) {
      /* Banker: win 0.95:1 */
      int winnings = (bet * 95) / 100;
      *balance += bet + winnings;
      printf("Banker wins. You win %d tokens.\n", winnings);
    } else {
      /* Player: win 1:1 */
      *balance += bet * 2;
      printf("Player wins. You win %d tokens.\n", bet);
    }
  } else {
    const char *winner = outcome == 1 ? "Player" : "Banker";
    printf("%s wins. You lost %d tokens.\n", winner, bet);
  }
}

/* ── Roulette (expanded) ────────────────────────────────────────────── */
static int roulette_column_from_number(int number) {
  if (number < 1 || number > 36) return 0;
  return ((number - 1) % 3) + 1;
}

static void play_roulette(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  int choice = read_int(
    "Choice:\n"
    "  1) Red (1:1)      2) Black (1:1)    3) Odd (1:1)\n"
    "  4) Even (1:1)     5) Low 1-18 (1:1) 6) High 19-36 (1:1)\n"
    "  7) 1st Dozen 1-12 (2:1)   8) 2nd Dozen 13-24 (2:1)   9) 3rd Dozen 25-36 (2:1)\n"
    " 10) Column 1 (2:1)        11) Column 2 (2:1)          12) Column 3 (2:1)\n"
    " 13) Exact Number (35:1)\n"
    "Select: ",
    1,
    13
  );

  int number_choice = -1;
  if (choice == 13) {
    number_choice = read_int("Pick a number (0-36): ", 0, 36);
  }

  *balance -= bet;
  int spin = uniform_random(ROULETTE_SLOTS);
  int is_zero = (spin == 0);
  int is_red = is_red_roulette_number(spin);
  int col = roulette_column_from_number(spin);
  int won = 0;
  int total_multiplier = 0;

  switch (choice) {
    case 1: /* Red */
      won = is_red;
      total_multiplier = 2;
      break;
    case 2: /* Black */
      won = !is_red && !is_zero;
      total_multiplier = 2;
      break;
    case 3: /* Odd */
      won = !is_zero && (spin % 2 == 1);
      total_multiplier = 2;
      break;
    case 4: /* Even */
      won = !is_zero && (spin % 2 == 0);
      total_multiplier = 2;
      break;
    case 5: /* Low 1-18 */
      won = spin >= 1 && spin <= 18;
      total_multiplier = 2;
      break;
    case 6: /* High 19-36 */
      won = spin >= 19 && spin <= 36;
      total_multiplier = 2;
      break;
    case 7: /* 1st Dozen */
      won = spin >= 1 && spin <= 12;
      total_multiplier = 3;
      break;
    case 8: /* 2nd Dozen */
      won = spin >= 13 && spin <= 24;
      total_multiplier = 3;
      break;
    case 9: /* 3rd Dozen */
      won = spin >= 25 && spin <= 36;
      total_multiplier = 3;
      break;
    case 10: /* Column 1 */
      won = col == 1;
      total_multiplier = 3;
      break;
    case 11: /* Column 2 */
      won = col == 2;
      total_multiplier = 3;
      break;
    case 12: /* Column 3 */
      won = col == 3;
      total_multiplier = 3;
      break;
    case 13: /* Exact Number */
      won = spin == number_choice;
      total_multiplier = ROULETTE_EXACT_PAYOUT_MULTIPLIER;
      break;
  }

  if (won) {
    int payout = bet * total_multiplier;
    int net_win = (total_multiplier - 1) * bet;
    *balance += payout;
    printf("Roulette landed on %d. You win %d tokens.\n", spin, net_win);
  } else {
    printf("Roulette landed on %d. You lost %d tokens.\n", spin, bet);
  }
}

/* ── Slots ──────────────────────────────────────────────────────────── */
static char slot_symbol_for_value(int value) {
  switch (value) {
    case 0: return 'C';
    case 1: return 'L';
    case 2: return 'S';
    default: return 'B';
  }
}

static int slot_multiplier_for_value(int value) {
  switch (value) {
    case 0: return 3;
    case 1: return 4;
    case 2: return 8;
    default: return 15;
  }
}

static void play_slots(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  *balance -= bet;

  int reels[3][3];
  for (int r = 0; r < 3; r++) {
    for (int c = 0; c < 3; c++) {
      reels[r][c] = uniform_random(SLOT_SYMBOL_COUNT);
    }
  }

  printf("Slots:\n");
  for (int r = 0; r < 3; r++) {
    printf(" %c %c %c\n",
      slot_symbol_for_value(reels[r][0]),
      slot_symbol_for_value(reels[r][1]),
      slot_symbol_for_value(reels[r][2]));
  }

  int lines = 0;
  int multiplier_total = 0;
  for (int r = 0; r < 3; r++) {
    if (reels[r][0] == reels[r][1] && reels[r][1] == reels[r][2]) {
      lines++;
      multiplier_total += slot_multiplier_for_value(reels[r][0]);
    }
  }
  for (int c = 0; c < 3; c++) {
    if (reels[0][c] == reels[1][c] && reels[1][c] == reels[2][c]) {
      lines++;
      multiplier_total += slot_multiplier_for_value(reels[0][c]);
    }
  }
  if (reels[0][0] == reels[1][1] && reels[1][1] == reels[2][2]) {
    lines++;
    multiplier_total += slot_multiplier_for_value(reels[0][0]);
  }
  if (reels[0][2] == reels[1][1] && reels[1][1] == reels[2][0]) {
    lines++;
    multiplier_total += slot_multiplier_for_value(reels[0][2]);
  }

  if (lines > 0) {
    int winnings = bet * multiplier_total;
    *balance += bet + winnings;
    printf("Winning lines: %d. You win %d tokens.\n", lines, winnings);
  } else {
    printf("No winning lines. You lost %d tokens.\n", bet);
  }
}

/* ── Blackjack ──────────────────────────────────────────────────────── */
static void play_blackjack(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  *balance -= bet;

  int player_values[MAX_BLACKJACK_CARDS] = {0};
  int dealer_values[MAX_BLACKJACK_CARDS] = {0};
  int player_count = 2;
  int dealer_count = 2;
  player_values[0] = draw_blackjack_card_value();
  player_values[1] = draw_blackjack_card_value();
  dealer_values[0] = draw_blackjack_card_value();
  dealer_values[1] = draw_blackjack_card_value();

  /* Check natural blackjack */
  int player_total_init = score_blackjack_hand(player_values, 2);
  int dealer_total_init = score_blackjack_hand(dealer_values, 2);
  int player_natural = (player_count == 2 && player_total_init == 21);
  int dealer_natural = (dealer_count == 2 && dealer_total_init == 21);

  if (player_natural || dealer_natural) {
    if (player_natural && dealer_natural) {
      *balance += bet;
      printf("Both have blackjack. Push.\n");
    } else if (player_natural) {
      int payout = (bet * 5) / 2; /* 2.5x */
      *balance += payout;
      printf("Blackjack! You win %d tokens.\n", payout - bet);
    } else {
      printf("Dealer has blackjack. You lost %d tokens.\n", bet);
    }
    return;
  }

  while (1) {
    int player_total = score_blackjack_hand(player_values, player_count);
    printf("Dealer shows: %d\n", dealer_values[0]);
    printf("Your total: %d\n", player_total);
    if (player_total > 21) {
      printf("Bust. You lost %d tokens.\n", bet);
      return;
    }
    int action = read_int("Action: 1) Hit 2) Stand\nSelect: ", 1, 2);
    if (action == 2) break;
    if (player_count >= MAX_BLACKJACK_CARDS) {
      printf("Maximum hand size reached. Standing automatically.\n");
      break;
    }
    player_values[player_count++] = draw_blackjack_card_value();
  }

  int dealer_total = score_blackjack_hand(dealer_values, dealer_count);
  while (dealer_total < 17) {
    if (dealer_count >= MAX_BLACKJACK_CARDS) {
      break;
    }
    dealer_values[dealer_count++] = draw_blackjack_card_value();
    dealer_total = score_blackjack_hand(dealer_values, dealer_count);
  }
  int player_total = score_blackjack_hand(player_values, player_count);

  printf("Dealer total: %d\n", dealer_total);
  printf("Your total: %d\n", player_total);

  if (dealer_total > 21 || player_total > dealer_total) {
    int payout = bet * 2;
    int net_win = bet;
    *balance += payout;
    printf("You win %d tokens.\n", net_win);
  } else if (player_total == dealer_total) {
    *balance += bet;
    printf("Push. Bet returned.\n");
  } else {
    printf("Dealer wins. You lost %d tokens.\n", bet);
  }
}

/* ── Poker (expanded: 3 named NPCs) ─────────────────────────────────── */
static void init_deck(Card *deck) {
  int idx = 0;
  for (int suit = 0; suit < 4; suit++) {
    for (int rank = 2; rank <= 14; rank++) {
      deck[idx].rank = rank;
      deck[idx].suit = suit;
      idx++;
    }
  }
}

static void shuffle_deck(Card *deck, int n) {
  for (int i = n - 1; i > 0; i--) {
    int j = uniform_random(i + 1);
    Card tmp = deck[i];
    deck[i] = deck[j];
    deck[j] = tmp;
  }
}

static void print_card(Card c) {
  printf("%s%s", RANK_NAMES[c.rank], SUIT_NAMES[c.suit]);
}

static void print_hand(const Card *cards, int n) {
  for (int i = 0; i < n; i++) {
    print_card(cards[i]);
    if (i < n - 1) printf(" ");
  }
}

static int evaluate_five_card_hand(const Card *h) {
  int rank_counts[RANK_ARRAY_SIZE] = {0};
  int suit_counts[SUIT_ARRAY_SIZE] = {0};
  int ranks[5];

  for (int i = 0; i < 5; i++) {
    rank_counts[h[i].rank]++;
    suit_counts[h[i].suit]++;
    ranks[i] = h[i].rank;
  }

  for (int i = 0; i < 5; i++) {
    for (int j = i + 1; j < 5; j++) {
      if (ranks[j] < ranks[i]) {
        int tmp = ranks[i];
        ranks[i] = ranks[j];
        ranks[j] = tmp;
      }
    }
  }

  int flush = 0;
  for (int s = 0; s < 4; s++) {
    if (suit_counts[s] == 5) {
      flush = 1;
      break;
    }
  }

  int straight = 1;
  for (int i = 1; i < 5; i++) {
    if (ranks[i] != ranks[i - 1] + 1) {
      straight = 0;
      break;
    }
  }
  if (!straight &&
      ranks[0] == 2 && ranks[1] == 3 && ranks[2] == 4 && ranks[3] == 5 && ranks[4] == 14) {
    straight = 1;
  }

  int pairs = 0;
  int threes = 0;
  int fours = 0;
  for (int r = 2; r <= 14; r++) {
    if (rank_counts[r] == 2) pairs++;
    else if (rank_counts[r] == 3) threes++;
    else if (rank_counts[r] == 4) fours++;
  }

  if (straight && flush) return HAND_STRAIGHT_FLUSH;
  if (fours) return HAND_FOUR_KIND;
  if (threes && pairs) return HAND_FULL_HOUSE;
  if (flush) return HAND_FLUSH;
  if (straight) return HAND_STRAIGHT;
  if (threes) return HAND_THREE_KIND;
  if (pairs == 2) return HAND_TWO_PAIR;
  if (pairs == 1) return HAND_PAIR;
  return HAND_HIGH_CARD;
}

static const char *hand_name(int hand_rank) {
  switch (hand_rank) {
    case HAND_PAIR: return "Pair";
    case HAND_TWO_PAIR: return "Two Pair";
    case HAND_THREE_KIND: return "Three of a Kind";
    case HAND_STRAIGHT: return "Straight";
    case HAND_FLUSH: return "Flush";
    case HAND_FULL_HOUSE: return "Full House";
    case HAND_FOUR_KIND: return "Four of a Kind";
    case HAND_STRAIGHT_FLUSH: return "Straight Flush";
    default: return "High Card";
  }
}

static void shuffle_npc_names(char names[3][16]) {
  /* Pick 3 random names from the NPC_NAMES pool */
  int indices[3];
  int pool[8] = {0, 1, 2, 3, 4, 5, 6, 7};
  int remaining = 8;
  for (int i = 0; i < 3; i++) {
    int pick = uniform_random(remaining);
    indices[i] = pool[pick];
    pool[pick] = pool[--remaining];
  }
  for (int i = 0; i < 3; i++) {
    snprintf(names[i], 16, "%s", NPC_NAMES[indices[i]]);
  }
}

static void play_poker(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  *balance -= bet;

  Card deck[52];
  init_deck(deck);
  shuffle_deck(deck, 52);

  Card player[5];
  Card npc1[5], npc2[5], npc3[5];
  char npc_names[3][16];
  shuffle_npc_names(npc_names);

  for (int i = 0; i < 5; i++) {
    player[i] = deck[i];
    npc1[i] = deck[i + 5];
    npc2[i] = deck[i + 10];
    npc3[i] = deck[i + 15];
  }

  int player_rank = evaluate_five_card_hand(player);
  int npc1_rank = evaluate_five_card_hand(npc1);
  int npc2_rank = evaluate_five_card_hand(npc2);
  int npc3_rank = evaluate_five_card_hand(npc3);

  printf("Your hand: ");
  print_hand(player, 5);
  printf(" (%s)\n", hand_name(player_rank));
  printf("%s: %s\n", npc_names[0], hand_name(npc1_rank));
  printf("%s: %s\n", npc_names[1], hand_name(npc2_rank));
  printf("%s: %s\n", npc_names[2], hand_name(npc3_rank));

  int best_npc = npc1_rank;
  if (npc2_rank > best_npc) best_npc = npc2_rank;
  if (npc3_rank > best_npc) best_npc = npc3_rank;

  if (player_rank > best_npc) {
    int payout = bet * 2;
    int net_win = bet;
    *balance += payout;
    printf("You win %d tokens.\n", net_win);
  } else if (player_rank == best_npc) {
    *balance += bet;
    printf("Tie. Bet returned.\n");
  } else {
    printf("NPCs win. You lost %d tokens.\n", bet);
  }
}

/* ── Bar ────────────────────────────────────────────────────────────── */
static void visit_bar(void) {
  int idx = uniform_random(BAR_DRINK_COUNT);
  printf("Bartender serves: %s (free)\n", BAR_DRINKS[idx]);
}

/* ── Floor visits (text descriptions) ──────────────────────────────────── */
static void visit_floor7(void) {
  printf("\n╔══════════════════════════════════╗\n");
  printf("║    Floor 7 — Spa & Pool         ║\n");
  printf("╚══════════════════════════════════╝\n");
  printf("A heated indoor pool stretches across the floor.\n");
  printf("Steam rises from a hot tub as guests relax poolside.\n");
  printf("Three private changing rooms line the left wall.\n");
  printf("The air smells of chlorine and eucalyptus.\n");
}

static void visit_floor12(void) {
  printf("\n╔══════════════════════════════════╗\n");
  printf("║    Floor 12 — Restaurant        ║\n");
  printf("╚══════════════════════════════════╝\n");
  printf("Skyline Terrace seats guests at four candle-lit tables.\n");
  printf("The bar counter gleams under warm amber light.\n");
  printf("Through the kitchen window, chefs prep the tasting menu.\n");
  printf("Live jazz drifts from a grand piano in the corner.\n");
}

static void visit_floor24(void) {
  printf("\n╔══════════════════════════════════╗\n");
  printf("║    Floor 24 — Penthouse Suite   ║\n");
  printf("╚══════════════════════════════════╝\n");
  printf("The presidential suite commands a 360-degree view.\n");
  printf("A king bed draped in silk faces floor-to-ceiling windows.\n");
  printf("The marble bathroom features a rain shower and deep soak tub.\n");
  printf("Through glass doors, a private balcony overlooks the city.\n");
}

/* ── Main ───────────────────────────────────────────────────────────── */
int main(void) {
  srand((unsigned int)time(NULL));
  int balance = 1000;

  printf("=== Neon Floor Casino (C Edition) ===\n");
  printf("Start in the Grand Neon Hotel lobby.\n");
  printf("Take the lifts to visit the floors, or step onto the casino floor.\n");

  while (1) {
    printf("\nBalance: %d WIS Tokens\n", balance);
    printf("── CASINO GAMES ──\n");
    printf("1) Roulette\n");
    printf("2) Slots\n");
    printf("3) Blackjack\n");
    printf("4) Poker (vs 3 NPCs)\n");
    printf("5) Coin Flip\n");
    printf("6) Baccarat\n");
    printf("7) Center Bar (Free Drink)\n");
    printf("── HOTEL FLOORS ──\n");
    printf("8) Floor 7 — Spa & Pool\n");
    printf("9) Floor 12 — Restaurant\n");
    printf("10) Floor 24 — Penthouse Suite\n");
    printf("── ──\n");
    printf("11) Exit\n");
    int choice = read_int("Select: ", 1, 11);

    if (choice == 11) {
      printf("Thanks for playing.\n");
      break;
    }
    switch (choice) {
      case 1: play_roulette(&balance); break;
      case 2: play_slots(&balance); break;
      case 3: play_blackjack(&balance); break;
      case 4: play_poker(&balance); break;
      case 5: play_coin_flip(&balance); break;
      case 6: play_baccarat(&balance); break;
      case 7: visit_bar(); break;
      case 8: visit_floor7(); break;
      case 9: visit_floor12(); break;
      case 10: visit_floor24(); break;
      default: break;
    }
  }
  return 0;
}
