

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const validateCORS = (req, res, next) => {
  try {
    const { origin } = req.headers;
    if (allowedOrigins.includes(origin) || !origin) {
      res.setHeader('Access-Control-Allow-Origin', origin ?? '');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    } else {
      res.status(403).json({ message: 'Error de CORS' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error interno al validar CORS' });
  }
};

export { corsOptions, validateCORS };