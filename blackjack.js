const readline = require('readline');
const { exec } = require('child_process');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Promisify readline question
const question = (prompt) => {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
};

class Card {
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
        this.value = this.calculateValue();
    }

    calculateValue() {
        if (['J', 'Q', 'K'].includes(this.rank)) {
            return 10;
        } else if (this.rank === 'A') {
            return 11; // Ace value will be adjusted in hand calculation
        } else {
            return parseInt(this.rank);
        }
    }

    getAsciiArt() {
        const suitSymbols = {
            'Hearts': '♥',
            'Diamonds': '♦',
            'Clubs': '♣',
            'Spades': '♠'
        };
        const symbol = suitSymbols[this.suit];
        
        // Format rank for display
        const displayRank = this.rank.length === 1 ? this.rank : this.rank;
        
        return [
            "┌─────────┐",
            `│${displayRank.padEnd(2)}       │`,
            "│         │",
            `│    ${symbol}    │`,
            "│         │",
            `│       ${displayRank.padStart(2)}│`,
            "└─────────┘"
        ];
    }

    static getCardBack() {
        return [
            "┌─────────┐",
            "│◇◆◇◆◇◆◇◆◇│",
            "│◆◇◆◇◆◇◆◇◆│",
            "│◇◆◇◆◇◆◇◆◇│",
            "│◆◇◆◇◆◇◆◇◆│",
            "│◇◆◇◆◇◆◇◆◇│",
            "└─────────┘"
        ];
    }
}

class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        this.cards = [];
        for (const suit of suits) {
            for (const rank of ranks) {
                this.cards.push(new Card(suit, rank));
            }
        }
    }

    shuffle() {
        // Fisher-Yates shuffle
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    dealCard() {
        return this.cards.length > 0 ? this.cards.pop() : null;
    }
}

class Player {
    constructor(startingBalance = 100) {
        this.balance = startingBalance;
        this.hand = [];
        this.currentBet = 0;
    }

    placeBet(amount) {
        if (amount <= this.balance) {
            this.currentBet = amount;
            this.balance -= amount;
            return true;
        }
        return false;
    }

    addCard(card) {
        this.hand.push(card);
    }

    getHandValue() {
        let value = 0;
        let aces = 0;
        
        for (const card of this.hand) {
            if (card.rank === 'A') {
                aces++;
                value += 11;
            } else {
                value += card.value;
            }
        }
        
        // Adjust for Aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }

    isBust() {
        return this.getHandValue() > 21;
    }

    hasBlackjack() {
        return this.hand.length === 2 && this.getHandValue() === 21;
    }

    clearHand() {
        this.hand = [];
        this.currentBet = 0;
    }
}

class Game {
    constructor() {
        this.player = new Player();
        this.dealer = new Player();
        this.deck = new Deck();
        this.dealerHiddenCard = true;
    }

    clearScreen() {
        console.clear();
    }

    displayCardsHorizontally(cards, showAll = true) {
        if (cards.length === 0) {
            return ["No cards"];
        }
        
        // Get ASCII art for each card
        const cardArts = [];
        for (let i = 0; i < cards.length; i++) {
            if (!showAll && i === 1) {  // Hide dealer's second card
                cardArts.push(Card.getCardBack());
            } else {
                cardArts.push(cards[i].getAsciiArt());
            }
        }
        
        // Combine cards horizontally
        const combinedLines = [];
        for (let lineIndex = 0; lineIndex < 7; lineIndex++) {  // Each card has 7 lines
            let line = "";
            for (const cardArt of cardArts) {
                line += cardArt[lineIndex] + " ";
            }
            combinedLines.push(line.trimEnd());
        }
        
        return combinedLines;
    }

