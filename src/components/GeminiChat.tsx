import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { Psychology as GeminiIcon } from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

const GeminiChat: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Container maxWidth="md" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 6, 
          textAlign: 'center', 
          borderRadius: 6, 
          border: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <GeminiIcon sx={{ fontSize: 100, color: 'primary.main', opacity: 0.5 }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>{t('aiAssistantTitle')}</Typography>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 600 }}>{t('inDevelopment')}</Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default GeminiChat;
