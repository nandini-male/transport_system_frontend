import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  MenuItem,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsBus as BusIcon,
  People as PeopleIcon,
  Navigation as NavigationIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Map as MapIcon,
  TimerOutlined as TimerIcon,
  AccessTime as AccessTimeIcon,
  Route as RouteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { routeCoordinates } from '../config/routeCoordinates';

// Small local date formatter (fallback for missing util)
const formatDateTime = (iso?: string) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

// Mock driver data - will be replaced with real data from backend
const mockStudents = [
  { id: 1, name: 'Rajesh Kumar', regNo: '21B01A0101', pickupPoint: 'Tenali Bus Stand', status: 'Boarded', phoneNumber: '+91 98765 43210' },
  { id: 2, name: 'Priya Sharma', regNo: '21B01A0202', pickupPoint: 'MG Road Junction', status: 'Waiting', phoneNumber: '+91 98765 43211' },
  { id: 3, name: 'Anil Reddy', regNo: '21B01A0303', pickupPoint: 'Kothapet', status: 'Absent', phoneNumber: '+91 98765 43212' },
  { id: 4, name: 'Sneha Patel', regNo: '21B01A0404', pickupPoint: 'Tenali Bus Stand', status: 'Boarded', phoneNumber: '+91 98765 43213' },
  { id: 5, name: 'Kiran Varma', regNo: '21B01A0505', pickupPoint: 'MG Road Junction', status: 'Boarded', phoneNumber: '+91 98765 43214' },
];

