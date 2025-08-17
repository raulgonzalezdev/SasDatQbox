import { Box, Typography, Container, Divider, CardMedia } from '@mui/material';
import { notFound } from 'next/navigation';

// Datos mock actualizados
const blogPosts = [
  {
    slug: 'mejores-practicas-telemedicina',
    title: 'Las plataformas de telemedicina más populares que cumplen con la HIPAA',
    content: '<p>Vivimos en un mundo tecnológicamente avanzado donde la tecnología impulsa todas las industrias y sectores. De todos ellos, un sector que experimentó un a gran revolución fue el de la salud. Durante la COVI D-19, cuando se restringieron las reuniones públicas, satisfacer las necesidades de atención médica públi ca se convirtió en un gran desafío. Fue entonces cua ndo las plataformas de telemedicina y telemedicina entr aron en escena [...].</p>',
    author: 'Dra. Ana López',
    date: '15 de Julio, 2024',
    image: 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_300/https://www.carestream.com/blog/wp-content/uploads/2018/10/AI-data-image.jpg',
    category: 'Monitoreo remoto',
    readingTime: '15 minutos de lectura',
  },
  {
    slug: 'futuro-de-recetas-electronicas',
    title: 'El Futuro de las Recetas Médicas es Digital',
    content: '<p>Contenido del artículo sobre recetas electrónicas...</p>',
    author: 'Dr. Carlos García',
    date: '10 de Julio, 2024',
  },
  {
    slug: 'integracion-ehr',
    title: 'Integración de EHR: La Revolución en la Salud Digital',
    content: '<p>La integración de EHR (Historia Clínica Electrónica) es un paso crucial en la transformación de la salud digital. En esta era de la tecnología, la capacidad de acceder a datos médicos en tiempo real y de diferentes proveedores es fundamental para proporcionar atención más precisa y personalizada.</p>',
    author: 'Dra. María Rodríguez',
    date: '05 de Julio, 2024',
    image: 'https://www.origensalud.com/wp-content/uploads/2023/05/blog-min.png',
    category: 'Innovación',
    readingTime: '10 minutos de lectura',
  },
  {
    slug: 'mejores-empresas-telemedicina-2025',
    title: 'Las 10 Mejores Empresas de Telemedicina para 2025',
    content: '<p>La telemedicina ha demostrado ser una herramienta esencial en la era de la pandemia. Con el avance de la tecnología y la demanda creciente por la atención médica a distancia, las empresas de telemedicina se han convertido en protagonistas de la industria. Aquí te presentamos las 10 mejores empresas de telemedicina que están liderando el mercado.</p>',
    author: 'Dr. Luis Martínez',
    date: '01 de Julio, 2024',
    image: 'https://media.istockphoto.com/id/1319031310/es/foto/m%C3%A9dico-que-escribe-una-receta-m%C3%A9dica.jpg?s=612x612&w=0&k=20&c=dRbSAjKFXJ8EZ4EbULL5fComouY4g4oUy_owPqF1vLs=',
    category: 'Mercado',
    readingTime: '12 minutos de lectura',
  },
];

const getPostData = (slug: string) => blogPosts.find((post) => post.slug === slug);

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
        Por {post.author} • {post.date} • {post.readingTime}
      </Typography>
      <Divider sx={{ mb: 4 }} />
      <CardMedia
        component="img"
        height="400"
        image={post.image}
        alt={post.title}
        sx={{ borderRadius: 2, mb: 4 }}
      />
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
