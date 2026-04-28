import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { ThemeContextProvider } from './ThemeContext';
import { LanguageProvider } from './LanguageContext';
import Sidebar from './components/Sidebar';
import GradeView from './components/GradeView';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Contact from './components/Contact';

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  React.useEffect(() => {
    const handleCollapse = (e: any) => {
      setSidebarCollapsed(e.detail);
    };
    window.addEventListener('sidebar-collapse', handleCollapse);
    return () => window.removeEventListener('sidebar-collapse', handleCollapse);
  }, []);

  return (
    <ThemeContextProvider>
      <LanguageProvider>
        <CssBaseline />
        <Box sx={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'background.default' }}>
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              height: '100%',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              transition: 'margin-left 0.3s ease',
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/grade/:gradeId" element={<GradeView />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </LanguageProvider>
    </ThemeContextProvider>
  );
};

export default App;
