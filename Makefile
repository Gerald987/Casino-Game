CC ?= cc
CFLAGS ?= -std=c11 -O2 -Wall -Wextra -pedantic
TARGET := casino_game
SRC := casino_game.c

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) -o $@ $(SRC)

run: $(TARGET)
	./$(TARGET)

clean:
	rm -f $(TARGET)
