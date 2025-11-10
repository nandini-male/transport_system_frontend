import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  DirectionsBus,
  AttachMoney,
  Close as CloseIcon,
  People,
  Campaign,
  Logout,
  Route as RouteIcon,
  Groups,
  AccountBalanceWallet,
  Warning,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Refresh,
} from '@mui/icons-material';

function AdminDashboard() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('Dashboard');
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [driverIssues, setDriverIssues] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingRegistrations: 0,
    activeRoutes: 0,
    feesCollected: 0,
  });
  const [feeStats, setFeeStats] = useState({
    paidInFull: 0,
    partiallyPaid: 0,
    pending: 0,
    totalCollected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showApprovedStudents, setShowApprovedStudents] = useState(false);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Notification states
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    targetAudience: 'all',
    targetRoute: [] as string[], // Changed to array for multiple routes
    priority: 'normal',
    type: 'info',
  });

  const handleLogout = () => {
    navigate('/admin-login');
  };

  // Fetch pending registrations and stats
  useEffect(() => {
    fetchPendingRegistrations();
    fetchStats();
    fetchDriverIssues();
    if (selectedMenu === 'Fees Management') {
      fetchAllStudents();
    }
    if (selectedMenu === 'Pending Requests') {
      fetchPendingRegistrations();
    }
  }, [selectedMenu]);

  const fetchAllStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching all students for fee management...');
      
      const response = await fetch('http://localhost:5000/api/admin/students/all');
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Students data received:', data);
      
      if (data.success) {
        setAllStudents(data.students);
        
        // Calculate fee statistics
        const paidInFull = data.students.filter((s: any) => s.feeStatus === 'Paid').length;
        const partiallyPaid = data.students.filter((s: any) => s.feeStatus === 'Partially Paid').length;
        const pending = data.students.filter((s: any) => s.feeStatus === 'Pending').length;
        const totalCollected = data.students.reduce((sum: number, s: any) => sum + (s.amountPaid || 0), 0);
        
        setFeeStats({
          paidInFull,
          partiallyPaid,
          pending,
          totalCollected,
        });
        
        console.log('Fee stats calculated:', { paidInFull, partiallyPaid, pending, totalCollected });
      } else {
        console.error('API returned success: false', data);
        setMessage({ type: 'error', text: data.message || 'Failed to fetch student fee data' });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setMessage({ type: 'error', text: `Failed to fetch student fee data: ${error}` });
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRegistrations = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching pending registrations...');
      const response = await fetch('http://localhost:5000/api/admin/registrations/pending');
      const data = await response.json();
      console.log('📊 Pending registrations response:', data);
      if (data.success) {
        setPendingRegistrations(data.registrations);
        console.log(`✅ Found ${data.registrations.length} pending registration(s)`);
      } else {
        console.log('❌ Failed to fetch pending registrations:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching pending registrations:', error);
      setMessage({ type: 'error', text: 'Failed to fetch pending registrations' });
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverIssues = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/driver-issues');
      const data = await response.json();
      if (data.success) {
        setDriverIssues(data.issues);
      }
    } catch (error) {
      console.error('Error fetching driver issues:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchApprovedStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/students/all');
      const data = await response.json();
      if (data.success) {
        setApprovedStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching approved students:', error);
      setMessage({ type: 'error', text: 'Failed to fetch approved students' });
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleStudents = () => {
    if (!showApprovedStudents) {
      fetchApprovedStudents();
    }
    setShowApprovedStudents(!showApprovedStudents);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/admin/registrations/${id}/approve`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Student approved successfully!' });
        fetchPendingRegistrations();
        fetchStats();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      setMessage({ type: 'error', text: 'Failed to approve registration' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this registration?')) {
      return;
    }
    setActionLoading(id);
    setMessage({ type: '', text: '' });
    try {
      const response = await fetch(`http://localhost:5000/api/admin/registrations/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Registration rejected successfully!' });
        fetchPendingRegistrations();
        fetchStats();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      setMessage({ type: 'error', text: 'Failed to reject registration' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateIssueStatus = async (issueId: string, status: string) => {
    setActionLoading(issueId);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/driver-issues/${issueId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Issue status updated successfully!' });
        fetchDriverIssues();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      setMessage({ type: 'error', text: 'Failed to update issue status' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      setMessage({ type: 'error', text: 'Title and message are required' });
      return;
    }

    if (notificationForm.targetAudience === 'route-specific' && notificationForm.targetRoute.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one route for route-specific notifications' });
      return;
    }

    setActionLoading('send-notification');
    try {
      // If multiple routes selected, send notification to each route
      if (notificationForm.targetAudience === 'route-specific' && notificationForm.targetRoute.length > 0) {
        const promises = notificationForm.targetRoute.map(route => 
          fetch('http://localhost:5000/api/admin/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...notificationForm,
              targetRoute: route,
            }),
          })
        );
        
        await Promise.all(promises);
        setMessage({ type: 'success', text: `Notification sent to ${notificationForm.targetRoute.length} route(s) successfully!` });
      } else {
        // Single notification for all/drivers/students
        const response = await fetch('http://localhost:5000/api/admin/notifications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...notificationForm,
            targetRoute: undefined, // Not needed for non-route-specific
          }),
        });
        const data = await response.json();
        if (data.success) {
          setMessage({ type: 'success', text: 'Notification sent successfully!' });
        } else {
          setMessage({ type: 'error', text: data.message });
        }
      }
      
      // Reset form
      setNotificationForm({
        title: '',
        message: '',
        targetAudience: 'all',
        targetRoute: [],
        priority: 'normal',
        type: 'info',
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessage({ type: 'error', text: 'Failed to send notification' });
    } finally {
      setActionLoading(null);
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
    { text: 'Pending Requests', icon: <HourglassEmpty /> },
    { text: 'Driver Issues', icon: <Warning /> },
    { text: 'Routes & Drivers', icon: <DirectionsBus /> },
    { text: 'Send Notifications', icon: <Campaign /> },
    { text: 'Fees Management', icon: <AttachMoney /> },
    { text: 'Attendance', icon: <People /> },
  ];

  const statsData = [
    {
      label: 'ACTIVE ROUTES',
      value: stats.activeRoutes.toString(),
      icon: <RouteIcon sx={{ fontSize: 28, color: '#818cf8' }} />,
      bgColor: '#ffffffff',
      borderColor: '#c7d2fe',
    },
    {
      label: 'TOTAL STUDENTS',
      value: stats.totalStudents.toString(),
      icon: <Groups sx={{ fontSize: 28, color: '#34d399' }} />,
      bgColor: '#d1fae5',
      borderColor: '#a7f3d0',
    },
    {
      label: 'FEES COLLECTED',
      value: `${stats.feesCollected}%`,
      icon: <AccountBalanceWallet sx={{ fontSize: 28, color: '#fbbf24' }} />,
      bgColor: '#fef3c7',
      borderColor: '#fde68a',
    },
    {
      label: 'PENDING REGISTRATIONS',
      value: stats.pendingRegistrations.toString(),
      icon: <Warning sx={{ fontSize: 28, color: '#fb7185' }} />,
      bgColor: '#ffe4e6',
      borderColor: '#fecdd3',
    },
  ];



  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafbff' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#ffffffff',
            borderRight: '1px solid #e8ecf7',
          },
        }}
      >
        {/* Logo/Brand */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderBottom: '1px solid #f0f4ff',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'linear-gradient(135deg, #a5b4fc 0%, #c7d2fe 100%)',
              background: 'linear-gradient(135deg, #a5b4fc 0%, #c7d2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            📦
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#4f46e5',
              fontSize: '1.1rem',
            }}
          >
            CTMS Admin
          </Typography>
        </Box>

        {/* Menu Items */}
        <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedMenu === item.text}
                onClick={() => setSelectedMenu(item.text)}
                sx={{
                  borderRadius: '12px',
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)',
                    background: 'linear-gradient(135deg, #818cf8 0%, #a5b4fc 100%)',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                      background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#fff',
                    },
                  },
                  '&:hover': {
                    bgcolor: '#f5f7ff',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selectedMenu === item.text ? '#fff' : '#818cf8',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                    fontWeight: selectedMenu === item.text ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Sign Out Button */}
        <Box sx={{ p: 2, borderTop: '1px solid #f0f4ff' }}>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '12px',
              py: 1.5,
              color: '#f87171',
              '&:hover': {
                bgcolor: '#fef2f2',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: '#f87171' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          bgcolor: '#fafbff',
        }}
      >
        <Container maxWidth="xl">
          {/* Page Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: '#4f46e5',
              mb: 4,
            }}
          >
            {selectedMenu === 'Driver Issues' ? 'Driver Issues' : 
             selectedMenu === 'Routes & Drivers' ? 'Routes & Drivers' : 
             selectedMenu === 'Fees Management' ? 'Fees Management' :
             selectedMenu === 'Send Notifications' ? 'Send Notifications' :
             selectedMenu === 'Pending Requests' ? 'Pending Requests' :
             'System Overview'}
          </Typography>

          {/* Routes & Drivers Section */}
          {selectedMenu === 'Routes & Drivers' ? (
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.08)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#4f46e5',
                  mb: 3,
                }}
              >
                Active Routes and Assigned Drivers
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9ff' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Route Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Driver Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Contact Email</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Bus Number</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Total Students</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Stops</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          Tenali - MG Road - College
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Via: Tenali → MG Road → Kothapet → Vadlamudi
                        </Typography>
                      </TableCell>
                      <TableCell>Satish Kumar</TableCell>
                      <TableCell>driver1@ctms.com</TableCell>
                      <TableCell>AP-16-TC-1234</TableCell>
                      <TableCell>45</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          size="small"
                          sx={{ 
                            bgcolor: '#d1fae5', 
                            color: '#10b981',
                            fontWeight: 600 
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          Guntur - Mangalagiri - College
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Via: Guntur → Mangalagiri → Tadepalli → Vadlamudi
                        </Typography>
                      </TableCell>
                      <TableCell>Ramesh Babu</TableCell>
                      <TableCell>driver2@ctms.com</TableCell>
                      <TableCell>AP-16-TC-2345</TableCell>
                      <TableCell>38</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          size="small"
                          sx={{ 
                            bgcolor: '#d1fae5', 
                            color: '#10b981',
                            fontWeight: 600 
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          Vijayawada - Benz Circle - College
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Via: VJA Station → Benz Circle → Tadepalli → Vadlamudi
                        </Typography>
                      </TableCell>
                      <TableCell>Krishna Reddy</TableCell>
                      <TableCell>driver3@ctms.com</TableCell>
                      <TableCell>AP-16-TC-3456</TableCell>
                      <TableCell>52</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          size="small"
                          sx={{ 
                            bgcolor: '#d1fae5', 
                            color: '#10b981',
                            fontWeight: 600 
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          Namburu - Pedakakani - College
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Via: Namburu → Pedakakani → Mangalagiri Rd → Vadlamudi
                        </Typography>
                      </TableCell>
                      <TableCell>Venkat Rao</TableCell>
                      <TableCell>driver4@ctms.com</TableCell>
                      <TableCell>AP-16-TC-4567</TableCell>
                      <TableCell>41</TableCell>
                      <TableCell>4</TableCell>
                      <TableCell>
                        <Chip 
                          label="Active" 
                          size="small"
                          sx={{ 
                            bgcolor: '#d1fae5', 
                            color: '#10b981',
                            fontWeight: 600 
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9ff', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Total Routes:</strong> 4 active routes<br />
                  <strong>Total Drivers:</strong> 4 drivers assigned<br />
                  <strong>Total Capacity:</strong> 176 students across all routes
                </Typography>
              </Box>
            </Paper>
          ) : selectedMenu === 'Driver Issues' ? (
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.08)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#4f46e5',
                  mb: 3,
                }}
              >
                Reported Issues from Drivers
              </Typography>

              {message.text && (
                <Alert severity={message.type as any} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              {driverIssues.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No driver issues reported
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f8f9ff' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Driver</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Bus</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Route</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Issue</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {driverIssues.map((issue: any) => (
                        <TableRow key={issue._id} hover>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {issue.driverName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {issue.driverEmail}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{issue.busNumber}</TableCell>
                          <TableCell sx={{ maxWidth: 150 }}>
                            <Typography variant="body2" noWrap>
                              {issue.route}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={issue.category || 'Other'} 
                              size="small"
                              sx={{ 
                                bgcolor: '#dbeafe', 
                                color: '#1e40af',
                                fontWeight: 600 
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ maxWidth: 200 }}>
                            <Typography variant="body2" noWrap title={issue.message}>
                              {issue.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(issue.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(issue.createdAt).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={issue.status} 
                              size="small"
                              sx={{ 
                                bgcolor: issue.status === 'pending' ? '#fef3c7' : 
                                        issue.status === 'in-progress' ? '#dbeafe' :
                                        issue.status === 'resolved' ? '#d1fae5' : '#f3f4f6',
                                color: issue.status === 'pending' ? '#f59e0b' : 
                                       issue.status === 'in-progress' ? '#3b82f6' :
                                       issue.status === 'resolved' ? '#10b981' : '#6b7280',
                                fontWeight: 600,
                                textTransform: 'capitalize'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                              {issue.status === 'pending' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={actionLoading === issue._id}
                                  onClick={() => handleUpdateIssueStatus(issue._id, 'in-progress')}
                                  sx={{
                                    bgcolor: '#3b82f6',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                      bgcolor: '#2563eb',
                                    },
                                  }}
                                >
                                  {actionLoading === issue._id ? 'Processing...' : 'In Progress'}
                                </Button>
                              )}
                              {issue.status === 'in-progress' && (
                                <Button
                                  size="small"
                                  variant="contained"
                                  disabled={actionLoading === issue._id}
                                  onClick={() => handleUpdateIssueStatus(issue._id, 'resolved')}
                                  sx={{
                                    bgcolor: '#10b981',
                                    color: '#fff',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                      bgcolor: '#059669',
                                    },
                                  }}
                                >
                                  {actionLoading === issue._id ? 'Resolving...' : 'Mark Resolved'}
                                </Button>
                              )}
                              {issue.status === 'resolved' && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  disabled={actionLoading === issue._id}
                                  onClick={() => handleUpdateIssueStatus(issue._id, 'closed')}
                                  sx={{
                                    borderColor: '#6b7280',
                                    color: '#6b7280',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    '&:hover': {
                                      borderColor: '#4b5563',
                                      bgcolor: '#f9fafb',
                                    },
                                  }}
                                >
                                  {actionLoading === issue._id ? 'Closing...' : 'Close'}
                                </Button>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          ) : selectedMenu === 'Send Notifications' ? (
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(79, 70, 229, 0.08)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#4f46e5',
                  mb: 3,
                }}
              >
                Send Notifications to Drivers & Students
              </Typography>

              {message.text && (
                <Alert severity={message.type as any} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}

              <Box component="form" sx={{ maxWidth: 600 }}>
                {/* Title */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Notification Title *
                  </Typography>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    placeholder="Enter notification title"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                  />
                </Box>

                {/* Message */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Message *
                  </Typography>
                  <textarea
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({ ...notificationForm, message: e.target.value })}
                    placeholder="Enter your message"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </Box>

                {/* Target Audience */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Send To *
                  </Typography>
                  <select
                    value={notificationForm.targetAudience}
                    onChange={(e) => setNotificationForm({ ...notificationForm, targetAudience: e.target.value, targetRoute: [] })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                  >
                    <option value="all">Everyone (All Drivers & Students)</option>
                    <option value="drivers">All Drivers</option>
                    <option value="students">All Students</option>
                    <option value="route-specific">Specific Route(s)</option>
                  </select>
                </Box>

                {/* Route Selection (conditional) - Now with Checkboxes */}
                {notificationForm.targetAudience === 'route-specific' && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Select Route(s) *
                    </Typography>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        bgcolor: '#f9fafb'
                      }}
                    >
                      <FormGroup>
                        {[
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
                        ].map((route) => (
                          <FormControlLabel
                            key={route}
                            control={
                              <Checkbox
                                checked={notificationForm.targetRoute.includes(route)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNotificationForm({
                                      ...notificationForm,
                                      targetRoute: [...notificationForm.targetRoute, route]
                                    });
                                  } else {
                                    setNotificationForm({
                                      ...notificationForm,
                                      targetRoute: notificationForm.targetRoute.filter(r => r !== route)
                                    });
                                  }
                                }}
                                sx={{
                                  color: '#4f46e5',
                                  '&.Mui-checked': {
                                    color: '#4f46e5',
                                  },
                                }}
                              />
                            }
                            label={
                              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                {route}
                              </Typography>
                            }
                          />
                        ))}
                      </FormGroup>
                      {notificationForm.targetRoute.length > 0 && (
                        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                          <Typography variant="caption" color="primary" fontWeight="bold">
                            {notificationForm.targetRoute.length} route(s) selected
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                )}

                {/* Priority */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Priority
                  </Typography>
                  <select
                    value={notificationForm.priority}
                    onChange={(e) => setNotificationForm({ ...notificationForm, priority: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </Box>

                {/* Type */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Type
                  </Typography>
                  <select
                    value={notificationForm.type}
                    onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px',
                    }}
                  >
                    <option value="info">Information</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success/Good News</option>
                    <option value="urgent">Urgent Alert</option>
                  </select>
                </Box>

                {/* Submit Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSendNotification}
                  disabled={actionLoading === 'send-notification'}
                  sx={{
                    bgcolor: '#4f46e5',
                    color: 'white',
                    py: 1.5,
                    textTransform: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: '#4338ca',
                    },
                  }}
                >
                  {actionLoading === 'send-notification' ? 'Sending...' : 'Send Notification'}
                </Button>
              </Box>

              {/* Info Box */}
              <Box sx={{ mt: 4, p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bfdbfe' }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Note:</strong> Notifications will be immediately visible to the selected audience.
                  Drivers and students will see them in their notification panels.
                </Typography>
              </Box>
            </Paper>
          ) : selectedMenu === 'Fees Management' ? (
            <>
              {/* Fee Statistics Cards */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: '1fr 1fr',
                    md: 'repeat(4, 1fr)',
                  },
                  gap: 3,
                  mb: 4,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: '#d1fae5',
                    border: '2px solid #a7f3d0',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.75rem' }}>
                    PAID IN FULL
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mt: 1 }}>
                    {feeStats.paidInFull}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: '#fef3c7',
                    border: '2px solid #fde68a',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.75rem' }}>
                    PARTIALLY PAID
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mt: 1 }}>
                    {feeStats.partiallyPaid}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: '#ffe4e6',
                    border: '2px solid #fecdd3',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.75rem' }}>
                    PENDING
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', mt: 1 }}>
                    {feeStats.pending}
                  </Typography>
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    bgcolor: '#dbeafe',
                    border: '2px solid #bfdbfe',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600, fontSize: '0.75rem' }}>
                    TOTAL COLLECTED
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6', mt: 1 }}>
                    ₹{feeStats.totalCollected.toLocaleString('en-IN')}
                  </Typography>
                </Paper>
              </Box>

              {/* Fee Payment Records Table */}
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: '16px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e8ecf7',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#4f46e5',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <AttachMoney /> Fee Payment Records
                </Typography>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : allStudents.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No student records found
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8f9ff' }}>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Reg No</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Student Name</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Route</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Total Fee</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Amount Paid</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Balance</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Last Payment</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allStudents.map((student: any) => {
                          const balance = student.feeDue - student.amountPaid;
                          const percentPaid = ((student.amountPaid / student.feeDue) * 100).toFixed(0);
                          
                          return (
                            <TableRow key={student._id} hover>
                              <TableCell>
                                <Chip 
                                  label={student.regNo} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: '#e0e7ff', 
                                    color: '#4f46e5',
                                    fontWeight: 600 
                                  }}
                                />
                              </TableCell>
                              <TableCell>{student.fullName}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                  {student.preferredRoute}
                                </Typography>
                              </TableCell>
                              <TableCell>₹{student.feeDue?.toLocaleString('en-IN')}</TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                  ₹{student.amountPaid?.toLocaleString('en-IN')}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: balance === 0 ? '#10b981' : '#ef4444',
                                    fontWeight: 600 
                                  }}
                                >
                                  {balance === 0 ? 'CLEARED' : `₹${balance.toLocaleString('en-IN')}`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={student.feeStatus === 'Paid' ? 'Paid' : student.feeStatus === 'Partially Paid' ? `${percentPaid}% paid` : 'Pending'}
                                  size="small"
                                  sx={{ 
                                    bgcolor: student.feeStatus === 'Paid' ? '#d1fae5' : student.feeStatus === 'Partially Paid' ? '#fef3c7' : '#ffe4e6',
                                    color: student.feeStatus === 'Paid' ? '#10b981' : student.feeStatus === 'Partially Paid' ? '#f59e0b' : '#ef4444',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {student.lastPaymentDate && student.lastPaymentDate !== 'N/A' 
                                    ? new Date(student.lastPaymentDate).toLocaleDateString('en-IN')
                                    : 'No payment yet'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </>
          ) : (
            <>
          {/* Stats Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: 'repeat(4, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            {statsData.map((stat, index) => (
              <Paper
                key={index}
                elevation={0}
                onClick={
                  stat.label === 'TOTAL STUDENTS' ? handleToggleStudents : 
                  stat.label === 'ACTIVE ROUTES' ? () => setSelectedMenu('Routes & Drivers') :
                  stat.label === 'FEES COLLECTED' ? () => setSelectedMenu('Fees Management') :
                  stat.label === 'PENDING REGISTRATIONS' ? () => setSelectedMenu('Pending Requests') :
                  undefined
                }
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: stat.bgColor,
                  border: `2px solid ${stat.borderColor}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  cursor: (stat.label === 'TOTAL STUDENTS' || stat.label === 'ACTIVE ROUTES' || stat.label === 'FEES COLLECTED' || stat.label === 'PENDING REGISTRATIONS') ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': (stat.label === 'TOTAL STUDENTS' || stat.label === 'ACTIVE ROUTES' || stat.label === 'FEES COLLECTED' || stat.label === 'PENDING REGISTRATIONS') ? {
                    transform: 'translateY(-4px)',
                    boxShadow: stat.label === 'TOTAL STUDENTS' ? '0 8px 16px rgba(52, 211, 153, 0.3)' : 
                                stat.label === 'ACTIVE ROUTES' ? '0 8px 16px rgba(129, 140, 248, 0.3)' :
                                stat.label === 'FEES COLLECTED' ? '0 8px 16px rgba(251, 191, 36, 0.3)' :
                                '0 8px 16px rgba(251, 113, 133, 0.3)',
                  } : {},
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b7280',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {stat.label}
                  </Typography>
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#4f46e5',
                  }}
                >
                  {stat.value}
                </Typography>
              </Paper>
            ))}
          </Box>

          {/* Approved Students Section - Shows when Total Students is clicked */}
          {showApprovedStudents && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: '16px',
                bgcolor: '#ffffff',
                border: '2px solid #a7f3d0',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Groups /> Approved Students ({approvedStudents.length})
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleToggleStudents}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      borderColor: '#059669',
                      bgcolor: '#ecfdf5',
                    },
                  }}
                >
                  Hide
                </Button>
              </Box>

              {loadingStudents ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : approvedStudents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No approved students found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f0fdf4' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Reg No</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Phone</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Year</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Route</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#10b981' }}>Fee Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {approvedStudents.map((student: any) => (
                        <TableRow key={student._id} hover>
                          <TableCell>
                            <Chip 
                              label={student.regNo} 
                              size="small"
                              sx={{ 
                                bgcolor: '#d1fae5', 
                                color: '#10b981',
                                fontWeight: 600 
                              }}
                            />
                          </TableCell>
                          <TableCell>{student.fullName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.phoneNumber}</TableCell>
                          <TableCell>{student.studyingYear || 'N/A'}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {student.preferredRoute}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={student.feeStatus || 'Pending'}
                              size="small"
                              sx={{ 
                                bgcolor: student.feeStatus === 'Paid' ? '#d1fae5' : student.feeStatus === 'Partially Paid' ? '#fef3c7' : '#ffe4e6',
                                color: student.feeStatus === 'Paid' ? '#10b981' : student.feeStatus === 'Partially Paid' ? '#f59e0b' : '#ef4444',
                                fontWeight: 600 
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          )}

          {/* Pending Requests Section */}
          {selectedMenu === 'Pending Requests' && (
            <>
              {message.text && (
                <Alert 
                  severity={message.type as 'success' | 'error'} 
                  sx={{ mt: 3, borderRadius: '12px' }}
                  onClose={() => setMessage({ type: '', text: '' })}
                >
                  {message.text}
                </Alert>
              )}

              {/* Summary Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mt: 2,
                  borderRadius: '16px',
                  bgcolor: '#fef3c7',
                  border: '2px solid #fde68a',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '12px',
                    bgcolor: '#fbbf24',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <HourglassEmpty sx={{ fontSize: 32, color: '#fff' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="#92400e">
                    {pendingRegistrations.length}
                  </Typography>
                  <Typography variant="body1" color="#92400e" fontWeight={500}>
                    {pendingRegistrations.length === 1 ? 'Pending Request' : 'Pending Requests'}
                  </Typography>
                </Box>
                {!loading && pendingRegistrations.length > 0 && (
                  <Chip 
                    label="Action Required" 
                    sx={{ 
                      bgcolor: '#ef4444', 
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 1 },
                        '50%': { opacity: 0.7 },
                      },
                    }}
                  />
                )}
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  mt: 4,
                  borderRadius: '16px',
                  bgcolor: '#ffffff',
                  border: '1px solid #e8ecf7',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#4f46e5',
                    }}
                  >
                    Student Registration Requests
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={16} /> : <Refresh />}
                    onClick={fetchPendingRegistrations}
                    disabled={loading}
                    sx={{
                      borderColor: '#4f46e5',
                      color: '#4f46e5',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#3730a3',
                        bgcolor: '#f0f4ff',
                      },
                    }}
                  >
                    Refresh
                  </Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : pendingRegistrations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No pending registrations at the moment. All requests have been processed! 🎉
                    </Typography>
                  </Box>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ bgcolor: '#f8f9ff' }}>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Reg No</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Full Name</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Phone</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Year</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Route</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#4f46e5' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingRegistrations.map((registration: any) => (
                          <TableRow key={registration._id} hover>
                            <TableCell>{registration.regNo}</TableCell>
                            <TableCell>{registration.fullName}</TableCell>
                            <TableCell>{registration.email}</TableCell>
                            <TableCell>{registration.phoneNumber}</TableCell>
                            <TableCell>{registration.studyingYear}</TableCell>
                            <TableCell>{registration.preferredRoute}</TableCell>
                            <TableCell>
                              <Chip 
                                label="Pending" 
                                size="small"
                                sx={{ 
                                  bgcolor: '#ffe4e6', 
                                  color: '#fb7185',
                                  fontWeight: 600 
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  startIcon={actionLoading === registration._id ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
                                  disabled={actionLoading === registration._id}
                                  onClick={() => handleApprove(registration._id)}
                                  sx={{
                                    bgcolor: '#34d399',
                                    color: '#fff',
                                    textTransform: 'none',
                                    '&:hover': {
                                      bgcolor: '#10b981',
                                    },
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={actionLoading === registration._id ? <CircularProgress size={16} /> : <Cancel />}
                                  disabled={actionLoading === registration._id}
                                  onClick={() => handleReject(registration._id)}
                                  sx={{
                                    borderColor: '#fb7185',
                                    color: '#fb7185',
                                    textTransform: 'none',
                                    '&:hover': {
                                      borderColor: '#f43f5e',
                                      bgcolor: '#fef2f2',
                                    },
                                  }}
                                >
                                  Reject
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </>
          )}
          </>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
