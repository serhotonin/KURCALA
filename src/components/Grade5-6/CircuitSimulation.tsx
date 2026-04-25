import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  Button,
  Divider,
  useTheme,
  alpha,
  Slider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  RestartAlt as ResetIcon,
  Lightbulb as BulbIcon,
  BatteryFull as BatteryIcon,
  Power as SwitchIcon,
  Science as ScienceIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// --- TYPES ---
interface CircuitElement {
  id: string;
  type: 'battery' | 'bulb';
  x: number;
  y: number;
}

const CircuitSimulation: React.FC = () => {
  const theme = useTheme();
  const [elements, setElements] = useState<CircuitElement[]>([]);
  const [isSwitchClosed, setIsSwitchClosed] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Calculate circuit parameters
  const batteryCount = elements.filter(el => el.type === 'battery').length;
  const bulbCount = elements.filter(el => el.type === 'bulb').length;
  
  // Brightness formula: (batteries / bulbs) * base_multiplier
  // We'll normalize this to a 0-1 range for styling
  const calculateBrightness = () => {
    if (bulbCount === 0 || batteryCount === 0 || !isSwitchClosed) return 0;
    const ratio = batteryCount / bulbCount;
    // Cap it at a reasonable max brightness
    return Math.min(ratio * 0.5, 1.5); 
  };

  const brightness = calculateBrightness();

  // --- ACTIONS ---
  const addElement = (type: 'battery' | 'bulb') => {
    const newElement: CircuitElement = {
      id: `${type}_${Date.now()}`,
      type,
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const resetCircuit = () => {
    setElements([]);
    setIsSwitchClosed(true);
  };

  // --- DRAG AND DROP LOGIC ---
  const handleMouseDown = (id: string) => {
    setDraggingId(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setElements(elements.map(el => 
      el.id === draggingId ? { ...el, x, y } : el
    ));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%', minHeight: '600px' }}>
      
      {/* Header / Stats */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
            Dinamik Devre Laboratuvarı
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Parçaları sürükle-bırak yöntemiyle devreye ekle ve parlaklık değişimini gözlemle.
          </Typography>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 4, display: 'flex', gap: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), border: '1px solid', borderColor: 'primary.light' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>PİL SAYISI</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{batteryCount}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>AMPUL SAYISI</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900 }}>{bulbCount}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'block' }}>PARLAKLIK</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, color: brightness > 0 ? 'warning.main' : 'text.disabled' }}>
              {brightness === 0 ? '%0' : `%${Math.round(brightness * 100)}`}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexGrow: 1 }}>
        
        {/* Sidebar / Tools */}
        <Paper sx={{ width: 280, p: 3, borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5 }}>
            ENSTRÜMANLAR
          </Typography>
          
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<BatteryIcon />}
            onClick={() => addElement('battery')}
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
          >
            Pil Ekle
          </Button>

          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<BulbIcon />}
            onClick={() => addElement('bulb')}
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, bgcolor: 'warning.main', color: 'black', '&:hover': { bgcolor: 'warning.dark' } }}
          >
            Ampul Ekle
          </Button>

          <Divider />

          <Typography variant="overline" sx={{ fontWeight: 900, color: 'text.secondary', letterSpacing: 1.5 }}>
            KONTROLLER
          </Typography>

          <Button 
            variant="outlined" 
            fullWidth 
            startIcon={<SwitchIcon />}
            onClick={() => setIsSwitchClosed(!isSwitchClosed)}
            color={isSwitchClosed ? "success" : "error"}
            sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
          >
            {isSwitchClosed ? "Anahtarı Aç" : "Anahtarı Kapat"}
          </Button>

          <Button 
            variant="text" 
            fullWidth 
            startIcon={<ResetIcon />}
            onClick={resetCircuit}
            sx={{ mt: 'auto', fontWeight: 800, color: 'text.secondary' }}
          >
            Devreyi Sıfırla
          </Button>

          <Box sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderRadius: 4, border: '1px dashed', borderColor: 'info.main' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <InfoIcon sx={{ fontSize: 16, color: 'info.main' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'info.main' }}>BİLGİ</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
              • Pil sayısı arttıkça parlaklık artar.<br/>
              • Ampul sayısı arttıkça parlaklık azalır.<br/>
              • Anahtar açıkken akım geçmez.
            </Typography>
          </Box>
        </Paper>

        {/* Main Canvas Area */}
        <Box 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          sx={{ 
            flexGrow: 1, 
            bgcolor: theme.palette.mode === 'dark' ? '#0a1929' : '#f0f4f8', 
            borderRadius: 8,
            border: '2px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            cursor: draggingId ? 'grabbing' : 'default',
            backgroundImage: `radial-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        >
          {/* Connection Lines (Simplified Grid Layout) */}
          <Box sx={{ 
            position: 'absolute', 
            top: '15%', 
            left: '15%', 
            right: '15%', 
            bottom: '15%', 
            border: '3px solid',
            borderColor: brightness > 0 ? alpha(theme.palette.warning.main, 0.4) : 'divider',
            borderRadius: 4,
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            boxShadow: brightness > 0 ? `0 0 ${brightness * 20}px ${alpha(theme.palette.warning.main, 0.2)}` : 'none'
          }} />

          {/* Render Elements */}
          {elements.map((el) => (
            <Box
              key={el.id}
              onMouseDown={() => handleMouseDown(el.id)}
              sx={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                transform: 'translate(-50%, -50%)',
                zIndex: draggingId === el.id ? 100 : 1,
                cursor: draggingId === el.id ? 'grabbing' : 'grab',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                userSelect: 'none'
              }}
            >
              <Paper
                elevation={draggingId === el.id ? 8 : 2}
                sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid',
                  borderColor: draggingId === el.id ? 'primary.main' : 'divider',
                  transition: 'transform 0.1s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translate(-50%, -50%) scale(1.1)',
                    borderColor: 'primary.light'
                  }
                }}
              >
                {el.type === 'battery' ? (
                  <BatteryIcon sx={{ fontSize: 40, color: 'success.main' }} />
                ) : (
                  <BulbIcon sx={{ 
                    fontSize: 40, 
                    color: brightness > 0 ? 'warning.main' : 'text.disabled',
                    filter: brightness > 0 ? `drop-shadow(0 0 ${brightness * 15}px ${theme.palette.warning.main})` : 'none',
                    transition: 'all 0.3s ease'
                  }} />
                )}
              </Paper>
              <IconButton 
                size="small" 
                onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
                sx={{ 
                  mt: 0.5, 
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                }}
              >
                <DeleteIcon sx={{ fontSize: 14, color: 'error.main' }} />
              </IconButton>
            </Box>
          ))}

          {/* No Elements Placeholder */}
          {elements.length === 0 && (
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              opacity: 0.5
            }}>
              <ScienceIcon sx={{ fontSize: 60, mb: 2, color: 'text.disabled' }} />
              <Typography variant="h6" color="text.disabled" sx={{ fontWeight: 800 }}>
                Devre Boş
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Soldaki menüden parça ekleyerek deneye başlayın.
              </Typography>
            </Box>
          )}

          {/* Current Flow Animation */}
          {brightness > 0 && (
            <Box sx={{ 
              position: 'absolute', 
              top: '15%', 
              left: '15%', 
              right: '15%', 
              bottom: '15%', 
              borderRadius: 4,
              pointerEvents: 'none',
              border: '3px solid transparent',
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -3,
                border: '3px solid',
                borderColor: theme.palette.warning.main,
                borderRadius: 4,
                animation: 'pulse 1.5s infinite',
              }
            }} />
          )}
        </Box>
      </Box>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.02); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default CircuitSimulation;
