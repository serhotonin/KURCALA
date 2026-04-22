import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as GeminiIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  HelpOutlined as HelpIcon,
  NotificationsNone as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../ThemeContext';

const drawerWidth = 280;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();

  const menuItems = [
    { label: '5. Sınıf', path: '/grade/5' },
    { label: '6. Sınıf', path: '/grade/6' },
    { label: '7. Sınıf', path: '/grade/7' },
    { label: '8. Sınıf', path: '/grade/8' },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 32, height: 32, backgroundColor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ color: mode === 'light' ? 'white' : 'black', fontWeight: 800, fontSize: '1.2rem' }}>A</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
              AETHER
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
              LABORATUVARLARI
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={toggleTheme} size="small">
          {mode === 'dark' ? <LightIcon fontSize="small" /> : <DarkIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2 }}>
          ANA MENÜ
        </Typography>
        <List sx={{ mt: 0.5 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => navigate('/')}
              selected={location.pathname === '/'}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': { backgroundColor: 'rgba(0,0,0,0.04)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><DashboardIcon fontSize="small" /></ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>Panel</Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>

        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2, mt: 2, display: 'block' }}>
          MÜFREDAT
        </Typography>
        <List sx={{ mt: 0.5 }}>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': { backgroundColor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}><SchoolIcon fontSize="small" /></ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2, mt: 2, display: 'block' }}>
          YAPAY ZEKA
        </Typography>
        <List sx={{ mt: 0.5 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/gemini')}
              selected={location.pathname === '/gemini'}
              sx={{
                borderRadius: 2,
                backgroundColor: location.pathname === '/gemini' ? 'rgba(0,0,0,0.04)' : 'transparent',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><GeminiIcon fontSize="small" sx={{ color: 'text.primary' }} /></ListItemIcon>
              <ListItemText
                primary={
                  <Typography sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.9rem' }}>
                    Gemini Asistan
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton
            onClick={() => navigate('/notifications')}
            selected={location.pathname === '/notifications'}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}><NotificationsIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Bildirimler</Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><HelpIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Destek</Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/settings')}
            selected={location.pathname === '/settings'}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText
              primary={
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>Ayarlar</Typography>
              }
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: '1rem' }}>Ö</Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Öğrenci Hesabı</Typography>
          <Typography variant="caption" color="text.secondary">ogrenci@aether.edu.tr</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
