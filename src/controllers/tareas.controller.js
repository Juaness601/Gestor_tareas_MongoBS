const Tarea = require('../models/tarea.model');
const { validarCrearTarea, validarActualizarTarea } = require('../validations/tarea.validation');

async function listarTareas(req, res) {
  try {
    const { estado, fecha } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado.toLowerCase();
    if (fecha)  filtro.fecha = fecha;
    const tareas = await Tarea.find(filtro).sort({ createdAt: -1 });
    return res.status(200).json({ total: tareas.length, tareas });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function obtenerTareaPorId(req, res) {
  try {
    const tarea = await Tarea.findById(req.params.id);
    if (!tarea) return res.status(404).json({ error: `No se encontró la tarea con ID ${req.params.id}.` });
    return res.status(200).json(tarea);
  } catch (err) {
    return res.status(404).json({ error: 'ID inválido o tarea no encontrada.' });
  }
}

async function crearTarea(req, res) {
  try {
    const datos = req.body;
    const errores = validarCrearTarea(datos);
    if (errores.length > 0) return res.status(400).json({ errores });
    const nuevaTarea = new Tarea({
      titulo: datos.titulo,
      descripcion: datos.descripcion || '',
      fecha: datos.fecha,
      estado: datos.estado || 'pendiente',
    });
    await nuevaTarea.save();
    return res.status(201).json({ mensaje: 'Tarea creada exitosamente.', tarea: nuevaTarea });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function actualizarTarea(req, res) {
  try {
    const errores = validarActualizarTarea(req.body);
    if (errores.length > 0) return res.status(400).json({ errores });
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!tarea) return res.status(404).json({ error: `No se encontró la tarea con ID ${req.params.id}.` });
    return res.status(200).json({ mensaje: 'Tarea actualizada exitosamente.', tarea });
  } catch (err) {
    return res.status(404).json({ error: 'ID inválido o tarea no encontrada.' });
  }
}

async function eliminarTarea(req, res) {
  try {
    const tarea = await Tarea.findByIdAndDelete(req.params.id);
    if (!tarea) return res.status(404).json({ error: `No se encontró la tarea con ID ${req.params.id}.` });
    return res.status(200).json({ mensaje: 'Tarea eliminada exitosamente.', tarea });
  } catch (err) {
    return res.status(404).json({ error: 'ID inválido o tarea no encontrada.' });
  }
}

module.exports = { listarTareas, obtenerTareaPorId, crearTarea, actualizarTarea, eliminarTarea };
