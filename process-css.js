const fs = require('fs');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const nested = require('postcss-nested');
const autoprefixer = require('autoprefixer');

// Read the input CSS file
const css = fs.readFileSync('./app/globals.css', 'utf8');

// Process it with PostCSS
postcss([tailwindcss, nested, autoprefixer])
  .process(css, { from: './app/globals.css', to: './app/processed-globals.css' })
  .then(result => {
    fs.writeFileSync('./app/processed-globals.css', result.css);
    console.log('CSS processed successfully!');
  })
  .catch(error => {
    console.error('Error processing CSS:', error);
    process.exit(1);
  });
