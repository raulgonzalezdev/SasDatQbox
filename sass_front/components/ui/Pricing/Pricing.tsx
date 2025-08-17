'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box, Card, CardContent, CardActions, Grid, ToggleButtonGroup, ToggleButton, Container, Chip } from '@mui/material';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description: string;
}

interface Price {
  id: string;
  unit_amount: number;
  currency: string;
  interval: 'month' | 'year';
}

interface ProductWithPrices extends Product {
  prices: Price[];
  mostPopular?: boolean;
}

interface Subscription {
  id: string;
  status: string;
  // Add other subscription fields as needed
}

interface Props {
  user: any; // TODO: Replace with actual User type
  products: ProductWithPrices[];
  subscription: Subscription | null;
}

type BillingInterval = 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin'); // Redirigir a la página de inicio de sesión
    }

    // TODO: Implement actual Stripe checkout logic with FastAPI backend
    console.log(`Iniciando checkout para el precio: ${price.id}`);
    alert('Funcionalidad de checkout no implementada aún.');

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          No se encontraron planes de precios de suscripción.
        </Typography>
        <Typography variant="body1">
          Cree planes en su{' '}
          <Link
            href="https://dashboard.stripe.com/products"
            target="_blank"
            rel="noopener noreferrer"
            color="primary"
          >
            Panel de Stripe
          </Link>
          .
        </Typography>
      </Box>
    );
  } else {
    return (
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Planes de Precios Flexibles
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Elige el plan que mejor se adapte a tu práctica médica. Sin compromisos a largo plazo.
            </Typography>
            {/* El ToggleButton para mensual/anual puede quedar comentado si solo ofrecemos mensual por ahora */}
          </Box>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {products.map((product) => {
              const price = product?.prices?.find(
                (p) => p.interval === billingInterval
              );
              if (!price) return null;

              const isContactForPrice = price.unit_amount === null;
              const priceString = isContactForPrice
                ? 'Contactar'
                : new Intl.NumberFormat('es-ES', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format((price.unit_amount || 0) / 100);

              return (
                <Grid item key={product.id} xs={12} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      border: product.mostPopular ? 2 : 0,
                      borderColor: 'primary.main',
                      position: 'relative',
                    }}
                  >
                    {product.mostPopular && (
                      <Chip 
                        label="Más Popular" 
                        color="primary" 
                        sx={{ 
                          position: 'absolute', 
                          top: -12, 
                          left: '50%', 
                          transform: 'translateX(-50%)',
                          fontWeight: 'bold',
                        }} 
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, pt: product.mostPopular ? 4 : 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ minHeight: 60 }}>
                        {product.description}
                      </Typography>
                      <Typography variant="h4" component="p" sx={{ mt: 2 }}>
                        {priceString}
                        {!isContactForPrice && (
                          <Typography component="span" variant="subtitle1" color="text.secondary">
                            /mes
                          </Typography>
                        )}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => !isContactForPrice && handleStripeCheckout(price)}
                        href={isContactForPrice ? '/contact' : undefined}
                        component={isContactForPrice ? Link : 'button'}
                        disabled={priceIdLoading === price.id}
                      >
                        {isContactForPrice ? 'Contactar Ventas' : (subscription && product.id === subscription?.id ? 'Gestionar' : 'Suscribirse')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>
    );
  }
}
