const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function autenticar(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader)
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token de autenticación.' });

  const partes = authHeader.split(' ');
  if (partes.length !== 2 || partes[0] !== 'Bearer')
    return res.status(401).json({ error: 'Formato de token inválido. Use: Authorization: Bearer <token>' });

  const token = partes[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'El token ha expirado. Inicie sesión nuevamente.' });
    return res.status(401).json({ error: 'Token inválido.' });
  }
}

module.exports = { autenticar };
