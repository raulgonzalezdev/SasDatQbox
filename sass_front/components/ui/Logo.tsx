'use client';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Link from 'next/link';
import Logos from '/public/logo-doctorbox.png';

const LogoWrapper = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative', // Esencial para que next/image funcione correctamente
  borderRadius: '50%', // Hace el contenedor circular
  overflow: 'hidden', // Recorta la imagen para que se ajuste al círculo
  bgcolor: 'rgba(255,255,255,0.1)', // Un fondo sutil para el logo
  flexShrink: 0, // Evita que el logo se encoja en layouts flexibles
});

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  disabledLink?: boolean;
}

export default function Logo({ width = 32, height = 32, className, disabledLink = false }: LogoProps) {
  const logo = (
    <LogoWrapper 
      className={className}
      sx={{
        width: width,
        height: height,
        p: 0.5,
      }}
    >
      <Image
        src={Logos}
        alt=""
        fill
        priority
      />
    </LogoWrapper>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link href="/" style={{ textDecoration: 'none', display: 'block' }}>
      {logo}
    </Link>
  );
}
  