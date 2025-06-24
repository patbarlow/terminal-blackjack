import os
import random
from typing import List, Optional

class Card:
    """Represents a playing card with ASCII art display."""
    
    def __init__(self, suit: str, rank: str):
        self.suit = suit
        self.rank = rank
        self.value = self._calculate_value()
    
    def _calculate_value(self) -> int:
        """Calculate the numerical value of the card."""
        if self.rank in ['J', 'Q', 'K']:
            return 10
        elif self.rank == 'A':
            return 11  # Ace value will be adjusted in hand calculation
        else:
            return int(self.rank)
    
    def get_ascii_art(self) -> List[str]:
        """Return ASCII art representation of the card."""
        suit_symbols = {'Hearts': '♥', 'Diamonds': '♦', 'Clubs': '♣', 'Spades': '♠'}
        symbol = suit_symbols[self.suit]
        
        # Format rank for display
        display_rank = self.rank if len(self.rank) == 1 else self.rank
        
        card_art = [
            "┌─────────┐",
            f"│{display_rank:<2}       │",
            "│         │",
            f"│    {symbol}    │",
            "│         │",
            f"│       {display_rank:>2}│",
            "└─────────┘"
        ]
        return card_art
    
    @staticmethod
    def get_card_back() -> List[str]:
        """Return ASCII art for face-down card."""
        return [
            "┌─────────┐",
            "│░░░░░░░░░│",
            "│░░░░░░░░░│",
            "│░░░░░░░░░│",
            "│░░░░░░░░░│",
            "│░░░░░░░░░│",
            "└─────────┘"
        ]

class Deck:
    """Represents a deck of 52 playing cards."""
    
    def __init__(self):
        self.cards = []
        self.create_deck()
        self.shuffle()
    
    def create_deck(self):
        """Create a standard 52-card deck."""
        suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
        ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
        
        self.cards = [Card(suit, rank) for suit in suits for rank in ranks]
    
    def shuffle(self):
        """Shuffle the deck."""
        random.shuffle(self.cards)
    
    def deal_card(self) -> Optional[Card]:
        """Deal a card from the deck."""
        return self.cards.pop() if self.cards else None

class Player:
    """Represents a player with balance and betting capabilities."""
    
    def __init__(self, starting_balance: int = 100):
        self.balance = starting_balance
        self.hand = []
        self.current_bet = 0
    
    def place_bet(self, amount: int) -> bool:
        """Place a bet if player has sufficient balance."""
        if amount <= self.balance:
            self.current_bet = amount
            self.balance -= amount
            return True
        return False
    
    def add_card(self, card: Card):
        """Add a card to player's hand."""
        self.hand.append(card)
    
    def get_hand_value(self) -> int:
        """Calculate the value of the player's hand, handling Aces."""
        value = 0
        aces = 0
        
        for card in self.hand:
            if card.rank == 'A':
                aces += 1
                value += 11
            else:
                value += card.value
        
        # Adjust for Aces
        while value > 21 and aces > 0:
            value -= 10
            aces -= 1
        
        return value
    
    def is_bust(self) -> bool:
        """Check if player has busted."""
        return self.get_hand_value() > 21
    
    def has_blackjack(self) -> bool:
        """Check if player has blackjack (21 with first 2 cards)."""
        return len(self.hand) == 2 and self.get_hand_value() == 21
    
    def clear_hand(self):
        """Clear the player's hand for a new round."""
        self.hand = []
        self.current_bet = 0

