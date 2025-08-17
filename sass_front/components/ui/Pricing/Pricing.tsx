'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Typography, Box, Card, CardContent, CardActions, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';

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
      <Box sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Planes de Precios
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Empiece a construir gratis, luego añada un plan de sitio para salir en vivo.
            Los planes de cuenta desbloquean características adicionales.
          </Typography>
          <ToggleButtonGroup
            value={billingInterval}
            exclusive
            onChange={(event, newInterval) => {
              if (newInterval !== null) {
                setBillingInterval(newInterval);
              }
            }}
            sx={{ mt: 4 }}
          >
            {intervals.includes('month') && (
              <ToggleButton value="month">
                Facturación Mensual
              </ToggleButton>
            )}
            {intervals.includes('year') && (
              <ToggleButton value="year">
                Facturación Anual
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: subscription && product.id === subscription?.id ? '2px solid primary.main' : 'none',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h4" component="p" sx={{ mt: 2 }}>
                      {priceString}
                      <Typography component="span" variant="subtitle1" color="text.secondary">
                        /{billingInterval === 'month' ? 'mes' : 'año'}
                      </Typography>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleStripeCheckout(price)}
                      disabled={priceIdLoading === price.id}
                    >
                      {subscription && product.id === subscription?.id ? 'Gestionar' : 'Suscribirse'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  }
}
