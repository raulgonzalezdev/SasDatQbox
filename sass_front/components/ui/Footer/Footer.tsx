'use client';
import { Box, Typography, Container, Grid, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';
import { useTranslations } from 'next-intl';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const FooterLink = ({ href, children, onClick }: FooterLinkProps) => (
  <MuiLink
    component={href ? Link : 'button'}
    href={href || '#'}
    onClick={onClick}
    variant="body1"
    sx={{
      color: 'text.secondary',
      textDecoration: 'none',
      '&:hover': {
        color: 'text.primary',
        textDecoration: 'underline',
      },
    }}
  >
    {children}
  </MuiLink>
);

interface FooterProps {
  onContactClick: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
  const t = useTranslations('Footer');

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Logo width={100} height={100} />
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} BoxDoctor. {t('rights') ?? 'Todos los derechos reservados.'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>{t('product')}</Typography>
            <FooterLink href="/#features">{t('features')}</FooterLink>
            <br />
            <FooterLink href="/#pricing">{t('pricing')}</FooterLink>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>{t('company')}</Typography>
            <FooterLink href="/about">{t('about')}</FooterLink>
            <br />
            <FooterLink href="/blog">{t('blog')}</FooterLink>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>{t('legal')}</Typography>
            <FooterLink href="/security">{t('security')}</FooterLink>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" gutterBottom>{t('contact')}</Typography>
            <FooterLink href="" onClick={onContactClick}>{t('contactSales')}</FooterLink>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
