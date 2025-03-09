import React from 'react';
import { ProviderForm } from '@/components/pos/ProviderForm';
import { router } from 'expo-router';

export default function NewProviderScreen() {
  const handleSaveProvider = (provider: {
    name: string;
    phone: string;
    email: string;
    address: string;
  }) => {
    // Aquí iría la lógica para guardar el proveedor en la base de datos
    console.log('Provider saved:', provider);
    
    // Navegar de vuelta a la pantalla anterior
    router.back();
  };

  return <ProviderForm onSave={handleSaveProvider} />;
} 