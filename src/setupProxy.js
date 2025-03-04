const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');

module.exports = function(app) {
  // Servir archivos estáticos con los tipos MIME correctos
  app.use('/static', express.static('build/static', {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

  // Proxy para Firestore
  app.use(
    '/google.firestore.v1.Firestore',
    createProxyMiddleware({
      target: 'https://firestore.googleapis.com',
      changeOrigin: true,
      secure: true,
      ws: true,
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('Origin', 'http://localhost:3000');
      },
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
    })
  );
};
