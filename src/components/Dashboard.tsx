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
import { useLanguage } from '../LanguageContext';

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
  const { t, language } = useLanguage();
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
    { label: t('totalStudy'), value: `${(stats.totalTime / 60).toFixed(1)} ${t('hours')}`, icon: <TimeIcon color="primary" /> },
    { label: t('completedModules'), value: stats.modulesCompleted, icon: <CompletedIcon color="primary" /> },
    { label: t('successScore'), value: `%${stats.averageScore}`, icon: <TrophyIcon color="primary" /> },
    { label: t('activeDays'), value: stats.activeDays, icon: <TimelineIcon color="primary" /> },
  ];

  // Calculate progress per grade
  const gradeProgress = [5, 6, 7, 8].map(grade => {
    const gradeModules = progress.filter(p => p.grade === grade);
    const totalModules = 2; // Fixed for now based on GradeView.tsx
    const totalScore = gradeModules.reduce((acc, curr) => acc + curr.score, 0);
    const percentage = (totalScore / (totalModules * 100)) * 100;
    
    const labels: Record<number, string> = {
      5: t('grade5Topic'),
      6: t('grade6Topic'),
      7: t('grade7Topic'),
      8: t('grade8Topic'),
    };

    return { label: labels[grade], value: Math.round(percentage) };
  });

  const badges = [
    { name: t('badgeSpeedLabel'), desc: t('badgeSpeedDesc'), icon: <SpeedIcon />, color: '#ef4444' },
    { name: t('badgeChaosLabel'), desc: t('badgeChaosDesc'), icon: <ChaosIcon />, color: '#8b5cf6' },
    { name: t('badgeMeticulousLabel'), desc: t('badgeMeticulousDesc'), icon: <RareIcon />, color: '#f59e0b' },
    { name: t('badgeFirstSparkLabel'), desc: t('badgeFirstSparkDesc'), icon: <HotIcon />, color: '#10b981' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t('dashboard')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('performanceData')}</Typography>
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
              <Box sx={{ p: 1, borderRadius: 1, backgroundColor: 'action.hover', display: 'flex' }}>
                {card.icon}
              </Box>
              <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary' }}>{card.label}</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{card.value}</Typography>
          </Card>
        ))}
      </Box>

      {/* Badges Section */}
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{t('earnedBadges')}</Typography>
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
              <Typography variant="caption" color="text.secondary">{t('opened')}</Typography>
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
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>{t('trainingProgress')}</Typography>
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
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 700 }}>{t('allLabNotes')}</Typography>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 400, pr: 1 }}>
             {notes.length === 0 ? (
               <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ScienceIcon sx={{ fontSize: 48, color: 'divider', mb: 2 }} />
                  <Typography color="text.secondary">{t('noNotes')}</Typography>
               </Box>
             ) : (
               <List sx={{ p: 0 }}>
                 {notes.map((n, idx) => (
                   <React.Fragment key={n.id}>
                     <ListItem sx={{ px: 0, py: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                           <Chip label={n.topic} size="small" variant="outlined" color="primary" sx={{ fontWeight: 700, borderRadius: 1 }} />
                           <Typography variant="caption" color="text.secondary">
                              {new Date(n.timestamp).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                           </Typography>
                        </Box>
                        <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 2, width: '100%' }}>
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
