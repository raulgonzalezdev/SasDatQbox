import React from 'react';
import { ExpenseForm } from '@/components/pos/ExpenseForm';
import { router } from 'expo-router';

export default function NewExpenseScreen() {
  const handleSaveExpense = (expense: {
    date: string;
    category: string;
    value: string;
    provider: string;
    isPaid: boolean;
  }) => {
    // Aquí iría la lógica para guardar el gasto en la base de datos
    console.log('Expense saved:', expense);
    
    // Navegar de vuelta a la pantalla principal
    router.back();
  };

  return <ExpenseForm onSave={handleSaveExpense} />;
} 