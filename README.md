# Terminal Blackjack

A terminal-based Blackjack game in Python with simple ASCII card graphics.

## Features
- Full Blackjack rules with dealer AI
- ASCII art for cards (♥ ♦ ♣ ♠)
- Betting system: start with $100 and track your bankroll
- Clean interface with screen clearing
- 3:2 payout on natural blackjack
- Automatic ace handling (1 or 11)

## How to Play

### Prerequisites
- Python 3.x
- Terminal or Command Prompt

### Installation

```bash
git clone https://github.com/patbarlow/terminal-blackjack.git
cd terminal-blackjack
```

### Running the Game

```bash
python3 blackjack.py
```

### Gameplay
1. Start with $100 balance
2. Place your bet (minimum $1)
3. Receive 2 cards (dealer gets 2, one face-down)
4. Choose to Hit (h) or Stand (s)
5. Win by:
   - Getting closer to 21 than the dealer without busting
   - Dealer busts
   - Hitting a blackjack (21 on first 2 cards) for a 3:2 payout

### Controls
- h – Hit
- s – Stand
- y / n – Play another round

### Rules
- Blackjack: 21 on first 2 cards (3:2 payout)
- Bust: Hand value over 21 (loss)
- Dealer: Hits on 16, stands on 17
- Card Values:
   - A = 1 or 11
	- J/Q/K = 10
	- 2–10 = face value
