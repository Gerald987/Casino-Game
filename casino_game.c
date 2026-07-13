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
  char prompt[96];
  snprintf(prompt, sizeof(prompt), "Enter bet (1-%d): ", balance);
  return read_int(prompt, 1, balance);
}

static int random_rank_for_blackjack(void) {
  int r = (rand() % 13) + 1;
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

static void play_roulette(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  int choice = read_int(
    "Choice: 1) Red 2) Black 3) Odd 4) Even 5) Exact Number\nSelect: ",
    1,
    5
  );

  int number_choice = -1;
  if (choice == 5) {
    number_choice = read_int("Pick a number (0-36): ", 0, 36);
  }

  *balance -= bet;
  int spin = rand() % 37;
  int is_zero = (spin == 0);
  int is_red = is_red_roulette_number(spin);
  int won = 0;
  int payout_multiplier = 0;

  if (choice == 1 && is_red) {
    won = 1;
    payout_multiplier = 2;
  } else if (choice == 2 && !is_red && !is_zero) {
    won = 1;
    payout_multiplier = 2;
  } else if (choice == 3 && !is_zero && (spin % 2 == 1)) {
    won = 1;
    payout_multiplier = 2;
  } else if (choice == 4 && !is_zero && (spin % 2 == 0)) {
    won = 1;
    payout_multiplier = 2;
  } else if (choice == 5 && spin == number_choice) {
    won = 1;
    payout_multiplier = ROULETTE_EXACT_PAYOUT_MULTIPLIER;
  }

  if (won) {
    int payout = bet * payout_multiplier;
    int net_win = (payout_multiplier - 1) * bet;
    *balance += payout;
    printf("Roulette landed on %d. You win %d tokens.\n", spin, net_win);
  } else {
    printf("Roulette landed on %d. You lost %d tokens.\n", spin, bet);
  }
}

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
      reels[r][c] = rand() % 4;
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

static void play_blackjack(int *balance) {
  if (*balance <= 0) {
    printf("You are out of tokens.\n");
    return;
  }
  int bet = read_bet(*balance);
  *balance -= bet;

  int player_cards[MAX_BLACKJACK_CARDS] = {0};
  int dealer_cards[MAX_BLACKJACK_CARDS] = {0};
  int player_count = 2;
  int dealer_count = 2;
  player_cards[0] = random_rank_for_blackjack();
  player_cards[1] = random_rank_for_blackjack();
  dealer_cards[0] = random_rank_for_blackjack();
  dealer_cards[1] = random_rank_for_blackjack();

  while (1) {
    int player_total = score_blackjack_hand(player_cards, player_count);
    printf("Dealer shows: %d\n", dealer_cards[0]);
    printf("Your total: %d\n", player_total);
    if (player_total > 21) {
      printf("Bust. You lost %d tokens.\n", bet);
      return;
    }
    int action = read_int("Action: 1) Hit 2) Stand\nSelect: ", 1, 2);
    if (action == 2) break;
    player_cards[player_count++] = random_rank_for_blackjack();
  }

  int dealer_total = score_blackjack_hand(dealer_cards, dealer_count);
  while (dealer_total < 17) {
    dealer_cards[dealer_count++] = random_rank_for_blackjack();
    dealer_total = score_blackjack_hand(dealer_cards, dealer_count);
  }
  int player_total = score_blackjack_hand(player_cards, player_count);

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
    int j = rand() % (i + 1);
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
  int rank_counts[15] = {0};
  int suit_counts[4] = {0};
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
  Card npc1[5];
  Card npc2[5];
  Card npc3[5];

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

  int best_npc = npc1_rank;
  if (npc2_rank > best_npc) best_npc = npc2_rank;
  if (npc3_rank > best_npc) best_npc = npc3_rank;

  printf("Your hand: ");
  print_hand(player, 5);
  printf(" (%s)\n", hand_name(player_rank));
  printf("NPC best hand rank: %s\n", hand_name(best_npc));

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

static void visit_bar(void) {
  int idx = rand() % (int)(sizeof(BAR_DRINKS) / sizeof(BAR_DRINKS[0]));
  printf("Bartender serves: %s (free)\n", BAR_DRINKS[idx]);
}

int main(void) {
  srand((unsigned int)time(NULL));
  int balance = 1000;

  printf("=== Neon Floor Casino (C Edition) ===\n");
  printf("Use menu numbers to pick a table.\n");

  while (1) {
    printf("\nBalance: %d WIS Tokens\n", balance);
    printf("1) Roulette\n");
    printf("2) Slots\n");
    printf("3) Blackjack\n");
    printf("4) Poker\n");
    printf("5) Center Bar (Free Drink)\n");
    printf("6) Exit\n");
    int choice = read_int("Select: ", 1, 6);

    if (choice == 6) {
      printf("Thanks for playing.\n");
      break;
    }
    switch (choice) {
      case 1:
        play_roulette(&balance);
        break;
      case 2:
        play_slots(&balance);
        break;
      case 3:
        play_blackjack(&balance);
        break;
      case 4:
        play_poker(&balance);
        break;
      case 5:
        visit_bar();
        break;
      default:
        break;
    }
  }
  return 0;
}
