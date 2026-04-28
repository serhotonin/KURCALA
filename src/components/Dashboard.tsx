import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  AssignmentTurnedIn as CompletedIcon,
  EmojiEvents as TrophyIcon,
  AccessTime as TimeIcon,
  Science as ScienceIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocalFireDepartment as HotIcon,
  Opacity as WaterIcon,
  WbSunny as SunIcon,
  Thunderstorm as StormIcon
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

const BadgeCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'earned' && prop !== 'badgeColor',
})<{ earned: boolean; badgeColor: string }>(({ theme, earned, badgeColor }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid',
  borderColor: earned ? alpha(badgeColor, 0.3) : 'transparent',
  background: earned 
    ? `linear-gradient(145deg, ${alpha(badgeColor, 0.05)}, ${alpha(badgeColor, 0.01)})`
    : theme.palette.action.hover,
  filter: earned ? 'none' : 'grayscale(1) opacity(0.5)',
  '&:hover': {
    transform: earned ? 'translateY(-8px)' : 'none',
    borderColor: earned ? badgeColor : 'transparent',
    boxShadow: earned ? `0 12px 24px -10px ${alpha(badgeColor, 0.5)}` : 'none',
  }
}));

const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [notes, setNotes] = useState<LabNote[]>([]);
  const [progress, setProgress] = useState<ModuleProgress[]>([]);
  
  // Edit State
  const [editingNote, setEditingNote] = useState<LabNote | null>(null);
  const [editH, setEditH] = useState('');
  const [editO, setEditO] = useState('');

  const refreshData = () => {
    fetch('http://localhost:3001/api/stats')
      .then(res => res.ok ? res.json() : null)
      .then(data => data && setStats(data))
      .catch(err => console.error(err));
      
    fetch('http://localhost:3001/api/progress/all')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setProgress(data) : setProgress([]))
      .catch(err => {
        console.error(err);
        setProgress([]);
      });

    fetch('http://localhost:3001/api/notes/all')
      .then(res => res.ok ? res.json() : [])
      .then(data => Array.isArray(data) ? setNotes(data) : setNotes([]))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleDeleteNote = (id: number) => {
    if (window.confirm(language === 'tr' ? 'Bu notu silmek istediğinize emin misiniz?' : 'Are you sure you want to delete this note?')) {
      fetch(`http://localhost:3001/api/notes/${id}`, { method: 'DELETE' })
        .then(() => refreshData());
    }
  };

  const handleUpdateNote = () => {
    if (!editingNote) return;
    fetch(`http://localhost:3001/api/notes/${editingNote.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hypothesis: editH, observation: editO }),
    }).then(() => {
      setEditingNote(null);
      refreshData();
    });
  };

  const handleNavigateToExperiment = (grade: number, topic: string) => {
    navigate(`/grade/${grade}`, { state: { activeTopic: topic } });
  };

  // Badge earned logic
  const isEarned = (topic: string) => Array.isArray(progress) && progress.some(p => p.topic.toLowerCase().includes(topic.toLowerCase()) && p.completed);

  const badges = [
    { id: 'alchemist', name: language === 'tr' ? 'Simya Ustası' : 'Master Alchemist', desc: language === 'tr' ? 'Karışımlar ünitesini tamamladı.' : 'Completed Mixtures module.', icon: <WaterIcon />, color: '#3b82f6', earned: isEarned('Karışımlar') || isEarned('Mixtures') },
    { id: 'astronomer', name: language === 'tr' ? 'Gök Bilimci' : 'Astronomer', desc: language === 'tr' ? 'Güneş Sistemi ünitesini tamamladı.' : 'Completed Solar System module.', icon: <SunIcon />, color: '#f59e0b', earned: isEarned('Güneş Sistemi') || isEarned('Solar System') },
    { id: 'spark', name: language === 'tr' ? 'İlk Kıvılcım' : 'First Spark', desc: language === 'tr' ? 'Devreler ünitesini tamamladı.' : 'Completed Circuits module.', icon: <HotIcon />, color: '#ef4444', earned: isEarned('Devreler') || isEarned('Circuits') },
    { id: 'weather', name: language === 'tr' ? 'Hava Kahini' : 'Weather Prophet', desc: language === 'tr' ? 'İklim ünitesini tamamladı.' : 'Completed Weather module.', icon: <StormIcon />, color: '#8b5cf6', earned: isEarned('İklim') || isEarned('Weather') },
  ];

  const statCards = [
    { label: t('totalStudy'), value: stats ? `${(stats.totalTime / 60).toFixed(1)} ${t('hours')}` : '0.0', icon: <TimeIcon color="primary" /> },
    { label: t('completedModules'), value: stats ? stats.modulesCompleted : 0, icon: <CompletedIcon color="primary" /> },
    { label: t('successScore'), value: stats ? `%${stats.averageScore}` : '%0', icon: <TrophyIcon color="primary" /> },
    { label: t('activeDays'), value: stats ? stats.activeDays : 1, icon: <TimelineIcon color="primary" /> },
  ];

  const allExperiments = [
    { grade: 5, topic: t('topics.circuits') },
    { grade: 6, topic: t('topics.solar') },
    { grade: 7, topic: t('topics.mixtures') },
    { grade: 8, topic: t('topics.weather') },
    { grade: 8, topic: t('topics.competition') },
  ];

  const remainingExperiments = allExperiments.filter(exp => 
    !Array.isArray(progress) || !progress.some(p => p.topic === exp.topic && p.completed)
  );

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: -1.5 }}>{t('dashboard')}</Typography>
        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>{t('performanceData')}</Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
        {statCards.map((card) => (
          <Card key={card.label} sx={{ p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ p: 1, borderRadius: 2, backgroundColor: alpha(theme.palette.primary.main, 0.1), display: 'flex' }}>
                {card.icon}
              </Box>
              <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary' }}>{card.label}</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>{card.value}</Typography>
          </Card>
        ))}
      </Box>

      <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, letterSpacing: -0.5 }}>{t('earnedBadges')}</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 3, mb: 8 }}>
        {badges.map((badge) => (
          <Tooltip title={badge.earned ? badge.desc : (language === 'tr' ? 'Kilidi açmak için ilgili modülü tamamlayın' : 'Complete the module to unlock')} key={badge.id} arrow>
            <BadgeCard earned={badge.earned} badgeColor={badge.color}>
              <Avatar 
                sx={{ 
                  bgcolor: badge.earned ? badge.color : 'action.disabledBackground', 
                  width: 64, 
                  height: 64, 
                  mb: 2, 
                  boxShadow: badge.earned ? `0 8px 24px ${alpha(badge.color, 0.4)}` : 'none',
                }}
              >
                {React.cloneElement(badge.icon as React.ReactElement, { sx: { fontSize: 32 } })}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: badge.earned ? 'text.primary' : 'text.disabled' }}>{badge.name}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: badge.earned ? badge.color : 'text.disabled', mt: 0.5 }}>
                {badge.earned ? t('opened').toUpperCase() : (language === 'tr' ? 'KİLİTLİ' : 'LOCKED')}
              </Typography>
            </BadgeCard>
          </Tooltip>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' }, gap: 4 }}>
        <Card sx={{ p: 4, borderRadius: 5 }}>
          <Typography variant="h6" sx={{ mb: 4, fontWeight: 900 }}>{t('trainingProgress')}</Typography>
          <Stack spacing={2}>
            {remainingExperiments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
                <CompletedIcon sx={{ fontSize: 48, mb: 1, color: 'success.main' }} />
                <Typography variant="body2" sx={{ fontWeight: 800 }}>{language === 'tr' ? 'Tüm deneyler tamamlandı!' : 'All experiments completed!'}</Typography>
              </Box>
            ) : remainingExperiments.map((exp, index) => (
              <Box 
                key={index} 
                onClick={() => handleNavigateToExperiment(exp.grade, exp.topic)}
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    transform: 'translateX(8px)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 900 }}>
                  {exp.grade}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800 }}>{exp.topic}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                    {exp.grade}. {language === 'tr' ? 'Sınıf Müfredatı' : 'Grade Curriculum'}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Card>

        <Card sx={{ p: 4, borderRadius: 5, boxShadow: '0 10px 40px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 900 }}>{t('allLabNotes')}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                size="small" 
                color="error" 
                onClick={() => {
                  if (window.confirm(language === 'tr' ? 'Tüm notları silmek istediğinize emin misiniz?' : 'Are you sure you want to clear all notes?')) {
                    fetch('http://localhost:3001/api/notes/all', { method: 'DELETE' }).then(() => refreshData());
                  }
                }}
                sx={{ fontWeight: 800, textTransform: 'none', mr: 1 }}
              >
                {language === 'tr' ? 'Hepsini Sil' : 'Clear All'}
              </Button>
              <Chip label={`${notes.length} ${language === 'tr' ? 'Kayıt' : 'Records'}`} size="small" sx={{ fontWeight: 800 }} />
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: 500, pr: 1 }}>
             {notes.length === 0 ? (
               <Box sx={{ textAlign: 'center', py: 8, opacity: 0.3 }}>
                  <ScienceIcon sx={{ fontSize: 64, mb: 2 }} />
                  <Typography variant="h6" fontWeight={800}>{t('noNotes')}</Typography>
               </Box>
             ) : (
               <List sx={{ p: 0 }}>
                 {notes.map((n, idx) => (
                   <React.Fragment key={n.id}>
                     <ListItem sx={{ px: 0, py: 3, flexDirection: 'column', alignItems: 'flex-start', '&:hover .note-actions': { opacity: 1 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 2 }}>
                           <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                             <Chip label={n.topic} size="small" color="primary" sx={{ fontWeight: 900, borderRadius: 1.5 }} />
                             <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                {new Date(n.timestamp).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}
                             </Typography>
                           </Box>
                           <Box className="note-actions" sx={{ opacity: 0, transition: 'opacity 0.2s', display: 'flex', gap: 0.5 }}>
                              <IconButton size="small" onClick={() => {
                                setEditingNote(n);
                                setEditH(n.hypothesis);
                                setEditO(n.observation);
                              }}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => handleDeleteNote(n.id)}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                           </Box>
                        </Box>
                        <Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), p: 2.5, borderRadius: 4, width: '100%', border: '1px solid', borderColor: alpha(theme.palette.primary.main, 0.08) }}>
                           <Typography variant="body2" sx={{ fontWeight: 900, mb: 1, color: 'primary.main', letterSpacing: 0.5 }}>HİPOTEZ: {n.hypothesis}</Typography>
                           <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', lineHeight: 1.7 }}>GÖZLEM: {n.observation}</Typography>
                        </Box>
                     </ListItem>
                     {idx < notes.length - 1 && <Divider sx={{ my: 1, opacity: 0.3 }} />}
                   </React.Fragment>
                 ))}
               </List>
             )}
          </Box>
        </Card>
      </Box>

      <Dialog open={!!editingNote} onClose={() => setEditingNote(null)} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 6, p: 2 } }}>
        <DialogTitle sx={{ fontWeight: 900, fontSize: '1.5rem' }}>Gözlemi Düzenle</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Hipotez" multiline rows={2} value={editH} onChange={e => setEditH(e.target.value)} sx={{ mt: 2, mb: 3 }} variant="outlined" />
          <TextField fullWidth label="Gözlem" multiline rows={4} value={editO} onChange={e => setEditO(e.target.value)} variant="outlined" />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditingNote(null)} sx={{ fontWeight: 800 }}>Vazgeç</Button>
          <Button onClick={handleUpdateNote} variant="contained" sx={{ fontWeight: 900, px: 4, borderRadius: 3, boxShadow: '0 8px 20px -5px rgba(0,0,0,0.2)' }}>Değişiklikleri Kaydet</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
