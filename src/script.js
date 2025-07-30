console.log("Let start");
let currentSong = new Audio();
let songs = [];
let allSongs = [];
let flag = false;
let currFolder;
let currentSongIndex = 0;

// Fetch songs from JSON file
async function loadSongsFromJSON() {
    try {
        let response = await fetch('/songs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allSongs = await response.json();
        console.log('Loaded songs:', allSongs.length);
        return allSongs;
    } catch (error) {
        console.error('Error loading songs.json:', error);
        return [];
    }
}

// Get songs by artist/folder
async function getsongs(folder) {
    currFolder = folder;
    
    if (allSongs.length === 0) {
        await loadSongsFromJSON();
    }
    
    // Filter songs by the folder/artist
    if (folder === 'all') {
        songs = [...allSongs];
    } else {
        songs = allSongs.filter(song => {
            // Extract folder name from path
            const pathParts = song.path.split('/');
            const songFolder = pathParts[pathParts.length - 2]; // Get folder name from path
            return songFolder === folder;
        });
    }

    console.log(`Found ${songs.length} songs for folder: ${folder}`);

    // Show songs in lib section
    let p = document.querySelector(".lib").getElementsByTagName("ul")[0];
    p.innerHTML = "";
    
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        p.innerHTML += `<li data-index="${i}">
                        <div class = "flex-c"
                            <div class="sname">    
                                <img src="/assets/images/music.svg" alt="">
                                <div class="songInfo">
                                    <p class="songName">${song.title}</p>
                                </div>
                            </div>
                        </div>
                            <div class="duration">${formatTime(song.duration)}</div>
                            <img class="pp" src="/assets/images/play.svg" alt="">
                        </li>`;
    }

    // Add Event listener to every song
    Array.from(document.querySelector(".lib").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            const songIndex = parseInt(e.getAttribute('data-index'));
            currentSongIndex = songIndex;
            playSong(songs[songIndex]);
        });
    });
}

function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds)) {
        return '0:00';
    }
    const totalSeconds = Math.round(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function setOnEndHandler() {
    currentSong.onended = () => {
        if (flag && currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playSong(songs[currentSongIndex]);
        } else {
            play.src = "/assets/images/play.svg";
        }
    };
}

const playSong = (songObj, pause = false) => {
    if (!songObj) return;
    
    currentSong.src = songObj.path;
    currentSong.loop = false;
    setOnEndHandler();
    
    if (!pause) {
        currentSong.play();
        if (!currentSong.paused) {
            play.src = "/assets/images/pause.svg";
        }
    }
    
    document.querySelector(".disName").innerHTML = songObj.title;
    document.querySelector(".time").innerHTML = "00:00 / " + formatTime(songObj.duration);
}

async function displayAlbums() {
    if (allSongs.length === 0) {
        await loadSongsFromJSON();
    }
    
    // Group songs by artist/folder to create albums
    const albumsMap = new Map();
    
    allSongs.forEach(song => {
        const pathParts = song.path.split('/');
        const folder = pathParts[pathParts.length - 2]; // Get folder name
        if (!albumsMap.has(folder)) {
            albumsMap.set(folder, {
                folder: folder,
                songs: []
            });
        }
        albumsMap.get(folder).songs.push(song);
    });

    // Display album cards
    const cardsContainer = document.querySelector(".cards");
    cardsContainer.innerHTML = "";
    
    // Load metadata for each album
    for (const [folder, album] of albumsMap) {
        try {
            // Fetch info.json for this folder
            const infoResponse = await fetch(`/songs/${folder}/info.json`);
            let albumInfo = {
                title: folder,
                discription: `${folder} Collection`
            };
            
            if (infoResponse.ok) {
                albumInfo = await infoResponse.json();
            } else {
                console.warn(`Could not fetch info.json for folder: ${folder}`);
            }
            
            // Create album card
            cardsContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <img src="/songs/${folder}/cover.jpg" alt="COVER" onerror="this.src='/assets/images/default-cover.jpg'">
                    <h3>${albumInfo.title}</h3>
                    <p>${albumInfo.discription}</p>
                    <span class="songCount">${album.songs.length} songs</span>
                </div>`;
                
        } catch (error) {
            console.error(`Error loading metadata for folder ${folder}:`, error);
            // Fallback card if info.json fails
            cardsContainer.innerHTML += `
                <div data-folder="${folder}" class="card">
                    <img src="/songs/${folder}/cover.jpg" alt="COVER" onerror="this.src='/assets/images/default-cover.jpg'">
                    <h3>${folder}</h3>
                    <p>${folder} Collection</p>
                    <span class="songCount">${album.songs.length} songs</span>
                </div>`;
        }
    }
}

async function main() {
    // Load all songs first
    await loadSongsFromJSON();
    
    // Get songs from first available artist or show all
    if (allSongs.length > 0) {
        const firstArtistPath = allSongs[0].path.split('/');
        const firstArtist = firstArtistPath[firstArtistPath.length - 2];
        await getsongs(firstArtist);
        
        if (songs.length > 0) {
            currentSongIndex = 0;
            playSong(songs[0], true);
        }
    }

    // Display all the albums
    await displayAlbums();

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            const folder = item.currentTarget.dataset.folder;
            await getsongs(folder);
            if (songs.length > 0) {
                currentSongIndex = 0;
                // Uncomment next line if you want auto play
                // playSong(songs[0]);
            }
        });
    });

    // Add Event Listener to play button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/assets/images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "/assets/images/play.svg";
        }
    });

    // Keyboard play pause
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            e.preventDefault();
            if (currentSong.paused) {
                currentSong.play();
                play.src = "/assets/images/pause.svg";
            } else {
                currentSong.pause();
                play.src = "/assets/images/play.svg";
            }
        }
    });

    // Previous and next event
    prev.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
            playSong(songs[currentSongIndex]);
        } else {
            currentSong.currentTime = 0;
        }
    });

    next.addEventListener("click", () => {
        if (currentSongIndex < songs.length - 1) {
            currentSongIndex++;
            playSong(songs[currentSongIndex]);
        }
    });

    replay.addEventListener("click", () => {
        currentSong.currentTime = 0;
    });

    // Current time and duration and move seekbar
    currentSong.addEventListener("timeupdate", () => {
        const currentTime = formatTime(currentSong.currentTime);
        const duration = formatTime(currentSong.duration);
        document.querySelector(".time").innerHTML = currentTime + " / " + duration;
        
        if (currentSong.duration) {
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 99 + "%";
        }
    });

    // Seekbar Event Listener
    document.querySelector(".seekBar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        if (currentSong.duration) {
            currentSong.currentTime = ((currentSong.duration) * percent) / 100;
        }
    });

    // Add Event listener to volume
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Mute
    mute.addEventListener("click", () => {
        let volSlider = document.querySelector(".vol").getElementsByTagName("input")[0];

        if (currentSong.volume == 0) {
            currentSong.volume = 0.1;
            volSlider.value = 10;
            mute.src = "/assets/images/volume.svg";
        } else {
            currentSong.volume = 0;
            volSlider.value = 0;
            mute.src = "/assets/images/mute.svg";
        }
    });

    // Hamburger add event
    ham.addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    });

    clo.addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    });

    // Autoplay toggle
    toggle.addEventListener("click", () => {
        const isAutoplayOn = toggle.src.includes("autoplay.svg") && !toggle.src.includes("autoplayoff");

        if (isAutoplayOn) {
            toggle.src = "/assets/images/autoplayoff.svg";
            flag = false;
        } else {
            toggle.src = "/assets/images/autoplay.svg";
            flag = true;
        }
    });
}

main();