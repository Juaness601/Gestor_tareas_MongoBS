const express = require('express');
const cors = require('cors');        // ← agregar
const path = require('path');
const tareasRoutes = require('./routes/tareas.routes');
const authRoutes = require('./routes/auth.routes');
const { autenticar } = require('./middlewares/auth.middleware');

const app = express();

app.use(cors());                     // ← agregar
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/auth', authRoutes);
app.use('/tareas', autenticar, tareasRoutes);

app.use((req, res, next) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/tareas')) {
    return res.status(404).json({ error: 'Ruta no encontrada.' });
  }
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

module.exports = app;