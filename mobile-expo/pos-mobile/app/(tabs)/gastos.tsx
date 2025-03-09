import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ExpenseForm } from '@/components/pos/ExpenseForm';

export default function GastosScreen() {
  const handleSaveExpense = (expense: any) => {
    console.log('Expense saved:', expense);
    // Aquí iría la lógica para guardar el gasto
  };

  return (
    <View style={styles.container}>
      <ExpenseForm onSave={handleSaveExpense} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 