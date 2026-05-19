const express = require('express');
const router = express.Router();
const { listarTareas, obtenerTareaPorId, crearTarea, actualizarTarea, eliminarTarea } = require('../controllers/tareas.controller');

router.get('/', listarTareas);
router.get('/:id', obtenerTareaPorId);
router.post('/', crearTarea);
router.put('/:id', actualizarTarea);
router.delete('/:id', eliminarTarea);

module.exports = router;
