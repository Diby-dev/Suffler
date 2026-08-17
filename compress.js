import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function processFolder(folderName, targetWidth) {
  const inputDir = path.join(__dirname, 'public', folderName);
  const outputDir = path.join(__dirname, 'public', folderName + '_compressed');

  if (!fs.existsSync(inputDir)) {
    console.log(`Le dossier ${folderName} n'existe pas dans public/`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  console.log(`Traitement du dossier : ${folderName}...`);

  for (let i = 1; i <= 240; i++) {
    const frameNumber = String(i).padStart(6, '0');
    const fileName = `${folderName}_${frameNumber}.png`;
    const inputPath = path.join(inputDir, fileName);
    const outputPath = path.join(outputDir, `${folderName}_${frameNumber}.webp`);

    if (fs.existsSync(inputPath)) {
      try {
        await sharp(inputPath)
          .resize({ width: targetWidth })
          .webp({ quality: 80 })
          .toFile(outputPath);
      } catch (err) {
        console.error(`Erreur sur l'image ${fileName}:`, err);
      }
    }
  }
  console.log(`Dossier ${folderName} terminé !`);
}

async function run() {
  await processFolder('fondpc', 1280);
  await processFolder('fondmobile', 720);
  console.log('Compression terminée avec succès !');
}

run();