import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  NotificationsNone as NotificationIcon,
  VpnKey as SecurityIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../ThemeContext';
import { useLanguage } from '../LanguageContext';

const Settings: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
  const { language, setLanguage, t } = useLanguage();
  const [emailNotify, setEmailNotify] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setEmailNotify(data.emailNotifications === 1);
      });
  }, []);

  const handleToggleEmail = () => {
    const newVal = !emailNotify;
    setEmailNotify(newVal);
    fetch('http://localhost:3001/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: mode, emailNotifications: newVal }),
    }).catch(err => console.error('Failed to update email settings:', err));
  };

  const handleLanguageChange = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: 'tr' | 'en',
  ) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t('settings')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('personalize')}</Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><DarkModeIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{t('darkMode')}</Typography>}
              secondary={t('darkModeDesc')}
            />
            <Switch checked={mode === 'dark'} onChange={toggleTheme} />
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><NotificationIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{t('emailNotifications')}</Typography>}
              secondary={t('emailNotificationsDesc')}
            />
            <Switch checked={emailNotify} onChange={handleToggleEmail} />
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><LanguageIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{t('platformLanguage')}</Typography>}
              secondary={language === 'tr' ? 'Türkçe' : 'English'}
            />
            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={handleLanguageChange}
              size="small"
              color="primary"
            >
              <ToggleButton value="tr">TR</ToggleButton>
              <ToggleButton value="en">EN</ToggleButton>
            </ToggleButtonGroup>
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>{t('accountSecurity')}</Typography>}
              secondary={t('accountSecurityDesc')}
            />
            <Button variant="outlined" size="small">{t('manage')}</Button>
          </ListItem>
        </List>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="error">{t('clearData')}</Button>
        <Button variant="contained">{t('applySettings')}</Button>
      </Box>
    </Container>
  );
};

export default Settings;
