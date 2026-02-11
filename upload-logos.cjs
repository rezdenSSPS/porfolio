const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.VITE_CLOUDINARY_API_SECRET,
});

async function uploadLogos() {
  try {
    console.log('Uploading logos to Cloudinary...\n');

    // Upload light logo (black text, for light mode backgrounds)
    console.log('1. Uploading logo-light.png...');
    const lightResult = await cloudinary.uploader.upload(
      path.join(__dirname, 'logo-light.png'),
      {
        folder: 'portfolio/logos',
        public_id: 'logo-light',
        overwrite: true,
      }
    );
    console.log('✓ Light logo uploaded:', lightResult.secure_url);

    // Upload dark logo (white text, for dark mode backgrounds)
    console.log('\n2. Uploading logo-dark.png...');
    const darkResult = await cloudinary.uploader.upload(
      path.join(__dirname, 'logo-dark.png'),
      {
        folder: 'portfolio/logos',
        public_id: 'logo-dark',
        overwrite: true,
      }
    );
    console.log('✓ Dark logo uploaded:', darkResult.secure_url);

    console.log('\n=== URLs to use in your code ===');
    console.log('Light Logo (for dark backgrounds):', lightResult.secure_url);
    console.log('Dark Logo (for light backgrounds):', darkResult.secure_url);

    // Save URLs to a file for reference
    const urlsContent = `# Logo URLs\n\nLIGHT_LOGO_URL=${lightResult.secure_url}\nDARK_LOGO_URL=${darkResult.secure_url}\n`;
    fs.writeFileSync(path.join(__dirname, 'logo-urls.txt'), urlsContent);
    console.log('\n✓ URLs saved to logo-urls.txt');

  } catch (error) {
    console.error('Error uploading logos:', error);
    process.exit(1);
  }
}

uploadLogos();
