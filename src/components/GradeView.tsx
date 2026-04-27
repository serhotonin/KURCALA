import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  IconButton,
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
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

// --- Grade 5-6 Components ---
import SolarSystemSimulation from './Grade5-6/SolarSystemSimulation';
import DarkNeighborhoodSimulation from './Grade5-6/DarkNeighborhoodSimulation';
import CircuitSimulation from './Grade5-6/CircuitSimulation';

// --- Grade 7-8 Components ---
import AlchemyMixtures from './Grade7-8/AlchemyMixtures';
import AcidBaseSimulation from './Grade7-8/AcidBaseSimulation';
import PressureSimulation from './Grade7-8/PressureSimulation';
import WeatherSimulation from './Grade7-8/WeatherSimulation';

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

interface LabNote {
  id?: number;
  topic: string;
  hypothesis: string;
  observation: string;
  timestamp: string;
}

const GradeView: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const theme = useTheme();
  const { t } = useLanguage();
  
  const topics = {
    '5': [t('topics.friction'), t('topics.circuits')],
    '6': [t('topics.solar'), t('topics.density')],
    '7': [t('topics.mixtures'), t('topics.acidBase')],
    '8': [t('topics.pressure'), t('topics.weather')],
  }[gradeId || '5'] || [];

  const [viewState, setViewState] = useState<'list' | 'briefing' | 'simulation'>('list');
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [notebookOpen, setNotebookOpen] = useState(false);
  const [hypothesis, setHypothesis] = useState('');
  const [observation, setObservation] = useState('');
  const [prevNotes, setPrevNotes] = useState<LabNote[]>([]);
  const [missionComplete, setMissionComplete] = useState(false);
  const [sandboxMode, setSandboxMode] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  const fetchNotes = (topic: string) => {
    fetch(`http://localhost:3001/api/notes/${encodeURIComponent(topic)}`)
      .then(res => res.json())
      .then(data => setPrevNotes(data))
      .catch(err => console.error(err));
  };

  const saveNote = () => {
    if (!activeTopic) return;
    setSavingNote(true);
    fetch('http://localhost:3001/api/notes', {
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
    fetch('http://localhost:3001/api/progress', {
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
    
    // Check by split part for localization robustness
    const isMixtures = activeTopic.includes(t('topics.mixtures', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.mixtures', { lng: 'en' }).split(' (')[0]);
    const isSolar = activeTopic.includes(t('topics.solar', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.solar', { lng: 'en' }).split(' (')[0]);
    const isCircuits = activeTopic.includes(t('topics.circuits', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.circuits', { lng: 'en' }).split(' (')[0]);
    const isAcidBase = activeTopic.includes(t('topics.acidBase', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.acidBase', { lng: 'en' }).split(' (')[0]);
    const isPressure = activeTopic.includes(t('topics.pressure', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.pressure', { lng: 'en' }).split(' (')[0]);
    const isWeather = activeTopic.includes(t('topics.weather', { lng: 'tr' }).split(' (')[0]) || activeTopic.includes(t('topics.weather', { lng: 'en' }).split(' (')[0]);

    if (isMixtures) return <AlchemyMixtures />;
    if (isSolar) return <SolarSystemSimulation />;
    if (isCircuits) {
      return sandboxMode ? <CircuitSimulation /> : <DarkNeighborhoodSimulation />;
    }
    if (isAcidBase) return <AcidBaseSimulation sandbox={sandboxMode} />;
    if (isPressure) return <PressureSimulation sandbox={sandboxMode} />;
    if (isWeather) return <WeatherSimulation sandbox={sandboxMode} />;
    
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
          {topics.map((topic, index) => (
            <ExperimentCard key={index}>
              <CardActionArea onClick={() => handleStartSimulation(topic)} sx={{ height: '100%', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <IconWrapper>
                  <ScienceIcon sx={{ fontSize: 32 }} />
                </IconWrapper>
                <CardContent sx={{ p: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.1, fontSize: '1.8rem' }}>
                    {topic}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, fontWeight: 500, lineHeight: 1.6 }}>
                    {t('topicDesc').replace('{topic}', topic.split(' (')[0])}
                  </Typography>
                  <Box sx={{ 
                    mt: 'auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    color: 'primary.main', 
                    fontWeight: 900,
                    fontSize: '1.1rem'
                  }}>
                    {t('startModule')} <ArrowIcon />
                  </Box>
                </CardContent>
              </CardActionArea>
            </ExperimentCard>
          ))}
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
            <Typography variant="overline" sx={{ fontWeight: 900, fontSize: '0.8rem', letterSpacing: 1 }}>{t('missionFile')}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 2 }}>{t('experimentTopic')}</Typography>
                <Typography variant="h3" sx={{ fontWeight: 950, mt: 1, letterSpacing: -1 }}>{activeTopic}</Typography>
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

      {/* Main Simulation Area */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 4, bgcolor: 'background.default' }}>
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
