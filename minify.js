const fs = require('fs');
const uglifyjs = require('uglify-js');

// List of JavaScript files to minify
const filesToMinify = [
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/index.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/patients.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/laboratory.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/medicines.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/odp.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/revenue.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/staff.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/tests.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/login.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/insurance.js',
    './BMS-2e8dde51476d2cefa1df5b4dbe9aaf23d196c578/clinical.js',
    // Add more files as needed
];

// Output directory for minified files
const outputDir = 'minified';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Minify each file and save the minified version
filesToMinify.forEach(file => {
    const code = fs.readFileSync(file, 'utf8');
    const minifiedCode = uglifyjs.minify(code).code;
    const outputFile = `${outputDir}/${file.replace('.js', '.min.js')}`;
    fs.writeFileSync(outputFile, minifiedCode);
    console.log(`Minified ${file} => ${outputFile}`);
});

console.log('Minification complete!');
