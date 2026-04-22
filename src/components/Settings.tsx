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
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  NotificationsNone as NotificationIcon,
  VpnKey as SecurityIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useThemeContext } from '../ThemeContext';

const Settings: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
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

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>Ayarlar</Typography>
        <Typography variant="h6" color="text.secondary">AETHER platform tercihlerini kişiselleştirin.</Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <List sx={{ p: 0 }}>
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><DarkModeIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Karanlık Mod</Typography>}
              secondary="Platformu koyu temada kullanın."
            />
            <Switch checked={mode === 'dark'} onChange={toggleTheme} />
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><NotificationIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>E-posta Bildirimleri</Typography>}
              secondary="Yeni modüller ve güncellemeler hakkında e-posta alın."
            />
            <Switch checked={emailNotify} onChange={handleToggleEmail} />
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><LanguageIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Platform Dili</Typography>}
              secondary="Türkçe (Varsayılan)"
            />
            <Button variant="outlined" size="small" disabled>Değiştir</Button>
          </ListItem>
          <Divider />
          <ListItem sx={{ py: 3 }}>
            <ListItemIcon><SecurityIcon color="primary" /></ListItemIcon>
            <ListItemText
              primary={<Typography variant="body1" sx={{ fontWeight: 600 }}>Hesap Güvenliği</Typography>}
              secondary="Şifrenizi ve 2FA ayarlarınızı yönetin."
            />
            <Button variant="outlined" size="small">Yönet</Button>
          </ListItem>
        </List>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" color="error">Verilerimi Temizle</Button>
        <Button variant="contained">Ayarları Uygula</Button>
      </Box>
    </Container>
  );
};

export default Settings;