    displayGameState() {
        this.clearScreen();
        
        console.log(" ________  ___       ________  ________  ___  __          ___  ________  ________  ___  __       ");
        console.log("|\   __  \|\  \     |\   __  \|\   ____\|\  \|\  \       |\  \|\   __  \|\   ____\|\  \|\  \     ");
        console.log("\ \  \|\ /\ \  \    \ \  \|\  \ \  \___|\ \  \/  /|_     \ \  \ \  \|\  \ \  \___|\ \  \/  /|_   ");
        console.log(" \ \   __  \ \  \    \ \   __  \ \  \    \ \   ___  \  __ \ \  \ \   __  \ \  \    \ \   ___  \  ");
        console.log("  \ \  \|\  \ \  \____\ \  \ \  \ \  \____\ \  \\ \  \|\  \\_\  \ \  \ \  \ \  \____\ \  \\ \  \ ");
        console.log("   \ \_______\ \_______\ \__\ \__\ \_______\ \__\\ \__\ \________\ \__\ \__\ \_______\ \__\\ \__\");
        console.log("    \|_______|\|_______|\|__|\|__|\|_______|\|__| \|__|\|________|\|__|\|__|\|_______|\|__| \|__|");
        console.log("                                                                                                 ");
        console.log();
        
        // Dealer's area
        console.log("DEALER'S HAND:");
        const dealerValue = this.dealerHiddenCard ? "?" : this.dealer.getHandValue();
        console.log(`Value: ${dealerValue}`);
        console.log();
        
        const dealerCards = this.displayCardsHorizontally(
            this.dealer.hand,
            !this.dealerHiddenCard
        );
        for (const line of dealerCards) {
            console.log(line);
        }
        
        console.log();
        console.log("-".repeat(100));
        console.log();
        
        // Player's area
        console.log("YOUR HAND:");
        console.log(`Value: ${this.player.getHandValue()}`);
        console.log();
        
        const playerCards = this.displayCardsHorizontally(this.player.hand);
        for (const line of playerCards) {
            console.log(line);
        }
        
        console.log();
        console.log(`Current Bet: $${this.player.currentBet}`);
        console.log(`Balance: $${this.player.balance}`);
        console.log("=".repeat(100));
    }

    async getBet() {
        while (true) {
            console.log(`\nYour balance: $${this.player.balance}`);
            if (this.player.balance <= 0) {
                console.log("\n💸 You're out of money! Game over.");
                console.log("Thanks for playing!");
                return false;
            }
            
            const input = await question(`Enter your bet (1-${this.player.balance}): $`);
            const bet = parseInt(input);
            
            if (!isNaN(bet) && bet >= 1 && bet <= this.player.balance) {
                if (this.player.placeBet(bet)) {
                    return true;
                }
            } else {
                console.log(`Please enter a bet between $1 and $${this.player.balance}`);
            }
        }
    }

    dealInitialCards() {
        // Deal two cards to each
        for (let i = 0; i < 2; i++) {
            this.player.addCard(this.deck.dealCard());
            this.dealer.addCard(this.deck.dealCard());
        }
    }

    async playerTurn() {
        while (true) {
            this.displayGameState();
            
            if (this.player.isBust()) {
                console.log("\n💥 BUST! You exceeded 21.");
                await this.sleep(2000);
                return;
            }
            
            if (this.player.hasBlackjack() && this.player.hand.length === 2) {
                console.log("\n🎉 BLACKJACK! You got 21!");
                await this.sleep(2000);
                return;
            }
            
            const choice = await question("\nDo you want to (h)it or (s)tand? ");
            
            if (choice.toLowerCase() === 'h') {
                this.player.addCard(this.deck.dealCard());
            } else if (choice.toLowerCase() === 's') {
                return;
            } else {
                console.log("Please enter 'h' for hit or 's' for stand.");
            }
        }
    }

    async dealerTurn() {
        this.dealerHiddenCard = false;
        
        while (this.dealer.getHandValue() < 17) {
            this.dealer.addCard(this.deck.dealCard());
            this.displayGameState();
            console.log("\nDealer hits...");
            await this.sleep(1500);
        }
    }

    async determineWinner() {
        this.displayGameState();
        
        const playerValue = this.player.getHandValue();
        const dealerValue = this.dealer.getHandValue();
        
        console.log("\n" + "=".repeat(40));
        console.log("           ROUND RESULTS");
        console.log("=".repeat(40));
        
        if (this.player.isBust()) {
            console.log("You BUSTED! Dealer wins. 💸");
            // Player already lost bet
        } else if (this.dealer.isBust()) {
            console.log("Dealer BUSTED! You win! 💰");
            this.player.balance += this.player.currentBet * 2;
        } else if (this.player.hasBlackjack() && !this.dealer.hasBlackjack()) {
            console.log("BLACKJACK! You win! 🎉");
            // Blackjack pays 3:2
            this.player.balance += Math.floor(this.player.currentBet * 2.5);
        } else if (this.dealer.hasBlackjack() && !this.player.hasBlackjack()) {
            console.log("Dealer has BLACKJACK! Dealer wins. 😔");
            // Player already lost bet
        } else if (playerValue > dealerValue) {
            console.log("You win! 🎊");
            this.player.balance += this.player.currentBet * 2;
        } else if (dealerValue > playerValue) {
            console.log("Dealer wins. 😞");
            // Player already lost bet
        } else {
            console.log("It's a tie! Push. 🤝");
            this.player.balance += this.player.currentBet;  // Return bet
        }
        
        console.log(`\nYour new balance: $${this.player.balance}`);
        await this.sleep(3000); // Auto-continue after 3 seconds
    }

    async playRound() {
        // Reset for new round
        this.player.clearHand();
        this.dealer.clearHand();
        this.dealerHiddenCard = true;
        
        // Create new deck if needed
        if (this.deck.cards.length < 10) {
            this.deck = new Deck();
        }
        
        // Get bet
        const betPlaced = await this.getBet();
        if (!betPlaced) {
            return false;
        }
        
        // Deal initial cards
        this.dealInitialCards();
        
        // Player's turn
        await this.playerTurn();
        
        // Dealer's turn (only if player didn't bust)
        if (!this.player.isBust()) {
            await this.dealerTurn();
        }
        
        // Determine winner
        await this.determineWinner();
        
        return true;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async run() {
        this.clearScreen();
        console.log("Welcome to Blackjack!");
        console.log("You start with $100. Good luck!");
        console.log("\nThe game will continue automatically after each hand.");
        console.log("Press Ctrl+C to quit at any time.");
        await question("\nPress Enter to start...");
        
        // Keep playing until bankrupt
        while (this.player.balance > 0) {
            const continueGame = await this.playRound();
            if (!continueGame) {
                break;
            }
        }
        
        if (this.player.balance <= 0) {
            console.log("\n" + "=".repeat(50));
            console.log("💸 GAME OVER - You're out of money! 💸");
            console.log("=".repeat(50));
        }
        
        console.log(`\nFinal balance: $${this.player.balance}`);
        console.log("Thanks for playing Blackjack!");
        rl.close();
    }
}

// Run the game
if (require.main === module) {
    const game = new Game();
    game.run();
}
