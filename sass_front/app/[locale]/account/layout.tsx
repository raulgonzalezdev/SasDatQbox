'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/ui/DashboardLayout';
import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams } from 'next/navigation';

export default function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { status } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/${locale}/signin`);
    }
  }, [status, router, locale]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}
