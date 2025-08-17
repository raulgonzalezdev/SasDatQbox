import Pricing from '@/components/ui/Pricing/Pricing';
import { useUserDetails, useProducts, useSubscription } from '@/lib/hooks/useData';

export default function PricingPage() {
  const { data: user, isLoading: loadingUser, error: userError } = useUserDetails();
  const { data: products, isLoading: loadingProducts, error: productsError } = useProducts();
  const { data: subscription, isLoading: loadingSubscription, error: subscriptionError } = useSubscription();

  if (loadingUser || loadingProducts || loadingSubscription) {
    return <div>Cargando planes de precios...</div>;
  }

  if (userError || productsError || subscriptionError) {
    return <div>Error: {userError?.message || productsError?.message || subscriptionError?.message}</div>;
  }

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
