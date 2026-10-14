import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Membaca data iklim historis 30 tahun per destinasi secara robust
 * di berbagai environment (local, monorepo root, Cloudflare Pages, CI/CD).
 */
export function getClimateData(slug: string): any | null {
  const candidates = [
    // 1. Relatif terhadap file sumber via import.meta.url (paling akurat)
    fileURLToPath(new URL(`../../../../data/climate/${slug}.json`, import.meta.url)),
    // 2. Relatif terhadap apps/web CWD
    path.resolve(process.cwd(), `../../data/climate/${slug}.json`),
    // 3. Relatif terhadap root monorepo CWD
    path.resolve(process.cwd(), `data/climate/${slug}.json`),
    path.resolve(process.cwd(), `../data/climate/${slug}.json`),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      try {
        return JSON.parse(fs.readFileSync(candidate, 'utf-8'));
      } catch (err) {
        console.warn(`[getClimateData] Gagal parse JSON dari ${candidate}:`, err);
      }
    }
  }

  return null;
}

