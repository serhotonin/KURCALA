import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationIcon,
  Circle as CircleIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  read: number;
}

const Notifications: React.FC = () => {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = () => {
    fetch('http://localhost:3001/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error('Failed to fetch notifications:', err));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = (id: number) => {
    fetch(`http://localhost:3001/api/notifications/${id}/read`, { method: 'POST' })
      .then(() => fetchNotifications())
      .catch((err) => console.error('Failed to mark notification as read:', err));
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>{t('notifications')}</Typography>
        <Typography variant="h6" color="text.secondary">{t('notificationUpdates')}</Typography>
      </Box>

      <Card>
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem sx={{ py: 4, textAlign: 'center' }}>
              <ListItemText primary={t('noNewNotifications')} />
            </ListItem>
          ) : (
            notifications.map((n, index) => (
              <React.Fragment key={n.id}>
                <ListItem
                  secondaryAction={
                    n.read === 0 && (
                      <IconButton edge="end" onClick={() => markAsRead(n.id)}>
                        <DoneIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                  sx={{
                    py: 2.5,
                    backgroundColor: n.read === 0 ? 'action.hover' : 'transparent',
                    opacity: n.read === 1 ? 0.6 : 1,
                  }}
                >
                  <ListItemIcon>
                    {n.read === 0 ? (
                      <CircleIcon sx={{ fontSize: 10, color: 'primary.main' }} />
                    ) : (
                      <NotificationIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: n.read === 0 ? 600 : 400 }}>
                        {n.message}
                      </Typography>
                    }
                    secondary={new Date(n.timestamp).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Card>
    </Container>
  );
};

export default Notifications;
