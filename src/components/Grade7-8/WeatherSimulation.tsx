import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Divider, Radio, RadioGroup, FormControlLabel, FormControl, CircularProgress, Button, Alert, Paper, keyframes, styled, IconButton, useTheme } from '@mui/material';
import { 
  Air as AirIcon, 
  Thermostat as ThermostatIcon, 
  WaterDrop as WaterDropIcon, 
  Speed as SpeedIcon, 
  HelpOutlined as HelpOutlineIcon, 
  CheckCircle as CheckCircleIcon, 
  Cancel as CancelIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

// --- Animations ---
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const rain = keyframes`
  0% { transform: translateY(-20px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(20px); opacity: 0; }
`;

// --- Styled Components ---
const GlassCard = styled(Card)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 41, 59, 0.7)' 
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: '1px solid',
  borderColor: theme.palette.divider,
  boxShadow: theme.palette.mode === 'dark'
    ? '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
    : '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
  overflow: 'visible',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.palette.mode === 'dark'
      ? '0 12px 40px 0 rgba(0, 0, 0, 0.6)'
      : '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
  }
}));

const WeatherIconContainer = styled(Box)({
  position: 'relative',
  width: 100,
  height: 100,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px auto'
});

interface WeatherData {
  name: string;
  temp: number;
  pressure: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
}

interface ComparisonData {
  esenler: WeatherData;
  random: WeatherData;
}

