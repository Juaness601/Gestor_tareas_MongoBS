const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config');

async function registro(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Los campos "nombre", "email" y "password" son requeridos.' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: 'El email no tiene un formato válido.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });

    const existe = await Usuario.findOne({ email });
    if (existe)
      return res.status(409).json({ error: 'Ya existe un usuario registrado con ese email.' });

    const usuario = new Usuario({ nombre, email, password });
    await usuario.save();

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Los campos "email" y "password" son requeridos.' });

    const usuario = await Usuario.findOne({ email });
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const passwordValida = await usuario.verificarPassword(password);
    if (!passwordValida)
      return res.status(401).json({ error: 'Credenciales incorrectas.' });

    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

function perfil(req, res) {
  return res.status(200).json({ mensaje: 'Token válido.', usuario: req.usuario });
}

module.exports = { registro, login, perfil };
