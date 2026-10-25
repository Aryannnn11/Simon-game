# Simon Game

A browser-based Simon memory game built using HTML, CSS, JavaScript ES6, jQuery, and the Web Audio API.

## Features

- Random color sequence generation
- User sequence validation
- Increasing difficulty with each level
- Automatic restart after incorrect input
- High score tracking
- Persistent high score using localStorage
- Sound effects generated using the Web Audio API
- Responsive design for desktop and mobile
- jQuery-based DOM manipulation and animations

## Tech Stack

- HTML5
- CSS3
- JavaScript ES6+
- jQuery
- Web Audio API
- LocalStorage

## How to Play

1. Press any key to start the game.
2. Watch the color shown by Simon.
3. Repeat the complete sequence by clicking the colored buttons.
4. Each level adds one new color to the sequence.
5. A wrong click restarts the game from Level 1.
6. Try to beat your high score.

## Project Structure

```text
Simon Game/
├── index.html
├── styles.css
├── game.js
└── README.md

## Live deployment (Vercel)

This is a static frontend game: no backend, database, or environment variables are needed.

1. Import `Aryannnn11/Simon-game` into a new Vercel project.
2. Choose **Framework Preset: Other**.
3. Leave **Root Directory** at the repository root (`./`).
4. Disable the build command (no build needed). The output is the repository root containing `index.html`.
5. Click **Deploy** and open the generated `.vercel.app` URL.

The game can be started with **Start Game** (including on touch devices) or a key on desktop. Each level replays the entire color sequence; a high score records the highest **completed** level in browser localStorage. Sound is synthesized by the Web Audio API. No personal data is sent to a server.
