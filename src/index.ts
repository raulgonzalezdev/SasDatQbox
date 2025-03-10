import dotenv from 'dotenv';
import app from './app';

// Cargar variables de entorno
dotenv.config();

// Puerto
const PORT = process.env.PORT || 4000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
}); 