const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy para Firestore
  app.use(
    '/google.firestore.v1.Firestore',
    createProxyMiddleware({
      target: 'https://firestore.googleapis.com',
      changeOrigin: true,
      secure: true,
      ws: true, // Habilitar WebSocket
      onProxyReq: (proxyReq) => {
        // Agregar headers necesarios
        proxyReq.setHeader('Origin', 'http://localhost:3000');
      },
      onProxyRes: (proxyRes) => {
        // Configurar CORS en la respuesta
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
    })
  );

  // Configurar tipo MIME para archivos CSS
  app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.type('text/css');
    }
    next();
  });
};
