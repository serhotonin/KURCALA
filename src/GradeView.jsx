import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, CardActionArea, Grid as Grid2, Chip, LinearProgress } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import AssignmentIcon from '@mui/icons-material/Assignment';

const topicsData = {
  '5': [
    { id: '5-1', title: 'Sürtünme Kuvveti (Buzul Gezegeni)', description: 'Buzul gezegeninde sürtünme kuvvetinin etkilerini keşfedin.', status: 'completed', progress: 100 },
    { id: '5-2', title: 'Elektrik Devreleri (Karanlık Mahalle)', description: 'Karanlık mahalleye ışık getirmek için elektrik devreleri kurun.', status: 'in-progress', progress: 45 },
  ],
  '6': [
    { id: '6-1', title: 'Güneş Sistemi (Yörünge İstasyonu)', description: 'Yörünge istasyonundan güneş sisteminin sırlarını çözün.', status: 'not-started', progress: 0 },
    { id: '6-2', title: 'Yoğunluk (Kayıp Kıta)', description: 'Kayıp kıtadaki gizemli maddelerin yoğunluklarını hesaplayın.', status: 'not-started', progress: 0 },
  ],
  '7': [
    { id: '7-1', title: 'Karışımlar (Simyacı İksiri)', description: 'Simyacının gizli laboratuvarında karışımları ayırın.', status: 'not-started', progress: 0 },
    { id: '7-2', title: 'Asitler ve Bazlar (Sızıntı)', description: 'Tehlikeli sızıntıyı nötralize etmek için asit-baz tepkimelerini kullanın.', status: 'not-started', progress: 0 },
  ],
  '8': [
    { id: '8-1', title: 'Sıvı Basıncı (Baraj Çatlağı)', description: 'Baraj çatlağını onarmak için sıvı basıncı prensiplerini uygulayın.', status: 'not-started', progress: 0 },
    { id: '8-2', title: 'İklim ve Hava (OpenWeather Canlı Veri)', description: 'Gerçek zamanlı hava verileri ile iklim değişikliklerini analiz edin.', status: 'not-started', progress: 0 },
  ]
};

const StatusChip = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Chip icon={<CheckCircleOutlineIcon fontSize="small" />} label="Tamamlandı" color="success" size="small" variant="outlined" sx={{ fontWeight: 500 }} />;
    case 'in-progress':
      return <Chip icon={<PlayCircleOutlineIcon fontSize="small" />} label="Devam Ediyor" color="warning" size="small" variant="outlined" sx={{ fontWeight: 500 }} />;
    default:
      return <Chip icon={<AssignmentIcon fontSize="small" />} label="Başlanmadı" color="default" size="small" variant="outlined" sx={{ fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }} />;
  }
};

function GradeView() {
  const { gradeId } = useParams();
  const navigate = useNavigate();
  const topics = topicsData[gradeId] || [];

  return (
    <Box sx={{ width: '100%', mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
        <DashboardIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
          {gradeId}. Sınıf Müfredatı
        </Typography>
      </Box>

      <Grid2 container spacing={3} direction="column">
        {topics.map((topic) => (
          <Grid2 item xs={12} key={topic.id}>
            <Card
              sx={{
                bgcolor: 'background.paper',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardActionArea
                onClick={() => navigate(`/grade/${gradeId}/topic/${topic.id}`)}
                sx={{ p: 2 }}
              >
                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" component="h2" gutterBottom sx={{ color: 'text.primary', mb: 0.5 }}>
                        {topic.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '80%' }}>
                        {topic.description}
                      </Typography>
                    </Box>
                    <StatusChip status={topic.status} />
                  </Box>

                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                     <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={topic.progress}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'rgba(255,255,255,0.05)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: topic.status === 'completed' ? 'success.main' : 'primary.main'
                            }
                          }}
                        />
                     </Box>
                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, minWidth: 35 }}>
                       %{topic.progress}
                     </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}

export default GradeView;
