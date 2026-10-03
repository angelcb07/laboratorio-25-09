require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');


// ============================================================
// CAMBIO 1 - INICIO
// Importamos las métricas definidas en metrics/prometheus.js
// ============================================================
const {
  client,
  httpRequests,
  httpDuration
} = require('./metrics/prometheus');
// ============================================================
// CAMBIO 1 - FIN
// ============================================================


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));


// ============================================================
// CAMBIO 2 - INICIO
// Middleware para medir:
//   - cantidad de requests
//   - código HTTP (200, 404, 500, etc.)
//   - tiempo de respuesta
//
// Debe estar ANTES de las rutas que queremos medir.
// ============================================================
app.use((req, res, next) => {

  // Guardamos el momento exacto en que comenzó la petición
  const start = process.hrtime.bigint();

  // "finish" se ejecuta cuando Express termina de responder
  res.on('finish', () => {

    const end = process.hrtime.bigint();

    // Convertimos nanosegundos a segundos
    const duration = Number(end - start) / 1e9;

    // Intentamos obtener la ruta definida por Express.
    // Si no existe, utilizamos req.path.
    const route = req.route?.path || req.path;

    // -----------------------------------------
    // Contador de requests
    // -----------------------------------------
    httpRequests.inc({
      method: req.method,
      route: route,
      status: res.statusCode
    });

    // -----------------------------------------
    // Tiempo de respuesta
    // -----------------------------------------
    httpDuration.observe(
      {
        method: req.method,
        route: route,
        status: res.statusCode
      },
      duration
    );

  });

  next();
});
// ============================================================
// CAMBIO 2 - FIN
// ============================================================


// ============================================================
// CAMBIO 3 - INICIO
// Endpoint que será consultado por Prometheus.
//
// Ejemplo:
// https://tu-app.onrender.com/metrics
// ============================================================
app.get('/metrics', async (req, res) => {

  res.set('Content-Type', client.register.contentType);

  res.end(
    await client.register.metrics()
  );

});
// ============================================================
// CAMBIO 3 - FIN
// ============================================================


// ------------------------------------------------------------
// A PARTIR DE AQUÍ CONTINÚA TU CÓDIGO ORIGINAL
// ------------------------------------------------------------

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);

app.use(express.static(path.join(__dirname, 'public')));


// Tu código original comentado
// app.get('*', (req, res) => {
//   if (req.path.startsWith('/api/'))
//     return res.status(404).json({
//       mensaje: 'Ruta API no encontrada'
//     });
//
//   res.sendFile(
//     path.join(__dirname, 'public', 'index.html')
//   );
// });


// Middleware original para errores
app.use((err, req, res, next) => {

  console.error(err);

  res.status(500).json({
    mensaje: 'Error interno del servidor'
  });

});


// Conexión a MongoDB y arranque del servidor
connectDB()
  .then(() => {

    app.listen(
      PORT,
      '0.0.0.0',
      () => console.log(
        `Servidor activo en puerto ${PORT}`
      )
    );

  })
  .catch((err) => {

    console.error(
      'No se pudo iniciar la aplicación:',
      err.message
    );

    process.exit(1);

  });