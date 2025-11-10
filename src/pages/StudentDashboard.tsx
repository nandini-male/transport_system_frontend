import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Tab, 
  Tabs, 
  CircularProgress,
  Divider,
  Chip,
  LinearProgress,
  TextField,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Route as RouteIcon, 
  DirectionsBus as BusIcon, 
  Payment as PaymentIcon, 
  NotificationsActive as NotificationsIcon, 
  AccountCircle as AccountIcon, 
  CheckCircle as CheckCircleIcon, 
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  History as HistoryIcon,
  CreditCard as CreditCardIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { loadGoogleMapsScript } from '../utils/googleMapsLoader';
import { routeCoordinates, getDefaultCenter } from '../config/routeCoordinates';

// --- Mock Student Data (removed - using real data from backend) ---

// --- Helper Component: Not Registered Flow ---
const RegistrationPrompt: React.FC<{ onRegisterClick: () => void }> = ({ onRegisterClick }) => (
    <Paper 
        elevation={6} 
        sx={{ 
            p: 8, 
            textAlign: 'center', 
            my: 4, 
            borderRadius: 4, 
            bgcolor: '#fff3e0', // Light orange background
            border: '3px dashed', 
            borderColor: 'warning.main', 
        }}
    >
        <WarningIcon sx={{ fontSize: 72, color: 'warning.dark', mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="warning.dark">
            Enrollment Required
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Please register for the college transport service to access real-time route, tracking, and fee information.
        </Typography>
        <Button
            onClick={onRegisterClick}
            variant="contained"
            color="warning"
            size="large"
            sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
        >
            Start Transport Registration
        </Button>
    </Paper>
);

// --- Helper Component: Payment Required ---
const PaymentRequired: React.FC<{ student: any; onPayNowClick: () => void }> = ({ student, onPayNowClick }) => (
    <Paper 
        elevation={6} 
        sx={{ 
            p: 8, 
            textAlign: 'center', 
            my: 4, 
            borderRadius: 4, 
            bgcolor: '#ffebee', // Light red background
            border: '3px dashed', 
            borderColor: 'error.main', 
        }}
    >
        <PaymentIcon sx={{ fontSize: 72, color: 'error.dark', mb: 2 }} />
        <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" color="error.dark">
            Payment Required
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Please complete your transport fee payment to access this feature.
        </Typography>
        <Box sx={{ bgcolor: 'white', p: 3, borderRadius: 2, mb: 3, border: '1px solid #ffcdd2' }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
                <strong>Your Route:</strong> {student.currentRoute}
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="error.main" sx={{ mt: 2 }}>
                Total Fee: ₹{student.feeDue?.toLocaleString('en-IN')}
            </Typography>
            {student.amountPaid > 0 && (
                <>
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        Amount Paid: ₹{student.amountPaid?.toLocaleString('en-IN')}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                        Balance Due: ₹{(student.feeDue - student.amountPaid)?.toLocaleString('en-IN')}
                    </Typography>
                </>
            )}
        </Box>
        <Button
            onClick={onPayNowClick}
            variant="contained"
            color="error"
            size="large"
            sx={{ px: 5, py: 1.5, borderRadius: 3, fontWeight: 'bold' }}
            startIcon={<PaymentIcon />}
        >
            Pay Now to Access
        </Button>
    </Paper>
);

// --- Sub-Components ---

// 1. Notifications Component (Used in Home and Alerts Tabs)
const Notifications: React.FC<{ notifications: any[]; isSummary?: boolean }> = ({ notifications, isSummary = false }) => {
  // Helper function to determine notification type styling
  const getNotificationType = (priority: string, type: string) => {
    if (type === 'success') return 'success';
    if (priority === 'high' || type === 'urgent') return 'emergency';
    if (type === 'warning') return 'warning';
    return 'announcement';
  };

  // Helper function to get notification color scheme
  const getNotificationColors = (notifType: string) => {
    switch(notifType) {
      case 'success':
        return {
          borderColor: 'success.main',
          bgcolor: '#f0fdf4',
          hoverBg: '#dcfce7',
          chipColor: 'success' as const,
          label: 'SUCCESS'
        };
      case 'emergency':
        return {
          borderColor: 'error.main',
          bgcolor: '#fef2f2',
          hoverBg: '#fee2e2',
          chipColor: 'error' as const,
          label: 'EMERGENCY ALERT'
        };
      case 'warning':
        return {
          borderColor: 'warning.main',
          bgcolor: '#fffbeb',
          hoverBg: '#fef3c7',
          chipColor: 'warning' as const,
          label: 'WARNING'
        };
      default:
        return {
          borderColor: 'info.main',
          bgcolor: '#eff6ff',
          hoverBg: '#dbeafe',
          chipColor: 'info' as const,
          label: 'ANNOUNCEMENT'
        };
    }
  };

  // Helper function to format time
  const formatTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <Box sx={{ mt: isSummary ? 0 : 4 }}>
      <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#3f51b5' }} fontWeight="bold">
        <NotificationsIcon sx={{ mr: 1, color: 'warning.main' }} /> {isSummary ? 'Recent Alerts' : 'Notifications & Alerts'}
        {notifications.length > 0 && (
          <Chip label={isSummary ? `${notifications.length} New` : `${notifications.length} Total`} size="small" color="secondary" sx={{ ml: 2 }} />
        )}
      </Typography>

      <Paper 
        elevation={isSummary ? 0 : 3} 
        sx={{ 
            p: isSummary ? 0 : 3, 
            borderRadius: 3, 
            bgcolor: isSummary ? 'transparent' : 'background.paper' 
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notifications.slice(0, isSummary ? 2 : notifications.length).map((alert) => {
              const notifType = getNotificationType(alert.priority, alert.type);
              const colors = getNotificationColors(notifType);
              return (
                <Paper 
                    key={alert._id} 
                    elevation={1} 
                    sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        borderLeft: 6, 
                        borderColor: colors.borderColor,
                        bgcolor: colors.bgcolor,
                        transition: '0.3s',
                        '&:hover': { bgcolor: colors.hoverBg }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Chip 
                          label={colors.label} 
                          size="small" 
                          color={colors.chipColor}
                          sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="caption" color="text.secondary">{formatTime(alert.createdAt)}</Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 1, color: 'text.primary' }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5, color: 'text.primary' }}>{alert.message}</Typography>
                </Paper>
              );
            })}

            {notifications.length === 0 && (
                <Box sx={{ textAlign: 'center', p: 4, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography color="text.secondary">No new notifications.</Typography>
                </Box>
            )}
        </Box>
      </Paper>
    </Box>
  );
};

// 2. Dashboard Summary / Home Tab
const HomeSummary: React.FC<{ student: any; setActiveTab: (tab: string) => void; notifications: any[] }> = ({ student, setActiveTab, notifications }) => {
    
    const SummaryCard: React.FC<{ title: string; value: string; icon: any; color: string; action: () => void }> = ({ title, value, icon: Icon, color, action }) => (
        <Paper 
            elevation={8} // Higher elevation for better pop
            sx={{ 
                p: 3, 
                borderRadius: 3, 
                borderBottom: 5, 
                borderColor: color, 
                cursor: 'pointer', 
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }
            }}
            onClick={action}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" fontWeight="medium">{title}</Typography>
                <Icon sx={{ fontSize: 36, color: color, opacity: 0.7 }} />
            </Box>
            <Typography variant="h5" component="div" fontWeight="extrabold" sx={{ mt: 1, color: 'text.primary' }}>{value}</Typography>
            <Button 
                size="small" 
                sx={{ mt: 2, color: color, fontWeight: 'bold' }} 
                onClick={(e) => { e.stopPropagation(); action(); }}
            >
                View Details &rarr;
            </Button>
        </Paper>
    );
    
    // Determine fee card style - check if fully paid
    const isPaid = student.feeStatus === 'Paid';
    const remainingBalance = student.feeDue - student.amountPaid;
    const feeColor = isPaid ? '#10b981' : '#ef4444';
    const feeValue = isPaid ? 'Paid in Full' : `₹ ${remainingBalance.toLocaleString('en-IN')} Due`;

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" sx={{ color: 'text.primary' }}>
                Welcome Back, {student.name.split(' ')[0]}!
            </Typography>
            
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 4,
                mb: 4 
            }}>
                <SummaryCard 
                    title="Your Route" 
                    value={student.currentRoute || student.route || 'Route not assigned'} 
                    icon={RouteIcon} 
                    color="#4f46e5" 
                    action={() => setActiveTab('route')}
                />
                <SummaryCard 
                    title="Bus Status" 
                    value={student.busLocation?.split('(')[0]?.trim() || 'Not started'}
                    icon={BusIcon} 
                    color="#f59e0b" 
                    action={() => setActiveTab('live-track')}
                />
                <SummaryCard 
                    title="Fee Balance" 
                    value={feeValue} 
                    icon={PaymentIcon} 
                    color={feeColor} 
                    action={() => setActiveTab('fees')}
                />
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Notifications notifications={notifications} isSummary={true} />
        </Box>
    );
};


