import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Divider,
  Paper,
  CircularProgress,
  LinearProgress,
  IconButton,
  Chip,
  useTheme,
  styled,
  alpha
} from '@mui/material';
import {
  Science as ScienceIcon,
  PlayArrow as PlayIcon,
  AssignmentTurnedIn as AssignmentIcon,
  MenuBook as NotebookIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  ArrowForward as ArrowIcon,
  AccessTime as TimeIcon,
  HistoryEdu as NoteIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';
import { Drawer, TextField } from '@mui/material';

// --- Grade 5-6 Components ---
import SolarSystemSimulation from './Grade5-6/SolarSystemSimulation';
import DarkNeighborhoodSimulation from './Grade5-6/DarkNeighborhoodSimulation';
import CircuitSimulation from './Grade5-6/CircuitSimulation';

// --- Grade 7-8 Components ---
import AlchemyMixtures from './Grade7-8/AlchemyMixtures';
import AcidBaseSimulation from './Grade7-8/AcidBaseSimulation';
import PressureSimulation from './Grade7-8/PressureSimulation';
import WeatherSimulation from './Grade7-8/WeatherSimulation';
import CompetitionQuiz from './CompetitionQuiz';

// --- Styled Components ---
const ExperimentCard = styled(Card)(({ theme }) => ({
  width: '320px', 
  height: '460px',
  borderRadius: '28px',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.mode === 'dark' 
    ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.4)})` 
    : `linear-gradient(145deg, #ffffff, #f8fafc)`,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: theme.palette.mode === 'dark'
      ? `0 20px 40px -10px ${alpha(theme.palette.primary.main, 0.4)}`
      : `0 20px 40px -10px ${alpha(theme.palette.common.black, 0.1)}`,
    borderColor: theme.palette.primary.main,
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  background: theme.palette.primary.main,
  color: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#ffffff',
  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
}));

const LabDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 450,
    backgroundColor: theme.palette.mode === 'dark' ? '#0f172a' : '#ffffff',
    backgroundImage: theme.palette.mode === 'dark' 
      ? 'radial-gradient(at 0% 0%, rgba(30, 41, 59, 0.7) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.7) 0, transparent 50%)'
      : 'none',
    borderLeft: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(4),
  }
}));

const NotePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '20px',
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    transform: 'translateX(4px)'
  }
}));

interface LabNote {
  id?: number;
  topic: string;
  hypothesis: string;
  observation: string;
  timestamp: string;
}

