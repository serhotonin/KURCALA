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
  Tooltip,
} from '@mui/material';
import {
  School as SchoolIcon,
  Psychology as GeminiIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  NotificationsNone as NotificationsIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
  ContactSupport as ContactIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeContext } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';

const drawerWidth = 280;
const collapsedWidth = 88;

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme } = useThemeContext();
  const { t } = useLanguage();

  const menuItems = [
    { label: t('grade5'), path: '/grade/5' },
    { label: t('grade6'), path: '/grade/6' },
    { label: t('grade7'), path: '/grade/7' },
    { label: t('grade8'), path: '/grade/8' },
  ];

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: currentWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: currentWidth,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      {/* Header Area */}
      <Box 
        onClick={() => navigate('/')}
        sx={{ 
          p: 2, 
          height: 80, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 }
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              width: 32, 
              height: 32, 
              backgroundColor: 'primary.main', 
              borderRadius: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography sx={{ 
                color: mode === 'dark' ? '#000000' : '#ffffff', 
                fontWeight: 800, 
                fontSize: '1.2rem' 
              }}>K</Typography>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                {t('appName')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.5 }}>
                {t('appTagline')}
              </Typography>
            </Box>
          </Box>
        )}

        {collapsed && (
          <Box sx={{ 
            width: 32, 
            height: 32, 
            backgroundColor: 'primary.main', 
            borderRadius: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography sx={{ 
              color: mode === 'dark' ? '#000000' : '#ffffff', 
              fontWeight: 800, 
              fontSize: '1.2rem' 
            }}>K</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ px: 2, mb: 1 }}>
        <IconButton onClick={onToggle} size="small" sx={{ 
            width: '100%',
            borderRadius: 2,
            bgcolor: 'action.hover',
            '&:hover': { bgcolor: 'primary.main', color: 'white' }
        }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      <Divider />

      {/* Theme Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Tooltip title={mode === 'dark' ? 'Açık Mod' : 'Koyu Mod'} placement="right">
            <IconButton onClick={toggleTheme} sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 3,
                bgcolor: 'action.hover'
            }}>
                {mode === 'dark' ? <LightIcon color="warning" /> : <DarkIcon color="primary" />}
            </IconButton>
          </Tooltip>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 10 } }}>
        <Box sx={{ px: 2, mt: 1 }}>
          {!collapsed && (
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2 }}>
              {t('mainMenu')}
            </Typography>
          )}
          <List>
            <Tooltip title={collapsed ? t('dashboard') : ''} placement="right">
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate('/')}
                  selected={location.pathname === '/'}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    borderRadius: 3,
                    px: 2.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                    <DashboardIcon color={location.pathname === '/' ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 700, opacity: 1 }}>
                          {t('dashboard')}
                        </Typography>
                      } 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>

          {!collapsed && (
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2, mt: 2, display: 'block' }}>
              {t('curriculum')}
            </Typography>
          )}
          <List>
            {menuItems.map((item) => (
              <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: collapsed ? 'center' : 'initial',
                      borderRadius: 3,
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                      <SchoolIcon color={location.pathname === item.path ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 700, opacity: 1 }}>
                            {item.label}
                          </Typography>
                        } 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>

          {!collapsed && (
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2, mt: 2, display: 'block' }}>
              {t('aiAssistant')}
            </Typography>
          )}
          <List>
            <Tooltip title={collapsed ? t('geminiAssistant') : ''} placement="right">
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => navigate('/gemini')}
                  selected={location.pathname === '/gemini'}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed ? 'center' : 'initial',
                    borderRadius: 3,
                    px: 2.5,
                    bgcolor: location.pathname === '/gemini' ? 'primary.main' : 'transparent',
                    color: location.pathname === '/gemini' ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: location.pathname === '/gemini' ? 'primary.dark' : 'action.hover',
                    },
                    '& .MuiListItemIcon-root': {
                      color: location.pathname === '/gemini' ? 'white' : 'inherit',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                    <GeminiIcon />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText 
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 800, opacity: 1 }}>
                          {t('geminiAssistant')}
                        </Typography>
                      } 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </List>

          {/* Moved Platform Options into the scrollable list */}
          {!collapsed && (
            <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, ml: 2, mt: 2, display: 'block' }}>
              {(t('language') === 'tr' ? 'PLATFORM' : 'PLATFORM')}
            </Typography>
          )}
          <List>
            {[
              { label: t('notifications'), icon: <NotificationsIcon />, path: '/notifications' },
              { label: t('contactUs'), icon: <ContactIcon />, path: '/contact' },
              { label: t('settings'), icon: <SettingsIcon />, path: '/settings' },
            ].map((item) => (
              <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right">
                <ListItem disablePadding sx={{ mb: 0.2 }}>
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    selected={location.pathname === item.path}
                    sx={{
                      minHeight: 48,
                      justifyContent: collapsed ? 'center' : 'initial',
                      borderRadius: 3,
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2, justifyContent: 'center' }}>
                      {item.icon}
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText 
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 700, opacity: 1 }}>
                            {item.label}
                          </Typography>
                        } 
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'initial', gap: 1.5 }}>
        <Avatar 
          src="https://upload.wikimedia.org/wikipedia/tr/b/b3/Y%C4%B1ld%C4%B1z_Teknik_%C3%9Cniversitesi_Logo.png"
          sx={{ 
            width: 36, 
            height: 36, 
            bgcolor: 'white', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '& img': { objectFit: 'contain', p: 0.5 }
          }} 
        />
        {!collapsed && (
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, whiteSpace: 'nowrap', display: 'block', lineHeight: 1.2 }}>
                Yıldız Teknik Üniversitesi
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
