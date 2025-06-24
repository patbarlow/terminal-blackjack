# Nintai - Minimal Solitaire for iOS

## Setup Instructions

### Method 1: Create in Xcode (Recommended)
1. Open Xcode
2. File → New → Project
3. iOS → App
4. Name: "Nintai", Interface: SwiftUI, Language: Swift
5. Save to this directory (replace existing files)
6. Copy our source files into the new project

### Method 2: Open as Swift Package
1. Open Xcode
2. File → Open
3. Select the `Package.swift` file in this directory
4. Build and run in iOS Simulator

## Project Structure
```
Nintai/
├── Models/
│   ├── Card.swift          # Card data model
│   ├── GameState.swift     # Game state management  
│   └── SolitaireLogic.swift # Game rules and logic
├── Views/
│   ├── CardView.swift      # Card UI component
│   └── GameView.swift      # Main game interface
├── ContentView.swift       # Root view
├── NintaiApp.swift        # App entry point
└── Assets.xcassets/       # App icons and assets
```

## Current Features
✅ Classic Klondike Solitaire layout
✅ Pure black theme (Offsuit-inspired)
✅ Card dealing and display
✅ New game functionality
✅ Score and move tracking

## Next Steps
- [ ] Drag & drop card interactions
- [ ] Haptic feedback
- [ ] Smooth animations
- [ ] Statistics tracking
- [ ] Different card themes