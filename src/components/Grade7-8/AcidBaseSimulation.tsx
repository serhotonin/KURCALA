import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, keyframes } from '@mui/material';
import { useLanguage } from '../../LanguageContext';

const fire = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2) skewX(2deg); }
`;

const sizzle = keyframes`
  0% { opacity: 0; transform: translateY(0); }
  50% { opacity: 0.8; transform: translateY(-5px); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

const AcidBaseSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const { t } = useLanguage();
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
        <Typography align="center" variant="h5" sx={{ fontWeight: 800, mb: 2, color: getColor(ph) }}>{t('phLevel')}: {ph.toFixed(1)}</Typography>
        <Slider 
          value={ph} 
          min={sandbox ? 0 : 3} 
          max={sandbox ? 14 : 11} 
          step={0.1} 
          onChange={(_, v) => setPh(v as number)} 
          sx={{ color: getColor(ph) }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
           <Typography variant="caption" sx={{ fontWeight: 900, color: 'red' }}>{t('acid')}</Typography>
           <Typography variant="caption" sx={{ fontWeight: 900, color: '#888' }}>{t('neutral')}</Typography>
           <Typography variant="caption" sx={{ fontWeight: 900, color: 'blue' }}>{t('base')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AcidBaseSimulation;
