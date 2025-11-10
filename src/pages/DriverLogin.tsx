import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  PersonOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function DriverLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    driverId: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Default driver credentials for each route (matching route configuration)
  const driverAccounts = [
    { 
      id: 'ramesh.kumar@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Ramesh Kumar', 
      email: 'ramesh.kumar@ctms.com',
      phone: '+91 98765 43210',
      route: 'Tenali - MG Road - College',
      busNumber: 'AP 16 TC 1234',
      totalStudents: 0,
      stopPoints: 4
    },
    { 
      id: 'suresh.babu@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Suresh Babu', 
      email: 'suresh.babu@ctms.com',
      phone: '+91 98765 43211',
      route: 'Tenali - Bus Stand - College',
      busNumber: 'AP 16 TC 1235',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'venkatesh.reddy@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Venkatesh Reddy', 
      email: 'venkatesh.reddy@ctms.com',
      phone: '+91 98765 43212',
      route: 'Guntur - Arundalpet - College',
      busNumber: 'AP 16 GN 2345',
      totalStudents: 0,
      stopPoints: 4
    },
    { 
      id: 'prakash.rao@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Prakash Rao', 
      email: 'prakash.rao@ctms.com',
      phone: '+91 98765 43213',
      route: 'Guntur - Brodipet - College',
      busNumber: 'AP 16 GN 2346',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'krishna.murthy@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Krishna Murthy', 
      email: 'krishna.murthy@ctms.com',
      phone: '+91 98765 43214',
      route: 'Guntur - Pattabhipuram - College',
      busNumber: 'AP 16 GN 2347',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'satish.patnaik@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Satish Patnaik', 
      email: 'satish.patnaik@ctms.com',
      phone: '+91 98765 43215',
      route: 'Vijayawada - Benz Circle - College',
      busNumber: 'AP 16 VW 3456',
      totalStudents: 0,
      stopPoints: 4
    },
    { 
      id: 'ravi.kumar@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Ravi Kumar', 
      email: 'ravi.kumar@ctms.com',
      phone: '+91 98765 43216',
      route: 'Vijayawada - Governorpet - College',
      busNumber: 'AP 16 VW 3457',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'nagendra.prasad@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Nagendra Prasad', 
      email: 'nagendra.prasad@ctms.com',
      phone: '+91 98765 43217',
      route: 'Vijayawada - Auto Nagar - College',
      busNumber: 'AP 16 VW 3458',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'srinivas.reddy@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Srinivas Reddy', 
      email: 'srinivas.reddy@ctms.com',
      phone: '+91 98765 43218',
      route: 'Vijayawada - Patamata - College',
      busNumber: 'AP 16 VW 3459',
      totalStudents: 0,
      stopPoints: 3
    },
    { 
      id: 'mahesh.babu@ctms.com', 
      password: 'driver123', 
      name: 'Mr. Mahesh Babu', 
      email: 'mahesh.babu@ctms.com',
      phone: '+91 98765 43219',
      route: 'Tenali - Guntur - Mangalagiri - College',
      busNumber: 'AP 16 MG 4567',
      totalStudents: 0,
      stopPoints: 4
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Login attempt with:', formData.driverId);
    
    // Trim and lowercase for case-insensitive comparison
    const inputId = formData.driverId.trim().toLowerCase();
    const inputPassword = formData.password.trim();

    // Check credentials against driver accounts
    const driver = driverAccounts.find(
      acc => acc.id.toLowerCase() === inputId && acc.password === inputPassword
    );

    if (driver) {
      console.log('Driver Login Successful:', driver.name);
      // Store driver info in localStorage for dashboard use
      localStorage.setItem('driver', JSON.stringify(driver));
      navigate('/driver-dashboard');
    } else {
      console.log('Login failed. Available drivers:', driverAccounts.map(d => d.id));
      setError('Invalid driver credentials. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f7f4 0%, #eef7f0 50%, #f2fbf6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: '24px',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)',
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: '#2e7d32',
              '&:hover': {
                bgcolor: 'rgba(46, 125, 50, 0.06)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#2e7d32',
                fontWeight: 700,
                mb: 1,
                fontSize: '1.2rem',
              }}
            >
              CTMS
            </Typography>
            <Box
              sx={{
                width: '60px',
                height: '4px',
                bgcolor: '#2e7d32',
                borderRadius: '2px',
                margin: '0 auto',
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: '#2e7d32',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Driver Login
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#4b6f4b',
              mb: 4,
              fontSize: '0.95rem',
            }}
          >
            Access driver tools and attendance
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Driver ID / Email"
              name="driverId"
              placeholder="Enter your driver ID or email"
              value={formData.driverId}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: '#2e7d32' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#2e7d32' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#2e7d32' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography sx={{ color: '#d32f2f', fontSize: '0.875rem', textAlign: 'center', mb: 2, mt: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#2e7d32',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)',
                '&:hover': {
                  bgcolor: '#25662a',
                },
              }}
            >
              Login as Driver
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default DriverLogin;