class Game:
    """Main game class that handles the Blackjack game logic and UI."""
    
    def __init__(self):
        self.player = Player()
        self.dealer = Player()
        self.deck = Deck()
        self.dealer_hidden_card = True
    
    def clear_screen(self):
        """Clear the terminal screen."""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def display_cards_horizontally(self, cards: List[Card], show_all: bool = True) -> List[str]:
        """Display multiple cards side by side."""
        if not cards:
            return ["No cards"]
        
        # Get ASCII art for each card
        card_arts = []
        for i, card in enumerate(cards):
            if not show_all and i == 1:  # Hide dealer's second card
                card_arts.append(Card.get_card_back())
            else:
                card_arts.append(card.get_ascii_art())
        
        # Combine cards horizontally
        combined_lines = []
        for line_index in range(7):  # Each card has 7 lines
            line = ""
            for card_art in card_arts:
                line += card_art[line_index] + " "
            combined_lines.append(line.rstrip())
        
        return combined_lines
    
    def display_game_state(self):
        """Display the current game state."""
        self.clear_screen()
        
        print("=" * 60)
        print("                    BLACKJACK GAME")
        print("=" * 60)
        print()
        
        # Dealer's area
        print("DEALER'S HAND:")
        dealer_value = self.dealer.get_hand_value() if not self.dealer_hidden_card else "?"
        print(f"Value: {dealer_value}")
        print()
        
        dealer_cards = self.display_cards_horizontally(
            self.dealer.hand, 
            show_all=not self.dealer_hidden_card
        )
        for line in dealer_cards:
            print(line)
        
        print()
        print("-" * 60)
        print()
        
        # Player's area
        print("YOUR HAND:")
        print(f"Value: {self.player.get_hand_value()}")
        print()
        
        player_cards = self.display_cards_horizontally(self.player.hand)
        for line in player_cards:
            print(line)
        
        print()
        print(f"Current Bet: ${self.player.current_bet}")
        print(f"Balance: ${self.player.balance}")
        print("=" * 60)
    
    def get_bet(self) -> bool:
        """Get bet amount from player."""
        while True:
            try:
                print(f"\nYour balance: ${self.player.balance}")
                if self.player.balance <= 0:
                    print("You're out of money! Game over.")
                    return False
                
                bet = int(input(f"Enter your bet (1-{self.player.balance}): $"))
                if 1 <= bet <= self.player.balance:
                    if self.player.place_bet(bet):
                        return True
                else:
                    print(f"Please enter a bet between $1 and ${self.player.balance}")
            except ValueError:
                print("Please enter a valid number.")
    
    def deal_initial_cards(self):
        """Deal initial two cards to player and dealer."""
        # Deal two cards to each
        for _ in range(2):
            self.player.add_card(self.deck.deal_card())
            self.dealer.add_card(self.deck.deal_card())
    
    def player_turn(self):
        """Handle the player's turn."""
        while True:
            self.display_game_state()
            
            if self.player.is_bust():
                print("\nBUST! You exceeded 21.")
                input("Press Enter to continue...")
                return
            
            if self.player.has_blackjack() and len(self.player.hand) == 2:
                print("\nBLACKJACK! You got 21!")
                input("Press Enter to continue...")
                return
            
            choice = input("\nDo you want to (h)it or (s)tand? ").lower()
            
            if choice == 'h':
                self.player.add_card(self.deck.deal_card())
            elif choice == 's':
                return
            else:
                print("Please enter 'h' for hit or 's' for stand.")
    
    def dealer_turn(self):
        """Handle the dealer's turn."""
        self.dealer_hidden_card = False
        
        while self.dealer.get_hand_value() < 17:
            self.dealer.add_card(self.deck.deal_card())
            self.display_game_state()
            print("\nDealer hits...")
            input("Press Enter to continue...")
    
    def determine_winner(self):
        """Determine the winner and update player balance."""
        self.display_game_state()
        
        player_value = self.player.get_hand_value()
        dealer_value = self.dealer.get_hand_value()
        
        print("\n" + "=" * 30)
        print("           ROUND RESULTS")
        print("=" * 30)
        
        if self.player.is_bust():
            print("You BUSTED! Dealer wins.")
            # Player already lost bet
        elif self.dealer.is_bust():
            print("Dealer BUSTED! You win!")
            self.player.balance += self.player.current_bet * 2
        elif self.player.has_blackjack() and not self.dealer.has_blackjack():
            print("BLACKJACK! You win!")
            # Blackjack pays 3:2
            self.player.balance += int(self.player.current_bet * 2.5)
        elif self.dealer.has_blackjack() and not self.player.has_blackjack():
            print("Dealer has BLACKJACK! Dealer wins.")
            # Player already lost bet
        elif player_value > dealer_value:
            print("You win!")
            self.player.balance += self.player.current_bet * 2
        elif dealer_value > player_value:
            print("Dealer wins.")
            # Player already lost bet
        else:
            print("It's a tie! Push.")
            self.player.balance += self.player.current_bet  # Return bet
        
        print(f"\nYour new balance: ${self.player.balance}")
        input("Press Enter to continue...")
    
    def play_round(self):
        """Play a single round of blackjack."""
        # Reset for new round
        self.player.clear_hand()
        self.dealer.clear_hand()
        self.dealer_hidden_card = True
        
        # Create new deck if needed
        if len(self.deck.cards) < 10:
            self.deck = Deck()
        
        # Get bet
        if not self.get_bet():
            return False
        
        # Deal initial cards
        self.deal_initial_cards()
        
        # Player's turn
        self.player_turn()
        
        # Dealer's turn (only if player didn't bust)
        if not self.player.is_bust():
            self.dealer_turn()
        
        # Determine winner
        self.determine_winner()
        
        return True
    
    def run(self):
        """Run the main game loop."""
        self.clear_screen()
        print("Welcome to Blackjack!")
        print("You start with $100. Good luck!")
        input("Press Enter to start...")
        
        while True:
            if not self.play_round():
                break
            
            if self.player.balance <= 0:
                print("\nYou're out of money! Thanks for playing!")
                break
            
            play_again = input("\nDo you want to play another round? (y/n): ").lower()
            if play_again != 'y':
                break
        
        print(f"\nFinal balance: ${self.player.balance}")
        print("Thanks for playing Blackjack!")

if __name__ == "__main__":
    game = Game()
    game.run()