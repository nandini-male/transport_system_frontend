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

function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Default admin credentials
  const defaultAdminEmail = 'admin123@gmail.com';
  const defaultAdminPassword = 'admin123';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on input change
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate admin credentials
    if (formData.adminId === defaultAdminEmail && formData.password === defaultAdminPassword) {
      console.log('Admin Login Successful');
      navigate('/admin-dashboard');
    } else {
      setError('Invalid admin credentials. Please try again.');
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #d4e1f4 0%, #e8eef7 50%, #d9e4f2 100%)',
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
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          {/* Back Button */}
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: '#6b8caf',
              '&:hover': {
                bgcolor: 'rgba(107, 140, 175, 0.1)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          {/* Logo/Brand */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#6b8caf',
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
                bgcolor: '#6b8caf',
                borderRadius: '2px',
                margin: '0 auto',
              }}
            />
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: '#6b8caf',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Admin Login
          </Typography>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#7a92b3',
              mb: 4,
              fontSize: '0.95rem',
            }}
          >
            Access the administrative dashboard
          </Typography>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Admin ID / Email */}
            <TextField
              fullWidth
              label="Admin ID / Email"
              name="adminId"
              placeholder="Enter your admin ID or email"
              value={formData.adminId}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f5f8fb',
                  '& fieldset': {
                    borderColor: '#d0dae8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b8caf',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6b8caf',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#7a92b3',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6b8caf',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: '#6b8caf' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f5f8fb',
                  '& fieldset': {
                    borderColor: '#d0dae8',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b8caf',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6b8caf',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#7a92b3',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#6b8caf',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#6b8caf' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#6b8caf' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Error Message */}
            {error && (
              <Typography
                sx={{
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  mb: 2,
                  mt: 1,
                }}
              >
                {error}
              </Typography>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#6b8caf',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(107, 140, 175, 0.3)',
                '&:hover': {
                  bgcolor: '#5a7a9a',
                  boxShadow: '0 6px 16px rgba(107, 140, 175, 0.4)',
                },
              }}
            >
              Login as Admin
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminLogin;
