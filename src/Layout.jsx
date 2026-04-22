import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Drawer, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import GeminiChat from './GeminiChat';

const drawerWidth = 280;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [geminiOpen, setGeminiOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleGeminiToggle = () => {
    setGeminiOpen(!geminiOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', bgcolor: 'background.default' }}>

      {/* Main Content Area - On the left */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4, md: 6 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          height: '100vh'
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="end"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, position: 'absolute', top: 16, right: 16, zIndex: 10 }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, mt: { xs: 6, sm: 0 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Outlet />
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right" // explicitly anchor right
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.paper' },
        }}
      >
        <Sidebar onGeminiClick={handleGeminiToggle} />
      </Drawer>

      {/* Desktop Drawer - Right Side */}
      <Drawer
        variant="permanent"
        anchor="right" // explicitly anchor right
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: 'background.paper', borderLeft: '1px solid', borderColor: 'divider' },
        }}
        open
      >
        <Sidebar onGeminiClick={handleGeminiToggle} />
      </Drawer>

      <GeminiChat open={geminiOpen} onClose={() => setGeminiOpen(false)} />
    </Box>
  );
}

export default Layout;