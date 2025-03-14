// This is a simple script to generate SVG icons for the extension
// You would typically replace these with proper designed icons

import fs from 'fs';
import path from 'path';

// Create the scripts directory if it doesn't exist
if (!fs.existsSync('scripts')) {
    fs.mkdirSync('scripts');
}

// Create the public/icons directory if it doesn't exist
if (!fs.existsSync('public/icons')) {
    fs.mkdirSync('public/icons', { recursive: true });
}

// Generate a simple SVG icon with the given size
function generateIcon(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#4285f4" />
  <circle cx="${size / 2}" cy="${size / 2}" r="${size / 3}" fill="white" />
  <line x1="${size / 3}" y1="${size / 3}" x2="${size * 2 / 3}" y2="${size * 2 / 3}" stroke="red" stroke-width="${size / 10}" />
  <line x1="${size * 2 / 3}" y1="${size / 3}" x2="${size / 3}" y2="${size * 2 / 3}" stroke="red" stroke-width="${size / 10}" />
</svg>`;
}

// Generate icons of different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
    const iconPath = path.join('public', 'icons', `icon${size}.svg`);
    fs.writeFileSync(iconPath, generateIcon(size));
    console.log(`Generated ${iconPath}`);
});

console.log('Icon generation complete!'); 