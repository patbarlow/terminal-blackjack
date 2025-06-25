# Terminal Blackjack

A terminal-based Blackjack game built with Node.js, featuring ASCII card graphics and a full betting system.

## Features

- Full Blackjack rules with dealer AI
- ASCII art for cards (♥ ♦ ♣ ♠)
- Betting system: start with $100 and track your bankroll
- Clean interface with screen clearing
- 3:2 payout on natural blackjack
- Automatic ace handling (1 or 11)
- No external dependencies (uses only Node.js built-in modules)

## How to Play

### Prerequisites

- Node.js (version 12.0.0 or higher)
- Terminal or Command Prompt

### Installation

```bash
git clone https://github.com/patbarlow/terminal-blackjack.git
cd terminal-blackjack
```

### Running the Game

```bash
node blackjack.js
```

Or if you're using npm scripts:

```bash
npm start
```

### Gameplay

1. Start with $100 balance
2. Place your bet (minimum $1, maximum your current balance)
3. Receive 2 cards (dealer gets 2, one face-down)
4. Choose to Hit (h) or Stand (s)
5. Win by:
   - Getting closer to 21 than the dealer without busting
   - Dealer busts
   - Hitting a blackjack (21 on first 2 cards) for a 3:2 payout

### Controls

- **h** – Hit (take another card)
- **s** – Stand (keep current hand)
- **y/n** – Play another round
- **Enter** – Continue/confirm

### Rules

- **Blackjack**: 21 on first 2 cards (pays 3:2)
- **Bust**: Hand value over 21 (automatic loss)
- **Push**: Tie with dealer (bet returned)
- **Dealer rules**: Hits on 16 or less, stands on 17 or more
- **Card Values**:
  - Ace = 1 or 11 (automatically calculated for best hand)
  - Jack/Queen/King = 10
  - 2–10 = face value

## Game Display

```
============================================================
                    BLACKJACK GAME
============================================================

DEALER'S HAND:
Value: ?

┌─────────┐ ┌─────────┐
│K        │ │░░░░░░░░░│
│         │ │░░░░░░░░░│
│    ♠    │ │░░░░░░░░░│
│         │ │░░░░░░░░░│
│        K│ │░░░░░░░░░│
└─────────┘ └─────────┘

------------------------------------------------------------

YOUR HAND:
Value: 20

┌─────────┐ ┌─────────┐
│Q        │ │10       │
│         │ │         │
│    ♥    │ │    ♦    │
│         │ │         │
│        Q│ │       10│
└─────────┘ └─────────┘

Current Bet: $10
Balance: $90
============================================================
```
