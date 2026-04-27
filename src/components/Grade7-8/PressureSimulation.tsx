import React, { useState } from 'react';
import { Box, Typography, Paper, Slider, keyframes } from '@mui/material';
import { useLanguage } from '../../LanguageContext';

const fire = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.2) skewX(2deg); }
`;

const PressureSimulation: React.FC<{ sandbox: boolean }> = ({ sandbox }) => {
  const { t } = useLanguage();
  const [water, setWater] = useState(40);
  const pressure = water * 1.5;
  const isBreaking = sandbox && water > 90;

  return (
    <Box sx={{ width: '100%', height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Box sx={{ position: 'relative', width: 400, height: 300, display: 'flex' }}>
        <Box sx={{ flex: 1, position: 'relative', bgcolor: '#e0f2fe', borderRadius: '4px 0 0 4px', border: '4px solid #333', borderRight: 'none' }}>
           <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${water}%`, bgcolor: '#0ea5e9', transition: 'height 0.3s', opacity: 0.8 }} />
           <Typography sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 900, color: '#0369a1' }}>{t('reservoir')}</Typography>
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
                <Typography sx={{ color: 'white', fontWeight: 900, p: 4 }}>{t('cityFlooded')}</Typography>
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
        <Typography variant="caption" sx={{ mt: 2, fontWeight: 800 }}>{t('waterLevel')}</Typography>
        <Paper sx={{ mt: 4, p: 2, bgcolor: '#f1f5f9' }}>
           <Typography variant="overline" sx={{ fontWeight: 900 }}>{t('pressure')}</Typography>
           <Typography variant="h5" sx={{ fontWeight: 900, color: pressure > 100 ? 'red' : 'primary.main' }}>{pressure.toFixed(0)} kPa</Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default PressureSimulation;
