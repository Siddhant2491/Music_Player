
# 🎧 Spotify-like Music Player

A sleek and functional music player web application built with HTML, CSS, and JavaScript, bundled with Vite. This project aims to replicate the core features and user interface of popular music streaming platforms, providing a seamless audio experience.

## ✨ Features

- **Responsive Design:** Enjoy your music on any device, from desktops to mobile phones.
- **Dynamic Playlist Loading:** Browse and play songs from various artists and albums.
- **Interactive Playback Controls:** Play, pause, skip, replay, and control volume.
- **Seekbar Functionality:** Easily navigate through the current song.
- **Autoplay Toggle:** Option to automatically play the next song in the playlist.
- **Volume Control & Mute:** Adjust volume and mute/unmute playback.
- **Keyboard Shortcuts:** Use the spacebar to play/pause.
- **Artist-based Albums:** Songs are organized into albums based on artists.

## 🚀 Demo


## 📱💻 Demo Previews

- Desktop View
  <img width="1920" height="918" alt="Desktop" src="https://github.com/user-attachments/assets/1708c71a-fb96-4e68-a423-e5fd4dda366b" />

- Tab View
- <img width="662" height="872" alt="tab" src="https://github.com/user-attachments/assets/843aabb4-06a3-4c1f-ab8e-9e09b1f8fe8e" />

- Mobile View
- <img width="398" height="861" alt="phone" src="https://github.com/user-attachments/assets/315cc992-3d42-4b90-9593-7aebacf1384e" />


## 🛠️ Technologies Used

- **HTML5:** For the basic structure of the web pages.
- **CSS3:** For styling and creating the modern UI.
- **JavaScript (ES6+):** For all interactive functionalities and dynamic content.
- **Vite:** A fast build tool for modern web projects.

## ⚙️ Installation and Setup

To get a local copy up and running, follow these simple steps:

1. **Clone the repository:**

```bash
git clone https://github.com/Siddhant2491/Music_Player.git
cd Music_Player
```

2. **Install dependencies (if you have a package.json for Vite):**

```bash
npm install
# OR
yarn install
```

3. **Run the development server:**

```bash
npm run dev
# OR
yarn dev
```

This will typically open the application in your default browser at `http://localhost:5173` (or a similar port).

4. **Build for production (optional):**

```bash
npm run build
# OR
yarn build
```

This will create a `dist` folder with the optimized production-ready files.

## 🎵 Project Structure

```
.
├── public/
│   ├── assets/
│   │   ├── images/  # UI icons like play, pause, home, search, etc.
│   │   └── default-cover.jpg
│   ├── songs.json   # Metadata for all songs
│   └── songs/       # Subfolders for each artist, each with cover.jpg, info.json, and audio files
├── src/
│   ├── style.css
│   └── script.js
├── index.html
├── vite.config.js
└── package.json
```

## 📁 Note on `songs.json` and `songs/` directory

- `songs.json`: An array of song objects with `title`, `path`, and `duration`. The path should be relative to the `public` directory (e.g., `"./songs/Arijit Singh/song1.mp3"`).
- `songs/{ArtistName}/`: Each artist folder should contain:
  - `cover.jpg`: Album cover.
  - `info.json`: *(Optional)* Album title and description.
  - Audio files in `.mp3` or other supported formats.

## 💡 How it Works

The application loads song metadata from `songs.json`. When an album card is clicked, `script.js` filters songs based on the selected artist's folder and populates the "Your Library" section. Playback is handled using the HTML Audio API, with event listeners for controls and time updates. The seekbar and volume controls are dynamically updated based on the audio's progress and user input.

## 🙏 Acknowledgements

- Inspired by Spotify's user interface.
- Vite for a lightning-fast development experience.
- Poppins Font for typography.

## 🤝 Contributing

Contributions are welcome! If you have any suggestions, bug reports, or want to contribute to the code, please feel free to open an issue or submit a pull request.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
