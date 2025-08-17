import { Box, Typography, Container, Divider } from '@mui/material';
import { notFound } from 'next/navigation';

// Datos mock (deberían estar en un lugar centralizado en el futuro)
const blogPosts = [
  {
    slug: 'mejores-practicas-telemedicina',
    title: '5 Mejores Prácticas para una Consulta de Telemedicina Exitosa',
    content: '<p>Contenido del artículo sobre telemedicina...</p>',
    author: 'Dra. Ana López',
    date: '15 de Julio, 2024',
  },
  {
    slug: 'futuro-de-recetas-electronicas',
    title: 'El Futuro de las Recetas Médicas es Digital',
    content: '<p>Contenido del artículo sobre recetas electrónicas...</p>',
    author: 'Dr. Carlos García',
    date: '10 de Julio, 2024',
  },
];

// Función para obtener los datos de un post por su slug
const getPostData = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug);
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostData(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        Por {post.author} • {post.date}
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <Box 
        component="article" 
        dangerouslySetInnerHTML={{ __html: post.content }} 
        sx={{
          '& p': { 
            lineHeight: 1.7, 
            fontSize: '1.1rem',
            marginBottom: '1.5rem',
          },
        }}
      />
    </Container>
  );
}
