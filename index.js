const https = require('https');
const fs = require('fs');
const app = require('./server');

const opciones = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const PORT = process.env.PORT || 3000;

https.createServer(opciones, app).listen(PORT, () => {
  console.log(`Servidor seguro corriendo en https://localhost:${PORT}`);
});