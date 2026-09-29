import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import CodeIcon from '@mui/icons-material/Code';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import NavigationIcon from '@mui/icons-material/Navigation';
import BuildIcon from '@mui/icons-material/Build';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { api } from './api';
import AdminLogin from './AdminLogin';
import ProjectsManager from './ProjectsManager';
import MessagesManager from './MessagesManager';
import ProfileManager from './ProfileManager';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import EducationManager from './EducationManager';
import NavigationManager from './NavigationManager';
import ServicesManager from './ServicesManager';
import './admin.css';

const drawerWidth = 260;

export default function AdminPortal() {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // CMS Content State
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Check current session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setAuthChecking(true);
    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setCurrentUser(res.user);
        loadAllData();
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthChecking(false);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, prjRes, skRes, expRes, eduRes, msgRes, navRes, srvRes] = await Promise.all([
        api.getProfile().catch(() => ({ data: null })),
        api.getProjects().catch(() => ({ data: [] })),
        api.getSkillCategories().catch(() => ({ data: [] })),
        api.getExperience().catch(() => ({ data: [] })),
        api.getEducation().catch(() => ({ data: [] })),
        api.getMessages().catch(() => ({ data: { items: [] } })),
        api.getNavigation().catch(() => ({ data: [] })),
        api.getServices().catch(() => ({ data: [] })),
      ]);

      if (pRes?.data) setProfile(pRes.data);
      if (prjRes?.data) setProjects(prjRes.data);
      if (skRes?.data) setSkillCategories(skRes.data);
      if (expRes?.data) setExperience(expRes.data);
      if (eduRes?.data) setEducation(eduRes.data);
      if (msgRes?.data?.items) setMessages(msgRes.data.items);
      if (navRes?.data) setNavItems(navRes.data);
      if (srvRes?.data) setServices(srvRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } finally {
      setCurrentUser(null);
    }
  };

  if (authChecking) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a0d14' }}>
        <CircularProgress sx={{ color: '#5000ca' }} />
      </Box>
    );
  }

  if (!currentUser) {
    return <AdminLogin onLoginSuccess={(user) => { setCurrentUser(user); loadAllData(); }} />;
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'profile', label: 'Profile & Bio', icon: <PersonIcon /> },
    { id: 'projects', label: 'Projects', icon: <FolderSpecialIcon />, count: projects.length },
    { id: 'services', label: 'Services / Cards', icon: <BuildIcon />, count: services.length },
    { id: 'skills', label: 'Skills & Tech', icon: <CodeIcon /> },
    { id: 'experience', label: 'Work Experience', icon: <WorkHistoryIcon />, count: experience.length },
    { id: 'education', label: 'Education', icon: <SchoolIcon />, count: education.length },
    { id: 'navigation', label: 'Navigation Links', icon: <NavigationIcon /> },
    { id: 'messages', label: 'Inquiries Inbox', icon: <EmailIcon />, count: messages.filter((m) => m.status === 'UNREAD').length },
  ];

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0a0d14', color: '#fff' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#4ade80' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
          Portfolio CMS
        </Typography>
      </Box>
      <Divider sx={{ borderColor: '#1f293d' }} />

      <List sx={{ px: 1, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={currentTab === item.id}
              onClick={() => {
                setCurrentTab(item.id);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                color: currentTab === item.id ? '#fff' : '#94a3b8',
                bgcolor: currentTab === item.id ? '#5000ca !important' : 'transparent',
                '&:hover': { bgcolor: '#131823' },
              }}
            >
              <ListItemIcon sx={{ color: currentTab === item.id ? '#fff' : '#94a3b8', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} />
              {typeof item.count === 'number' && item.count > 0 && (
                <Box
                  sx={{
                    px: 1,
                    py: 0.2,
                    borderRadius: 5,
                    bgcolor: item.id === 'messages' ? '#ef4444' : '#1f293d',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {item.count}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#1f293d' }} />
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<OpenInNewIcon />}
          onClick={() => (window.location.hash = '')}
          sx={{ color: '#94a3b8', borderColor: '#1f293d', textTransform: 'none', '&:hover': { borderColor: '#5000ca' } }}
        >
          View Live Portfolio
        </Button>
        <Button
          fullWidth
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ color: '#fca5a5', textTransform: 'none', justifyContent: 'flex-start' }}
        >
          Sign Out ({currentUser.fullName || currentUser.email})
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box className="admin-scope" sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0b0f19' }}>
      {/* Top Navbar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#0a0d14',
          borderBottom: '1px solid #1f293d',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>
            {menuItems.find((m) => m.id === currentTab)?.label || 'Admin'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', display: { xs: 'none', sm: 'block' } }}>
              Signed in as <strong style={{ color: '#fff' }}>{currentUser.email}</strong>
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebars */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #1f293d' },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #1f293d' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` }, mt: '64px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#5000ca' }} />
          </Box>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 3 }}>
                  Overview & Key Statistics
                </Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Total Projects</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#38bdf8', mt: 1 }}>{projects.length}</Typography>
                        <Typography variant="caption" sx={{ color: '#4ade80' }}>
                          {projects.filter((p) => p.published).length} Published
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Skill Categories</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#a855f7', mt: 1 }}>{skillCategories.length}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {skillCategories.reduce((acc, c) => acc + (c.skills?.length || 0), 0)} Total Skills
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Career History</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mt: 1 }}>{experience.length}</Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{education.length} Education degrees</Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>Unread Inquiries</Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444', mt: 1 }}>
                          {messages.filter((m) => m.status === 'UNREAD').length}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>{messages.length} Total Messages</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2, p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Current Active Profile</Typography>
                  <Typography variant="body1" sx={{ color: '#38bdf8' }}>
                    {profile?.fullName || 'Shaikh Abbas'} — {profile?.title || 'Senior Software Engineer'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                    {profile?.headline || 'AI Engineer & Full Stack Developer with 3 years experience'}
                  </Typography>
                </Card>
              </Box>
            )}

            {currentTab === 'profile' && <ProfileManager profile={profile} onRefresh={loadAllData} />}
            {currentTab === 'projects' && <ProjectsManager projects={projects} onRefresh={loadAllData} />}
            {currentTab === 'services' && <ServicesManager services={services} onRefresh={loadAllData} />}
            {currentTab === 'skills' && <SkillsManager categories={skillCategories} onRefresh={loadAllData} />}
            {currentTab === 'experience' && <ExperienceManager experienceList={experience} onRefresh={loadAllData} />}
            {currentTab === 'education' && <EducationManager educationList={education} onRefresh={loadAllData} />}
            {currentTab === 'navigation' && <NavigationManager navItems={navItems} onRefresh={loadAllData} />}
            {currentTab === 'messages' && <MessagesManager messages={messages} onRefresh={loadAllData} />}
          </>
        )}
      </Box>
    </Box>
  );
}