const AnimatedWeatherIcon: React.FC<{ code: string }> = ({ code }) => {
  const type = code.substring(0, 2);

  if (type === '01') { // Clear sky
    return (
      <Box sx={{ animation: `${spin} 10s linear infinite`, color: '#facc15', fontSize: 64, filter: 'drop-shadow(0 0 10px rgba(250, 204, 21, 0.4))' }}>
        ☀️
      </Box>
    );
  }
  if (type === '02' || type === '03' || type === '04') { // Clouds
    return (
      <Box sx={{ animation: `${float} 3s ease-in-out infinite`, fontSize: 64, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.2))' }}>
        ☁️
      </Box>
    );
  }
  if (type === '09' || type === '10') { // Rain
    return (
      <Box sx={{ position: 'relative', fontSize: 64 }}>
        🌧️
        <Box sx={{ 
          position: 'absolute', top: 40, left: 10, 
          animation: `${rain} 1s linear infinite`, fontSize: 20 
        }}>💧</Box>
        <Box sx={{ 
          position: 'absolute', top: 40, left: 30, 
          animation: `${rain} 1.2s linear infinite`, fontSize: 20 
        }}>💧</Box>
      </Box>
    );
  }
  if (type === '11') { // Thunderstorm
    return (
      <Box sx={{ animation: `${pulse} 0.5s ease-in-out infinite`, fontSize: 64, filter: 'drop-shadow(0 0 15px rgba(255, 255, 0, 0.6))' }}>
        ⚡
      </Box>
    );
  }
  if (type === '13') { // Snow
    return (
      <Box sx={{ animation: `${float} 4s ease-in-out infinite`, fontSize: 64, filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>
        ❄️
      </Box>
    );
  }
  return <Box sx={{ fontSize: 64 }}>🌫️</Box>;
};

const WeatherSimulation: React.FC<{ sandbox?: boolean }> = ({ sandbox }) => {
  const theme = useTheme();
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setSubmitted(false);
    setAnswers({});
    try {
      const response = await fetch('http://localhost:3001/api/weather/compare');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setData(result);
      setError(null);
    } catch (err) {
      setError("Hava durumu verileri yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 400, gap: 2 }}>
      <CircularProgress size={60} thickness={5} sx={{ color: 'secondary.main' }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>İstasyon Verileri Alınıyor...</Typography>
    </Box>
  );

  if (error || !data) return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Alert severity="error" variant="filled" sx={{ borderRadius: 4, justifyContent: 'center' }}>{error}</Alert>
      <Button variant="contained" color="primary" onClick={fetchData} sx={{ mt: 3, px: 4, borderRadius: 10, fontWeight: 800 }}>TEKRAR DENE</Button>
    </Box>
  );

  const windCorrect = data.esenler.pressure > data.random.pressure ? 'e_to_r' : 
                      data.esenler.pressure < data.random.pressure ? 'r_to_e' : 'none';

  const pressureCorrect = data.esenler.pressure < data.random.pressure ? 'esenler' : 
                          data.esenler.pressure > data.random.pressure ? 'random' : 'none';

  const humidityCorrect = data.esenler.humidity > data.random.humidity ? 'high_hum' : 
                          data.esenler.humidity < data.random.humidity ? 'low_hum' : 'none';

  const questions = [
    {
      id: 'wind',
      question: 'Yüksek basınçtan alçak basınca olan hava hareketini düşünerek; rüzgar hangi yöne doğru eser?',
      options: [
        { label: `${data.esenler.name} -> ${data.random.name}`, value: 'e_to_r' },
        { label: `${data.random.name} -> ${data.esenler.name}`, value: 'r_to_e' },
        { label: `Rüzgar oluşmaz / Belirgin bir yön yoktur`, value: 'none' }
      ],
      correct: windCorrect
    },
    {
      id: 'pressure_type',
      question: `Basınç değerlerine göre hangi şehirde "Yükselici Hava Hareketi" (Alçak Basınç) görülmektedir?`,
      options: [
        { label: data.esenler.name, value: 'esenler' },
        { label: data.random.name, value: 'random' },
        { label: `Her iki şehirde de basınç özellikleri aynıdır`, value: 'none' }
      ],
      correct: pressureCorrect
    },
    {
        id: 'humidity_logic',
        question: 'Hangi bölgede bulutlanma ve yağış görülme ihtimali daha yüksektir?',
        options: [
            { label: `Nem oranı yüksek olan şehir`, value: 'high_hum' },
            { label: `Nem oranı düşük olan şehir`, value: 'low_hum' },
            { label: `Nem oranları eşit / İhtimal aynıdır`, value: 'none' }
        ],
        correct: humidityCorrect
    }
  ];

  const WeatherCard = ({ city, title, isAccent }: { city: WeatherData, title: string, isAccent?: boolean }) => (
    <GlassCard sx={{ flex: 1, minWidth: 280, p: 1 }}>
      <CardContent>
        <Typography variant="overline" color={isAccent ? "secondary.main" : "primary.main"} sx={{ fontWeight: 900, fontSize: '0.85rem', letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, color: 'text.primary' }}>{city.name}</Typography>
        
        <WeatherIconContainer>
          <AnimatedWeatherIcon code={city.icon} />
        </WeatherIconContainer>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {[
            { icon: <ThermostatIcon color="error" />, label: 'SICAKLIK', value: `${city.temp}°C` },
            { icon: <AirIcon color="primary" />, label: 'BASINÇ', value: `${city.pressure} hPa` },
            { icon: <WaterDropIcon color="info" />, label: 'NEM', value: `%${city.humidity}` },
            { icon: <SpeedIcon color="success" />, label: 'RÜZGAR', value: `${city.windSpeed} m/s` }
          ].map((item, i) => (
            <Paper key={i} elevation={0} sx={{ 
              p: 1.5, 
              textAlign: 'center', 
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)', 
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider'
            }}>
              {item.icon}
              <Typography variant="caption" display="block" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.label}</Typography>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>{item.value}</Typography>
            </Paper>
          ))}
        </Box>

        <Divider sx={{ my: 3, borderColor: 'divider' }} />
        <Typography sx={{ textTransform: 'capitalize', fontWeight: 700, textAlign: 'center', color: 'secondary.main', bgcolor: 'secondary.main', backgroundClip: 'text', color: 'transparent', backgroundImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}>
          {city.description}
        </Typography>
      </CardContent>
    </GlassCard>
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 1, md: 3 }, minHeight: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mb: 4 }}>
        {/* Left Side - Weather Info */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 50%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: -1.5 }}>
              Atmosfer <span style={{ color: theme.palette.primary.main }}>Gözlemi</span>
            </Typography>
            <IconButton onClick={fetchData} sx={{ bgcolor: 'background.paper', boxShadow: 3, '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
              <RefreshIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <WeatherCard title="MERKEZ İSTASYON" city={data.esenler} />
            <WeatherCard title="UZAK İSTASYON" city={data.random} isAccent />
          </Box>
        </Box>

        {/* Right Side - Questions */}
        <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 40%' } }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: '32px', 
            border: '1px solid', 
            borderColor: 'divider', 
            bgcolor: 'background.paper',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 4, display: 'flex', alignItems: 'center', gap: 2, color: 'text.primary' }}>
              <Box sx={{ bgcolor: 'secondary.main', p: 1, borderRadius: 2.5, display: 'flex', boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)' }}>
                <HelpOutlineIcon sx={{ color: 'white' }} />
              </Box>
              BİLİMSEL ANALİZ
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {questions.map((q, idx) => (
                <Box key={q.id}>
                  <Typography variant="body1" sx={{ fontWeight: 800, mb: 2, fontSize: '1.05rem', color: 'text.primary', lineHeight: 1.4 }}>
                    {idx + 1}. {q.question}
                  </Typography>
                  <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={answers[q.id] || ''} onChange={(e) => {
                      if (!submitted) setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                    }}>
                      {q.options.map(opt => {
                        const isCorrect = opt.value === q.correct;
                        const isSelected = answers[q.id] === opt.value;
                        const showResult = submitted;

                        let bgColor = 'transparent';
                        let textColor = theme.palette.text.primary;
                        let borderColor = theme.palette.divider;

                        if (showResult) {
                          if (isCorrect) {
                            bgColor = theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)';
                            borderColor = '#4caf50';
                            textColor = theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32';
                          } else if (isSelected) {
                            bgColor = theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)';
                            borderColor = '#f44336';
                            textColor = theme.palette.mode === 'dark' ? '#e57373' : '#d32f2f';
                          }
                        }

                        return (
                          <FormControlLabel 
                            key={opt.value} 
                            value={opt.value} 
                            control={<Radio sx={{ color: theme.palette.divider, '&.Mui-checked': { color: 'secondary.main' } }} />} 
                            label={<Typography sx={{ fontWeight: 600, color: 'inherit' }}>{opt.label}</Typography>} 
                            disabled={submitted}
                            sx={{ 
                              mb: 1.5, 
                              mx: 0,
                              p: 1.5, 
                              borderRadius: 3, 
                              border: '2px solid',
                              borderColor: borderColor,
                              bgcolor: bgColor,
                              color: textColor,
                              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': { 
                                bgcolor: submitted ? bgColor : 'action.hover',
                                transform: submitted ? 'none' : 'translateX(5px)'
                              },
                              '& .MuiTypography-root': { color: 'inherit' }
                            }}
                          />
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Box>

            {!submitted ? (
              <Button 
                fullWidth 
                variant="contained" 
                color="secondary" 
                size="large"
                sx={{ 
                  mt: 4, 
                  py: 2, 
                  borderRadius: 4, 
                  fontWeight: 900, 
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 24px -6px rgba(156, 39, 176, 0.5)',
                  textTransform: 'none'
                }} 
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(answers).length < questions.length}
              >
                Gözlemi Onayla
              </Button>
            ) : (
              <Button 
                fullWidth 
                variant="outlined" 
                color="secondary" 
                sx={{ mt: 3, py: 1.5, borderRadius: 4, fontWeight: 800, textTransform: 'none' }} 
                onClick={fetchData}
              >
                Farklı Şehirleri İncele
              </Button>
            )}
          </Paper>
        </Box>
      </Box>

      <Paper sx={{ 
        p: 3, 
        borderRadius: 5, 
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'primary.main', 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
      }}>
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.15)', p: 2, borderRadius: 4, display: 'flex' }}>
          <AirIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: 0.5 }}>AKADEMİK NOT</Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, lineHeight: 1.5 }}>
            Rüzgar, yüksek basınç (soğuk/yoğun) alanından alçak basınç (sıcak/seyrek) alanına doğru gerçekleşen yatay yönlü hava hareketidir. 
            Basınç farkı ne kadar fazlaysa, hava akımı o denli şiddetlenir.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default WeatherSimulation;
