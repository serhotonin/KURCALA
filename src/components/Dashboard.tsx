import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  LinearProgress,
  Avatar,
  Tooltip,
  Divider,
  List,
  ListItem,
  Chip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  AssignmentTurnedIn as CompletedIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Speed as SpeedIcon,
  Cyclone as ChaosIcon,
  AutoAwesome as RareIcon,
  LocalFireDepartment as HotIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

interface Stats {
  totalTime: number;
  modulesCompleted: number;
  averageScore: number;
  activeDays: number;
}

interface ModuleProgress {
  grade: number;
  topic: string;
  completed: number;
  score: number;
}

interface LabNote {
  id: number;
  topic: string;
  hypothesis: string;
  observation: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);

  useEffect(() => {
    // Fetch stats
    fetch('http://localhost:3001/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to fetch stats:', err));

    // Fetch progress
    fetch('http://localhost:3001/api/progress/all')
      .then((res) => res.json())
      .then((data) => setProgress(data))
      .catch((err) => console.error('Failed to fetch progress:', err));

    // Fetch all notes
    fetch('http://localhost:3001/api/notes/all')
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error('Failed to fetch all notes:', err));
  }, []);

  if (!stats) return <LinearProgress />;

  const statCards = [
    { label: 'Toplam Çalışma', value: `${(stats.totalTime / 60).toFixed(1)} Saat`, icon: <TimeIcon color="primary" /> },
    { label: 'Tamamlanan Modüller', value: stats.modulesCompleted, icon: <CompletedIcon color="primary" /> },
    { label: 'Başarı Puanı', value: `%${stats.averageScore}`, icon: <TrophyIcon color="primary" /> },
    { label: 'Aktif Günler', value: stats.activeDays, icon: <TimelineIcon color="primary" /> },
  ];

  // Calculate progress per grade
  const gradeProgress = [5, 6, 7, 8].map(grade => {
    const gradeModules = progress.filter(p => p.grade === grade);
    const totalModules = 2; // Fixed for now based on GradeView.tsx
    const totalScore = gradeModules.reduce((acc, curr) => acc + curr.score, 0);
    const percentage = (totalScore / (totalModules * 100)) * 100;
    
    const labels: Record<number, string> = {
      5: '5. Sınıf: Kuvvet ve Hareket',
      6: '6. Sınıf: Güneş Sistemi',
      7: '7. Sınıf: Karışımlar',
      8: '8. Sınıf: Basınç',
    };

    return { label: labels[grade], value: Math.round(percentage) };
  });

  const badges = [
    { name: 'Hız Tutkunu', desc: 'Bir deneyi 2 dakikadan kısa sürede bitirdi.', icon: <SpeedIcon />, color: '#ef4444' },
    { name: 'Kaos Teorisyeni', desc: 'Serbest modda sistem sınırlarını zorladı.', icon: <ChaosIcon />, color: '#8b5cf6' },
    { name: 'Titiz Araştırmacı', desc: 'Laboratuvar defterine 10+ gözlem yazdı.', icon: <RareIcon />, color: '#f59e0b' },
    { name: 'İlk Kıvılcım', desc: 'İlk elektrik devresini başarıyla kurdu.', icon: <HotIcon />, color: '#10b981' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Panel</Typography>
        <Typography variant="h6" color="text.secondary">AETHER Laboratuvarlarındaki gerçek zamanlı performans verileriniz.</Typography>
      </Box>

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 6
        }}
      >
        {statCards.map((card) => (
          <Card key={card.label} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'rgba(0,0,0,0.03)', display: 'flex' }}>
                {card.icon}
              </Box>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>{card.label}</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{card.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* Badges Section */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Kazanılan Rozetler</Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 6
        }}
      >
        {badges.map((badge) => (
          <Tooltip title={badge.desc} key={badge.name} arrow>
            <Card 
              sx={{ 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { transform: 'translateY(-5px)', borderColor: badge.color, boxShadow: `0 10px 20px -10px ${badge.color}` }
              }}
            >
              <Avatar sx={{ bgcolor: badge.color, width: 56, height: 56, mb: 2, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {badge.icon}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{badge.name}</Typography>
              <Typography variant="caption" color="text.secondary">Açıldı</Typography>
            </Card>
          </Tooltip>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4
        }}
      >
        {/* Progress Card */}
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Eğitim İlerlemesi</Typography>
          <Stack spacing={4}>
            {gradeProgress.map((item) => (
              <Box key={item.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.value}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={item.value} sx={{ height: 8, borderRadius: 4 }} />
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Global Notes Card */}
        <Card sx={{ p: 4, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>Tüm Laboratuvar Notları</Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400, pr: 1 }}>
             {notes.length === 0 ? (
               <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ScienceIcon sx={{ fontSize: 48, color: 'divider', mb: 2 }} />
                  <Typography color="text.secondary">Henüz kayıtlı bir notunuz bulunmuyor.</Typography>
               </Box>
             ) : (
               <List sx={{ p: 0 }}>
                 {notes.map((n, idx) => (
                   <React.Fragment key={n.id}>
                     <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                           <Chip label={n.topic} size="small" variant="outlined" color="primary" sx={{ fontWeight: 700, borderRadius: 1 }} />
                           <Typography variant="caption" color="text.secondary">
                              {new Date(n.timestamp).toLocaleString('tr-TR')}
                           </Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 2, width: '100%' }}>
                           <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>H: {n.hypothesis}</Typography>
                           <Typography variant="body2" color="text.secondary">G: {n.observation}</Typography>
                        </Box>
                     </ListItem>
                     {idx < notes.length - 1 && <Divider sx={{ opacity: 0.5 }} />}
                   </React.Fragment>
                 ))}
               </List>
             )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
