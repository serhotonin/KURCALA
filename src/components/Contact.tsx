import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Grid,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    // Simulating email sending
    // In a real scenario, you would use a service like Formspree or your own backend
    // Since the user asked to redirect to haciogullariserhat@gmail.com
    // I recommend using Formspree: https://formspree.io/f/haciogullariserhat@gmail.com (once registered)
    
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>{t('contactUs')}</Typography>
        <Typography variant="h6" color="text.secondary">
          {t('contactDesc')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}>
                <EmailIcon />
              </IconButton>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>haciogullariserhat@gmail.com</Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ bgcolor: 'secondary.main', color: 'white', '&:hover': { bgcolor: 'secondary.dark' } }}>
                <PhoneIcon />
              </IconButton>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>+90 (555) 000 00 00</Typography>
              </Box>
            </Card>

            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton sx={{ bgcolor: 'info.main', color: 'white', '&:hover': { bgcolor: 'info.dark' } }}>
                <LocationIcon />
              </IconButton>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Istanbul, Turkey</Typography>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{ p: 4 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('name')}
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('email')}
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('subject')}
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('message')}
                    multiline
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={status === 'sending'}
                    endIcon={<SendIcon />}
                    sx={{ py: 1.5, fontSize: '1.1rem' }}
                  >
                    {status === 'sending' ? t('sending') : t('send')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>

      <Snackbar
        open={status === 'success' || status === 'error'}
        autoHideDuration={6000}
        onClose={() => setStatus('idle')}
      >
        <Alert severity={status === 'success' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {status === 'success' ? t('success') : t('error')}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 8, p: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Note on Email Integration:</Typography>
        <Typography variant="body2" color="text.secondary">
          To receive these emails directly at <strong>haciogullariserhat@gmail.com</strong>, you can use a service like <strong>Formspree</strong> (easiest, no backend required) or set up <strong>Nodemailer</strong> with an SMTP server (requires backend configuration). 
          For SMTP, you would need a service like SendGrid, Mailgun, or even a Gmail account with an "App Password".
        </Typography>
      </Box>
    </Container>
  );
};

export default Contact;
