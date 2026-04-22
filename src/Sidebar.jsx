import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import TokenIcon from '@mui/icons-material/Token';

const grades = [
  { id: '5', label: '5. Sınıf Müfredatı' },
  { id: '6', label: '6. Sınıf Müfredatı' },
  { id: '7', label: '7. Sınıf Müfredatı' },
  { id: '8', label: '8. Sınıf Müfredatı' },
];

function Sidebar({ onGeminiClick }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 2, display: 'flex' }}>
          <TokenIcon sx={{ color: 'white' }} />
        </Box>
        <Typography variant="h6" component="div" sx={{ fontWeight: '700', letterSpacing: '-0.02em', color: 'text.primary' }}>
          SERUF Enterprise
        </Typography>
      </Box>
      <Divider sx={{ borderColor: 'divider' }} />

      <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
        <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 600 }}>Öğrenim Modülleri</Typography>
        {grades.map((grade) => {
          const isSelected = location.pathname.includes(`/grade/${grade.id}`);
          return (
            <ListItem key={grade.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => navigate(`/grade/${grade.id}`)}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(37, 99, 235, 0.15)', // primary.main with opacity
                    '&:hover': {
                      backgroundColor: 'rgba(37, 99, 235, 0.25)',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                  <AutoStoriesIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? 'primary.main' : 'text.primary',
                    fontSize: '0.9rem'
                  }}
                  primary={grade.label}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'divider' }} />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<SupportAgentIcon />}
          onClick={onGeminiClick}
          sx={{
            py: 1.5,
            fontWeight: 600,
            bgcolor: 'secondary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'secondary.dark',
            },
            boxShadow: '0 4px 14px 0 rgba(147, 51, 234, 0.39)',
            textTransform: 'none',
            fontSize: '0.95rem'
          }}
        >
          Destek Asistanı
        </Button>
      </Box>
    </Box>
  );
}

export default Sidebar;