import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Dashboard,
  Engineering
} from '@mui/icons-material';

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#1a237e', fontWeight: 700 }}>
            Campus Trasnport Management System
          </Typography>
          <Button color="inherit" sx={{ color: '#000', mx: 1 }} onClick={() => scrollToSection('features')}>Features</Button>
          <Button color="inherit" sx={{ color: '#000', mx: 1 }} onClick={() => scrollToSection('benefits')}>Benefits</Button>
          <Button 
            variant="contained" 
            onClick={handleLoginClick}
            sx={{ bgcolor: '#4fc3f7', color: '#000', ml: 2, borderRadius: '20px', '&:hover': { bgcolor: '#29b6f6' } }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>


      {/* Hero Section with Background Image */}
      <Box sx={{ 
        position: 'relative',
        backgroundImage: 'url(/transport-pic.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        pb: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.4)', // Reduced overlay for more visibility
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          bgcolor: '#f8f9fa',
          borderTopLeftRadius: '50% 100%',
          borderTopRightRadius: '50% 100%',
          zIndex: 1,
        }
      }}>
        <Container maxWidth="lg" sx={{ pt: 16, pb: 12, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}>
              Campus
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}>
              Transport
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}>
              Management
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 4px rgba(255,255,255,0.9)' }}>
              System
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Challenges Section */}
      <Container maxWidth="lg" sx={{ py: 8 }} id="benefits">
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 6, textAlign: 'center', color: '#1a237e' }}>
          Solving Core Transport Challenges
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1, bgcolor: '#ffebee', p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ color: '#d32f2f', mb: 3, fontWeight: 600 }}>
              😟 The Challenges You Face
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon><Cancel sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText primary="Difficulty managing scattered student route data" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Cancel sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText primary="Manual fee collection causing delays" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Cancel sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText primary="Lack of real-time bus tracking and attendance marking" />
              </ListItem>
              <ListItem>
                <ListItemIcon><Cancel sx={{ color: '#d32f2f' }} /></ListItemIcon>
                <ListItemText primary="Poor communication channels for delays or emergencies" />
              </ListItem>
            </List>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ color: '#2e7d32', mb: 3, fontWeight: 600 }}>
              😊 The CTMS Solution
            </Typography>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 0, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Route Data:</Typography>
                <Typography variant="body2">Centralized access for all student, route, and driver data.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 0, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Online Fee Payments:</Typography>
                <Typography variant="body2">Secure integration for instant collections and digital receipts.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 0, mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Enhanced Tracking:</Typography>
                <Typography variant="body2">Real-time updates on schedules and attendance for transparency.</Typography>
              </CardContent>
            </Card>
            <Card sx={{ bgcolor: '#e8f5e9', boxShadow: 0 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Instant Alerts:</Typography>
                <Typography variant="body2">Send group announcements to all students and drivers instantly.</Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'white', py: 8 }} id="features">
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center', color: '#1a237e' }}>
            Core Features at a Glance
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', mb: 6 }}>
            Streamlining transport for both students and administrators.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Student Dashboard */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ p: 3, height: '100%', border: '1px solid #e0e0e0', borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Dashboard sx={{ fontSize: 40, color: '#4fc3f7', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Student Dashboard</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#4fc3f7', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Register & Select" secondary="Instant access to timing and preferred pickup points." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#4fc3f7', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Online Fee Payment" secondary="Secure payments via Razorpay/Stripe with digital receipts." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#4fc3f7', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Real-Time Notifications" secondary="Alerts about delays, route changes." />
                  </ListItem>
                </List>
              </Card>
            </Box>

            {/* Admin Dashboard */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ p: 3, height: '100%', bgcolor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '16px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Engineering sx={{ fontSize: 40, color: '#2e7d32', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Admin Dashboard</Typography>
                </Box>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Route & Schedule Management" secondary="Add, modify, and assign routes effectively." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Student Tracking" secondary="Monitor driver-wise student count and route assignments." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Attendance & Fee" secondary="Daily/weekly attendance tracking and fee collection reports." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircle sx={{ color: '#2e7d32', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primary="Announcements" secondary="Broadcast timely alerts." />
                  </ListItem>
                </List>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1a1a1a', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>CTMS</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                College Transport Management System
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" sx={{ opacity: 0.7, mb: 0.5 }}>
                © {new Date().getFullYear()} CTMS. All rights reserved.
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Version 1.0.0
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'row', md: 'column' } }}>
              <Typography variant="body2" sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Privacy Policy
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}>
                Terms of Service
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default LandingPage;