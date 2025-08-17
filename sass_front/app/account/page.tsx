import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { useUserDetails, useSubscription } from '@/lib/hooks/useData';
import { Box, Typography, Container } from '@mui/material';

export default function Account() {
  const { data: userDetails, isLoading: loadingUserDetails, error: userDetailsError } = useUserDetails();
  const { data: subscription, isLoading: loadingSubscription, error: subscriptionError } = useSubscription();

  if (loadingUserDetails || loadingSubscription) {
    return <Typography>Cargando...</Typography>; // O un componente de carga más sofisticado
  }

  if (userDetailsError || subscriptionError) {
    return <Typography color="error">Error: {userDetailsError?.message || subscriptionError?.message}</Typography>; // Manejo de errores
  }

  if (!userDetails) {
    return redirect('/signin');
  }

  return (
    <Container component="section" maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Cuenta
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Nos asociamos con Stripe para una facturación simplificada.
        </Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <CustomerPortalForm subscription={subscription} />
        <NameForm userName={userDetails?.full_name ?? ''} />
        <EmailForm userEmail={userDetails?.email} />
      </Box>
    </Container>
  );
}
