const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

// Define the plugins to use
const plugins = [
  require('tailwindcss'),
  require('postcss-nested'),
  require('autoprefixer')
];

// Read the input CSS file
const inputPath = path.join(__dirname, 'app', 'globals.css');
const outputPath = path.join(__dirname, 'app', 'processed.css');

// Ensure the file exists
if (!fs.existsSync(inputPath)) {
  console.error(`Error: Input CSS file not found at ${inputPath}`);
  process.exit(1);
}

// Read the file content
const css = fs.readFileSync(inputPath, 'utf8');

// Process the CSS with PostCSS
postcss(plugins)
  .process(css, { from: inputPath, to: outputPath })
  .then(result => {
    // Write the processed CSS to the output file
    fs.writeFileSync(outputPath, result.css);
    console.log(`CSS processed successfully! Output: ${outputPath}`);
    
    // Now modify the layout file to use the processed CSS
    const layoutPaths = [
      path.join(__dirname, 'app', 'layout.js'),
      path.join(__dirname, 'app', 'layout.jsx'),
      path.join(__dirname, 'app', 'layout.ts'),
      path.join(__dirname, 'app', 'layout.tsx')
    ];
    
    // Find the existing layout file
    const layoutPath = layoutPaths.find(p => fs.existsSync(p));
    
    if (!layoutPath) {
      console.error('Error: Could not find layout file');
      process.exit(1);
    }
    
    // Read the layout file
    let layout = fs.readFileSync(layoutPath, 'utf8');
    
    // Check if it includes the original globals.css import
    if (layout.includes("import './globals.css'")) {
      // Replace the import with our processed CSS
      layout = layout.replace(
        "import './globals.css'", 
        "import './processed.css' // Processed by custom script"
      );
      
      // Write the modified layout file
      fs.writeFileSync(layoutPath, layout);
      console.log(`Updated layout file at ${layoutPath}`);
    } else {
      console.warn('Warning: Could not find globals.css import in layout file. You may need to update it manually.');
    }
  })
  .catch(error => {
    console.error('Error processing CSS:', error);
    process.exit(1);
  });
