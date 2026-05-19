const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema(
  {
    titulo:      { type: String, required: true, trim: true },
    descripcion: { type: String, default: '' },
    fecha:       { type: String, required: true },
    estado:      { type: String, enum: ['pendiente', 'completado'], default: 'pendiente' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tarea', tareaSchema);
