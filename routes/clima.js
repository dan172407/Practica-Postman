const express = require('express');
const router = express.Router();
const { param, validationResult } = require('express-validator');
const { obtenerClima } = require('../services/clima');

// Middleware de validación rápida
function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
  next();
}

// RETO DE LA SESIÓN: GET /api/clima/:ciudad
router.get(
  '/:ciudad',
  param('ciudad')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('El nombre de la ciudad no es válido')
    .escape(),
  validar,
  async (req, res) => {
    try {
      const clima = await obtenerClima(req.params.ciudad);
      res.status(200).json(clima);
    } catch (error) {
      res.status(502).json({ error: error.message });
    }
  }
);

module.exports = router;