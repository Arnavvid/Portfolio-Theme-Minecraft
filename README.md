# Minecraft Portfolio

## Description
Minecraft Portfolio is a personal website designed with the look and feel of the game Minecraft. It features a custom 3D environment where a character follows the user's mouse movement. The site includes a unique interactive "Hobbies" section where users drag words to form sentences and a "Game Zone" with fully playable mini-games.

## Tech Stack
- **HTML5**
- **CSS3**
- **JS** (Vanilla JavaScript)
- **Three.js** (Used for 3D character rendering)
- **Firebase Hosting**

## Setup
1.  **Clone the repository** to your computer.
2.  **Open the project folder** in VS Code.
3.  **Install Firebase CLI** if you haven't already: `npm install -g firebase-tools`.
4.  **Login and Initialize**:
    * Run `firebase login`.
    * Run `firebase init`.
5.  **Configure Hosting**:
    * Select **Hosting: Configure files for Firebase Hosting**.
    * When asked for your public directory, type `.` (if your files are in the main folder) or `public`.
6.  **Deploy**:
    * Run `firebase deploy` to put your site online.

Make sure these files are in your root directory:
- `index.html`
- `homepage.js`
- `hobbies.js`
- `tag.js`
- `airhockey.js`
- `homepage.css`


## Usage
### Navigation
* Open the website in a desktop browser. 
* The **3D Steve** at the top will track your mouse cursor.
* Click the **Jukebox** to play or mute the background music.

### Hobbies Interaction
* Go to the **Hobbies** section.
* Drag the floating word blocks next to each other.
* Forming a recognized sentence (e.g., "I game") will trigger a **typed reply** in the chat bubble.

### Game Zone
* **Tag**: Use **WASD** to move. Avoid the "IT" player or chase others to pass the tag. Supports up to 3 players.
* **Air Hockey**: Use your mouse to control your paddle and defend your goal.
* Select difficulty levels from **Easy** to **Insane** to change AI speed.

### Achievements
* Specific actions (like clicking the Jukebox) will trigger a Minecraft-style **"Advancement Made!"** toast notification.

---
**Note**: This website is restricted for desktop use. Mobile users will be blocked by a "Desktop Only" screen to ensure the game controls work correctly.
