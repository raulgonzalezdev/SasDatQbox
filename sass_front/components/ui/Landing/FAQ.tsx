"use client";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Container } from '@mui/material';
import { useTranslations, useMessages } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQ');
  // For arrays/complex structures read the raw messages object to avoid serialization issues
  const messages = useMessages();
  const questions = (messages?.FAQ?.questions ?? []) as Array<{ question: string; answer: string }>;

  return (
    <Box id="faq" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Typography variant="h2" component="h2" textAlign="center" fontWeight="bold" sx={{ mb: 6 }}>
          {t('title')}
        </Typography>
        <Box>
          {questions && questions.map((item, index) => (
            <Accordion key={index} elevation={2} sx={{ '&:before': { display: 'none' }, mb: 1 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
              >
                <Typography variant="h6">{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
