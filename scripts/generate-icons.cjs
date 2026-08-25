#!/usr/bin/env node
/**
 * Generate PWA icons for IRENA Scenario Dialogue Tool
 * Pure Node.js — no external dependencies
 * Creates icon-192.png and icon-512.png in public/
 */
'use strict';
const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

// ─── PNG helpers ─────────────────────────────────────────────────────────────
function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  const payload = Buffer.concat([typeBytes, data]);
  crcBuf.writeUInt32BE(crc32(payload), 0);
  return Buffer.concat([len, payload, crcBuf]);
}

function uint32BE(v) {
  const b = Buffer.allocUnsafe(4);
  b.writeUInt32BE(v, 0);
  return b;
}

function buildPNG(size, drawFn) {
  // IHDR
  const ihdr = Buffer.concat([
    uint32BE(size), uint32BE(size),
    Buffer.from([8, 2, 0, 0, 0]) // bit depth 8, RGB, no interlace
  ]);

  // Raw image data: each row has a filter byte (0 = None) + RGB pixels
  const pixels = new Uint8Array(size * size * 3);
  drawFn(pixels, size);

  const rowSize = size * 3;
  const raw = Buffer.allocUnsafe(size * (1 + rowSize));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + rowSize)] = 0; // filter type: None
    for (let x = 0; x < rowSize; x++) {
      raw[y * (1 + rowSize) + 1 + x] = pixels[y * rowSize + x];
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const idat = compressed;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── IRENA brand colors ───────────────────────────────────────────────────────
const IRENA_BLUE = [0, 90, 130];      // #005a82
const IRENA_BLUE_MID = [0, 120, 167]; // #0078a7
const IRENA_ORANGE = [247, 148, 29];  // #f7941d
const WHITE = [255, 255, 255];
const LIGHT = [230, 240, 248];

// ─── Drawing helpers ─────────────────────────────────────────────────────────
function setPixel(pixels, size, x, y, rgb) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 3;
  pixels[i] = rgb[0]; pixels[i+1] = rgb[1]; pixels[i+2] = rgb[2];
}

function fillRect(pixels, size, x1, y1, w, h, rgb) {
  for (let dy = 0; dy < h; dy++) for (let dx = 0; dx < w; dx++)
    setPixel(pixels, size, x1 + dx, y1 + dy, rgb);
}

function fillCircle(pixels, size, cx, cy, r, rgb) {
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++)
    if (dx*dx + dy*dy <= r*r) setPixel(pixels, size, cx + dx, cy + dy, rgb);
}

function fillRoundRect(pixels, size, x1, y1, w, h, r, rgb) {
  fillRect(pixels, size, x1 + r, y1, w - 2*r, h, rgb);
  fillRect(pixels, size, x1, y1 + r, w, h - 2*r, rgb);
  fillCircle(pixels, size, x1 + r,     y1 + r,     r, rgb);
  fillCircle(pixels, size, x1 + w - r, y1 + r,     r, rgb);
  fillCircle(pixels, size, x1 + r,     y1 + h - r, r, rgb);
  fillCircle(pixels, size, x1 + w - r, y1 + h - r, r, rgb);
}

// Draw a bar chart icon (energy scenario theme)
function drawIcon(pixels, size) {
  const s = size / 192; // scale factor (design at 192px)

  // Background — IRENA dark blue, fully rounded
  fillRoundRect(pixels, size, 0, 0, size, size, Math.round(28 * s), IRENA_BLUE);

  // ── Dialogue bubbles ── two overlapping chat-style arcs
  // Left bubble (smaller — stakeholder)
  const bx1 = Math.round(28 * s), by1 = Math.round(32 * s);
  const bw1 = Math.round(88 * s), bh1 = Math.round(56 * s);
  const br1 = Math.round(12 * s);
  fillRoundRect(pixels, size, bx1, by1, bw1, bh1, br1, LIGHT);
  // bubble tail
  fillRect(pixels, size, bx1 + Math.round(16 * s), by1 + bh1, Math.round(14 * s), Math.round(10 * s), LIGHT);
  fillRect(pixels, size, bx1 + Math.round(16 * s), by1 + bh1, Math.round(8 * s), Math.round(10 * s), IRENA_BLUE);

  // Right bubble (larger — planner response)
  const bx2 = Math.round(76 * s), by2 = Math.round(96 * s);
  const bw2 = Math.round(88 * s), bh2 = Math.round(56 * s);
  const br2 = Math.round(12 * s);
  fillRoundRect(pixels, size, bx2, by2, bw2, bh2, br2, IRENA_ORANGE);
  // bubble tail (right side)
  fillRect(pixels, size, bx2 + bw2 - Math.round(30 * s), by2 + bh2, Math.round(14 * s), Math.round(10 * s), IRENA_ORANGE);
  fillRect(pixels, size, bx2 + bw2 - Math.round(24 * s), by2 + bh2, Math.round(8 * s), Math.round(10 * s), IRENA_BLUE);

  // Lines inside left bubble (text lines)
  const lw = Math.round(8 * s);
  fillRect(pixels, size, bx1 + lw, by1 + lw, Math.round(60 * s), Math.round(5 * s), IRENA_BLUE_MID);
  fillRect(pixels, size, bx1 + lw, by1 + lw*2 + Math.round(5 * s), Math.round(44 * s), Math.round(5 * s), IRENA_BLUE_MID);
  fillRect(pixels, size, bx1 + lw, by1 + lw*3 + Math.round(10 * s), Math.round(52 * s), Math.round(5 * s), IRENA_BLUE_MID);

  // Lines inside right bubble (text lines — white)
  fillRect(pixels, size, bx2 + lw, by2 + lw, Math.round(60 * s), Math.round(5 * s), WHITE);
  fillRect(pixels, size, bx2 + lw, by2 + lw*2 + Math.round(5 * s), Math.round(40 * s), Math.round(5 * s), WHITE);
}

// ─── Generate ─────────────────────────────────────────────────────────────────
const publicDir = path.join(__dirname, '..', 'public');

for (const size of [192, 512]) {
  const buf = buildPNG(size, drawIcon);
  const outPath = path.join(publicDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, buf);
  console.log(`✓ ${outPath} (${buf.length} bytes)`);
}

// Apple touch icon (180×180)
const appleBuf = buildPNG(180, drawIcon);
const applePath = path.join(publicDir, 'apple-touch-icon.png');
fs.writeFileSync(applePath, appleBuf);
console.log(`✓ ${applePath} (${appleBuf.length} bytes)`);

console.log('\nPWA icons generated successfully.');
