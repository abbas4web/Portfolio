import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { api } from './api';
import MediaUploader from './MediaUploader';

interface ProjectsManagerProps {
  projects: any[];
  onRefresh: () => void;
}

export default function ProjectsManager({ projects, onRefresh }: ProjectsManagerProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setShortDescription('');
    setDescription('');
    setImage('/mock01.png');
    setTechnologies('React.js, Node.js, PostgreSQL');
    setGithubUrl('https://github.com/abbas4web');
    setLiveUrl('');
    setFeatured(false);
    setPublished(true);
    setDisplayOrder(projects.length + 1);
    setOpenModal(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setShortDescription(p.shortDescription || '');
    setDescription(p.description);
    setImage(p.image);
    setTechnologies(Array.isArray(p.technologies) ? p.technologies.join(', ') : '');
    setGithubUrl(p.githubUrl || '');
    setLiveUrl(p.liveUrl || '');
    setFeatured(p.featured);
    setPublished(p.published);
    setDisplayOrder(p.displayOrder || 0);
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) {
      setFeedback({ message: 'Title, Slug, and Description are required.', severity: 'error' });
      return;
    }

    setLoading(true);
    const payload = {
      title,
      slug,
      shortDescription,
      description,
      image: image || '/mock01.png',
      technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
      githubUrl,
      liveUrl,
      featured,
      published,
      displayOrder: Number(displayOrder),
    };

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, payload);
        setFeedback({ message: 'Project updated successfully!', severity: 'success' });
      } else {
        await api.createProject(payload);
        setFeedback({ message: 'Project created successfully!', severity: 'success' });
      }
      setOpenModal(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Action failed', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setLoading(true);
    try {
      await api.deleteProject(deleteConfirmId);
      setFeedback({ message: 'Project deleted successfully.', severity: 'success' });
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Failed to delete project', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
          Projects Management ({projects.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add New Project
        </Button>
      </Box>

      {/* Grid of Projects */}
      <Grid container spacing={3}>
        {projects.map((p) => (
          <Grid item xs={12} md={6} lg={4} key={p.id}>
            <Card
              sx={{
                bgcolor: '#131823',
                color: '#fff',
                border: '1px solid #1f293d',
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {p.title}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenEdit(p)} sx={{ color: '#94a3b8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => setDeleteConfirmId(p.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={p.published ? 'Published' : 'Draft'}
                    sx={{
                      bgcolor: p.published ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                      color: p.published ? '#4ade80' : '#94a3b8',
                      fontWeight: 600,
                    }}
                  />
                  {p.featured && (
                    <Chip
                      size="small"
                      label="Featured"
                      sx={{ bgcolor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 600 }}
                    />
                  )}
                  <Chip size="small" label={`Order: ${p.displayOrder}`} sx={{ bgcolor: '#1f293d', color: '#94a3b8' }} />
                </Box>

                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2, lineClamp: 3 }}>
                  {p.description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {p.technologies?.map((tech: string) => (
                    <Chip key={tech} label={tech} size="small" sx={{ bgcolor: '#0a0d14', color: '#38bdf8' }} />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, pt: 1, borderTop: '1px solid #1f293d' }}>
                  {p.githubUrl && (
                    <Button
                      size="small"
                      startIcon={<GitHubIcon />}
                      href={p.githubUrl}
                      target="_blank"
                      sx={{ color: '#94a3b8', textTransform: 'none' }}
                    >
                      Repo
                    </Button>
                  )}
                  {p.liveUrl && (
                    <Button
                      size="small"
                      startIcon={<LaunchIcon />}
                      href={p.liveUrl}
                      target="_blank"
                      sx={{ color: '#38bdf8', textTransform: 'none' }}
                    >
                      Demo
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create / Edit Dialog */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProject ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingProject) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Short Description"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />

            <TextField
              fullWidth
              label="Full Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Technologies (comma separated)"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="React.js, Node.js, PostgreSQL"
                />
              </Grid>
              <Grid item xs={12}>
                <MediaUploader
                  currentUrl={image}
                  onUploaded={(uploadedUrl) => setImage(uploadedUrl)}
                  label="Project Thumbnail Image"
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GitHub URL"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Live Demo URL"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Display Order"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={<Switch checked={featured} onChange={(e) => setFeatured(e.target.checked)} />}
                  label="Featured Project"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControlLabel
                  control={<Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />}
                  label="Published"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #1f293d' }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={loading}
            sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
          >
            {loading ? <CircularProgress size={20} /> : editingProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #ef4444' } }}
      >
        <DialogTitle sx={{ color: '#fca5a5' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this project? This destructive action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Delete Project'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar feedback */}
      <Snackbar
        open={Boolean(feedback)}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {feedback ? (
          <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
}
