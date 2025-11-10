import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  ArrowBack,
} from '@mui/icons-material';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store student data in localStorage
        localStorage.setItem('student', JSON.stringify(data.student));
        // Navigate to student dashboard
        navigate('/student-dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #FCE4EC 100%)',
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
            onClick={handleBackToHome}
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              color: '#64B5F6',
              '&:hover': {
                bgcolor: 'rgba(100, 181, 246, 0.1)',
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
                color: '#64B5F6',
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
                bgcolor: '#64B5F6',
                borderRadius: '2px',
                margin: '0 auto',
              }}
            />
          </Box>

          {/* Heading */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              background: 'linear-gradient(135deg, #64B5F6 0%, #7986CB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Student Login
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: '#666',
              mb: 4,
            }}
          >
            Welcome back! Please login to your account
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {/* Email/RegNo Field */}
            <TextField
              fullWidth
              label="Registration No / Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f8f9fa',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#64B5F6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#64B5F6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#64B5F6',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline sx={{ color: '#64B5F6' }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  bgcolor: '#f8f9fa',
                  '& fieldset': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#64B5F6',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#64B5F6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#64B5F6',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined sx={{ color: '#64B5F6' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      edge="end"
                      sx={{ color: '#64B5F6' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#64B5F6',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
                mb: 2,
                '&:hover': {
                  bgcolor: '#42A5F5',
                  boxShadow: '0 6px 16px rgba(100, 181, 246, 0.4)',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            {/* Driver Login Button */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/driver-login')}
              sx={{
                borderColor: '#4caf50',
                color: '#4caf50',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                mb: 2,
                '&:hover': {
                  borderColor: '#43a047',
                  bgcolor: 'rgba(76, 175, 80, 0.04)',
                },
              }}
            >
              Driver Login
            </Button>

            {/* Admin Login Button */}
            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/admin-login')}
              sx={{
                borderColor: '#ba68c8',
                color: '#ba68c8',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#ab47bc',
                  bgcolor: 'rgba(186, 104, 200, 0.04)',
                },
              }}
            >
              Admin Login
            </Button>
          </Box>

          {/* Sign Up Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              New user?{' '}
              <Typography
                component="span"
                onClick={() => navigate('/signup')}
                sx={{
                  color: '#64B5F6',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#42A5F5',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;