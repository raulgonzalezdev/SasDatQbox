import { Box, Typography, Container, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import Link from 'next/link';

// Datos mock para los artículos del blog
const blogPosts = [
  {
    slug: 'mejores-practicas-telemedicina',
    title: '5 Mejores Prácticas para una Consulta de Telemedicina Exitosa',
    excerpt: 'Descubre cómo mejorar la experiencia de tus pacientes en las consultas virtuales con estos sencillos consejos.',
    author: 'Dra. Ana López',
    date: '15 de Julio, 2024',
  },
  {
    slug: 'futuro-de-recetas-electronicas',
    title: 'El Futuro de las Recetas Médicas es Digital',
    excerpt: 'Analizamos las ventajas de la prescripción electrónica tanto para médicos como para pacientes.',
    author: 'Dr. Carlos García',
    date: '10 de Julio, 2024',
  },
];

export default function BlogPage() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" textAlign="center" fontWeight="bold" gutterBottom>
        Nuestro Blog
      </Typography>
      <Typography variant="h5" color="text.secondary" textAlign="center" sx={{ mb: 6 }}>
        Consejos, noticias y mejores prácticas para profesionales de la salud en la era digital.
      </Typography>
      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} sm={6} key={post.slug}>
            <CardActionArea component={Link} href={`/blog/${post.slug}`}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>{post.title}</Typography>
                  <Typography color="text.secondary" paragraph>{post.excerpt}</Typography>
                  <Typography variant="body2" color="text.secondary">{post.author} • {post.date}</Typography>
                </CardContent>
              </Card>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