const GradeView: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const location = useLocation();
  const theme = useTheme();
  const { t, language } = useLanguage();
  
  const [viewState, setViewState] = useState<'list' | 'briefing' | 'simulation'>('list');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [observation, setObservation] = useState('');
  const [prevNotes, setPrevNotes] = useState<LabNote[]>([]);
  const [missionComplete, setMissionComplete] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  // Reset state when grade changes
  useEffect(() => {
    const state = location.state as { activeTopic?: string };
    if (state?.activeTopic) {
      setActiveTopic(state.activeTopic);
      setViewState('briefing');
      fetchNotes(state.activeTopic);
    } else {
      setViewState('list');
      setActiveTopic(null);
    }
    setMissionComplete(false);
    setNotebookOpen(false);
  }, [gradeId, location.state]);

  const topics = {
    '5': [t('topics.circuits')],
    '6': [t('topics.solar')],
    '7': [t('topics.mixtures')],
    '8': [t('topics.weather'), t('topics.competition')],
  }[gradeId || '5'] || [];

  const fetchNotes = (topic: string) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notes/${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => setPrevNotes(data))
      .catch(err => console.error(err));
  };

  const saveNote = () => {
    if (!activeTopic) return;
    setSavingNote(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: activeTopic, hypothesis, observation }),
    })
    .then(() => {
      fetchNotes(activeTopic);
      setSavingNote(false);
      setNotebookOpen(false);
    })
    .catch(err => {
      console.error(err);
      setSavingNote(false);
    });
  };

  const handleStartSimulation = (topic: string) => {
    setActiveTopic(topic);
    setViewState('briefing');
    setMissionComplete(false);
    setSandboxMode(false);
    setHypothesis('');
    setObservation('');
    fetchNotes(topic);
  };

  const handleComplete = () => {
    setMissionComplete(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        grade: parseInt(gradeId || '5'), 
        topic: activeTopic, 
        completed: true, 
        score: 100 
      }),
    }).catch(err => console.error('Failed to save progress:', err));
  };

  const renderSimulationContent = () => {
    if (!activeTopic) return null;
    
    // Check by translation keys instead of fragile string matching if possible,
    // but we currently store localized names in activeTopic.
    // Let's use the actual translation values to compare.
    const t_mixtures = t('topics.mixtures');
    const t_solar = t('topics.solar');
    const t_circuits = t('topics.circuits');
    const t_acidBase = t('topics.acidBase');
    const t_pressure = t('topics.pressure');
    const t_weather = t('topics.weather');
    const t_competition = t('topics.competition');

    if (activeTopic === t_mixtures) return <AlchemyMixtures />;
    if (activeTopic === t_solar) return <SolarSystemSimulation />;
    if (activeTopic === t_circuits) {
      return sandboxMode ? <CircuitSimulation /> : <DarkNeighborhoodSimulation />;
    }
    if (activeTopic === t_acidBase) return <AcidBaseSimulation sandbox={sandboxMode} />;
    if (activeTopic === t_pressure) return <PressureSimulation sandbox={sandboxMode} />;
    if (activeTopic === t_weather) return <WeatherSimulation sandbox={sandboxMode} />;
    if (activeTopic === t_competition) return <CompetitionQuiz onExit={() => setViewState('list')} />;
    
    return (
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, py: 10 }}>
          <ScienceIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h5" color="text.secondary">{t('inDevelopment')}</Typography>
       </Box>
    );
  };

  if (viewState === 'list') {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ fontWeight: 950, mb: 2, letterSpacing: -2 }}>
            {t('gradeLabTitle').replace('{grade}', gradeId || '5')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 700, mx: 'auto' }}>
            {t('gradeLabDesc')}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: 5, 
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {topics.map((topic, index) => {
            const isCompetition = topic === t('topics.competition');
            return (
              <ExperimentCard 
                key={index}
                sx={isCompetition ? {
                  background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${alpha(theme.palette.secondary.main, 0.4)}, ${alpha(theme.palette.background.paper, 0.4)})`
                    : `linear-gradient(145deg, ${alpha(theme.palette.secondary.light, 0.2)}, #ffffff)`,
                  borderColor: 'secondary.main',
                  '&:hover': {
                    borderColor: 'secondary.main',
                    boxShadow: `0 20px 40px -10px ${alpha(theme.palette.secondary.main, 0.4)}`,
                  }
                } : {}}
              >
                <CardActionArea onClick={() => handleStartSimulation(topic)} sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <IconWrapper sx={isCompetition ? { background: theme.palette.secondary.main } : {}}>
                    {isCompetition ? <TrophyIcon sx={{ fontSize: 32 }} /> : <ScienceIcon sx={{ fontSize: 32 }} />}
                  </IconWrapper>
                  <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, lineHeight: 1.1, fontSize: '1.8rem' }}>
                      {topic}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5, color: 'text.secondary' }}>
                      <TimeIcon sx={{ fontSize: 18 }} />
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>{isCompetition ? '???' : `5 ${t('min') || 'min'}`}</Typography>
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 500, lineHeight: 1.6 }}>
                      {isCompetition 
                        ? (language === 'tr' ? 'Fen Bilimleri Olimpiyatı\'na hoş geldiniz! Bilgini test et ve takımını zafere taşı.' : 'Welcome to the Science Olympiad! Test your knowledge and lead your team to victory.')
                        : t('topicDesc').replace('{topic}', topic.split(' (')[0])
                      }
                    </Typography>
                    <Box sx={{ 
                      mt: 'auto', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1.5, 
                      color: isCompetition ? 'secondary.main' : 'primary.main', 
                      fontWeight: 900,
                      fontSize: '1.1rem'
                    }}>
                      {t('startModule')} <ArrowIcon />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </ExperimentCard>
            );
          })}
        </Box>
      </Container>
    );
  }

  if (viewState === 'briefing' && activeTopic) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 4, md: 8 }, 
          borderRadius: '32px', 
          border: '2px solid', 
          borderColor: 'primary.main', 
          position: 'relative',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          boxShadow: '0 20px 50px -20px rgba(0,0,0,0.2)'
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            right: 0, 
            p: 1.5, 
            px: 3,
            backgroundColor: 'primary.main', 
            color: 'white',
            borderBottomLeftRadius: '20px'
          }}>
            <Typography variant="overline" sx={{ fontWeight: 900, fontSize: '0.8rem', letterSpacing: 1, color: '#ffffff' }}>{t('missionFile')}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}>{t('experimentTopic')}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 950, mt: 1, letterSpacing: -1 }}>{activeTopic}</Typography>
                </Box>
                <Chip icon={<TimeIcon />} label={`5 ${t('min') || 'min'}`} sx={{ fontWeight: 900, borderRadius: 2, bgcolor: 'action.hover' }} />
            </Box>

            <Typography variant="body1" sx={{ fontSize: '1.3rem', lineHeight: 1.8, color: 'text.secondary', fontStyle: 'italic', borderLeft: '4px solid', pl: 3, borderColor: 'primary.light' }}>
              {t('experimentBriefing')}
            </Typography>

            <Divider />

            <Grid container spacing={3}>
                <Grid item xs={12} sm={activeTopic.includes(t('topics.circuits', {lng:'tr'}).split(' (')[0]) || activeTopic.includes(t('topics.circuits', {lng:'en'}).split(' (')[0]) ? 4 : 6}>
                    <Button 
                        variant="contained" 
                        size="large" 
                        fullWidth 
                        onClick={() => setViewState('simulation')}
                        sx={{ py: 2.5, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)' }}
                        startIcon={<PlayIcon />}
                    >
                        {t('startExperiment')}
                    </Button>
                </Grid>
                {(activeTopic.includes(t('topics.circuits', {lng:'tr'}).split(' (')[0]) || activeTopic.includes(t('topics.circuits', {lng:'en'}).split(' (')[0])) && (
                  <Grid item xs={12} sm={4}>
                      <Button 
                          variant="contained" 
                          size="large" 
                          fullWidth 
                          color="secondary"
                          onClick={() => {
                            setSandboxMode(true);
                            setViewState('simulation');
                          }}
                          sx={{ py: 2.5, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.2)' }}
                          startIcon={<ScienceIcon />}
                      >
                          {t('sandboxMode')}
                      </Button>
                  </Grid>
                )}
                <Grid item xs={12} sm={activeTopic.includes(t('topics.circuits', {lng:'tr'}).split(' (')[0]) || activeTopic.includes(t('topics.circuits', {lng:'en'}).split(' (')[0]) ? 4 : 6}>
                    <Button 
                        variant="outlined" 
                        size="large" 
                        fullWidth 
                        onClick={() => setViewState('list')}
                        sx={{ py: 2.5, borderRadius: 4, fontWeight: 800 }}
                    >
                        {t('backToList')}
                    </Button>
                </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Simulation Toolbar */}
      {activeTopic !== t('topics.competition') && viewState === 'simulation' && (
        <Paper elevation={0} sx={{ p: 2, px: 4, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.paper', zIndex: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => setViewState('list')} size="small">
                  <CloseIcon />
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 900 }}>{activeTopic}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                  variant="outlined" 
                  startIcon={<NotebookIcon />} 
                  onClick={() => setNotebookOpen(true)}
                  sx={{ borderRadius: 10, fontWeight: 700, px: 3 }}
              >
                  {t('labNotebook')}
              </Button>
              {!missionComplete && (
                  <Button 
                      variant="contained" 
                      color="success" 
                      startIcon={<CheckIcon />} 
                      onClick={handleComplete}
                      sx={{ borderRadius: 10, fontWeight: 900, px: 3 }}
                  >
                      {t('finishMission')}
                  </Button>
              )}
          </Box>
        </Paper>
      )}

      {/* Main Simulation Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: activeTopic === t('topics.competition') ? 0 : 4, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
            {renderSimulationContent()}
        </Container>
      </Box>

      {/* Mission Complete Overlay */}
      {missionComplete && (
        <Paper 
            sx={{ 
                position: 'fixed', 
                bottom: 40, 
                left: '50%', 
                transform: 'translateX(-50%)', 
                p: 3, 
                px: 6,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 3,
                bgcolor: 'success.main',
                color: 'white',
                zIndex: 2000,
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                animation: 'slideUp 0.5s ease'
            }}
        >
          <TrophyIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 950 }}>{t('missionCompleted')}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.9 }}>{t('missionSaved')}</Typography>
          </Box>
          <Button variant="contained" color="inherit" sx={{ color: 'success.main', fontWeight: 900, borderRadius: 5, ml: 2, px: 3 }} onClick={() => setViewState('list')}>
            {t('continue')}
          </Button>
        </Paper>
      )}

      <LabDrawer anchor="right" open={notebookOpen} onClose={() => setNotebookOpen(false)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'white', display: 'flex' }}>
              <NoteIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{t('labNotebook')}</Typography>
          </Box>
          <IconButton onClick={() => setNotebookOpen(false)}><CloseIcon /></IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: '24px', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', mb: 2, display: 'block' }}>YENİ GÖZLEM</Typography>
            <TextField 
              fullWidth 
              multiline 
              rows={2} 
              placeholder="Hipotezini yaz..." 
              value={hypothesis} 
              onChange={e => setHypothesis(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true, sx: { fontSize: '1.1rem', fontWeight: 600 } }}
              sx={{ mb: 2 }}
            />
            <Divider sx={{ my: 2 }} />
            <TextField 
              fullWidth 
              multiline 
              rows={4} 
              placeholder="Neler gözlemliyorsun?" 
              value={observation} 
              onChange={e => setObservation(e.target.value)}
              variant="standard"
              InputProps={{ disableUnderline: true, sx: { fontSize: '1rem' } }}
            />
            <Button 
              variant="contained" 
              fullWidth 
              onClick={saveNote} 
              disabled={savingNote || !hypothesis || !observation} 
              sx={{ mt: 3, py: 1.5, borderRadius: 3, fontWeight: 900 }}
              startIcon={savingNote ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              {savingNote ? 'Kaydediliyor...' : 'Gözlemi Kaydet'}
            </Button>
          </Box>

          <Box>
            <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', mb: 2, display: 'block' }}>GEÇMİŞ NOTLARIN</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
              {prevNotes.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4, fontStyle: 'italic' }}>
                  Henüz bir not kaydetmediniz.
                </Typography>
              ) : prevNotes.map(n => (
                <NotePaper key={n.id} elevation={0}>
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main' }}>AKADEMİK KAYIT</Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(n.timestamp || '').toLocaleString('tr-TR')}</Typography>
                   </Box>
                   <Typography variant="body2" sx={{ fontWeight: 800, mb: 1 }}>H: {n.hypothesis}</Typography>
                   <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>G: {n.observation}</Typography>
                </NotePaper>
              ))}
            </Box>
          </Box>
        </Box>
      </LabDrawer>
    </Box>
  );
};

// Mock Trophy Icon for the overlay
const TrophyIcon = (props: any) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 10.63 21 8.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
  </svg>
);

export default GradeView;
