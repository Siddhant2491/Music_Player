import fs from 'fs';
import path from 'path';
import { parseFile } from 'music-metadata';

const musicDir = path.join(process.cwd(), 'public', 'songs'); // Change to your folder if different
const outputFile = path.join(process.cwd(), 'public', 'songs.json');

async function getAllMP3Files(dir, basePath = "") {
  let results = [];

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(basePath, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      const subFiles = await getAllMP3Files(fullPath, relativePath);
      results = results.concat(subFiles);
    } else if (path.extname(file).toLowerCase() === ".mp3") {
      try {
        const metadata = await parseFile(fullPath);

        const title = metadata.common.title || path.basename(file, ".mp3");
        const artist = metadata.common.artist || "Unknown Artist";
        const duration = metadata.format.duration || 0;

        console.log("🎵 Found:", relativePath);

        results.push({
          title,
          artist,
          duration: Number(duration.toFixed(2)),
          cover: `/covers/${path.basename(file, ".mp3")}.jpg`, // Optional: must exist
          path: `/songs/${relativePath.replace(/\\/g, "/")}`,
        });
      } catch (err) {
        console.error("❌ Error reading metadata:", file, err.message);
      }
    }
  }

  return results;
}

(async () => {
  const songs = await getAllMP3Files(musicDir);
  fs.writeFileSync(outputFile, JSON.stringify(songs, null, 2));
  console.log(`✅ ${songs.length} song(s) added to songs.json`);
})();
