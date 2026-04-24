import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Container,
  Divider,
  Button,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as GeminiIcon,
  Person as UserIcon,
  DeleteOutlined as DeleteIcon,
  School as TeacherIcon,
} from '@mui/icons-material';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Merhaba! Ben AETHER Yapay Zeka Asistanı. Laboratuvar çalışmalarınızda size rehberlik etmek için buradayım. Hangi konuda yardıma ihtiyacınız var?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [socraticMode, setSocraticMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // SECURE: Now calling local backend proxy instead of Google SDK directly
      const response = await fetch('http://localhost:3001/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
          socratic: socraticMode
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: 'model', text: data.text }]);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [...prev, { role: 'model', text: `Hata: ${error.message || 'Sunucuyla bağlantı kurulamadı.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'model', text: 'Sohbet geçmişi temizlendi. Yeni bir soru sorabilirsiniz.' }]);
  };

  return (
    <Container maxWidth="md" sx={{ height: '100%', display: 'flex', flexDirection: 'column', py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
            Yapay Zeka Asistanı
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bilimsel sorgularınız için akıllı rehberiniz.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={socraticMode} 
                onChange={(e) => setSocraticMode(e.target.checked)} 
                color="primary" 
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TeacherIcon fontSize="small" color={socraticMode ? "primary" : "disabled"} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: socraticMode ? 'text.primary' : 'text.disabled' }}>
                  Rehber Modu
                </Typography>
              </Box>
            }
          />
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<DeleteIcon />}
            size="small"
            onClick={handleClear}
            sx={{ color: 'text.secondary', borderColor: 'divider' }}
          >
            Temizle
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            p: 3,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: 'background.default',
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}
            >
              <Avatar
                sx={{
                  bgcolor: msg.role === 'user' ? 'text.primary' : 'background.paper',
                  width: 36,
                  height: 36,
                  border: msg.role === 'model' ? '1px solid' : 'none',
                  borderColor: 'divider',
                  boxShadow: msg.role === 'model' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {msg.role === 'user' ? <UserIcon fontSize="small" sx={{color: 'background.paper'}} /> : <GeminiIcon fontSize="small" sx={{ color: 'text.primary' }} />}
              </Avatar>
              <Box
                sx={{
                  maxWidth: '75%',
                  p: 2.5,
                  borderRadius: 3,
                  backgroundColor: msg.role === 'user' ? 'text.primary' : 'background.paper',
                  color: msg.role === 'user' ? 'background.paper' : 'text.primary',
                  border: msg.role === 'model' ? '1px solid' : 'none',
                  borderColor: 'divider',
                  boxShadow: msg.role === 'model' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                  borderTopRightRadius: msg.role === 'user' ? 4 : 24,
                  borderTopLeftRadius: msg.role === 'model' ? 4 : 24,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {msg.text}
                </Typography>
              </Box>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: 'flex', gap: 2, ml: 1 }}>
               <Avatar sx={{ width: 36, height: 36, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <GeminiIcon fontSize="small" sx={{ color: 'text.primary' }} />
              </Avatar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, backgroundColor: 'background.paper', borderRadius: 3, border: '1px solid', borderColor: 'divider', borderTopLeftRadius: 4 }}>
                <CircularProgress size={16} sx={{ color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">Asistan yanıt hazırlıyor...</Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Divider />
        <Box sx={{ p: 2, backgroundColor: 'background.paper', display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Araştırmak istediğiniz konuyu yazın..."
            variant="outlined"
            size="medium"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.default',
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            sx={{ height: 53, px: 4, borderRadius: 2, boxShadow: 'none' }}
            endIcon={<SendIcon />}
          >
            Gönder
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default GeminiChat;
