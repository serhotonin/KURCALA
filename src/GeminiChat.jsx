import { useState, useRef, useEffect } from 'react';
import {
  Drawer, TextField, Box, Typography, IconButton, Paper, CircularProgress, Avatar, Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function GeminiChat({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Merhaba. Ben SERUF Enterprise Destek Asistanınızım. Size müfredat, simülasyonlar veya teknik konularda nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatSession, setChatSession] = useState(null);

  useEffect(() => {
    // Initialize chat session on load
    try {
        const session = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Sen SERUF için bir fen bilimleri eğitim asistanısın. Öğrencilere 5, 6, 7 ve 8. sınıf konularında rehberlik etmelisin. Yanıtların Türkçe, açıklayıcı ve cesaretlendirici olmalı." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Anladım. SERUF fen bilimleri eğitim asistanı olarak öğrencilere yardımcı olmaya hazırım." }],
                },
            ],
        });
        setChatSession(session);
    } catch (e) {
        console.error("Failed to initialize chat session", e);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
          // Mock response if no key is provided to prevent crashing during demo
          setTimeout(() => {
              setMessages(prev => [...prev, {
                  role: 'model',
                  content: 'VITE_GEMINI_API_KEY bulunamadı. Lütfen `.env` dosyanızı kontrol edin. (Bu bir test yanıtıdır)'
              }]);
              setIsLoading(false);
          }, 1000);
          return;
      }

      if (chatSession) {
          const result = await chatSession.sendMessage(userMessage);
          const responseText = result.response.text();
          setMessages(prev => [...prev, { role: 'model', content: responseText }]);
      } else {
          throw new Error("Chat session not initialized");
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: 'Üzgünüm, bir hata oluştu veya API bağlantısı sağlanamadı. Lütfen daha sonra tekrar deneyin.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400, md: 450 },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderLeft: '1px solid',
          borderColor: 'divider',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.2)'
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'background.default', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              <SupportAgentIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>Destek Asistanı</Typography>
              <Typography variant="caption" sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', display: 'inline-block' }}></span> Çevrimiçi
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary', bgcolor: 'rgba(255,255,255,0.05)' } }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Chat Area */}
        <Box sx={{ flexGrow: 1, p: 3, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: 1.5
              }}
            >
              {msg.role === 'model' && (
                <Avatar sx={{ bgcolor: 'secondary.dark', width: 28, height: 28, mt: 0.5 }}>
                   <SupportAgentIcon sx={{ fontSize: 16 }} />
                </Avatar>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: '85%',
                  bgcolor: msg.role === 'user' ? 'primary.dark' : 'background.default',
                  color: 'text.primary',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  border: '1px solid',
                  borderColor: msg.role === 'user' ? 'primary.main' : 'divider'
                }}
              >
                <Box className="prose prose-invert prose-sm max-w-none" sx={{
                  '& p': { margin: 0, lineHeight: 1.5 },
                  '& p + p': { marginTop: '0.75em' }
                }}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Box>
              </Paper>
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 1.5 }}>
               <Avatar sx={{ bgcolor: 'secondary.dark', width: 28, height: 28, mt: 0.5 }}>
                   <SupportAgentIcon sx={{ fontSize: 16 }} />
                </Avatar>
               <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: '12px 12px 12px 2px', border: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', height: 40 }}>
                 <CircularProgress size={16} sx={{ color: 'text.secondary' }} />
               </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2.5, bgcolor: 'background.default', borderTop: '1px solid', borderColor: 'divider' }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Mesajınızı yazın..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSend} disabled={!input.trim() || isLoading} size="small" sx={{ color: 'primary.main', mr: -1 }}>
                  <SendIcon fontSize="small" />
                </IconButton>
              ),
              sx: {
                bgcolor: 'background.paper',
                color: 'text.primary',
                borderRadius: 2,
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'text.secondary' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              }
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
}

export default GeminiChat;
