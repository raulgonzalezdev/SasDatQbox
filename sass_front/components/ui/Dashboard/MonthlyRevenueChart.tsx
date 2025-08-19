'use client';
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Typography, Paper } from '@mui/material';
import { useTranslations } from 'next-intl';

export default function MonthlyRevenueChart() {
  const t = useTranslations('Dashboard');

  // Datos de ejemplo usando las traducciones de meses
  const chartData = {
    labels: [
      t('months.0'), // Enero/January
      t('months.1'), // Febrero/February
      t('months.2'), // Marzo/March
      t('months.3'), // Abril/April
      t('months.4'), // Mayo/May
      t('months.5'), // Junio/June
    ],
    series: [
      { 
        data: [2400, 1398, 9800, 3908, 4800, 3800], 
        label: t('chart.revenue'), 
        id: 'revenueId' 
      },
      { 
        data: [2000, 1500, 8000, 3000, 4000, 3200], 
        label: t('chart.expenses'), 
        id: 'expensesId' 
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {t('chart.title')}
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
