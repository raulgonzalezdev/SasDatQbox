import { Box, Typography, Container, Paper } from '@mui/material';
import { useTranslations, useLocale } from 'next-intl';

export default function SecurityPage() {
  const locale = useLocale();
  const t = useTranslations('Security');

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          {t('title')}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          {t('subtitle')}
        </Typography>
        <Typography paragraph>
          {t('p1')}
        </Typography>
        <Typography paragraph>
          {t('p2')}
        </Typography>
      </Paper>
    </Container>
  );
}
