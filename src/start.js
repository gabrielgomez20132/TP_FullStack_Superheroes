const path = require('path');
const { exec } = require('child_process');

// Construye la ruta correcta a app.mjs
const appPath = path.join(__dirname, '../app.mjs');

// Ejecuta el archivo app.mjs con node
exec(`node "${appPath}"`, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error: ${err.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});