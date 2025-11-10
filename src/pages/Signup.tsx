import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Link,
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    regNo: '',
    fullName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    studyingYear: '',
    preferredRoute: '',
  });

  const routes = [
    'Tenali - MG Road - College',
    'Tenali - Bus Stand - College',
    'Guntur - Arundalpet - College',
    'Guntur - Brodipet - College',
    'Guntur - Pattabhipuram - College',
    'Vijayawada - Benz Circle - College',
    'Vijayawada - Governorpet - College',
    'Vijayawada - Auto Nagar - College',
    'Vijayawada - Patamata - College',
    'Tenali - Guntur - Mangalagiri - College',
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!formData.studyingYear) {
      setError('Please select your studying year');
      return;
    }

    if (!formData.preferredRoute) {
      setError('Please select your preferred route');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regNo: formData.regNo,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          studyingYear: formData.studyingYear,
          preferredRoute: formData.preferredRoute,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Registration submitted successfully! Please wait for admin approval.');
        // Clear form
        setFormData({
          regNo: '',
          fullName: '',
          phoneNumber: '',
          email: '',
          password: '',
          confirmPassword: '',
          studyingYear: '',
          preferredRoute: '',
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
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
            onClick={handleBackToLogin}
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
            variant="h4"
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              mb: 1,
              color: '#64B5F6',
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Student Registration
          </Typography>

          {/* Error and Success Messages */}
          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, borderRadius: '12px' }}>
              {success}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {/* Registration Number */}
            <TextField
              fullWidth
              label="Registration Number"
              name="regNo"
              placeholder="Enter your registration number"
              value={formData.regNo}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
            />

            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
            />

            {/* Phone Number */}
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              placeholder="Enter 10-digit phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
            />

            {/* Email Address */}
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
            />

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: '#64B5F6' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: '#64B5F6' }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Studying Year */}
            <TextField
              fullWidth
              select
              label="Studying Year"
              name="studyingYear"
              value={formData.studyingYear}
              onChange={handleChange}
              variant="outlined"
              sx={{
                mb: 2.5,
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
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#64B5F6',
                },
              }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#999' }}>Select your year</span>;
                  }
                  return String(selected);
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </TextField>

            {/* Preferred Route */}
            <TextField
              fullWidth
              select
              label="Preferred Route"
              name="preferredRoute"
              value={formData.preferredRoute}
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
                '& .MuiInputLabel-root': {
                  color: '#666',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#64B5F6',
                },
              }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (selected) => {
                  if (!selected || selected === '') {
                    return <span style={{ color: '#999' }}>Select your route</span>;
                  }
                  return String(selected);
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              {routes.map((route) => (
                <MenuItem key={route} value={route}>
                  {route}
                </MenuItem>
              ))}
            </TextField>

            {/* Register Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                bgcolor: '#17a2b8',
                color: '#fff',
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 12px rgba(23, 162, 184, 0.3)',
                '&:hover': {
                  bgcolor: '#138496',
                  boxShadow: '0 6px 16px rgba(23, 162, 184, 0.4)',
                },
                '&:disabled': {
                  bgcolor: '#ccc',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Register Account'}
            </Button>
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Already registered?{' '}
              <Link
                onClick={handleLoginClick}
                underline="none"
                sx={{
                  color: '#17a2b8',
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#138496',
                  },
                }}
              >
                Log in
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;