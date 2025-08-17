'use client';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Paper } from '@mui/material';

// Datos de ejemplo
const chartData = {
  labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
  series: [
    { data: [2400, 1398, 9800, 3908, 4800, 3800], label: 'Ingresos', id: 'revenueId' },
    { data: [2000, 1500, 8000, 3000, 4000, 3200], label: 'Gastos', id: 'expensesId' },
  ],
};

export default function MonthlyRevenueChart() {
  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Ingresos Mensuales
      </Typography>
      <div style={{ flexGrow: 1 }}>
        <BarChart
          xAxis={[{ scaleType: 'band', data: chartData.labels }]}
          series={chartData.series}
          // width y height se ajustarán al contenedor gracias al flexGrow
        />
      </div>
    </Paper>
  );
}
