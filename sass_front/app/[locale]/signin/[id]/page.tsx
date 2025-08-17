import { redirect } from 'next/navigation';
import { Box, Typography, Container } from '@mui/material';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import SignUp from '@/components/ui/AuthForms/Signup';

// Este archivo ahora actúa como un enrutador simple para los diferentes formularios de autenticación.
// La lógica de autenticación real se maneja dentro de cada componente de formulario.

export default async function SignInPage({ params }: { params: { id: string } }) {
  const viewProp = params.id;

  // Redireccionar si el usuario ya está logueado (esto se manejará a nivel de API/sesión)
  const user = null; // Placeholder: la verificación real del usuario debe hacerse a través de la API de FastAPI
  if (user) {
    return redirect('/');
  }

  let ComponentToRender;
  let title = '';

  switch (viewProp) {
    case 'password_signin':
      ComponentToRender = PasswordSignIn;
      title = 'Iniciar Sesión';
      break;
    case 'email_signin':
      ComponentToRender = EmailSignIn;
      title = 'Iniciar Sesión con Enlace Mágico';
      break;
    case 'forgot_password':
      ComponentToRender = ForgotPassword;
      title = 'Restablecer Contraseña';
      break;
    case 'update_password':
      ComponentToRender = UpdatePassword;
      title = 'Actualizar Contraseña';
      break;
    case 'signup':
      ComponentToRender = SignUp;
      title = 'Registrarse';
      break;
    case 'oauth_signin': // Añadido para manejar explícitamente OAuth si es necesario
      ComponentToRender = OauthSignIn;
      title = 'Iniciar Sesión con OAuth';
      break;
    default:
      // Si el ID no coincide con ninguna vista, redirigir a la vista de inicio de sesión por defecto
      return redirect('/signin/password_signin');
  }

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          {title}
        </Typography>
        {ComponentToRender && <ComponentToRender />}
      </Box>
    </Container>
  );
}
