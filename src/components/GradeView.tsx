import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Button,
  Container,
  Chip,
  IconButton,
  Divider,
  Drawer,
  TextField,
  Switch,
  Paper,
  Slider,
  CircularProgress,
  keyframes,
} from '@mui/material';
import {
  Science as ScienceIcon,
  PlayArrow as PlayIcon,
  AssignmentTurnedIn as AssignmentIcon,
  MenuBook as NotebookIcon,
  CheckCircle as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import AlchemyMixtures from './AlchemyMixtures';

// --- Animations ---
const bubble = keyframes`
  0% { transform: translateY(0) scale(1); opacity: 0.5; }
  100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
`;

const fire = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2) skewX(2deg); }
`;

const shake = keyframes`
  0%, 100% { transform: translate(0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-5px, -5px); }
  20%, 40%, 60%, 80% { transform: translate(5px, 5px); }
`;

const sizzle = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.8; transform: translateY(-5px); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

// --- Simulation Components ---

const PotionSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const [level, setLevel] = useState(0);
  const [color, setColor] = useState('rgba(255,255,255,0.1)');
  const [chaos, setChaos] = useState(false);

  const addPotion = (c: string) => {
    if (chaos) return;
    setLevel(prev => Math.min(prev + 20, 100));
    setColor(c);
    if (sandbox && level >= 80) {
      setChaos(true);
      setTimeout(() => { setChaos(false); setLevel(0); setColor('rgba(255,255,255,0.1)'); }, 3000);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: chaos ? `${shake} 0.5s infinite` : 'none' }}>
      {/* Background Elements */}
      <Box sx={{ position: 'absolute', bottom: 20, width: 200, height: 40, bgcolor: '#442b1d', borderRadius: '50% 50% 10% 10%', zIndex: 1 }} />
      
      {/* Fire */}
      <Box sx={{ display: 'flex', gap: 1, position: 'absolute', bottom: 45, zIndex: 0 }}>
        {[...Array(5)].map((_, i) => (
          <Box key={i} sx={{ width: 20, height: 40, bgcolor: i % 2 ? '#ff4d00' : '#ff9100', borderRadius: '50% 50% 20% 20%', animation: `${fire} ${0.5 + i*0.1}s infinite ease-in-out` }} />
        ))}
      </Box>

      {/* Cauldron */}
      <Box sx={{ position: 'relative', width: 180, height: 160, zIndex: 2 }}>
         <Box sx={{ position: 'absolute', top: 0, width: '100%', height: '100%', border: '8px solid #222', borderRadius: '10% 10% 80% 80%', bgcolor: '#1a1a1a', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${level}%`, bgcolor: color, transition: 'all 0.8s ease-out', boxShadow: `inset 0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${color}` }} />
            {level > 0 && [...Array(8)].map((_, i) => (
              <Box key={i} sx={{ position: 'absolute', bottom: 10, left: `${10 + i * 12}%`, width: 10, height: 10, bgcolor: color, borderRadius: '50%', animation: `${bubble} ${1 + Math.random()}s infinite ease-in`, opacity: 0.5 }} />
            ))}
         </Box>
         <Box sx={{ position: 'absolute', left: -20, top: '30%', width: 30, height: 30, border: '6px solid #222', borderRadius: '50%', zIndex: -1 }} />
         <Box sx={{ position: 'absolute', right: -20, top: '30%', width: 30, height: 30, border: '6px solid #222', borderRadius: '50%', zIndex: -1 }} />
      </Box>

      {/* Potion Shelf */}
      <Box sx={{ display: 'flex', gap: 3, mt: 6, zIndex: 3 }}>
        {[
          { name: 'Ejder Kanı', color: '#ef4444' },
          { name: 'Gece Otu', color: '#8b5cf6' },
          { name: 'Güneş Özü', color: '#f59e0b' },
          { name: 'Buz Kristali', color: '#3b82f6' }
        ].map(p => (
          <Box key={p.name} sx={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-10px)' } }} onClick={() => addPotion(p.color)}>
            <Box sx={{ width: 40, height: 60, border: '2px solid #555', borderRadius: '10% 10% 40% 40%', position: 'relative', bgcolor: 'rgba(255,255,255,0.05)', mb: 1, overflow: 'hidden' }}>
               <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: '70%', bgcolor: p.color, opacity: 0.8 }} />
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>{p.name}</Typography>
          </Box>
        ))}
      </Box>

      {chaos && (
        <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,0,0,0.3)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
           <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', textShadow: '0 0 20px black' }}>PATLAMA!</Typography>
        </Box>
      )}
    </Box>
  );
};

const AcidBaseSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const [ph, setPh] = useState(7);
  const [isMelting, setIsMelting] = useState(false);

  useEffect(() => {
    if (sandbox && ph < 2) {
      setIsMelting(true);
    } else {
      setIsMelting(false);
    }
  }, [ph, sandbox]);

  const getColor = (v: number) => {
    if (v < 7) return `rgb(255, ${Math.floor((v/7) * 255)}, 0)`;
    if (v > 7) return `rgb(0, ${Math.floor((1 - (v-7)/7) * 255)}, 255)`;
    return '#888';
  };

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ position: 'relative', width: 400, height: 200, bgcolor: '#ddd', borderRadius: 2, border: '4px solid #555', overflow: 'hidden', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)' }}>
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: `${100 + (7-ph)*20}%`, 
            height: `${20 + Math.abs(7-ph)*10}%`, 
            bgcolor: getColor(ph), 
            borderRadius: '50% 50% 0 0', 
            transition: 'all 0.5s',
            opacity: 0.7,
            filter: 'blur(5px)',
            boxShadow: `0 0 30px ${getColor(ph)}`
          }} 
        />
        {isMelting && (
          <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.8)', mixBlendMode: 'multiply', animation: `${fire} 0.2s infinite` }}>
             {[...Array(20)].map((_, i) => (
               <Box key={i} sx={{ position: 'absolute', left: `${i*5}%`, top: '80%', width: 4, height: 20, bgcolor: '#555', animation: `${sizzle} ${0.5 + Math.random()}s infinite` }} />
             ))}
          </Box>
        )}
      </Box>

      <Box sx={{ mt: 4, width: 300 }}>
        <Typography align="center" variant="h5" sx={{ fontWeight: 800, mb: 2, color: getColor(ph) }}>pH Seviyesi: {ph.toFixed(1)}</Typography>
        <Slider 
          value={ph} 
          min={sandbox ? 0 : 3} 
          max={sandbox ? 14 : 11} 
          step={0.1} 
          onChange={(_, v) => setPh(v as number)} 
          sx={{ color: getColor(ph) }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
           <Typography variant="caption" sx={{ fontWeight: 900, color: 'red' }}>ASİT</Typography>
           <Typography variant="caption" sx={{ fontWeight: 900, color: '#888' }}>NÖTR</Typography>
           <Typography variant="caption" sx={{ fontWeight: 900, color: 'blue' }}>BAZ</Typography>
        </Box>
      </Box>
    </Box>
  );
};

const PressureSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const [water, setWater] = useState(40);
  const pressure = water * 1.5;
  const isBreaking = sandbox && water > 90;

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Box sx={{ position: 'relative', width: 400, height: 300, display: 'flex' }}>
        <Box sx={{ flex: 1, position: 'relative', bgcolor: '#e0f2fe', borderRadius: '4px 0 0 4px', border: '4px solid #333', borderRight: 'none' }}>
           <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${water}%`, bgcolor: '#0ea5e9', transition: 'height 0.3s', opacity: 0.8 }} />
           <Typography sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 900, color: '#0369a1' }}>REZERVUAR</Typography>
        </Box>
        <Box sx={{ width: 40, bgcolor: '#4b5563', borderTop: '4px solid #333', borderBottom: '4px solid #333', position: 'relative' }}>
           <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <path 
                d={`M 20 20 L ${20 + (water/20)} ${20 + (water*2)} L 15 ${50 + (water*2.5)}`} 
                stroke="black" 
                strokeWidth={water/20} 
                fill="none" 
                style={{ opacity: water > 50 ? 0.8 : 0, transition: 'all 0.3s' }}
              />
              {isBreaking && (
                <path d="M 0 0 L 40 300 M 40 0 L 0 300" stroke="black" strokeWidth={5} />
              )}
           </svg>
        </Box>
        <Box sx={{ flex: 1, border: '4px dashed #ccc', borderLeft: 'none', borderRadius: '0 4px 4px 0', display: 'flex', alignItems: 'flex-end', p: 2, position: 'relative' }}>
           <Box sx={{ width: 40, height: 60, bgcolor: '#94a3b8', mr: 1 }} />
           <Box sx={{ width: 30, height: 40, bgcolor: '#94a3b8', mr: 1 }} />
           <Box sx={{ width: 50, height: 80, bgcolor: '#94a3b8' }} />
           {isBreaking && (
             <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(14, 165, 233, 0.6)', zIndex: 5, animation: `${fire} 0.1s infinite` }}>
                <Typography sx={{ color: 'white', fontWeight: 900, p: 4 }}>ŞEHRİ SU BASTI!</Typography>
             </Box>
           )}
        </Box>
      </Box>
      <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slider 
          orientation="vertical" 
          value={water} 
          min={0} 
          max={sandbox ? 100 : 85} 
          onChange={(_, v) => setWater(v as number)} 
        />
        <Typography variant="caption" sx={{ mt: 2, fontWeight: 800 }}>SU SEVİYESİ</Typography>
        <Paper sx={{ mt: 4, p: 2, bgcolor: '#f1f5f9' }}>
           <Typography variant="overline" sx={{ fontWeight: 900 }}>BASINÇ</Typography>
           <Typography variant="h5" sx={{ fontWeight: 900, color: pressure > 100 ? 'red' : 'primary.main' }}>{pressure.toFixed(0)} kPa</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

const WeatherSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const [temp, setTemp] = useState(25);
  const [hum, setHum] = useState(50);
  const isSnowing = temp < 5 && hum > 60;
  const isStorming = sandbox && temp > 40 && hum > 80;

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box 
        sx={{ 
          width: '90%', 
          height: 250, 
          borderRadius: 4, 
          border: '4px solid #333', 
          position: 'relative', 
          overflow: 'hidden',
          background: temp > 30 ? 'linear-gradient(#fde68a, #f59e0b)' : temp < 10 ? 'linear-gradient(#e0f2fe, #7dd3fc)' : 'linear-gradient(#7dd3fc, #38bdf8)',
          transition: 'all 1s'
        }}
      >
        <Box sx={{ position: 'absolute', top: 30, right: 50, width: temp > 30 ? 80 : 40, height: temp > 30 ? 80 : 40, bgcolor: '#fbbf24', borderRadius: '50%', boxShadow: `0 0 ${temp}px #fbbf24`, transition: 'all 0.5s' }} />
        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: 60, bgcolor: temp > 35 ? '#b45309' : '#22c55e', transition: 'all 1s' }} />
        {isSnowing && [...Array(20)].map((_, i) => (
          <Box key={i} sx={{ position: 'absolute', top: -10, left: `${Math.random()*100}%`, width: 8, height: 8, bgcolor: 'white', borderRadius: '50%', animation: `${bubble} ${2 + Math.random()*2}s infinite linear reverse`, opacity: 0.8 }} />
        ))}
        {isStorming && (
          <Box sx={{ position: 'absolute', bottom: 40, left: '40%', width: 100, height: 200, borderLeft: '50px solid transparent', borderRight: '50px solid transparent', borderTop: '200px solid rgba(0,0,0,0.5)', borderRadius: '50%', animation: `${shake} 0.1s infinite` }} />
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 6, mt: 4, width: '80%' }}>
         <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>SICAKLIK ({temp}°C)</Typography>
            <Slider value={temp} min={-20} max={sandbox ? 60 : 40} onChange={(_, v) => setTemp(v as number)} />
         </Box>
         <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 900 }}>NEM (%{hum})</Typography>
            <Slider value={hum} min={0} max={100} onChange={(_, v) => setHum(v as number)} />
         </Box>
      </Box>
      {isStorming && (
        <Typography variant="h6" sx={{ mt: 2, color: 'error.main', fontWeight: 900, animation: `${shake} 0.2s infinite` }}>KASIRGA UYARISI!</Typography>
      )}
    </Box>
  );
};

// --- GradeView Component ---

interface LabNote {
  id: number;
  topic: string;
  hypothesis: string;
  observation: string;
  timestamp: string;
}

