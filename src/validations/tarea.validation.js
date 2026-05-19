const ESTADOS_VALIDOS = ['pendiente', 'completado'];

function validarCrearTarea(datos) {
  const errores = [];

  if (!datos.titulo || datos.titulo.trim() === '')
    errores.push('El campo "titulo" es requerido.');

  if (!datos.fecha)
    errores.push('El campo "fecha" es requerido.');
  else if (isNaN(Date.parse(datos.fecha)))
    errores.push('El campo "fecha" debe tener un formato de fecha válido (YYYY-MM-DD).');

  if (datos.estado && !ESTADOS_VALIDOS.includes(datos.estado.toLowerCase()))
    errores.push('El campo "estado" debe ser "pendiente" o "completado".');

  return errores;
}

function validarActualizarTarea(datos) {
  const errores = [];

  if (datos.titulo !== undefined && datos.titulo.trim() === '')
    errores.push('El campo "titulo" no puede estar vacío.');

  if (datos.fecha !== undefined && isNaN(Date.parse(datos.fecha)))
    errores.push('El campo "fecha" debe tener un formato de fecha válido (YYYY-MM-DD).');

  if (datos.estado !== undefined && !ESTADOS_VALIDOS.includes(datos.estado.toLowerCase()))
    errores.push('El campo "estado" debe ser "pendiente" o "completado".');

  return errores;
}

module.exports = { validarCrearTarea, validarActualizarTarea };
