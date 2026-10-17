import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Helper to construct a multi-resolution .ico binary buffer
function createIco(pngBuffers) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO format
  header.writeUInt16LE(pngBuffers.length, 4);

  let offset = 6 + (16 * pngBuffers.length);
  const entries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // color palette (0 for truecolor)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += img.buffer.length;
  }
  return Buffer.concat([header, ...entries, ...pngBuffers.map(p => p.buffer)]);
}

async function run() {
  console.log('🔄 Iniciando generación de iconos PWA y desktop de alta fidelidad para Des-Tec...');

  const sourceIconPath = path.resolve('public/icons/icon-512x512.png');
  if (!fs.existsSync(sourceIconPath)) {
    throw new Error('No se encontró el archivo base public/icons/icon-512x512.png');
  }

  // 1. Recortar la insignia interna en un círculo perfecto y suave
  const circleMask = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512">
      <circle cx="256" cy="256" r="244" fill="#ffffff" />
    </svg>
  `);

  const innerCleanCircle = await sharp(sourceIconPath)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // 2. Anillo de borde neón cyan / violeta idéntico al navbar (Header.tsx)
  // border-cyan-500/40 con hover purple-500/60 y shadow luminosa
  const neonRimSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.95"/>
          <stop offset="35%" stop-color="#38bdf8" stop-opacity="0.95"/>
          <stop offset="70%" stop-color="#818cf8" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0.95"/>
        </linearGradient>
        <filter id="neonHalo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <!-- Resplandor exterior suave -->
      <circle cx="256" cy="256" r="241" fill="none" stroke="url(#neonGradient)" stroke-width="7" opacity="0.45" filter="url(#neonHalo)" />
      <!-- Borde nítido exterior -->
      <circle cx="256" cy="256" r="241" fill="none" stroke="url(#neonGradient)" stroke-width="3" opacity="0.95" />
    </svg>
  `);

  // Insignia circular maestra 512x512 (con fondo transparente y borde de luz circular)
  const masterCircularBadge = await sharp(innerCleanCircle)
    .composite([{ input: neonRimSvg, top: 0, left: 0 }])
    .png()
    .toBuffer();

  // -------------------------------------------------------------
  // 3. GENERAR ICONOS "MASKABLE" (Android Adaptive Icons sin cajas blancas)
  // Requisito Android: 100% opaco, fondo sólido #0B0F19 a todo el lienzo,
  // con la insignia circular en la Safe Zone (75% del diámetro).
  // -------------------------------------------------------------
  console.log('📱 Generando iconos maskable para Android (elimina fondo blanco y líneas cuadradas)...');

  // A) 512x512 maskable (384px diámetro en lienzo de 512px = 75% safe zone)
  const emblemForMaskable512 = await sharp(masterCircularBadge)
    .resize(384, 384, { fit: 'contain' })
    .toBuffer();

  const bg512 = await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 15, b: 25, alpha: 1 } // #0B0F19
    }
  }).png().toBuffer();

  const iconMaskable512 = await sharp(bg512)
    .composite([{ input: emblemForMaskable512, top: 64, left: 64 }])
    .png()
    .toBuffer();

  fs.writeFileSync('public/icons/icon-maskable.png', iconMaskable512);
  console.log('  ✓ public/icons/icon-maskable.png (512x512) creado.');

  // B) 192x192 maskable (144px diámetro en lienzo de 192px = 75% safe zone)
  const emblemForMaskable192 = await sharp(masterCircularBadge)
    .resize(144, 144, { fit: 'contain' })
    .toBuffer();

  const bg192 = await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 11, g: 15, b: 25, alpha: 1 } // #0B0F19
    }
  }).png().toBuffer();

  const iconMaskable192 = await sharp(bg192)
    .composite([{ input: emblemForMaskable192, top: 24, left: 24 }])
    .png()
    .toBuffer();

  fs.writeFileSync('public/icons/icon-maskable-192x192.png', iconMaskable192);
  console.log('  ✓ public/icons/icon-maskable-192x192.png (192x192) creado.');

  // -------------------------------------------------------------
  // 4. GENERAR ICONOS "ANY" (Desktop PC, Windows Taskbar, Mac Dock, Shortcuts)
  // Insignia circular nítida exactamente como en la barra superior (Image 1)
  // -------------------------------------------------------------
  console.log('💻 Generando iconos circulares para PC y navegadores...');

  const standardSizes = [512, 384, 256, 192, 152, 144, 128, 96, 72];
  for (const size of standardSizes) {
    const resized = await sharp(masterCircularBadge)
      .resize(size, size, { fit: 'contain' })
      .png()
      .toBuffer();

    fs.writeFileSync(`public/icons/icon-${size}x${size}.png`, resized);
    console.log(`  ✓ public/icons/icon-${size}x${size}.png (${size}x${size})`);
  }

  // -------------------------------------------------------------
  // 5. GENERAR APPLE TOUCH ICON (iOS Safari)
  // iOS Safari redondea las esquinas a squircle; el lienzo debe ser 100% opaco #0B0F19
  // -------------------------------------------------------------
  console.log('🍏 Generando apple-touch-icon.png para iOS...');
  const appleEmblem = await sharp(masterCircularBadge)
    .resize(136, 136, { fit: 'contain' })
    .toBuffer();

  const appleBg = await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: { r: 11, g: 15, b: 25, alpha: 1 } // #0B0F19
    }
  }).png().toBuffer();

  const appleTouchIcon = await sharp(appleBg)
    .composite([{ input: appleEmblem, top: 22, left: 22 }])
    .png()
    .toBuffer();

  fs.writeFileSync('public/apple-touch-icon.png', appleTouchIcon);
  console.log('  ✓ public/apple-touch-icon.png (180x180)');

  // -------------------------------------------------------------
  // 6. GENERAR FAVICONS Y .ICO
  // -------------------------------------------------------------
  console.log('🌐 Generando favicon.ico, favicon-32x32.png y favicon-16x16.png...');
  const favicon32 = await sharp(masterCircularBadge)
    .resize(32, 32, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync('public/favicon-32x32.png', favicon32);

  const favicon16 = await sharp(masterCircularBadge)
    .resize(16, 16, { fit: 'contain' })
    .png()
    .toBuffer();
  fs.writeFileSync('public/favicon-16x16.png', favicon16);

  const favicon48 = await sharp(masterCircularBadge)
    .resize(48, 48, { fit: 'contain' })
    .png()
    .toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: favicon16 },
    { width: 32, height: 32, buffer: favicon32 },
    { width: 48, height: 48, buffer: favicon48 }
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  console.log('  ✓ public/favicon.ico, favicon-32x32.png, favicon-16x16.png creados.');

  console.log('🎉 ¡Todos los iconos fueron generados exitosamente con calidad profesional!');
}

run().catch((err) => {
  console.error('❌ Error generando iconos:', err);
  process.exit(1);
});
