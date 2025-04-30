const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 5001;

const runPythonScript = () => {
  exec('python src/app/services/translate.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el script Python: ${error}`);
      return;
    }
    console.log(`Salida del script Python: ${stdout}`);
    if (stderr) {
      console.error(`Error en el script Python: ${stderr}`);
    }
  });
};

runPythonScript();

// Rutas de tu servidor Express
app.get('/', (req, res) => {
  res.send('¡Servidor Express en marcha!');
});

app.listen(port, () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${port}`);
});
