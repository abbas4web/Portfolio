import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { api } from './api';
import MediaUploader from './MediaUploader';

interface ProfileManagerProps {
  profile: any;
  onRefresh: () => void;
}

export default function ProfileManager({ profile, onRefresh }: ProfileManagerProps) {
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [headline, setHeadline] = useState(profile?.headline || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [shortBio, setShortBio] = useState(profile?.shortBio || '');
  const [metaDescription, setMetaDescription] = useState(profile?.metaDescription || '');

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setTitle(profile.title || '');
      setHeadline(profile.headline || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setLocation(profile.location || '');
      setAvatarUrl(profile.avatarUrl || '');
      setShortBio(profile.shortBio || '');
      setMetaDescription(profile.metaDescription || '');
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.updateProfile({
        fullName,
        title,
        headline,
        email,
        phone,
        location,
        avatarUrl,
        shortBio,
        metaDescription,
        isPublished: true,
      });
      setFeedback({ message: 'Profile updated successfully!', severity: 'success' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to update profile', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
      {/* Page Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.85rem' }}>
          Profile & Identity Settings
        </Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
          Manage your personal details, public bio, contact channels, and SEO search tags.
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSave}>
        {/* Section 1: Basic Identity */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <PersonOutlineIcon sx={{ color: '#a78bfa' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.15rem' }}>
                Basic Information
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              Your primary name, professional designation, and hero headline.
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="e.g. Shaikh Abbas"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Title / Role"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Headline Bio"
                  placeholder="e.g. AI Engineer & Full Stack Developer with 3 years experience"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <MediaUploader
                  currentUrl={avatarUrl}
                  onUploaded={(uploadedUrl) => setAvatarUrl(uploadedUrl)}
                  label="Profile Avatar Photo"
                  previewHeight={140}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section 2: Contact Details */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <ContactMailOutlinedIcon sx={{ color: '#38bdf8' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.15rem' }}>
                Contact & Location
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              How clients and recruiters reach you directly.
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  placeholder="e.g. abbas4developer@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="e.g. +91-9284987979"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Location"
                  placeholder="e.g. Hyderabad, INDIA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Section 3: Bio & SEO */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <SearchOutlinedIcon sx={{ color: '#34d399' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.15rem' }}>
                Bio & Search Visibility
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
              Metadata for search engine snippets and social preview cards.
            </Typography>

            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Bio / Footer Summary"
                  multiline
                  rows={3}
                  placeholder="Brief summary of your expertise..."
                  value={shortBio}
                  onChange={(e) => setShortBio(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="SEO Meta Description"
                  multiline
                  rows={2}
                  placeholder="Google search snippet description..."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Sticky Action Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 2,
            pt: 2,
            pb: 4,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <SaveIcon />}
            sx={{
              bgcolor: '#6d28d9',
              '&:hover': { bgcolor: '#7c3aed' },
              px: 4,
              py: 1.4,
              fontSize: '0.95rem',
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: '0 10px 15px -3px rgba(109, 40, 217, 0.4)',
              textTransform: 'none',
            }}
          >
            {loading ? 'Saving Changes...' : 'Save Profile Settings'}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ borderRadius: 2 }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
