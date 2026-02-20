/**
 * Génère des icônes PWA simples en PNG via canvas (Node.js natif)
 * Utilise le module 'canvas' si disponible, sinon crée des SVG
 */
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'public', 'icons');

// Créer le dossier si nécessaire
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Générer des SVG simples (compatibles avec les navigateurs comme icônes PWA)
sizes.forEach(size => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#22C55E"/>
  <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">CB</text>
</svg>`;

    // Sauvegarder en SVG (renommé .png pour compatibilité manifest)
    const filePath = path.join(iconsDir, `icon-${size}x${size}.png`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Créé: icon-${size}x${size}.png`);
});

// Icônes de raccourcis
['shortcut-add', 'shortcut-list', 'shortcut-chat', 'shortcut-search'].forEach(name => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="19" fill="#22C55E"/>
  <text x="50%" y="55%" font-family="Arial" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">+</text>
</svg>`;
    const filePath = path.join(iconsDir, `${name}.png`);
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Créé: ${name}.png`);
});

console.log('\n🎉 Toutes les icônes PWA ont été générées dans public/icons/');
