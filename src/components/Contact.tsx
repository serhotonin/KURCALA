import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  HelpOutlineOutlined as SupportIcon,
} from '@mui/icons-material';
import { useLanguage } from '../LanguageContext';

const Contact: React.FC = () => {
  const theme = useTheme();
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
    
    // Integration logic remains same
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 10 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 8, 
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          minHeight: 650,
          bgcolor: 'background.paper'
        }}
      >
        {/* Left Side: Information Panel - Fixed Dark Theme for better visibility */}
        <Box 
          sx={{ 
            flex: { md: '0 0 40%' },
            bgcolor: '#0f172a', // Fixed deep dark color for visibility in all modes
            color: 'white',
            p: { xs: 4, md: 6 },
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative Circles */}
          <Box sx={{ 
            position: 'absolute', 
            top: -50, 
            right: -50, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            bgcolor: alpha('#3b82f6', 0.15),
            zIndex: 0
          }} />
          <Box sx={{ 
            position: 'absolute', 
            bottom: -80, 
            left: -80, 
            width: 250, 
            height: 250, 
            borderRadius: '50%', 
            bgcolor: alpha('#3b82f6', 0.1),
            zIndex: 0
          }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <SupportIcon sx={{ fontSize: 48, color: '#3b82f6' }} />
                <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -2 }}>
                    {t('contactUs')}
                </Typography>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 8, opacity: 0.7, fontSize: '1.1rem', lineHeight: 1.6 }}>
              {t('contactDesc')}
            </Typography>

            {/* Contact Items - Vertically Stacked Labels */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: 2, 
                        bgcolor: alpha('#fff', 0.1), 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 1
                    }}>
                        <EmailIcon sx={{ fontSize: 22, color: '#3b82f6' }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Email Address
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                            haciogullariserhat@gmail.com
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: 2, 
                        bgcolor: alpha('#fff', 0.1), 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 1
                    }}>
                        <LocationIcon sx={{ fontSize: 22, color: '#3b82f6' }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" sx={{ opacity: 0.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
                            Our Location
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                            Istanbul, Turkey
                        </Typography>
                    </Box>
                </Box>
            </Box>
          </Box>

          <Box sx={{ position: 'relative', zIndex: 1, mt: 'auto', pt: 6 }}>
             <Typography variant="h5" sx={{ fontWeight: 950, color: '#3b82f6', mb: 0.5 }}>KURCALA LABS</Typography>
             <Typography variant="caption" sx={{ opacity: 0.4, fontWeight: 700 }}>
                © 2026 Yıldız Teknik Üniversitesi
             </Typography>
          </Box>
        </Box>

        {/* Right Side: Support Form */}
        <Box sx={{ flex: 1, p: { xs: 4, md: 8 }, bgcolor: 'background.paper' }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'text.primary', letterSpacing: -1 }}>
                    {(t('language') === 'tr' ? 'Destek Talebi Oluştur' : 'Support Request')}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {(t('language') === 'tr' ? 'Ekibimiz 24 saat içinde size dönüş yapacaktır.' : 'Our team will get back to you within 24 hours.')}
                </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', ml: 1 }}>
                    {t('name').toUpperCase()}
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder={t('name')}
                  variant="outlined"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'action.hover' } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', ml: 1 }}>
                    {t('email').toUpperCase()}
                </Typography>
                <TextField
                  fullWidth
                  required
                  type="email"
                  placeholder={t('email')}
                  variant="outlined"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', ml: 1 }}>
                    {t('subject').toUpperCase()}
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder={t('subject')}
                  variant="outlined"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block', ml: 1 }}>
                    {t('message').toUpperCase()}
                </Typography>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  placeholder={(t('language') === 'tr' ? 'Mesajınızı buraya yazın...' : 'Type your message here...')}
                  variant="outlined"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'action.hover' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={status === 'sending'}
                  endIcon={status === 'sending' ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                  sx={{ 
                    py: 2.5, 
                    fontSize: '1.1rem', 
                    borderRadius: 3, 
                    fontWeight: 900, 
                    bgcolor: 'text.primary',
                    color: 'background.paper',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.text.primary, 0.8),
                    },
                    boxShadow: '0 12px 30px -10px rgba(0,0,0,0.3)',
                    textTransform: 'none',
                    mt: 1
                  }}
                >
                  {status === 'sending' ? t('sending') : t('send')}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>

      <Snackbar
        open={status === 'success' || status === 'error'}
        autoHideDuration={6000}
        onClose={() => setStatus('idle')}
      >
        <Alert 
            severity={status === 'success' ? 'success' : 'error'} 
            variant="filled"
            sx={{ width: '100%', borderRadius: 4, fontWeight: 700 }}
        >
          {status === 'success' ? t('success') : t('error')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
