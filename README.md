# Terminal Blackjack

A classic terminal-based Blackjack game written in Python with beautiful ASCII card art.

## Features

- **Full Blackjack Rules**: Classic 21 gameplay with proper dealer AI
- **ASCII Card Art**: Beautiful terminal graphics with suit symbols (♥♦♣♠)
- **Betting System**: Start with $100 and manage your bankroll
- **Clean Interface**: Screen clearing for smooth gameplay experience
- **Blackjack Payouts**: 3:2 payout for natural blackjack
- **Smart Ace Handling**: Automatic ace value adjustment (1 or 11)

## How to Play

### Prerequisites
- Python 3.x installed on your system
- Terminal/Command Prompt

### Installation & Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/terminal-blackjack.git
   cd terminal-blackjack
   ```

2. **Run the game:**
   ```bash
   python3 blackjack.py
   ```

### Gameplay

1. **Start** with $100 balance
2. **Place your bet** (minimum $1)
3. **Receive 2 cards** (dealer gets 2, one face-down)
4. **Hit or Stand** to get closer to 21 without going over
5. **Win conditions:**
   - Get closer to 21 than dealer without busting
   - Dealer busts (goes over 21)
   - Get blackjack (21 with first 2 cards) for 3:2 payout

### Controls
- `h` - Hit (take another card)
- `s` - Stand (keep current hand)
- `y/n` - Play another round

## Game Rules

- **Blackjack**: 21 with first 2 cards (pays 3:2)
- **Bust**: Hand value over 21 (automatic loss)
- **Dealer**: Must hit on 16, stands on 17
- **Card Values**: A=1/11, Face cards=10, Numbers=face value