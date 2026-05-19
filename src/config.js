module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'clave_secreta_api_tareas_2026',
  JWT_EXPIRES_IN: '24h',
  PORT: process.env.PORT || 3000,
};
