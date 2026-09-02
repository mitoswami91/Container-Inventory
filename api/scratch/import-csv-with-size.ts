import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function importCSVWithSize() {
  const filePath = 'C:/Users/Administrator/Desktop/Untitled.csv';
  console.log(`Starting bulk import from ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let isHeader = true;
  let batch: { cont_no: string; size: number | null; source: string }[] = [];
  let totalProcessed = 0;
  const BATCH_SIZE = 5000;
  const startTime = Date.now();

  for await (const line of rl) {
    if (isHeader) {
      isHeader = false;
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Supports: "CONT_NO","size","source" or "CONT_NO","source"
    const parts = trimmed.split(',').map(p => p.replace(/^"|"$/g, '').trim());
    if (parts.length >= 2) {
      const cont_no = parts[0];
      let sizeVal: number | null = null;
      let sourceVal = '';

      if (parts.length >= 3) {
        sizeVal = Number(parts[1]) || null;
        sourceVal = parts[2] || '';
      } else {
        sourceVal = parts[1] || '';
      }

      if (cont_no && cont_no.length <= 15) {
        batch.push({ cont_no, size: sizeVal, source: sourceVal });
      }
    }

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      totalProcessed += batch.length;
      console.log(`Imported ${totalProcessed.toLocaleString()} records so far...`);
      batch = [];
    }
  }

  if (batch.length > 0) {
    await insertBatch(batch);
    totalProcessed += batch.length;
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n==============================================`);
  console.log(`SUCCESS: Imported total ${totalProcessed.toLocaleString()} master records in ${durationSec}s!`);
  console.log(`==============================================\n`);

  await prisma.$disconnect();
}

async function insertBatch(batch: { cont_no: string; size: number | null; source: string }[]) {
  if (batch.length === 0) return;

  const valueStrings = batch.map(item => {
    const escapedCont = item.cont_no.replace(/'/g, "\\'");
    const escapedSource = item.source.replace(/'/g, "\\'");
    const sizeStr = item.size !== null && !isNaN(item.size) ? item.size : 'NULL';
    return `('${escapedCont}', ${sizeStr}, '${escapedSource}')`;
  });

  const sql = `INSERT INTO container_master (cont_no, size, source) VALUES ${valueStrings.join(',')} ON DUPLICATE KEY UPDATE size = VALUES(size), source = VALUES(source);`;
  await prisma.$executeRawUnsafe(sql);
}

importCSVWithSize().catch(async (e) => {
  console.error('Import error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
