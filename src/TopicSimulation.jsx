import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Typography, Button, Container, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

function TopicSimulation() {
  const { gradeId, topicId } = useParams();
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/grade/${gradeId}`)}
        sx={{ mb: 3, color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.05)' } }}
      >
        Müfredata Dön
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
         <IntegrationInstructionsIcon color="primary" sx={{ fontSize: 28 }} />
         <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary' }}>
           İnteraktif Öğrenim Modülü: {topicId}
         </Typography>
      </Box>

      <Card
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.paper',
          p: { xs: 2, md: 6 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle background pattern to look like a workspace */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          opacity: 0.03,
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          pointerEvents: 'none'
        }} />

        <CircularProgress size={48} thickness={4} sx={{ mb: 3, color: 'text.secondary' }} />

        <Typography variant="h5" component="h2" gutterBottom sx={{ color: 'text.primary', fontWeight: 500, mb: 2, textAlign: 'center', zIndex: 1 }}>
          Simülasyon Ortamı
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 6, textAlign: 'center', maxWidth: 400, zIndex: 1 }}>
          {gradeId}. Sınıf müfredatı kapsamındaki {topicId} numaralı görev için geliştirilmiş olan etkileşimli P5.js/Matter.js modülü yükleniyor. Lütfen bekleyiniz veya manuel olarak başlatınız.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<PlayArrowIcon />}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            textTransform: 'none',
            zIndex: 1,
            boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)'
          }}
        >
          Çalışma Alanını Başlat
        </Button>
      </Card>
    </Box>
  );
}

export default TopicSimulation;