// Dashboard Overview Component
const DashboardOverview: React.FC<{ 
  driver: any; 
  tripStatus: any; 
  setActiveTab: (tab: string) => void;
  onStartTrip: () => void;
}> = ({ driver, tripStatus, setActiveTab, onStartTrip }) => {
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueMessage, setIssueMessage] = useState('');
  const [issueCategory, setIssueCategory] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const stats = [
    { label: 'Total Students', value: driver.totalStudents, icon: PeopleIcon, color: '#4f46e5' },
    { label: 'Present Today', value: tripStatus.presentCount, icon: CheckCircleIcon, color: '#10b981' },
    { label: 'Absent Today', value: tripStatus.absentCount, icon: CancelIcon, color: '#ef4444' },
    { label: 'Trip Status', value: tripStatus.status, icon: BusIcon, color: '#f59e0b' },
  ];

  const handleReportIssue = async () => {
    if (!issueMessage.trim()) {
      setSnackbarMessage('Please enter an issue description');
      setSnackbarOpen(true);
      return;
    }

    try {
      console.log('Submitting issue with data:', {
        driverName: driver.name,
        driverEmail: driver.email,
        busNumber: driver.busNumber,
        route: driver.assignedRoute,
        category: issueCategory,
        message: issueMessage,
      });

      const response = await fetch('http://localhost:5000/api/driver/report-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverName: driver.name,
          driverEmail: driver.email,
          busNumber: driver.busNumber,
          route: driver.assignedRoute,
          category: issueCategory,
          message: issueMessage,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      console.log('Response from server:', data);

      if (response.ok) {
        setSnackbarMessage('Issue reported successfully! Admin will be notified.');
        setSnackbarOpen(true);
        setIssueDialogOpen(false);
        setIssueMessage('');
        setIssueCategory('');
      } else {
        setSnackbarMessage(`Failed: ${data.message || 'Please try again.'}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error reporting issue:', error);
      setSnackbarMessage(`Error: ${error instanceof Error ? error.message : 'Network error. Is backend running?'}`);
      setSnackbarOpen(true);
    }
  };

  const handleSubmitToStudents = async () => {
    if (!issueMessage.trim()) {
      setSnackbarMessage('Please enter a message for students');
      setSnackbarOpen(true);
      return;
    }

    try {
      console.log('Sending notification to students on route:', driver.assignedRoute);

      const response = await fetch('http://localhost:5000/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: issueCategory || 'Driver Alert',
          message: `${issueMessage}\n\n— ${driver.name} (${driver.busNumber})`,
          targetAudience: 'route-specific',
          targetRoute: driver.assignedRoute,
          type: 'info',
          priority: 'high',
        }),
      });

      const data = await response.json();
      console.log('Notification response:', data);

      if (response.ok && data.success) {
        setSnackbarMessage(`Notification sent to all students on ${driver.assignedRoute}!`);
        setSnackbarOpen(true);
        setIssueDialogOpen(false);
        setIssueMessage('');
        setIssueCategory('');
      } else {
        setSnackbarMessage(`Failed: ${data.message || 'Please try again.'}`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error sending notification to students:', error);
      setSnackbarMessage(`Error: ${error instanceof Error ? error.message : 'Network error. Is backend running?'}`);
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Welcome, {driver.name}!
      </Typography>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <Paper
              key={index}
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                borderBottom: 4,
                borderColor: stat.color,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase">
                  {stat.label}
                </Typography>
                <StatIcon sx={{ fontSize: 36, color: stat.color, opacity: 0.7 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="text.primary">
                {stat.value}
              </Typography>
            </Paper>
          );
        })}
      </Box>

      {/* Route Information */}
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: '#f0f9ff', border: '2px solid #3b82f6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RouteIcon sx={{ fontSize: 32, color: '#3b82f6', mr: 2 }} />
            <Typography variant="h6" fontWeight="bold" color="#1e40af">
              Assigned Route
            </Typography>
          </Box>
          <Chip 
            label={`📅 ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`} 
            color="primary" 
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 2 }}>
          {driver.assignedRoute}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip icon={<BusIcon />} label={`Bus: ${driver.busNumber}`} color="primary" />
          <Chip icon={<ScheduleIcon />} label={`Departure: ${driver.departureTime}`} color="secondary" />
          <Chip icon={<LocationIcon />} label={`${driver.stopPoints} Stops`} color="info" />
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        gap: 2,
        mt: 3 
      }}>
        <Button
          variant="contained"
          color="success"
          size="large"
          startIcon={<NavigationIcon />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          onClick={() => {
            onStartTrip();
            setActiveTab('tracking');
          }}
        >
          Start Trip
        </Button>
        <Button
          variant="contained"
          color="warning"
          size="large"
          startIcon={<WarningIcon />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          onClick={() => setIssueDialogOpen(true)}
        >
          Report Issue
        </Button>
        <Button
          variant="contained"
          color="info"
          size="large"
          startIcon={<MapIcon />}
          sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
          onClick={() => setActiveTab('tracking')}
        >
          View Route Map
        </Button>
      </Box>

      {/* Issue Reporting Dialog */}
      <Dialog 
        open={issueDialogOpen} 
        onClose={() => setIssueDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Report an Issue
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Report any issues or concerns to the admin team. They will be notified immediately.
            </Typography>
            
            <TextField
              select
              fullWidth
              label="Issue Category"
              value={issueCategory}
              onChange={(e) => setIssueCategory(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Select Category</MenuItem>
              <MenuItem value="Bus Maintenance">Bus Maintenance</MenuItem>
              <MenuItem value="Route Issue">Route Issue</MenuItem>
              <MenuItem value="Student Behavior">Student Behavior</MenuItem>
              <MenuItem value="Traffic/Delay">Traffic/Delay</MenuItem>
              <MenuItem value="Safety Concern">Safety Concern</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Issue Description"
              placeholder="Please describe the issue in detail..."
              value={issueMessage}
              onChange={(e) => setIssueMessage(e.target.value)}
              variant="outlined"
            />

            <Box sx={{ mt: 2, p: 2, bgcolor: '#f3f4f6', borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Driver:</strong> {driver.name}<br />
                <strong>Bus:</strong> {driver.busNumber}<br />
                <strong>Route:</strong> {driver.assignedRoute}
              </Typography>
            </Box>

            <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, border: '1px solid #2196f3' }}>
              <Typography variant="caption" color="primary" fontWeight="bold">
                💡 Tip: Use "Submit to Students" to notify all students on your route about delays, changes, or important updates.
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button 
            onClick={() => {
              setIssueDialogOpen(false);
              setIssueMessage('');
              setIssueCategory('');
            }}
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitToStudents}
            variant="contained" 
            color="info"
            startIcon={<PeopleIcon />}
          >
            Submit to Students
          </Button>
          <Button 
            onClick={handleReportIssue}
            variant="contained" 
            color="warning"
            startIcon={<WarningIcon />}
          >
            Submit to Admin
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

// Student List Component
const StudentList: React.FC<{ students: any[]; onMarkAttendance: (studentId: number, status: string) => void }> = ({ 
  students, 
  onMarkAttendance 
}) => {
  const [filter, setFilter] = useState('All');

  const filteredStudents = filter === 'All' 
    ? students 
    : students.filter(s => s.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Boarded': return 'success';
      case 'Waiting': return 'warning';
      case 'Absent': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Student Management
        </Typography>
        <Chip 
          label={`Attendance for: ${new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`} 
          color="primary" 
          icon={<ScheduleIcon />}
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        {['All', 'Boarded', 'Waiting', 'Absent'].map((status) => (
          <Chip
            key={status}
            label={`${status} (${status === 'All' ? students.length : students.filter(s => s.status === status).length})`}
            onClick={() => setFilter(status)}
            color={filter === status ? 'primary' : 'default'}
            variant={filter === status ? 'filled' : 'outlined'}
            sx={{ fontWeight: 'bold' }}
          />
        ))}
      </Box>

      {/* Boarding Summary for Boarded Students */}
      {filter === 'Boarded' && filteredStudents.length > 0 && (
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 3, 
            borderRadius: 3, 
            bgcolor: '#f0fdf4',
            border: '2px solid #10b981'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CheckCircleIcon sx={{ color: '#10b981', fontSize: 28 }} />
            <Typography variant="h6" fontWeight="bold" color="success.dark">
              Boarded Students Summary
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">Total Boarded</Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {filteredStudents.length}
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">Boarding Points</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {new Set(filteredStudents.map(s => s.pickupPoint)).size}
              </Typography>
            </Box>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">Attendance Rate</Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {Math.round((filteredStudents.length / students.length) * 100)}%
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* Student List */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List sx={{ p: 0 }}>
          {filteredStudents.map((student, index) => (
            <React.Fragment key={student.id}>
              <ListItem
                sx={{
                  py: 2,
                  px: 3,
                  '&:hover': { bgcolor: '#f3f4f6' },
                  transition: '0.2s',
                  bgcolor: student.status === 'Boarded' ? '#f0fdf4' : 'transparent',
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: student.status === 'Boarded' ? '#10b981' : '#4f46e5', 
                    width: 50, 
                    height: 50 
                  }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {student.name}
                      </Typography>
                      {student.status === 'Boarded' && (
                        <Chip 
                          label="✓ On Board" 
                          size="small" 
                          color="success" 
                          sx={{ fontWeight: 'bold' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {student.regNo}
                      </Typography>
                      
                      {/* Boarding Point Details */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 16, color: student.status === 'Boarded' ? '#10b981' : 'text.secondary' }} />
                        <Typography 
                          variant="body2" 
                          color={student.status === 'Boarded' ? 'success.main' : 'text.secondary'}
                          sx={{ fontWeight: student.status === 'Boarded' ? 600 : 400 }}
                        >
                          {student.pickupPoint}
                        </Typography>
                      </Box>

                      {/* Boarding Time (if available) */}
                      {student.pickupPointTiming && student.pickupPointTiming !== 'N/A' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Scheduled: {student.pickupPointTiming}
                          </Typography>
                        </Box>
                      )}

                      {/* Phone Number */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {student.phoneNumber}
                        </Typography>
                      </Box>

                      {/* Boarding Confirmation for Boarded Students */}
                      {student.status === 'Boarded' && (
                        <Box sx={{ 
                          mt: 1, 
                          p: 1, 
                          bgcolor: '#d1fae5', 
                          borderRadius: 1,
                          border: '1px solid #10b981'
                        }}>
                          <Typography variant="caption" color="success.dark" sx={{ fontWeight: 600 }}>
                            ✓ Boarded at {student.pickupPoint} • Attendance Marked
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Chip
                    label={student.status}
                    color={getStatusColor(student.status)}
                    size="small"
                    sx={{ fontWeight: 'bold', minWidth: 80 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => onMarkAttendance(student.id, 'Boarded')}
                      disabled={student.status === 'Boarded'}
                      title="Mark as Boarded"
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onMarkAttendance(student.id, 'Absent')}
                      disabled={student.status === 'Absent'}
                      title="Mark as Absent"
                    >
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </Box>
              </ListItem>
              {index < filteredStudents.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {filteredStudents.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No students found for the selected filter.
        </Alert>
      )}
    </Box>
  );
};

// Trip Tracking Component
const TripTracking: React.FC<{ 
  driver: any; 
  onTripStatusChange: (status: string) => void;
  isTripActive: boolean;
  onTripActiveChange: (active: boolean) => void;
}> = ({ driver, onTripStatusChange, isTripActive, onTripActiveChange }) => {
  const [tripStarted, setTripStarted] = useState(isTripActive);
  const [currentLocation, setCurrentLocation] = useState('Waiting to start...');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [directionsError, setDirectionsError] = useState<string | null>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const markersRef = React.useRef<any[]>([]);
  const routePolylineRef = React.useRef<any>(null);
  const busMarkerRef = React.useRef<any>(null);

  // Sync local tripStarted state with global isTripActive prop
  React.useEffect(() => {
    setTripStarted(isTripActive);
  }, [isTripActive]);

  // Load Google Maps script
  React.useEffect(() => {
    // Listen for Google Maps errors
    (window as any).gm_authFailure = () => {
      setMapError('Google Maps API key is invalid or restricted. Please check your API key configuration.');
      setMapLoaded(false);
    };

    loadGoogleMapsScript()
      .then(() => {
        console.log('Google Maps loaded successfully');
        setMapLoaded(true);
        setMapError(null);
      })
      .catch((error) => {
        console.error('Error loading Google Maps:', error);
        setMapError(error.message || 'Failed to load Google Maps. Please check your internet connection.');
      });
  }, []);

  // Initialize map
  React.useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !mapLoaded) {
      return;
    }

    try {
      // Double-check that google.maps is actually available
      if (typeof window === 'undefined' || 
          typeof (window as any).google === 'undefined' || 
          typeof (window as any).google.maps === 'undefined') {
        console.error('Google Maps not loaded yet');
        setMapError('Google Maps is still loading. Please wait...');
        return;
      }

      const coords = routeCoordinates[driver.assignedRoute] || routeCoordinates['Tenali - MG Road - College'];
      
      if (!coords || coords.length === 0) {
        console.error('No route coordinates available');
        setMapError('Route coordinates not found');
        return;
      }
      
      // Create map centered on first stop
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 11,
        center: coords[0],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
      });
      
      mapInstanceRef.current = map;

      // Add markers for each stop
      coords.forEach((coord, index) => {
        const marker = new (window as any).google.maps.Marker({
          position: { lat: coord.lat, lng: coord.lng },
          map: map,
          title: coord.name,
          label: (index + 1).toString(),
          icon: {
            path: (window as any).google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: index === 0 ? '#10b981' : (index === coords.length - 1 ? '#ef4444' : '#3b82f6'),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        const infoWindow = new (window as any).google.maps.InfoWindow({
          content: `<div style="padding: 8px;"><strong>${coord.name}</strong><br/>Stop ${index + 1}</div>`,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        markersRef.current.push(marker);
      });

      // Use Directions Service for accurate route display
      const directionsService = new (window as any).google.maps.DirectionsService();
      const directionsRenderer = new (window as any).google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true, // We already have custom markers
        polylineOptions: {
          strokeColor: '#667eea',
          strokeOpacity: 0.8,
          strokeWeight: 5,
        },
      });

      // Create waypoints (all stops except first and last)
      const waypoints = coords.slice(1, -1).map(coord => ({
        location: { lat: coord.lat, lng: coord.lng },
        stopover: true,
      }));

      console.log('═══════════════════════════════════════');
      console.log('📍 ATTEMPTING DIRECTIONS API REQUEST');
      console.log('═══════════════════════════════════════');
      console.log('Origin:', coords[0]);
      console.log('Destination:', coords[coords.length - 1]);
      console.log('Waypoints:', waypoints.length);
      console.log('API Key configured:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'Yes' : 'No');

      // Request route from Directions API
      directionsService.route(
        {
          origin: { lat: coords[0].lat, lng: coords[0].lng },
          destination: { lat: coords[coords.length - 1].lat, lng: coords[coords.length - 1].lng },
          waypoints: waypoints,
          travelMode: (window as any).google.maps.TravelMode.DRIVING,
          optimizeWaypoints: false,
        },
        (result: any, status: any) => {
          console.log('═══════════════════════════════════════');
          console.log('📍 GOOGLE MAPS DIRECTIONS API RESPONSE');
          console.log('═══════════════════════════════════════');
          console.log('Status:', status);
          console.log('Result:', result);
          
          if (status === (window as any).google.maps.DirectionsStatus.OK) {
            console.log('✅ SUCCESS: Directions route loaded successfully!');
            console.log('Route will display on actual roads');
            directionsRenderer.setDirections(result);
            routePolylineRef.current = directionsRenderer;
            setDirectionsError(null);
          } else {
            console.error('❌ FAILED: Directions request failed!');
            console.error('Status Code:', status);
            
            let errorMessage = '';
            let detailedHelp = '';
            
            switch (status) {
              case 'REQUEST_DENIED':
                errorMessage = 'REQUEST DENIED - Directions API not enabled or API key restricted!';
                detailedHelp = `
🔴 CRITICAL: The Directions API is not enabled for your API key.

📋 SOLUTION - Follow these steps:

1. Open Google Cloud Console:
   👉 https://console.cloud.google.com/google/maps-apis/api-list

2. Click the "+ ENABLE APIS AND SERVICES" button

3. Search for "Directions API"

4. Click on "Directions API" in the results

5. Click the blue "ENABLE" button

6. Wait 1-2 minutes for changes to propagate

7. Refresh this page (Ctrl + Shift + R)

💡 ALTERNATIVE: If you don't want to enable billing, the map will show
   simplified routes with straight lines between stops (current fallback).

Your API Key: ${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                `;
                break;
              case 'NOT_FOUND':
                errorMessage = 'Route not found between these locations';
                break;
              case 'ZERO_RESULTS':
                errorMessage = 'No route could be found between the origin and destination';
                break;
              case 'MAX_WAYPOINTS_EXCEEDED':
                errorMessage = 'Too many waypoints (max 25 for Directions API)';
                break;
              case 'INVALID_REQUEST':
                errorMessage = 'Invalid request - check origin/destination/waypoints';
                break;
              case 'OVER_QUERY_LIMIT':
                errorMessage = 'API quota exceeded - too many requests';
                break;
              case 'UNKNOWN_ERROR':
                errorMessage = 'Server error - try again';
                break;
              default:
                errorMessage = `Unknown error: ${status}`;
            }
            
            console.error('Error Message:', errorMessage);
            if (detailedHelp) {
              console.error(detailedHelp);
            }
            console.error('═══════════════════════════════════════');
            setDirectionsError(errorMessage);
            
            // Fallback to geodesic polyline (curved lines following earth's surface)
            console.log('⚠️ FALLBACK MODE: Using geodesic polyline');
            console.log('This shows approximate routes but not actual roads');
            const routePath = new (window as any).google.maps.Polyline({
              path: coords.map(c => ({ lat: c.lat, lng: c.lng })),
              geodesic: true, // This makes lines curve with earth's surface
              strokeColor: '#f59e0b',
              strokeOpacity: 0.7,
              strokeWeight: 4,
              icons: [{
                icon: {
                  path: (window as any).google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 3,
                  strokeColor: '#f59e0b',
                },
                offset: '100%',
                repeat: '100px'
              }]
            });
            routePath.setMap(map);
            routePolylineRef.current = routePath;
          }
        }
      );

      // Fit bounds to show all markers
      const bounds = new (window as any).google.maps.LatLngBounds();
      coords.forEach(coord => bounds.extend({ lat: coord.lat, lng: coord.lng }));
      map.fitBounds(bounds);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please refresh the page.');
    }
  }, [driver.assignedRoute, mapLoaded]);

  // Simulate live tracking when trip starts
  React.useEffect(() => {
    if (!tripStarted || !mapInstanceRef.current || !mapLoaded) {
      // Reset when trip is stopped and notify backend
      if (!tripStarted && driver) {
        setCurrentStopIndex(0);
        setCurrentLocation('Waiting to start...');
        if (busMarkerRef.current) {
          busMarkerRef.current.setMap(null);
          busMarkerRef.current = null;
        }
        
        // Notify backend that trip has ended
        fetch('http://localhost:5000/api/driver/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driverEmail: driver.email,
            route: driver.assignedRoute,
            latitude: 0,
            longitude: 0,
            tripActive: false,
          }),
        }).catch(err => console.error('Failed to update trip status:', err));
      }
      return;
    }

    try {
      // Double-check that google.maps is available
      if (typeof window === 'undefined' || 
          typeof (window as any).google === 'undefined' || 
          typeof (window as any).google.maps === 'undefined') {
        console.error('Google Maps not loaded for trip tracking');
        return;
      }

      const coords = routeCoordinates[driver.assignedRoute] || routeCoordinates['Tenali - MG Road - College'];
      
      if (!coords || coords.length === 0) {
        console.error('No route coordinates for trip tracking');
        return;
      }
      
      // Add a moving bus marker
      const busMarker = new (window as any).google.maps.Marker({
        position: coords[0],
        map: mapInstanceRef.current,
        title: 'Bus Location',
        icon: {
          path: (window as any).google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: '#f59e0b',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      busMarkerRef.current = busMarker;

      // Simulate movement (in production, this would be real GPS data)
      let stopIndex = 0;
      setCurrentStopIndex(0);
      setCurrentLocation(coords[0].name);

      // Send initial location to backend
      const sendLocationUpdate = (lat: number, lng: number) => {
        console.log('📤 Driver - Sending location update:', {
          route: driver.assignedRoute,
          latitude: lat,
          longitude: lng,
          tripActive: true
        });
        
        fetch('http://localhost:5000/api/driver/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driverEmail: driver.email,
            route: driver.assignedRoute,
            latitude: lat,
            longitude: lng,
            tripActive: true,
            timestamp: new Date().toISOString(),
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('✅ Driver - Location updated successfully');
          } else {
            console.error('❌ Driver - Location update failed:', data.message);
          }
        })
        .catch(err => console.error('❌ Driver - Failed to update location:', err));
      };

      // Send initial location
      sendLocationUpdate(coords[0].lat, coords[0].lng);

      const moveInterval = setInterval(() => {
        if (stopIndex < coords.length - 1) {
          stopIndex++;
          setCurrentStopIndex(stopIndex);
          const newPos = coords[stopIndex];
          busMarker.setPosition(newPos);
          setCurrentLocation(newPos.name);
          mapInstanceRef.current.panTo(newPos);
          
          // Send location update to backend
          sendLocationUpdate(newPos.lat, newPos.lng);
        } else {
          clearInterval(moveInterval);
          setCurrentLocation("Arrived at Vignan's Foundation for Science, Technology & Research, Vadlamudi");
        }
      }, 5000); // Move to next stop every 5 seconds

      return () => {
        clearInterval(moveInterval);
        if (busMarkerRef.current) {
          busMarkerRef.current.setMap(null);
          busMarkerRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error starting trip tracking:', error);
    }
  }, [tripStarted, driver.assignedRoute, driver, mapLoaded]);

  const handleStartTrip = () => {
    setTripStarted(true);
    onTripActiveChange(true);
    onTripStatusChange('In Progress');
    const coords = routeCoordinates[driver.assignedRoute] || routeCoordinates['Tenali - MG Road - College'];
    setCurrentLocation(`Near ${coords[0].name}`);
  };

  const stopPoints = routeCoordinates[driver.assignedRoute] || routeCoordinates['Tenali - MG Road - College'];

  const getStopStatus = (index: number) => {
    if (!tripStarted) return 'pending';
    if (index < currentStopIndex) return 'completed';
    if (index === currentStopIndex) return 'current';
    return 'pending';
  };

  const getStopTime = (index: number) => {
    // Calculate estimated time based on route (15 minutes between stops)
    const baseTime = new Date();
    baseTime.setHours(7, 0, 0); // Start at 7:00 AM
    baseTime.setMinutes(baseTime.getMinutes() + (index * 15));
    return baseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        Trip Tracking
      </Typography>

      {/* Trip Control */}
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, mb: 3, bgcolor: tripStarted ? '#dcfce7' : '#fef3c7' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {tripStarted ? 'Trip in Progress' : 'Trip Not Started'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current Location: {currentLocation}
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={tripStarted}
                onChange={() => {
                  if (tripStarted) {
                    setTripStarted(false);
                    onTripActiveChange(false);
                    onTripStatusChange('Completed');
                  } else {
                    handleStartTrip();
                  }
                }}
                color="success"
                size="medium"
              />
            }
            label={tripStarted ? 'End Trip' : 'Start Trip'}
            labelPlacement="start"
            sx={{ m: 0 }}
          />
        </Box>
      </Paper>

      {/* GPS Tracking Map */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Live GPS Tracking
        </Typography>
        
        {/* Directions API Error Alert */}
        {directionsError && (
          <Alert severity="warning" sx={{ mb: 2, border: '2px solid #f59e0b' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#92400e' }}>
              ⚠️ Map Display Mode: Simplified Routes
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Current Status:</strong> {directionsError}
            </Typography>
            
            <Box sx={{ bgcolor: '#fffbeb', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                The map is showing approximate routes (orange lines) instead of actual road routes.
              </Typography>
              <Typography variant="body2">
                This is because the Google <strong>Directions API</strong> needs to be enabled in your Google Cloud Console.
              </Typography>
            </Box>

            <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
              🔧 To enable road-based routing:
            </Typography>
            <Box component="ol" sx={{ pl: 3, mb: 2 }}>
              <li>
                Open <Button 
                  size="small" 
                  variant="outlined" 
                  href="https://console.cloud.google.com/google/maps-apis/api-list" 
                  target="_blank"
                  sx={{ ml: 1, textTransform: 'none' }}
                >
                  Google Cloud Console
                </Button>
              </li>
              <li>Click <strong>"+ ENABLE APIS AND SERVICES"</strong> at the top</li>
              <li>Search for <strong>"Directions API"</strong></li>
              <li>Click on it and press <strong>"ENABLE"</strong></li>
              <li>Wait 1-2 minutes, then refresh this page</li>
            </Box>

            <Box sx={{ bgcolor: '#fef3c7', p: 2, borderRadius: 1, border: '1px solid #fbbf24' }}>
              <Typography variant="caption" fontWeight="bold" gutterBottom display="block">
                💡 Note: This requires billing to be enabled on your Google Cloud account
              </Typography>
              <Typography variant="caption" display="block">
                Don't worry - Google provides $200/month free credit, which is more than enough for a college transport system.
                You won't be charged unless you exceed the free tier.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setDirectionsError(null)}
              >
                Dismiss Alert
              </Button>
            </Box>
          </Alert>
        )}
        
        {mapError ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              {mapError}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              To fix this issue:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li>Check that your API key is valid in the <code>.env</code> file</li>
              <li>Enable the following APIs in Google Cloud Console:
                <ul>
                  <li>Maps JavaScript API</li>
                  <li>Directions API</li>
                  <li>Geocoding API</li>
                </ul>
              </li>
              <li>Enable billing on your Google Cloud project</li>
              <li>Check API key restrictions (allow your domain/localhost)</li>
            </Box>
            <Button
              size="small"
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ mr: 1 }}
            >
              Reload Page
            </Button>
            <Button
              size="small"
              variant="outlined"
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
            >
              Open Google Cloud Console
            </Button>
          </Alert>
        ) : !mapLoaded ? (
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#e0f2f1',
              borderRadius: 2,
              border: '2px solid #14b8a6',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={50} sx={{ color: '#14b8a6', mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading Google Maps...
              </Typography>
              <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                This may take a few moments
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            ref={mapRef}
            sx={{
              height: 400,
              width: '100%',
              borderRadius: 2,
              border: '2px solid #14b8a6',
              bgcolor: '#e0f2f1',
            }}
          />
        )}
        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<LocationIcon />} 
            label={`Current: ${currentLocation}`} 
            color="primary" 
            sx={{ fontWeight: 'bold' }}
          />
          <Chip 
            icon={<RouteIcon />} 
            label={driver.assignedRoute} 
            variant="outlined"
          />
          {tripStarted && (
            <Chip 
              icon={<NavigationIcon />} 
              label="Trip Active" 
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      </Paper>

      {/* Stop Points Timeline */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Route Timeline
        </Typography>
        <Box sx={{ position: 'relative', pl: 4, mt: 3 }}>
          {stopPoints.map((stop, index) => {
            const status = getStopStatus(index);
            return (
              <Box key={index} sx={{ position: 'relative', pb: 4 }}>
                {/* Timeline Line */}
                {index < stopPoints.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -19,
                      top: 30,
                      width: 3,
                      height: 'calc(100% - 10px)',
                      bgcolor: status === 'completed' ? '#10b981' : '#e5e7eb'
                    }}
                  />
                )}
                {/* Timeline Dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -28,
                    top: 0,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: status === 'completed' ? '#10b981' : status === 'current' ? '#f59e0b' : '#9ca3af',
                    border: '3px solid white',
                    boxShadow: 2
                  }}
                />
                {/* Stop Info */}
                <Paper
                  elevation={status === 'current' ? 4 : 1}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: status === 'current' ? '2px solid #f59e0b' : 'none',
                    bgcolor: status === 'current' ? '#fef3c7' : 'white'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {stop.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {getStopTime(index)}
                        </Typography>
                      </Box>
                    </Box>
                    {status === 'completed' && (
                      <CheckCircleIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    )}
                    {status === 'current' && (
                      <Chip label="Current" color="warning" size="small" sx={{ fontWeight: 'bold' }} />
                    )}
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};

// Notifications Component
const DriverNotifications: React.FC<{ notifications: any[]; onRefresh: () => void }> = ({ notifications, onRefresh }) => {
  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Notifications & Alerts
        </Typography>
        <Button
          variant="outlined"
          startIcon={<NotificationsIcon />}
          onClick={onRefresh}
          sx={{
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#764ba2',
              bgcolor: 'rgba(102, 126, 234, 0.05)',
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      {notifications.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No notifications yet
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            You'll see important updates and alerts here
          </Typography>
        </Paper>
      ) : (
        <List sx={{ p: 0 }}>
          {notifications.map((notification, index) => (
            <Paper key={index} elevation={2} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
              <ListItem
                sx={{
                  p: 3,
                  bgcolor: notification.type === 'urgent' ? '#fef2f2' : 
                          notification.type === 'success' ? '#f0fdf4' : '#f9fafb'
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ 
                    bgcolor: notification.type === 'urgent' ? '#ef4444' : 
                            notification.type === 'success' ? '#10b981' : '#3b82f6' 
                  }}>
                    <NotificationsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" fontWeight="bold">
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

// Main Driver Dashboard Component
const DriverDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [driver, setDriver] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [studentsByPickupPoint, setStudentsByPickupPoint] = useState<any[]>([]);
  const [studentsWithoutPickup, setStudentsWithoutPickup] = useState<any[]>([]);
  const [tripStatus, setTripStatus] = useState({
    status: 'Not Started',
    presentCount: 0,
    absentCount: 0,
  });
  const [isTripActive, setIsTripActive] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Track viewed notifications in localStorage
  const getViewedNotifications = (): Set<string> => {
    const viewed = localStorage.getItem('viewedNotifications');
    return viewed ? new Set(JSON.parse(viewed)) : new Set();
  };

  const markNotificationsAsViewed = (notificationIds: string[]) => {
    const viewed = getViewedNotifications();
    notificationIds.forEach(id => viewed.add(id));
    localStorage.setItem('viewedNotifications', JSON.stringify(Array.from(viewed)));
  };

  const countUnreadNotifications = (allNotifications: any[]): number => {
    const viewed = getViewedNotifications();
    return allNotifications.filter(notif => !viewed.has(notif.id)).length;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get attendance data for today
  const getTodayAttendance = () => {
    const todayDate = getTodayDate();
    const attendanceKey = `attendance_${todayDate}`;
    const storedAttendance = localStorage.getItem(attendanceKey);
    return storedAttendance ? JSON.parse(storedAttendance) : {};
  };

  // Save attendance for a student
  const saveStudentAttendance = (regNo: string, status: string) => {
    const todayDate = getTodayDate();
    const attendanceKey = `attendance_${todayDate}`;
    const attendance = getTodayAttendance();
    attendance[regNo] = status;
    localStorage.setItem(attendanceKey, JSON.stringify(attendance));
  };

  // Clean up old attendance records (keep last 7 days)
  const cleanupOldAttendance = () => {
    const today = new Date();
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('attendance_')) {
        const dateStr = key.replace('attendance_', '');
        const recordDate = new Date(dateStr);
        const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Remove records older than 7 days
        if (daysDiff > 7) {
          localStorage.removeItem(key);
          console.log('🗑️ Cleaned up old attendance record:', dateStr);
        }
      }
    });
  };

  // Fetch students by route from backend
  const fetchStudents = async (route: string) => {
    try {
      console.log('📋 Fetching students for route:', route);
      
      const response = await fetch(
        `http://localhost:5000/api/driver/students?route=${encodeURIComponent(route)}`
      );
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Fetched students:', data.totalStudents);
        console.log('📍 Grouped by pickup points:', data.studentsByPickupPoint.length);
        console.log('⚠️ Without pickup:', data.studentsWithoutPickup.length);
        
        setStudentsByPickupPoint(data.studentsByPickupPoint);
        setStudentsWithoutPickup(data.studentsWithoutPickup);
        
        // Get today's attendance
        const todayAttendance = getTodayAttendance();
        console.log('📅 Today\'s attendance loaded:', Object.keys(todayAttendance).length, 'students');
        
        // Convert to flat list for StudentList component (add status field from today's attendance)
        const allStudents: any[] = [];
        let studentId = 1;
        
        data.studentsByPickupPoint.forEach((group: any) => {
          group.students.forEach((student: any) => {
            allStudents.push({
              id: studentId++,
              name: student.fullName,
              regNo: student.regNo,
              pickupPoint: group.pickupPoint,
              pickupPointTiming: group.timing,
              phoneNumber: student.phoneNumber,
              status: todayAttendance[student.regNo] || 'Waiting', // Load from today's attendance or default to Waiting
              feeStatus: student.feeStatus
            });
          });
        });
        
        data.studentsWithoutPickup.forEach((student: any) => {
          allStudents.push({
            id: studentId++,
            name: student.fullName,
            regNo: student.regNo,
            pickupPoint: 'Not Selected',
            pickupPointTiming: 'N/A',
            phoneNumber: student.phoneNumber,
            status: todayAttendance[student.regNo] || 'Waiting', // Load from today's attendance or default to Waiting
            feeStatus: student.feeStatus
          });
        });
        
        setStudents(allStudents);
        
        // Calculate trip status from today's attendance
        const presentCount = allStudents.filter(s => s.status === 'Boarded').length;
        const absentCount = allStudents.filter(s => s.status === 'Absent').length;
        
        setTripStatus({
          status: presentCount > 0 ? 'In Progress' : 'Not Started',
          presentCount,
          absentCount,
        });
        
        console.log('📊 Trip status - Present:', presentCount, 'Absent:', absentCount);
        
        // Update driver total students count
        setDriver((prev: any) => ({ ...prev, totalStudents: data.totalStudents }));
      } else {
        console.error('❌ Failed to fetch students:', data.message);
        setStudents([]);
      }
    } catch (error) {
      console.error('❌ Error fetching students:', error);
      setStudents([]);
    }
  };

  useEffect(() => {
    // Clean up old attendance records
    cleanupOldAttendance();
    
    // Log today's date for debugging
    console.log('📅 Today\'s date:', getTodayDate());
    
    // Fetch driver data from localStorage
    const storedDriver = localStorage.getItem('driver');
    if (storedDriver) {
      const driverData = JSON.parse(storedDriver);
      setDriver({
        name: driverData.name,
        email: driverData.email,
        driverId: driverData.id.split('@')[0].toUpperCase(), // e.g., "DRIVER1"
        phoneNumber: '+91 98765 43210',
        assignedRoute: driverData.route,
        busNumber: driverData.busNumber || 'AP 16 T 1234',
        totalStudents: driverData.totalStudents || 0,
        departureTime: '7:00 AM',
        stopPoints: driverData.stopPoints || 4,
      });
      
      // Fetch students for this route
      fetchStudents(driverData.route);
      
      setLoading(false);
    } else {
      // Fallback if no driver info found
      const fallbackRoute = 'Tenali - MG Road - College';
      setDriver({
        name: 'Guest Driver',
        email: 'guest@ctms.com',
        driverId: 'DRV001',
        phoneNumber: '+91 98765 43210',
        assignedRoute: fallbackRoute,
        busNumber: 'AP 16 T 1234',
        totalStudents: 0,
        departureTime: '7:00 AM',
        stopPoints: 4,
      });
      
      // Fetch students for fallback route
      fetchStudents(fallbackRoute);
      
      setLoading(false);
    }
  }, []);

  // Fetch notifications when driver data is loaded
  useEffect(() => {
    if (driver && driver.assignedRoute) {
      fetchNotifications();
    }
  }, [driver]);

  // Refresh notifications when switching to notifications tab
  useEffect(() => {
    if (activeTab === 'notifications' && driver && driver.assignedRoute) {
      fetchNotifications();
      // Mark all notifications as read when viewing the notifications tab
      setUnreadCount(0);
    }
  }, [activeTab]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      console.log('=== Fetching notifications for driver ===');
      
      if (!driver || !driver.assignedRoute) {
        console.log('❌ Driver or route not available yet');
        console.log('Driver:', driver);
        return;
      }

      console.log('✅ Driver info:', {
        name: driver.name,
        email: driver.email,
        route: driver.assignedRoute
      });

      // Fetch driver's own issues (converted to notifications)
      if (driver.email) {
        console.log('📧 Fetching driver issues...');
        const issuesResponse = await fetch(`http://localhost:5000/api/driver/issues?driverEmail=${driver.email}`);
        const issuesData = await issuesResponse.json();
        console.log('Driver issues response:', issuesData);
        
        const issueNotifications = issuesData.success && issuesData.issues.length > 0 
          ? issuesData.issues.map((issue: any) => {
              let title = 'Issue Update';
              let message = '';
              let type = 'info';
              
              if (issue.status === 'resolved') {
                title = '✅ Issue Resolved';
                message = `Your ${issue.category} issue has been resolved! "${issue.message}"`;
                type = 'success';
              } else if (issue.status === 'in-progress') {
                title = '⏳ Issue In Progress';
                message = `Admin is working on your ${issue.category} issue: "${issue.message}"`;
                type = 'info';
              } else if (issue.status === 'closed') {
                title = '📁 Issue Closed';
                message = `Your ${issue.category} issue has been closed: "${issue.message}"`;
                type = 'info';
              } else {
                title = '📢 Issue Reported';
                message = `Your ${issue.category} issue is pending review: "${issue.message}"`;
                type = 'info';
              }
              
              return {
                type,
                title,
                message,
                time: formatDateTime(issue.updatedAt || issue.createdAt),
              };
            })
          : [];

        console.log('📋 Issue notifications:', issueNotifications.length);

        // Fetch admin notifications for this driver's route
        const notifUrl = `http://localhost:5000/api/admin/notifications/route?route=${encodeURIComponent(driver.assignedRoute)}&audience=drivers`;
        console.log('📢 Fetching admin notifications from:', notifUrl);
        
        const notifResponse = await fetch(notifUrl);
        const notifData = await notifResponse.json();
        console.log('Admin notifications response:', notifData);

        const adminNotifications = notifData.success && notifData.notifications.length > 0
          ? notifData.notifications.map((notif: any) => ({
              type: notif.type || 'info',
              title: notif.title,
              message: notif.message,
              time: formatDateTime(notif.createdAt),
            }))
          : [];

        console.log('📢 Admin notifications:', adminNotifications.length);
        console.log('🔔 Total notifications:', issueNotifications.length + adminNotifications.length);

        // Combine both types of notifications
        const allNotifications = [...issueNotifications, ...adminNotifications];
        setNotifications(allNotifications);
        
        // Calculate unread count (notifications not yet viewed)
        const unread = countUnreadNotifications(allNotifications);
        setUnreadCount(unread);
        
        console.log('📊 Total notifications:', allNotifications.length, '| Unread:', unread);
      }
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    
    // When switching to notifications tab, mark all as viewed
    if (newValue === 'notifications' && notifications.length > 0) {
      const notificationIds = notifications.map(n => n._id || n.id).filter(id => id);
      markNotificationsAsViewed(notificationIds);
      setUnreadCount(0);
      console.log('✅ Marked', notificationIds.length, 'notifications as viewed');
    }
  };

  const handleMarkAttendance = async (studentId: number, status: string) => {
    // Find the student being marked
    const student = students.find(s => s.id === studentId);
    
    if (!student) return;
    
    // Save attendance to localStorage for today
    saveStudentAttendance(student.regNo, status);
    console.log('💾 Saved attendance for', student.name, ':', status);
    
    // Update student status in UI
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status } : s
    ));
    
    // Update trip status
    const presentCount = students.filter(s => s.status === 'Boarded' || (s.id === studentId && status === 'Boarded')).length;
    const absentCount = students.filter(s => s.status === 'Absent' || (s.id === studentId && status === 'Absent')).length;
    setTripStatus(prev => ({ ...prev, presentCount, absentCount }));

    // Send notification to student when marked as Boarded
    if (status === 'Boarded' && student) {
      try {
        const pickupLocation = student.pickupPoint !== 'Not Selected' ? student.pickupPoint : 'the pickup point';
        const notificationData = {
          title: '🚌 You Have Boarded!',
          message: `You just now boarded at ${pickupLocation}`,
          targetAudience: 'specific',
          targetRegNo: student.regNo,
          priority: 'normal',
          type: 'success',
        };

        console.log('📤 Sending boarding notification to student:', student.regNo);

        const response = await fetch('http://localhost:5000/api/admin/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationData),
        });

        const data = await response.json();

        if (data.success) {
          console.log('✅ Boarding notification sent successfully to', student.name);
        } else {
          console.error('❌ Failed to send boarding notification:', data.message);
        }
      } catch (error) {
        console.error('❌ Error sending boarding notification:', error);
      }
    }
  };

  const handleStartTrip = () => {
    setIsTripActive(true);
    setTripStatus(prev => ({ ...prev, status: 'In Progress' }));
    setActiveTab('tracking');
  };

  const handleTripStatusChange = (status: string) => {
    setTripStatus(prev => ({ ...prev, status }));
    if (status === 'In Progress') {
      setIsTripActive(true);
    } else if (status === 'Completed' || status === 'Not Started') {
      setIsTripActive(false);
    }
  };

  const handleTripActiveChange = (active: boolean) => {
    setIsTripActive(active);
    if (active) {
      setTripStatus(prev => ({ ...prev, status: 'In Progress' }));
    } else {
      setTripStatus(prev => ({ ...prev, status: 'Completed' }));
    }
  };

  const handleLogout = () => {
    // Clear driver data from localStorage
    localStorage.removeItem('driver');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview driver={driver} tripStatus={tripStatus} setActiveTab={setActiveTab} onStartTrip={handleStartTrip} />;
      case 'students':
        return <StudentList students={students} onMarkAttendance={handleMarkAttendance} />;
      case 'tracking':
        return <TripTracking 
          driver={driver} 
          onTripStatusChange={handleTripStatusChange} 
          isTripActive={isTripActive}
          onTripActiveChange={handleTripActiveChange}
        />;
      case 'notifications':
        return <DriverNotifications notifications={notifications} onRefresh={fetchNotifications} />;
      default:
        return <DashboardOverview driver={driver} tripStatus={tripStatus} setActiveTab={setActiveTab} onStartTrip={handleStartTrip} />;
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
    { id: 'students', name: 'Students', icon: PeopleIcon },
    { id: 'tracking', name: 'Trip Tracking', icon: NavigationIcon },
    { id: 'notifications', name: 'Notifications', icon: NotificationsIcon, badge: unreadCount },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          borderRadius: 0,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Driver Dashboard
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              {driver?.name} • ID: {driver?.driverId}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Badge badgeContent={unreadCount} color="error">
              <IconButton 
                sx={{ color: 'white' }}
                onClick={() => {
                  setActiveTab('notifications');
                  // Mark notifications as viewed when icon is clicked
                  if (notifications.length > 0) {
                    const notificationIds = notifications.map(n => n._id || n.id).filter(id => id);
                    markNotificationsAsViewed(notificationIds);
                    setUnreadCount(0);
                  }
                }}
              >
                <NotificationsIcon />
              </IconButton>
            </Badge>
            <Button
              onClick={handleLogout}
              variant="outlined"
              startIcon={<LogoutIcon />}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ position: 'sticky', top: 0, zIndex: 10 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 600,
              fontSize: '0.95rem',
            },
          }}
        >
          {navItems.map((item) => {
            const IconComp = item.icon;
            return (
              <Tab
                key={item.id}
                value={item.id}
                label={item.name}
                icon={
                  item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      <IconComp />
                    </Badge>
                  ) : (
                    <IconComp />
                  )
                }
                iconPosition="start"
              />
            );
          })}
        </Tabs>
      </Paper>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 4 }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DriverDashboard;