const GradeView: React.FC = () => {
  const { gradeId } = useParams<{ gradeId: string }>();
  const topics = {
    '5': ["Sürtünme Kuvveti (Buzul Gezegeni)", "Elektrik Devreleri (Karanlık Mahalle)"],
    '6': ["Güneş Sistemi (Yörünge İstasyonu)", "Yoğunluk (Kayıp Kıta)"],
    '7': ["Karışımlar (Simyacı İksiri)", "Asitler ve Bazlar (Sızıntı)"],
    '8': ["Sıvı Basıncı (Baraj Çatlağı)", "İklim ve Hava (OpenWeather Canlı Veri)"],
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

  const handleMissionComplete = () => {
    if (!activeTopic) return;
    setMissionComplete(true);
    
    // Save progress to backend
    fetch('http://localhost:3001/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        grade: parseInt(gradeId || '5'), 
        topic: activeTopic, 
        completed: true, 
        score: 100 // Default score for now
      }),
    }).catch(err => console.error('Failed to save progress:', err));
  };

  const renderSimulationContent = () => {
    if (!activeTopic) return null;
    if (activeTopic.includes("Karışımlar")) return <AlchemyMixtures />;
    if (activeTopic.includes("Asitler")) return <AcidBaseSimulation sandbox={sandboxMode} />;
    if (activeTopic.includes("Basıncı")) return <PressureSimulation sandbox={sandboxMode} />;
    if (activeTopic.includes("İklim")) return <WeatherSimulation sandbox={sandboxMode} />;
    
    return (
       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <ScienceIcon sx={{ fontSize: 80, color: 'text.disabled' }} />
          <Typography variant="h5" color="text.secondary">Geliştirme Aşamasında...</Typography>
       </Box>
    );
  };

  if (viewState === 'briefing' && activeTopic) {
    return (
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Card sx={{ p: 6, border: '2px solid', borderColor: 'primary.main', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0, p: 2, backgroundColor: 'primary.main', color: 'background.paper' }}>
            <Typography variant="overline" sx={{ fontWeight: 900 }}>GÖREV DOSYASI</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{activeTopic}</Typography>
            <Typography variant="body1" sx={{ fontSize: '1.2rem', lineHeight: 1.8, fontStyle: 'italic' }}>
              "Laboratuvar hazır. Bilimsel verileri toplayıp görevi tamamlamak senin elinde!"
            </Typography>
            <Divider />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="contained" size="large" fullWidth onClick={() => setViewState('simulation')}>Simülasyonu Başlat</Button>
              <Button variant="outlined" size="large" onClick={() => setViewState('list')}>Geri Dön</Button>
            </Box>
          </Box>
        </Card>
      </Container>
    );
  }

  if (viewState === 'simulation' && activeTopic) {
    return (
      <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{activeTopic}</Typography>
            {missionComplete && <Chip icon={<CheckIcon />} label="GÖREV TAMAMLANDI" color="success" size="small" />}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button startIcon={<NotebookIcon />} onClick={() => setNotebookOpen(true)} variant="outlined" size="small">Defter</Button>
            <Button variant="contained" color="inherit" size="small" onClick={() => setViewState('list')}>Kapat</Button>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', bgcolor: sandboxMode ? '#111' : '#f8fafc' }}>
             {renderSimulationContent()}

          {!missionComplete && (
            <Box sx={{ position: 'absolute', bottom: 20, right: 20 }}>
               <Button variant="contained" color="success" onClick={handleMissionComplete}>Görevi Tamamla</Button>
            </Box>
          )}

          {missionComplete && (
            <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }}>
              <Paper elevation={6} sx={{ p: 1, px: 3, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 2, border: '2px solid', borderColor: sandboxMode ? 'error.main' : 'primary.main' }}>
                <Typography variant="body2" sx={{ fontWeight: 800 }}>SERBEST MOD (KAOS)</Typography>
                <Switch checked={sandboxMode} onChange={(e) => setSandboxMode(e.target.checked)} color="error" />
              </Paper>
            </Box>
          )}

          <Drawer anchor="right" open={notebookOpen} onClose={() => setNotebookOpen(false)} sx={{ '& .MuiDrawer-paper': { width: 450, p: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Deney Notları</Typography>
              <IconButton onClick={() => setNotebookOpen(false)}><CloseIcon /></IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Typography variant="overline" color="primary" sx={{ fontWeight: 800 }}>YENİ NOT</Typography>
                <TextField fullWidth multiline rows={3} placeholder="Hipotezin..." value={hypothesis} onChange={e => setHypothesis(e.target.value)} variant="filled" sx={{mb: 2, mt: 1}} />
                <TextField fullWidth multiline rows={3} placeholder="Gözlemlerin..." value={observation} onChange={e => setObservation(e.target.value)} variant="filled" />
                <Button variant="contained" fullWidth onClick={saveNote} disabled={savingNote} sx={{mt: 2}}>{savingNote ? <CircularProgress size={24} /> : "Kaydet"}</Button>
              </Box>
              <Divider />
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800 }}>GEÇMİŞ NOTLAR</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                  {prevNotes.length === 0 ? <Typography variant="caption">Not bulunamadı.</Typography> : prevNotes.map(n => (
                    <Paper key={n.id} variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.01)' }}>
                       <Typography variant="caption" color="text.secondary">{new Date(n.timestamp).toLocaleString('tr-TR')}</Typography>
                       <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>H: {n.hypothesis}</Typography>
                       <Typography variant="body2">G: {n.observation}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            </Box>
          </Drawer>
        </Box>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{gradeId}. Sınıf Laboratuvarı</Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>İnteraktif simülasyonları başlatmak için bir ünite seçin.</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {topics.map((topic, index) => (
          <Card key={topic} sx={{ display: 'flex', flexDirection: 'column', transition: 'all 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 } }}>
            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{topic.split('(')[0].trim()}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AssignmentIcon fontSize="small" /> {topic.split('(')[1].replace(')', '')}
                </Typography>
              </Box>
              <Chip label={`Modül 0${index + 1}`} size="small" />
            </Box>
            <Box sx={{ px: 3, py: 2, backgroundColor: 'rgba(0,0,0,0.01)', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" startIcon={<PlayIcon />} onClick={() => handleStartSimulation(topic)}>Başlat</Button>
            </Box>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default GradeView;
