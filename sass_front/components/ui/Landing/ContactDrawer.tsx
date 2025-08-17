"use client";
import {
  Box, Typography, Drawer, IconButton, TextField, Button, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

const contactSchema = (t: any) => z.object({
  name: z.string().min(1, t('errors.nameRequired') ?? 'El nombre es requerido.'),
  email: z.string().email(t('errors.invalidEmail') ?? 'Debe ser un email válido.'),
  message: z.string().min(10, t('errors.messageMin') ?? 'El mensaje debe tener al menos 10 caracteres.'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ open, onClose }: ContactDrawerProps) {
  const t = useTranslations('ContactDrawer');
  const schema = contactSchema(t);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simular envío a API
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(data);
    toast.success(t('successMessage'));
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: { xs: '90vw', sm: 400 }, p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {t('title')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {t('subtitle')}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 4, flexGrow: 1 }}>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field }) => (
                <TextField
                {...field}
                label={t('form.name')}
                fullWidth
                margin="normal"
                required
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
                <TextField
                {...field}
                label={t('form.email')}
                type="email"
                fullWidth
                margin="normal"
                required
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => (
                <TextField
                {...field}
                label={t('form.message')}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                required
                error={!!errors.message}
                helperText={errors.message?.message}
              />
            )}
          />
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : t('form.submit')}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