// 3. Route Details Component
const RouteDetails: React.FC<{ student: any; onRegisterClick: () => void; onPickupPointUpdate: (pickupPoint: string, pickupPointId: number) => void }> = ({ student, onRegisterClick, onPickupPointUpdate }) => {
    const [routeInfo, setRouteInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPickupPoint, setSelectedPickupPoint] = useState<any>(student.pickupPoint || null);
    const [updating, setUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        if (student.currentRoute) {
            fetchRouteInfo();
        }
    }, [student.currentRoute]);

    const fetchRouteInfo = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/students/route-info?routeName=${encodeURIComponent(student.currentRoute)}`
            );
            const data = await response.json();
            
            if (data.success) {
                setRouteInfo(data.routeInfo);
                // If student has a pickup point, set it
                if (student.pickupPoint) {
                    const existingPoint = data.routeInfo.pickupPoints.find(
                        (p: any) => p.name === student.pickupPoint
                    );
                    setSelectedPickupPoint(existingPoint);
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching route info:', error);
            setLoading(false);
        }
    };

    const handlePickupPointChange = async (pickupPoint: any) => {
        setSelectedPickupPoint(pickupPoint);
        setUpdating(true);
        setUpdateMessage('');

        try {
            const response = await fetch('http://localhost:5000/api/students/pickup-point', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    regNo: student.regNo,
                    pickupPoint: pickupPoint.name,
                    pickupPointId: pickupPoint.id,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setUpdateMessage('✅ Pickup point updated successfully!');
                onPickupPointUpdate(pickupPoint.name, pickupPoint.id);
            } else {
                setUpdateMessage('❌ Failed to update pickup point');
            }
        } catch (error) {
            console.error('Error updating pickup point:', error);
            setUpdateMessage('❌ Failed to update pickup point');
        } finally {
            setUpdating(false);
        }
    };

    if (!student.isRegistered) {
        return <RegistrationPrompt onRegisterClick={onRegisterClick} />;
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }} fontWeight="bold">
                <RouteIcon sx={{ mr: 1, color: 'primary.main' }} /> Your Transportation Route
            </Typography>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, borderLeft: 6, borderColor: 'primary.main', bgcolor: 'white' }}>
                <Typography variant="h5" color="primary.dark" gutterBottom fontWeight="extrabold">
                    {student.currentRoute || student.route || 'Route not assigned'}
                </Typography>
                
                {routeInfo && (
                    <>
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 3,
                            mt: 2 
                        }}>
                            <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8eaf6', borderRadius: 2, border: '1px solid #c5cae9' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScheduleIcon fontSize="small" sx={{ mr: 1 }} /> Departure Time
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                    {routeInfo.departureTime}
                                </Typography>
                            </Paper>
                            <Paper elevation={1} sx={{ p: 2, bgcolor: '#e8eaf6', borderRadius: 2, border: '1px solid #c5cae9' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                    <ScheduleIcon fontSize="small" sx={{ mr: 1 }} /> Arrival Time
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>
                                    {routeInfo.arrivalTime}
                                </Typography>
                            </Paper>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Pickup Point Selection */}
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                            Select Your Pickup Point
                        </Typography>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                            gap: 2,
                            mb: 3
                        }}>
                            {routeInfo.pickupPoints.map((point: any) => (
                                <Paper
                                    key={point.id}
                                    onClick={() => handlePickupPointChange(point)}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        borderRadius: 2,
                                        border: 2,
                                        borderColor: selectedPickupPoint?.id === point.id ? 'primary.main' : 'grey.300',
                                        bgcolor: selectedPickupPoint?.id === point.id ? '#e3f2fd' : 'white',
                                        transition: '0.3s',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            bgcolor: '#f5f5f5',
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Box>
                                            <Typography variant="body1" fontWeight="bold">
                                                {point.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {point.timing}
                                            </Typography>
                                        </Box>
                                        {selectedPickupPoint?.id === point.id && (
                                            <CheckCircleIcon color="primary" />
                                        )}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>

                        {updating && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <CircularProgress size={20} />
                                <Typography variant="body2">Updating pickup point...</Typography>
                            </Box>
                        )}

                        {updateMessage && (
                            <Alert severity={updateMessage.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
                                {updateMessage}
                            </Alert>
                        )}

                        <Divider sx={{ my: 3 }} />

                        {/* Driver Information */}
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                            Assigned Driver & Contact
                        </Typography>
                        <Paper variant="outlined" sx={{ 
                            p: 3, 
                            bgcolor: 'grey.50', 
                            borderRadius: 2,
                            borderLeft: 4,
                            borderColor: 'success.main'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <AccountIcon sx={{ mr: 1, color: 'success.main', fontSize: 28 }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Driver Name</Typography>
                                    <Typography variant="h6" fontWeight="bold">{routeInfo.driver.name}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PhoneIcon sx={{ mr: 1, color: 'success.main', fontSize: 24 }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Contact Number</Typography>
                                    <Typography 
                                        component="a" 
                                        href={`tel:${routeInfo.driver.phone}`} 
                                        sx={{ 
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            color: 'info.main',
                                            textDecoration: 'none',
                                            '&:hover': { textDecoration: 'underline' }
                                        }}
                                    >
                                        {routeInfo.driver.phone}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <BusIcon sx={{ mr: 1, color: 'success.main', fontSize: 24 }} />
                                <Box>
                                    <Typography variant="body2" color="text.secondary">Vehicle Number</Typography>
                                    <Typography variant="body1" fontWeight="bold">{routeInfo.driver.vehicleNumber}</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </>
                )}
            </Paper>
        </Box>
    );
};


// 4. Live Bus Tracking Component
const LiveTracking: React.FC<{ student: any }> = ({ student }) => {
    const [tracking, setTracking] = React.useState(false);
    const [busLocation, setBusLocation] = React.useState<{latitude: number, longitude: number} | null>(null);
    const [lastUpdate, setLastUpdate] = React.useState<string>('');
    const [mapLoaded, setMapLoaded] = React.useState(false);
    const [mapError, setMapError] = React.useState<string | null>(null);
    const mapRef = React.useRef<HTMLDivElement>(null);
    const mapInstanceRef = React.useRef<any>(null);
    const busMarkerRef = React.useRef<any>(null);
    const routeMarkersRef = React.useRef<any[]>([]);
    const routePolylineRef = React.useRef<any>(null);
    const directionsRendererRef = React.useRef<any>(null);
    
    // Debug log to check student data
    console.log('🔍 LiveTracking component - Student data:', {
        currentRoute: student.currentRoute,
        route: student.route,
        name: student.name
    });
    
    // Load Google Maps
    React.useEffect(() => {
        // Listen for Google Maps errors
        (window as any).gm_authFailure = () => {
            setMapError('Google Maps API key is invalid or restricted. Please check your API key configuration.');
            setMapLoaded(false);
        };

        loadGoogleMapsScript()
            .then(() => {
                console.log('✅ Student Dashboard - Google Maps loaded successfully');
                setMapLoaded(true);
                setMapError(null);
            })
            .catch((error) => {
                console.error('❌ Student Dashboard - Error loading Google Maps:', error);
                setMapError(error.message || 'Failed to load Google Maps. Please check your internet connection.');
            });
    }, []);
    
    // Initialize map with route
    React.useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current || !mapLoaded) {
            return;
        }
        
        const studentRoute = student.currentRoute || student.route;
        
        if (!studentRoute || studentRoute === 'Route not assigned') {
            console.log('No route assigned, using default center');
        }
        
        try {
            // Get route coordinates
            const coords = routeCoordinates[studentRoute] || [];
            const center = coords.length > 0 ? coords[0] : getDefaultCenter();
            
            const map = new (window as any).google.maps.Map(mapRef.current, {
                zoom: coords.length > 0 ? 11 : 12,
                center: center,
                mapTypeControl: true,
                streetViewControl: false,
                fullscreenControl: true,
            });
            
            mapInstanceRef.current = map;
            
            // If route coordinates exist, display the route using Directions API
            if (coords.length > 0) {
                console.log('📍 Displaying route with', coords.length, 'stops');
                
                // Initialize DirectionsService and DirectionsRenderer
                const directionsService = new (window as any).google.maps.DirectionsService();
                const directionsRenderer = new (window as any).google.maps.DirectionsRenderer({
                    map: map,
                    suppressMarkers: false, // Show default markers
                    polylineOptions: {
                        strokeColor: '#667eea',
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                    },
                    markerOptions: {
                        icon: {
                            path: (window as any).google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            strokeColor: '#ffffff',
                            strokeWeight: 2,
                        }
                    }
                });
                
                directionsRendererRef.current = directionsRenderer;
                
                // Build waypoints (all stops except first and last)
                const waypoints = coords.slice(1, -1).map((coord: any) => ({
                    location: { lat: coord.lat, lng: coord.lng },
                    stopover: true,
                }));
                
                // Request directions from first to last stop with waypoints
                const request = {
                    origin: { lat: coords[0].lat, lng: coords[0].lng },
                    destination: { lat: coords[coords.length - 1].lat, lng: coords[coords.length - 1].lng },
                    waypoints: waypoints,
                    travelMode: (window as any).google.maps.TravelMode.DRIVING,
                    optimizeWaypoints: false, // Keep the order as defined
                };
                
                directionsService.route(request, (result: any, status: any) => {
                    if (status === 'OK') {
                        console.log('✅ Directions loaded successfully');
                        directionsRenderer.setDirections(result);
                        
                        // Add custom markers for better visibility
                        coords.forEach((coord: any, index: number) => {
                            const marker = new (window as any).google.maps.Marker({
                                position: { lat: coord.lat, lng: coord.lng },
                                map: map,
                                title: coord.name,
                                label: {
                                    text: (index + 1).toString(),
                                    color: 'white',
                                    fontWeight: 'bold',
                                },
                                icon: {
                                    path: (window as any).google.maps.SymbolPath.CIRCLE,
                                    scale: 12,
                                    fillColor: index === 0 ? '#10b981' : (index === coords.length - 1 ? '#ef4444' : '#3b82f6'),
                                    fillOpacity: 1,
                                    strokeColor: '#ffffff',
                                    strokeWeight: 3,
                                },
                                zIndex: 1000,
                            });

                            const infoWindow = new (window as any).google.maps.InfoWindow({
                                content: `<div style="padding: 8px; font-family: Arial;">
                                    <strong style="color: #1f2937; font-size: 14px;">${coord.name}</strong><br/>
                                    <span style="color: #6b7280; font-size: 12px;">Stop ${index + 1} of ${coords.length}</span>
                                </div>`,
                            });

                            marker.addListener('click', () => {
                                // Close all other info windows
                                routeMarkersRef.current.forEach(m => {
                                    if (m.infoWindow) m.infoWindow.close();
                                });
                                infoWindow.open(map, marker);
                            });

                            marker.infoWindow = infoWindow;
                            routeMarkersRef.current.push(marker);
                        });
                    } else {
                        console.error('❌ Directions request failed:', status);
                        // Fallback to polyline if directions fail
                        const routePath = new (window as any).google.maps.Polyline({
                            path: coords.map((c: any) => ({ lat: c.lat, lng: c.lng })),
                            geodesic: true,
                            strokeColor: '#667eea',
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                            map: map,
                        });
                        
                        routePolylineRef.current = routePath;
                        
                        // Add markers as before
                        coords.forEach((coord: any, index: number) => {
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
                            routeMarkersRef.current.push(marker);
                        });
                        
                        // Fit map to show all stops
                        const bounds = new (window as any).google.maps.LatLngBounds();
                        coords.forEach((coord: any) => bounds.extend({ lat: coord.lat, lng: coord.lng }));
                        map.fitBounds(bounds);
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Failed to initialize map.');
        }
    }, [mapLoaded, student.currentRoute, student.route]);
    
    // Fetch driver location
    const fetchDriverLocation = React.useCallback(async () => {
        const studentRoute = student.currentRoute || student.route;
        
        if (!studentRoute || studentRoute === 'Route not assigned') {
            console.log('No route assigned to student');
            setTracking(false);
            return;
        }
        
        try {
            console.log('🔍 Student - Fetching driver location for route:', studentRoute);
            const response = await fetch(`http://localhost:5000/api/driver/location?route=${encodeURIComponent(studentRoute)}`);
            const data = await response.json();
            
            console.log('📍 Location response:', data);
            
            if (data.success && data.tracking && data.location) {
                console.log('✅ Tracking active, location:', data.location);
                setTracking(true);
                setBusLocation({
                    latitude: data.location.latitude,
                    longitude: data.location.longitude
                });
                setLastUpdate(new Date(data.location.lastUpdated).toLocaleTimeString());
                
                // Update map if available
                if (mapInstanceRef.current && (window as any).google) {
                    const position = { lat: data.location.latitude, lng: data.location.longitude };
                    
                    // Update or create bus marker
                    if (busMarkerRef.current) {
                        busMarkerRef.current.setPosition(position);
                    } else {
                        busMarkerRef.current = new (window as any).google.maps.Marker({
                            position: position,
                            map: mapInstanceRef.current,
                            title: '🚍 Live Bus Location',
                            icon: {
                                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                                        <circle cx="24" cy="24" r="20" fill="#f59e0b" stroke="#fff" stroke-width="3"/>
                                        <text x="24" y="32" font-size="28" text-anchor="middle" fill="#fff">🚍</text>
                                    </svg>
                                `),
                                scaledSize: new (window as any).google.maps.Size(48, 48),
                                anchor: new (window as any).google.maps.Point(24, 24),
                            },
                            zIndex: 2000,
                            animation: (window as any).google.maps.Animation.BOUNCE,
                        });
                        
                        // Add info window for bus
                        const busInfoWindow = new (window as any).google.maps.InfoWindow({
                            content: `<div style="padding: 12px; font-family: Arial;">
                                <strong style="color: #f59e0b; font-size: 16px;">🚍 Bus Location</strong><br/>
                                <span style="color: #6b7280; font-size: 13px;">Live tracking active</span><br/>
                                <span style="color: #374151; font-size: 12px; margin-top: 4px; display: block;">
                                    Last updated: ${new Date().toLocaleTimeString()}
                                </span>
                            </div>`,
                        });
                        
                        busMarkerRef.current.addListener('click', () => {
                            busInfoWindow.open(mapInstanceRef.current, busMarkerRef.current);
                        });
                        
                        // Auto-open info window initially
                        busInfoWindow.open(mapInstanceRef.current, busMarkerRef.current);
                        
                        // Stop bouncing after 3 seconds
                        setTimeout(() => {
                            if (busMarkerRef.current) {
                                busMarkerRef.current.setAnimation(null);
                            }
                        }, 3000);
                    }
                    
                    // Center map on bus
                    mapInstanceRef.current.panTo(position);
                }
            } else {
                console.log('⚠️ No tracking available');
                setTracking(false);
                setBusLocation(null);
                if (busMarkerRef.current) {
                    busMarkerRef.current.setMap(null);
                    busMarkerRef.current = null;
                }
            }
        } catch (error) {
            console.error('❌ Error fetching driver location:', error);
            setTracking(false);
        }
    }, [student.currentRoute, student.route]);
    
    // Poll for updates every 5 seconds
    React.useEffect(() => {
        console.log('🔄 Setting up location polling for student route:', student.currentRoute || student.route);
        fetchDriverLocation(); // Initial fetch
        
        const interval = setInterval(fetchDriverLocation, 5000); // Poll every 5 seconds
        
        return () => {
            console.log('🛑 Stopping location polling');
            clearInterval(interval);
        };
    }, [fetchDriverLocation]);
    
    return (
        <Box sx={{ my: 4 }}>
            {/* Route Header */}
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 2.5, 
                    mb: 2, 
                    borderRadius: 3, 
                    bgcolor: 'primary.main',
                    color: 'white'
                }}
            >
                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
                    <RouteIcon sx={{ mr: 1.5, fontSize: 28 }} />
                    {student.currentRoute || student.route || 'No route assigned'}
                </Typography>
            </Paper>

            <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }} fontWeight="bold">
                <BusIcon sx={{ mr: 1, color: 'warning.main' }} /> Real-Time Bus Location
            </Typography>

            <Paper elevation={4} sx={{ p: 4, borderRadius: 4, borderLeft: 6, borderColor: 'warning.main', bgcolor: 'white' }}>
                
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Chip 
                            label={tracking ? "🚍 Live Tracking Active" : "⚠️ No Active Trip"} 
                            color={tracking ? "success" : "default"} 
                            size="medium" 
                            sx={{ fontWeight: 'bold' }} 
                        />
                    </Box>
                    {lastUpdate && (
                        <Typography variant="caption" color="text.secondary">
                            Last updated: {lastUpdate}
                        </Typography>
                    )}
                </Box>

                {mapError ? (
                    <Box 
                        sx={{ 
                            height: 400, 
                            width: '100%', 
                            bgcolor: '#ffebee', 
                            borderRadius: 2, 
                            mb: 3, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '1px solid #ef5350'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" color="error">
                            {mapError}
                        </Typography>
                    </Box>
                ) : !mapLoaded ? (
                    <Box 
                        sx={{ 
                            height: 400, 
                            width: '100%', 
                            bgcolor: '#e0f2f1', 
                            borderRadius: 2, 
                            mb: 3, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            border: '1px solid #b2dfdb'
                        }}
                    >
                        <CircularProgress size={60} sx={{ color: 'info.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold" color="text.secondary">
                            Loading Map...
                        </Typography>
                    </Box>
                ) : (
                    <Box 
                        ref={mapRef}
                        sx={{ 
                            height: 400, 
                            width: '100%', 
                            borderRadius: 2, 
                            mb: 3, 
                            border: '2px solid #14b8a6'
                        }}
                    />
                )}

                {tracking && busLocation ? (
                    <Paper elevation={2} sx={{ p: 3, bgcolor: '#dcfce7', borderLeft: 5, borderColor: 'success.dark', mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'success.dark', display: 'flex', alignItems: 'center' }}>
                            <BusIcon sx={{ mr: 1 }} /> Bus is Currently Active
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                            Your bus is on the way! The driver has started the trip and is tracking live.
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Position: {busLocation.latitude.toFixed(4)}, {busLocation.longitude.toFixed(4)}
                        </Typography>
                    </Paper>
                ) : (
                    <Paper elevation={2} sx={{ p: 3, bgcolor: '#fef3c7', borderLeft: 5, borderColor: 'warning.dark', mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center' }}>
                            <BusIcon sx={{ mr: 1 }} /> No Active Trip
                        </Typography>
                        <Typography variant="body1" color="text.primary" sx={{ mt: 1 }}>
                            The driver hasn't started the trip yet. Live tracking will activate when the driver starts their trip.
                        </Typography>
                    </Paper>
                )}
                
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {student.pickupPoint ? (
                        <>Your pickup point: <strong>{student.pickupPoint}</strong></>
                    ) : (
                        <>Please select a pickup point in the Route Info tab to see estimated arrival times.</>
                    )}
                </Typography>
            </Paper>
        </Box>
    );
};

// 5. Fees and Payments Component
const FeesAndPayments: React.FC<{ student: any; onPaymentSuccess: () => void }> = ({ student, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showUpiDialog, setShowUpiDialog] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');
  const [showCardDialog, setShowCardDialog] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);

  const handlePayment = async () => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      setPaymentMessage('Please enter a valid amount');
      return;
    }

    const remainingBalance = student.feeDue - student.amountPaid;
    if (amount > remainingBalance) {
      setPaymentMessage(`Amount exceeds balance due (₹${remainingBalance.toLocaleString('en-IN')})`);
      return;
    }

    setIsPaying(true);
    setPaymentMessage('Processing payment...');

    try {
      const response = await fetch('http://localhost:5000/api/students/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regNo: student.regNo,
          amount: amount,
          paymentMethod: 'Online Payment',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentMessage(`✓ Payment successful! Transaction ID: ${data.payment.transactionId}`);
        
        // Update localStorage with new payment info
        const studentData = JSON.parse(localStorage.getItem('student') || '{}');
        studentData.feeStatus = data.payment.feeStatus;
        studentData.amountPaid = data.payment.amountPaid;
        studentData.lastPaymentDate = new Date().toISOString();
        localStorage.setItem('student', JSON.stringify(studentData));
        
        // Call parent callback to refresh student data
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setPaymentMessage(`✗ Payment failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentMessage('✗ Payment failed. Please try again.');
    } finally {
      setIsPaying(false);
      setPaymentAmount('');
    }
  };

  const handleUpiPayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      setPaymentMessage('Please enter a valid amount');
      return;
    }

    const remainingBalance = student.feeDue - student.amountPaid;
    if (amount > remainingBalance) {
      setPaymentMessage(`Amount exceeds balance due (₹${remainingBalance.toLocaleString('en-IN')})`);
      return;
    }

    // Generate UPI payment link
    const upiId = 'chowdary@okicici';
    const name = 'chow';
    const transactionNote = `Transport Fee Payment - ${student.regNo}`;
    
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    // Open UPI app
    window.location.href = upiLink;
    
    // Show dialog for transaction ID
    setShowUpiDialog(true);
    setPaymentMessage('');
  };

  const handleVerifyUpiPayment = async () => {
    if (!upiTransactionId.trim()) {
      setPaymentMessage('Please enter the UPI Transaction ID');
      return;
    }

    const amount = parseFloat(paymentAmount);
    setIsPaying(true);
    setPaymentMessage('Verifying UPI payment...');

    try {
      const response = await fetch('http://localhost:5000/api/students/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regNo: student.regNo,
          amount: amount,
          paymentMethod: 'UPI Payment',
          transactionId: upiTransactionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentMessage(`✓ UPI Payment verified! Transaction ID: ${data.payment.transactionId}`);
        setShowUpiDialog(false);
        setUpiTransactionId('');
        
        // Update localStorage with new payment info
        const studentData = JSON.parse(localStorage.getItem('student') || '{}');
        studentData.feeStatus = data.payment.feeStatus;
        studentData.amountPaid = data.payment.amountPaid;
        studentData.lastPaymentDate = new Date().toISOString();
        localStorage.setItem('student', JSON.stringify(studentData));
        
        // Call parent callback to refresh student data
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setPaymentMessage(`✗ Payment verification failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentMessage('✗ Payment verification failed. Please try again.');
    } finally {
      setIsPaying(false);
      setPaymentAmount('');
    }
  };

  const handleCardPayment = () => {
    const amount = parseFloat(paymentAmount);
    
    if (!amount || amount <= 0) {
      setPaymentMessage('Please enter a valid amount');
      return;
    }

    const remainingBalance = student.feeDue - student.amountPaid;
    if (amount > remainingBalance) {
      setPaymentMessage(`Amount exceeds balance due (₹${remainingBalance.toLocaleString('en-IN')})`);
      return;
    }

    setShowCardDialog(true);
    setPaymentMessage('');
  };

  const handleProcessCardPayment = async () => {
    // Validate card details
    if (!cardDetails.cardNumber || !cardDetails.cardHolderName || !cardDetails.expiryDate || !cardDetails.cvv) {
      setPaymentMessage('Please fill in all card details');
      return;
    }

    // Validate card number (basic validation - 16 digits)
    const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16 || !/^\d+$/.test(cardNumberClean)) {
      setPaymentMessage('Please enter a valid 16-digit card number');
      return;
    }

    // Validate expiry date format (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      setPaymentMessage('Please enter expiry date in MM/YY format');
      return;
    }

    // Validate CVV (3 or 4 digits)
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
      setPaymentMessage('Please enter a valid CVV (3 or 4 digits)');
      return;
    }

    const amount = parseFloat(paymentAmount);
    setIsPaying(true);
    setPaymentMessage('Processing card payment...');

    try {
      // Generate transaction ID for card payment
      const transactionId = `CARD${Date.now()}${Math.floor(Math.random() * 10000)}`;

      const response = await fetch('http://localhost:5000/api/students/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          regNo: student.regNo,
          amount: amount,
          paymentMethod: 'Card Payment',
          transactionId: transactionId,
          cardLastFour: cardNumberClean.slice(-4), // Store only last 4 digits
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentMessage(`✓ Card Payment successful! Transaction ID: ${data.payment.transactionId}`);
        setShowCardDialog(false);
        setCardDetails({
          cardNumber: '',
          cardHolderName: '',
          expiryDate: '',
          cvv: '',
        });
        
        // Update localStorage with new payment info
        const studentData = JSON.parse(localStorage.getItem('student') || '{}');
        studentData.feeStatus = data.payment.feeStatus;
        studentData.amountPaid = data.payment.amountPaid;
        studentData.lastPaymentDate = new Date().toISOString();
        localStorage.setItem('student', JSON.stringify(studentData));
        
        // Call parent callback to refresh student data
        setTimeout(() => {
          onPaymentSuccess();
        }, 2000);
      } else {
        setPaymentMessage(`✗ Payment failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Card payment error:', error);
      setPaymentMessage('✗ Card payment failed. Please try again.');
    } finally {
      setIsPaying(false);
      setPaymentAmount('');
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      console.log('Fetching payment history for:', student.regNo);
      const response = await fetch(`http://localhost:5000/api/students/${student.regNo}/payment-history`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Payment history data:', data);
      
      if (data.success) {
        setPaymentHistory(data.paymentHistory || []);
        setShowPaymentHistory(true);
      } else {
        setPaymentMessage('Failed to fetch payment history: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setPaymentMessage('Error loading payment history. Please ensure the backend server is running.');
    }
  };

  const downloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
╔════════════════════════════════════════════════════════════╗
║         COLLEGE TRANSPORT SYSTEM - PAYMENT RECEIPT         ║
╚════════════════════════════════════════════════════════════╝

Receipt Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
Time: ${new Date().toLocaleTimeString('en-IN')}

────────────────────────────────────────────────────────────

STUDENT DETAILS:
  Name           : ${student.fullName}
  Registration No: ${student.regNo}
  Email          : ${student.email}
  Phone          : ${student.phoneNumber}
  Route          : ${student.preferredRoute || student.currentRoute || student.route}

────────────────────────────────────────────────────────────

PAYMENT SUMMARY:
  Total Fee Amount    : ₹${student.feeDue?.toLocaleString('en-IN')}
  Amount Paid         : ₹${student.amountPaid?.toLocaleString('en-IN')}
  Balance Due         : ₹${(student.feeDue - student.amountPaid)?.toLocaleString('en-IN')}
  Payment Status      : ${student.feeStatus}

────────────────────────────────────────────────────────────

LAST PAYMENT DETAILS:
  Date: ${student.lastPaymentDate && student.lastPaymentDate !== 'N/A' 
    ? new Date(student.lastPaymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'No payments yet'}

────────────────────────────────────────────────────────────

This is a computer-generated receipt and does not require a signature.

For queries, contact: transport@college.edu.in
Phone: +91-1234567890

════════════════════════════════════════════════════════════
              Thank you for using our services!
════════════════════════════════════════════════════════════
`;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Transport_Receipt_${student.regNo}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    setPaymentMessage('✓ Receipt downloaded successfully!');
    setTimeout(() => setPaymentMessage(''), 3000);
  };

  const isPaid = student.feeStatus === 'Paid';
  const remainingBalance = student.feeDue - student.amountPaid;

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }} fontWeight="bold">
        <PaymentIcon sx={{ mr: 1, color: 'success.main' }} /> Transport Fees & Transactions
      </Typography>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, borderLeft: 6, borderColor: isPaid ? 'success.main' : 'error.main', bgcolor: 'white' }}>
        <Typography variant="subtitle2" color="text.secondary">Fee Details</Typography>
        
        <Box sx={{ mt: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Total Fee:</Typography>
                <Typography variant="body1" fontWeight="bold">₹{student.feeDue?.toLocaleString('en-IN')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" color="success.main">Amount Paid:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">₹{student.amountPaid?.toLocaleString('en-IN')}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Balance Due:</Typography>
                <Typography variant="h6" fontWeight="bold" color={isPaid ? 'success.dark' : 'error.dark'}>
                    {isPaid ? 'CLEARED' : `₹${remainingBalance?.toLocaleString('en-IN')}`}
                </Typography>
            </Box>
        </Box>

        <Chip 
            label={student.feeStatus === 'Paid' ? 'PAID IN FULL' : student.feeStatus === 'Partially Paid' ? 'PARTIALLY PAID' : 'PENDING'}
            color={student.feeStatus === 'Paid' ? 'success' : student.feeStatus === 'Partially Paid' ? 'warning' : 'error'}
            size="medium"
            sx={{ fontSize: '0.9rem', fontWeight: 'bold', py: 1, mb: 2 }}
        />
        
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
            Last Payment: {student.lastPaymentDate !== 'N/A' ? new Date(student.lastPaymentDate).toLocaleDateString() : 'No payments yet'}
        </Typography>

        {/* Payment Action */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            {isPaid ? (
                <Button 
                    variant="contained"
                    color="success"
                    fullWidth 
                    disabled
                    startIcon={<CheckCircleIcon />}
                    sx={{ borderRadius: 2, py: 1.5, opacity: 0.8 }}
                >
                    No Pending Dues
                </Button>
            ) : (
                <>
                    <TextField
                        label="Payment Amount"
                        type="number"
                        fullWidth
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder={`Max: ₹${remainingBalance?.toLocaleString('en-IN')}`}
                        sx={{ mb: 2 }}
                        InputProps={{
                            startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                        }}
                    />
                    
                    {/* UPI Payment Button */}
                    <Button
                        onClick={handleUpiPayment}
                        disabled={isPaying || !paymentAmount}
                        variant="contained"
                        color="primary"
                        fullWidth 
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', mb: 2 }}
                        startIcon={
                            <Box 
                                component="img" 
                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bS0yIDE1bC01LTVsMS40MS0xLjQxTDEwIDE0LjE3bDcuNTktNy41OUwxOSA4bC05IDl6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" 
                                alt="UPI" 
                                sx={{ width: 24, height: 24 }}
                            />
                        }
                    >
                        Pay with UPI (Recommended)
                    </Button>
                    
                    <Divider sx={{ my: 2 }}>
                        <Chip label="OR" size="small" />
                    </Divider>
                    
                    {/* Online Payment Button */}
                    <Button
                        onClick={handleCardPayment}
                        disabled={isPaying || !paymentAmount}
                        variant="outlined"
                        color="error"
                        fullWidth 
                        sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold' }}
                        startIcon={<CreditCardIcon />}
                    >
                        Pay with Card/Net Banking
                    </Button>
                </>
            )}
            
            {paymentMessage && (
                <Alert severity={paymentMessage.includes('✓') ? 'success' : 'error'} sx={{ mt: 2 }}>
                    {paymentMessage}
                </Alert>
            )}
        </Box>
        
        {/* Transaction History & Receipt Download */}
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            mt: 2 
        }}>
            <Button 
                variant="outlined"
                color="primary"
                fullWidth 
                startIcon={<DownloadIcon />}
                onClick={downloadReceipt}
            >
                Download Latest Receipt
            </Button>
            <Button 
                variant="outlined"
                color="info"
                fullWidth 
                startIcon={<HistoryIcon />}
                onClick={fetchPaymentHistory}
            >
                View Payment History
            </Button>
        </Box>
      </Paper>

      {/* Payment Message */}
      {paymentMessage && (
        <Paper elevation={2} sx={{ p: 2, mt: 3, borderRadius: 2, 
            bgcolor: paymentMessage.includes('successful') || paymentMessage.includes('outstanding') ? '#d1fae5' : '#dbeafe',
            color: paymentMessage.includes('successful') || paymentMessage.includes('outstanding') ? '#065f46' : '#1e40af'
        }}>
          <Typography variant="body2" fontWeight="medium">{paymentMessage}</Typography>
        </Paper>
      )}

      {/* UPI Payment Verification Dialog */}
      <Dialog 
        open={showUpiDialog} 
        onClose={() => !isPaying && setShowUpiDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}>
          UPI Payment Verification
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="medium">
              Scan the QR code or use the UPI ID to complete payment, then enter the Transaction ID below to verify.
            </Typography>
          </Alert>

          {/* UPI QR Code Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Scan to Pay with UPI
            </Typography>
            <Box
              component="img"
              src="/upi-qr-code.jpg"
              alt="UPI QR Code - Geddam Varshitha Chowdary"
              sx={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                border: 2,
                borderColor: 'primary.main',
                borderRadius: 2,
                my: 1,
                bgcolor: 'white'
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
              UPI ID: gvarshithachowdary@okicici
            </Typography>
          </Box>
          
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">Payment Details:</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Amount:</strong> ₹{paymentAmount}
            </Typography>
            <Typography variant="body2">
              <strong>UPI ID:</strong> chowdary@okicici
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> chow
            </Typography>
          </Box>

          <TextField
            label="UPI Transaction ID / Reference Number"
            placeholder="e.g., 123456789012"
            fullWidth
            value={upiTransactionId}
            onChange={(e) => setUpiTransactionId(e.target.value)}
            disabled={isPaying}
            helperText="Enter the 12-digit transaction ID from your UPI app"
            sx={{ mt: 2 }}
          />

          {paymentMessage && (
            <Alert 
              severity={paymentMessage.includes('✓') ? 'success' : 'error'} 
              sx={{ mt: 2 }}
            >
              {paymentMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setShowUpiDialog(false);
              setUpiTransactionId('');
              setPaymentMessage('');
            }}
            disabled={isPaying}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleVerifyUpiPayment}
            disabled={isPaying || !upiTransactionId.trim()}
            variant="contained"
            color="primary"
            startIcon={isPaying ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
          >
            {isPaying ? 'Verifying...' : 'Verify Payment'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Card/Net Banking Payment Dialog */}
      <Dialog 
        open={showCardDialog} 
        onClose={() => !isPaying && setShowCardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 'bold' }}>
          Card / Net Banking Payment
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="medium">
              Enter your card details to complete the payment. Your information is secure and encrypted.
            </Typography>
          </Alert>
          
          <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">Payment Amount:</Typography>
            <Typography variant="h6" sx={{ mt: 0.5, color: 'error.main', fontWeight: 'bold' }}>
              ₹{parseFloat(paymentAmount).toLocaleString('en-IN')}
            </Typography>
          </Box>

          {/* Card Number */}
          <TextField
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            fullWidth
            value={cardDetails.cardNumber}
            onChange={(e) => {
              // Format card number with spaces every 4 digits
              let value = e.target.value.replace(/\s/g, '');
              if (value.length > 16) value = value.slice(0, 16);
              const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
              setCardDetails({ ...cardDetails, cardNumber: formatted });
            }}
            disabled={isPaying}
            inputProps={{ maxLength: 19 }}
            sx={{ mb: 2 }}
            helperText="Enter 16-digit card number"
          />

          {/* Card Holder Name */}
          <TextField
            label="Card Holder Name"
            placeholder="JOHN DOE"
            fullWidth
            value={cardDetails.cardHolderName}
            onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value.toUpperCase() })}
            disabled={isPaying}
            sx={{ mb: 2 }}
            helperText="Name as shown on card"
          />

          {/* Expiry Date and CVV */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Expiry Date"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                setCardDetails({ ...cardDetails, expiryDate: value });
              }}
              disabled={isPaying}
              inputProps={{ maxLength: 5 }}
              sx={{ flex: 1 }}
              helperText="MM/YY"
            />
            <TextField
              label="CVV"
              placeholder="123"
              type="password"
              value={cardDetails.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 4) {
                  setCardDetails({ ...cardDetails, cvv: value });
                }
              }}
              disabled={isPaying}
              inputProps={{ maxLength: 4 }}
              sx={{ flex: 1 }}
              helperText="3-4 digits"
            />
          </Box>

          <Alert severity="warning" icon={false} sx={{ mt: 2, fontSize: '0.75rem' }}>
            🔒 Your card information is encrypted and secure. We never store your full card details.
          </Alert>

          {paymentMessage && (
            <Alert 
              severity={paymentMessage.includes('✓') ? 'success' : 'error'} 
              sx={{ mt: 2 }}
            >
              {paymentMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => {
              setShowCardDialog(false);
              setCardDetails({
                cardNumber: '',
                cardHolderName: '',
                expiryDate: '',
                cvv: '',
              });
              setPaymentMessage('');
            }}
            disabled={isPaying}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcessCardPayment}
            disabled={isPaying}
            variant="contained"
            color="error"
            startIcon={isPaying ? <CircularProgress size={20} color="inherit" /> : <CreditCardIcon />}
          >
            {isPaying ? 'Processing...' : `Pay ₹${paymentAmount}`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment History Dialog */}
      <Dialog 
        open={showPaymentHistory} 
        onClose={() => setShowPaymentHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 'bold' }}>
          Payment History
        </DialogTitle>
        <DialogContent sx={{ mt: 3 }}>
          {paymentHistory.length === 0 ? (
            <Alert severity="info">
              <Typography variant="body2">
                No payment history found. Make your first payment to see it here.
              </Typography>
            </Alert>
          ) : (
            <>
              <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Fee</Typography>
                    <Typography variant="h6" fontWeight="bold">₹{student.feeDue?.toLocaleString('en-IN')}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Total Paid</Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      ₹{student.amountPaid?.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Balance Due</Typography>
                    <Typography variant="h6" fontWeight="bold" color="error.main">
                      ₹{(student.feeDue - student.amountPaid)?.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      <Chip 
                        label={student.feeStatus} 
                        size="small"
                        color={student.feeStatus === 'Paid' ? 'success' : student.feeStatus === 'Partially Paid' ? 'warning' : 'error'}
                      />
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell><strong>Date</strong></TableCell>
                      <TableCell><strong>Transaction ID</strong></TableCell>
                      <TableCell><strong>Method</strong></TableCell>
                      <TableCell align="right"><strong>Amount</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paymentHistory.map((payment, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          {new Date(payment.paymentDate).toLocaleDateString('en-IN', { 
                            day: '2-digit', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {payment.transactionId}
                          </Typography>
                          {payment.cardLastFour && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              Card ending in {payment.cardLastFour}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.paymentMethod} 
                            size="small" 
                            variant="outlined"
                            color={payment.paymentMethod === 'UPI Payment' ? 'primary' : 'secondary'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            ₹{payment.amount?.toLocaleString('en-IN')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 2, border: 1, borderColor: 'success.main' }}>
                <Typography variant="body2" color="success.dark">
                  <strong>Total Transactions:</strong> {paymentHistory.length} | 
                  <strong> Total Amount Paid:</strong> ₹{student.amountPaid?.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setShowPaymentHistory(false)}
            variant="contained"
            color="info"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


// --- Main Application Component ---
const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Fetch notifications from backend
  const fetchNotifications = async (route: string, regNo?: string) => {
    try {
      console.log('📢 Student - Fetching notifications for route:', route, 'RegNo:', regNo);
      
      let url = `http://localhost:5000/api/students/notifications/route?route=${encodeURIComponent(route)}&audience=students`;
      if (regNo) {
        url += `&regNo=${encodeURIComponent(regNo)}`;
      }
      
      const response = await fetch(url);
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Student - Received notifications:', data.notifications.length);
        setNotifications(data.notifications);
      } else {
        console.error('❌ Student - Failed to fetch notifications:', data.message);
        setNotifications([]);
      }
    } catch (error) {
      console.error('❌ Student - Error fetching notifications:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    // Get student data from localStorage
    const studentData = localStorage.getItem('student');
    if (!studentData) {
      // If no student data, redirect to login
      navigate('/login');
      return;
    }

    try {
      const parsedStudent = JSON.parse(studentData);
      // Transform backend data to match dashboard structure
      const dashboardStudent = {
        isRegistered: true,
        regNo: parsedStudent.regNo,
        name: parsedStudent.fullName,
        year: parsedStudent.studyingYear,
        currentRoute: parsedStudent.preferredRoute || 'Route not assigned',
        route: parsedStudent.preferredRoute || 'Route not assigned', // Add route field for consistency
        pickupPoint: parsedStudent.pickupPoint || null,
        pickupPointId: parsedStudent.pickupPointId || null,
        driverName: 'To be assigned',
        driverPhone: 'To be assigned',
        timing: '7:45 AM', // Default timing, can be made dynamic
        expectedArrival: '7:35 AM',
        busLocation: 'Bus not started',
        feeDue: parsedStudent.routeFee || 35000, // Use the route-specific fee from backend
        feeStatus: parsedStudent.feeStatus || 'Pending',
        amountPaid: parsedStudent.amountPaid || 0,
        lastPaymentDate: parsedStudent.lastPaymentDate || 'N/A',
        email: parsedStudent.email,
        hasPaid: parsedStudent.feeStatus === 'Paid', // Check if fee is fully paid
      };
      
      console.log('📋 Student Dashboard - Loaded student data:', {
        name: dashboardStudent.name,
        route: dashboardStudent.route,
        currentRoute: dashboardStudent.currentRoute
      });
      
      setStudent(dashboardStudent);
      setLoading(false);
      
      // Fetch notifications for the student's route with regNo for specific notifications
      if (parsedStudent.preferredRoute) {
        fetchNotifications(parsedStudent.preferredRoute, parsedStudent.regNo);
      }
    } catch (error) {
      console.error('Error parsing student data:', error);
      navigate('/login');
    }
  }, [navigate]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleRegistration = () => {
    // Mock completion of registration and switch to fees tab
    setStudent((prev: any) => ({ ...prev, isRegistered: true, feeStatus: 'Pending Initial Payment' }));
    setActiveTab('fees'); 
  };

  const handlePickupPointUpdate = (pickupPoint: string, pickupPointId: number) => {
    // Update student data in state and localStorage
    setStudent((prev: any) => ({ 
      ...prev, 
      pickupPoint: pickupPoint,
      pickupPointId: pickupPointId
    }));
    
    // Update localStorage
    const studentData = localStorage.getItem('student');
    if (studentData) {
      const parsedStudent = JSON.parse(studentData);
      parsedStudent.pickupPoint = pickupPoint;
      parsedStudent.pickupPointId = pickupPointId;
      localStorage.setItem('student', JSON.stringify(parsedStudent));
    }
  };

  const handlePaymentSuccess = () => {
    // Reload student data after successful payment
    setLoading(true);
    const studentData = localStorage.getItem('student');
    if (studentData) {
      try {
        const parsedStudent = JSON.parse(studentData);
        const dashboardStudent = {
          isRegistered: true,
          regNo: parsedStudent.regNo,
          name: parsedStudent.fullName,
          year: parsedStudent.studyingYear,
          currentRoute: parsedStudent.preferredRoute || 'Route not assigned',
          route: parsedStudent.preferredRoute || 'Route not assigned', // Add route field for consistency
          pickupPoint: parsedStudent.pickupPoint || null,
          pickupPointId: parsedStudent.pickupPointId || null,
          driverName: 'To be assigned',
          driverPhone: 'To be assigned',
          timing: '7:45 AM',
          expectedArrival: '7:35 AM',
          busLocation: 'Bus not started',
          feeDue: parsedStudent.routeFee || 35000,
          feeStatus: parsedStudent.feeStatus || 'Pending',
          amountPaid: parsedStudent.amountPaid || 0,
          lastPaymentDate: parsedStudent.lastPaymentDate || 'N/A',
          email: parsedStudent.email,
          hasPaid: parsedStudent.feeStatus === 'Paid',
        };
        setStudent(dashboardStudent);
        setLoading(false);
        
        // Refetch notifications after payment update
        if (parsedStudent.preferredRoute) {
          fetchNotifications(parsedStudent.preferredRoute, parsedStudent.regNo);
        }
      } catch (error) {
        console.error('Error refreshing student data:', error);
      }
    }
  };

  const handleLogout = () => {
    // Clear localStorage and navigate to login
    localStorage.removeItem('student');
    navigate('/login');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!student) {
    return null;
  }

  const renderContent = () => {
    if (!student.isRegistered && activeTab !== 'home' && activeTab !== 'route') {
        // Force unregistered user to register if they try to access sensitive tabs
        return <RegistrationPrompt onRegisterClick={handleRegistration} />;
    }
    
    // Check payment status for restricted features
    const requiresPayment = ['route', 'live-track', 'notifications'].includes(activeTab);
    if (requiresPayment && !student.hasPaid) {
        return <PaymentRequired student={student} onPayNowClick={() => setActiveTab('fees')} />;
    }
    
    switch (activeTab) {
      case 'home':
        return <HomeSummary student={student} setActiveTab={setActiveTab} notifications={notifications} />;
      case 'route':
        return <RouteDetails student={student} onRegisterClick={handleRegistration} onPickupPointUpdate={handlePickupPointUpdate} />;
      case 'live-track':
        return <LiveTracking student={student} />;
      case 'fees':
        return <FeesAndPayments student={student} onPaymentSuccess={handlePaymentSuccess} />;
      case 'notifications':
        return <Notifications notifications={notifications} />;
      default:
        return <HomeSummary student={student} setActiveTab={setActiveTab} notifications={notifications} />;
    }
  };

  const navItems = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'route', name: 'Route Info', icon: RouteIcon },
    { id: 'live-track', name: 'Live Tracking', icon: BusIcon },
    { id: 'fees', name: 'Fees & Payments', icon: PaymentIcon },
    { id: 'notifications', name: 'Alerts', icon: NotificationsIcon },
  ];
  
  return (
    // Main Container/Background
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6f8', p: { xs: 2, sm: 4 }, fontFamily: 'Roboto, sans-serif' }}>
      
      {/* Header Card (Student Info) - Attractive Container */}
      <Paper elevation={8} sx={{ p: 3, mb: 4, borderRadius: 4, 
          background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)', // Blue Gradient Background
          color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountIcon sx={{ fontSize: 48, color: 'white', bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', mr: 2, p: 0.5 }} />
                <Box>
                    <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>{student.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>{student.regNo} | {student.year}</Typography>
                </Box>
            </Box>
            <Button 
              color="inherit" 
              size="small" 
              variant="outlined" 
              sx={{ borderColor: 'white', color: 'white' }}
              onClick={handleLogout}
            >
                Log Out
            </Button>
        </Box>
      </Paper>

      {/* Main Content Area (Tabs) - Attractive Container */}
      <Paper elevation={8} sx={{ borderRadius: 4, bgcolor: 'white' }}>
        
        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', borderTopLeftRadius: 4, borderTopRightRadius: 4 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange} 
            variant="scrollable" 
            scrollButtons="auto" 
            allowScrollButtonsMobile
          >
            {navItems.map(item => (
              <Tab 
                key={item.id} 
                label={item.name} 
                value={item.id} 
                icon={<item.icon />} 
                iconPosition="start"
                sx={{ minHeight: 64, fontWeight: 'bold' }}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: '#ffffff', borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }}>
          {renderContent()}
        </Box>
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
