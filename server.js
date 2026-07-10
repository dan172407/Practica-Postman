require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const tareasRouter = require('./routes/tareas'); 
const climaRouter = require('./routes/clima');
const app = express();

app.use(helmet());              // cabeceras de seguridad HTTP
app.use(express.json());        // parseo seguro de JSON
app.use(morgan('dev'));         // bitácora de peticiones

// Ruta de prueba con validación de entrada
app.post(
  '/api/echo',
  body('mensaje').isString().trim().isLength({ min: 1, max: 200 }).escape(),
  (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    res.json({ recibido: req.body.mensaje });
  }
);

// =========================================================================
// RETO DE LA SESIÓN: Endpoint POST /api/registro con validación de entradas
// =========================================================================
app.post(
  '/api/registro',
  [
    
    body('nombre')
      .trim()
      .notEmpty().withMessage('El nombre es obligatorio')
      .escape(),
    
    
    body('correo')
      .trim()
      .isEmail().withMessage('Debe ser un correo electrónico válido')
      .normalizeEmail()
  ],
  (req, res) => {
    
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    /* 
      JUSTIFICACIÓN DEL PRINCIPIO DE CODIFICACIÓN SEGURA (Paso 3 del reto):
      Este endpoint aplica el principio de "Nunca confiar en la entrada del usuario" (Input Validation).
      Al validar y sanitizar los datos en el servidor mediante express-validator (usando .isEmail(), .escape() y .notEmpty()),
      evitamos ataques comunes como Inyección de Código (XSS) y manipulación de datos mal formados, asegurando que 
      solo información limpia y con la estructura correcta llegue a la lógica de negocio o base de datos.
    */

   
    res.json({
      mensaje: 'Registro exitoso',
      usuario: {
        nombre: req.body.nombre,
        correo: req.body.correo
      }
    });
  }
);
app.get('/api/salud', (req, res) => {
  res.json({ status: 'ok' });
});

// =========================================================================
// SESIÓN 2: Conexión de las rutas REST de Tareas
// =========================================================================
app.use('/api/tareas', tareasRouter); // <-- Conectamos el router
app.use('/api/tareas', tareasRouter);
app.use('/api/clima', climaRouter);

module.exports = app;