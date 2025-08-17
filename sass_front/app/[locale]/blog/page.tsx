import { Box, Typography, Container, Grid, Card, CardContent, CardActionArea, CardMedia, Chip, Button, Divider } from '@mui/material';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const blogPosts = [
  {
    slug: 'mejores-practicas-telemedicina',
    title: 'Las plataformas de telemedicina más populares que cumplen con la HIPAA',
    excerpt: 'Vivimos en un mundo tecnológicamente avanzado donde la tecnología impulsa todas las industrias y sectores...',
    category: 'Monitoreo remoto',
    image: 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_300/https://www.carestream.com/blog/wp-content/uploads/2018/10/AI-data-image.jpg',
    readingTime: '15 minutos de lectura',
  },
  {
    slug: 'integracion-ehr',
    title: 'Integración de EHR para proveedores de atención médica: desafíos y soluciones',
    excerpt: 'Los historiales médicos electrónicos se han convertido en parte integral del sistema en el sector sanitario...',
    category: 'Monitoreo remoto',
    image: 'https://www.origensalud.com/wp-content/uploads/2023/05/blog-min.png',
    readingTime: '12 minutos de lectura',
  },
  {
    slug: 'mejores-empresas-telemedicina-2025',
    title: 'Mejores empresas de desarrollo de aplicaciones de telemedicina en EE. UU. (2025)',
    excerpt: 'La telemedicina es un campo innovador y en rápido crecimiento, y existen numerosas empresas excelentes...',
    category: 'Telemedicina',
    image: 'https://media.istockphoto.com/id/1319031310/es/foto/m%C3%A9dico-que-escribe-una-receta-m%C3%A9dica.jpg?s=612x612&w=0&k=20&c=dRbSAjKFXJ8EZ4EbULL5fComouY4g4oUy_owPqF1vLs=',
    readingTime: '18 minutos de lectura',
  },
];

export default function BlogPage() {
  const t = useTranslations('Blog');
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" textAlign="center" fontWeight="bold" gutterBottom>
        {t('title')}
      </Typography>
      <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        {t('subtitle')}
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.slug}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardActionArea component={Link} href={`/blog/${post.slug}`}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.image}
                    alt={post.title}
                  />
                  <Chip 
                    label={post.category} 
                    sx={{ position: 'absolute', top: 16, left: 16, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }} 
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">{post.title}</Typography>
                  <Typography color="text.secondary" paragraph>{post.excerpt}</Typography>
                </CardContent>
              </CardActionArea>
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button component={Link} href={`/blog/${post.slug}`} size="small">{t('continueReading')}</Button>
                <Typography variant="body2" color="text.secondary">{post.readingTime}</Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
