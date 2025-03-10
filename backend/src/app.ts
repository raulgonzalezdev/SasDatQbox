import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Importar rutas
import userRoutes from './routes/userRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';

// Configuración de variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Middleware para parsear JSON (excepto para la ruta de webhook)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.originalUrl === '/api/subscriptions/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Ruta de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API funcionando correctamente',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Ruta de diagnóstico para Supabase
app.get('/api/diagnostics/supabase', (req: Request, res: Response) => {
  (async () => {
    try {
      console.log('🔍 [DIAGNOSTICS] Verificando conexión con Supabase');
      
      const startTime = Date.now();
      const { supabase } = await import('./config/supabase');
      
      // Intentar hacer una consulta simple
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .limit(1);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      if (error) {
        console.error('❌ [DIAGNOSTICS] Error al conectar con Supabase:', error.message);
        return res.status(500).json({
          status: 'error',
          message: 'Error al conectar con Supabase',
          error: error.message,
          details: {
            supabaseUrl: process.env.SUPABASE_URL,
            responseTime: `${responseTime}ms`,
          }
        });
      }
      
      console.log('✅ [DIAGNOSTICS] Conexión con Supabase verificada correctamente');
      console.log(`✅ [DIAGNOSTICS] Tiempo de respuesta: ${responseTime}ms`);
      
      res.status(200).json({
        status: 'success',
        message: 'Conexión con Supabase verificada correctamente',
        details: {
          supabaseUrl: process.env.SUPABASE_URL,
          responseTime: `${responseTime}ms`,
          usersCount: count
        }
      });
    } catch (error: any) {
      console.error('❌ [DIAGNOSTICS] Error al verificar conexión con Supabase:', error.message);
      console.error('❌ [DIAGNOSTICS] Stack de error:', error.stack);
      
      res.status(500).json({
        status: 'error',
        message: 'Error al verificar conexión con Supabase',
        error: error.message
      });
    }
  })();
});

// Ruta para probar directamente la autenticación de Supabase
app.post('/api/auth/login-direct', express.json(), (req: Request, res: Response) => {
  (async () => {
    try {
      console.log('🔍 [AUTH-DIRECT] Iniciando proceso de login directo');
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          status: 'error',
          message: 'Por favor, proporciona email y contraseña'
        });
      }
      
      console.log('🔄 [AUTH-DIRECT] Intentando autenticar con Supabase Auth');
      const { supabase } = await import('./config/supabase');
      
      const startTime = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      const endTime = Date.now();
      
      if (error) {
        console.error('❌ [AUTH-DIRECT] Error en autenticación:', error.message);
        return res.status(401).json({
          status: 'error',
          message: error.message,
          details: {
            responseTime: `${endTime - startTime}ms`
          }
        });
      }
      
      console.log('✅ [AUTH-DIRECT] Autenticación exitosa para:', email);
      res.status(200).json({
        status: 'success',
        data: {
          user: data.user,
          session: data.session,
          responseTime: `${endTime - startTime}ms`
        }
      });
    } catch (error: any) {
      console.error('❌ [AUTH-DIRECT] Error en el proceso de login directo:', error.message);
      console.error('❌ [AUTH-DIRECT] Stack de error:', error.stack);
      
      res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  })();
});

// Manejo de rutas no encontradas
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `No se encontró la ruta ${req.originalUrl}`
  });
});

// Middleware de manejo de errores global
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Error interno del servidor'
  });
});

export default app; 