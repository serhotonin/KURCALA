import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import GradeView from './GradeView';
import TopicSimulation from './TopicSimulation';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0A0A0A', // very dark background
      paper: '#141414', // slightly lighter for paper
    },
    primary: {
      main: '#2563EB', // professional blue
      light: '#3B82F6',
      dark: '#1D4ED8',
    },
    secondary: {
      main: '#9333EA', // deep purple
      light: '#A855F7',
      dark: '#7E22CE',
    },
    text: {
      primary: '#F3F4F6',
      secondary: '#9CA3AF',
    },
    divider: '#262626',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #262626',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderLeft: '1px solid #262626',
          backgroundImage: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/grade/5" replace />} />
            <Route path="grade/:gradeId" element={<GradeView />} />
            <Route path="grade/:gradeId/topic/:topicId" element={<TopicSimulation />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;