import app from './app';
import dotenv from 'dotenv';

// Configuración de variables de entorno
dotenv.config();

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT} en modo ${process.env.NODE_ENV}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! 💥 Cerrando servidor...');
  console.error(err.name, err.message);
  
  server.close(() => {
    process.exit(1);
  });
});

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECIBIDO. Cerrando servidor graciosamente');
  
  server.close(() => {
    console.log('💥 Proceso terminado!');
  });
}); 