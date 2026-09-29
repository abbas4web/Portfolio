import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from './api';

interface ServicesManagerProps {
  services: any[];
  onRefresh: () => void;
}

export default function ServicesManager({ services, onRefresh }: ServicesManagerProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [iconKey, setIconKey] = useState('faBrain');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setIconKey('faBrain');
    setDescription('');
    setDisplayOrder(services.length + 1);
    setOpenModal(true);
  };

  const handleOpenEdit = (s: any) => {
    setEditingService(s);
    setTitle(s.title);
    setSlug(s.slug);
    setIconKey(s.iconKey);
    setDescription(s.description);
    setDisplayOrder(s.displayOrder || 1);
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!title || !description) return;
    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      iconKey,
      description,
      displayOrder: Number(displayOrder),
      published: true,
    };

    try {
      if (editingService) {
        await api.updateService(editingService.id, payload);
        setFeedback({ message: 'Service card updated', severity: 'success' });
      } else {
        await api.createService(payload);
        setFeedback({ message: 'Service card created', severity: 'success' });
      }
      setOpenModal(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Action failed', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteService(deleteId);
      setFeedback({ message: 'Service removed', severity: 'success' });
      setDeleteId(null);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
          Services / Expertise Cards ({services.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add Service Card
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((s) => (
          <Grid item xs={12} md={4} key={s.id}>
            <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {s.title}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleOpenEdit(s)} sx={{ color: '#94a3b8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteId(s.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#38bdf8', display: 'block', mb: 1 }}>
                  Icon: {s.iconKey} • Order: {s.displayOrder}
                </Typography>
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  {s.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>{editingService ? 'Edit Service Card' : 'Add Service Card'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required />
          <TextField
            label="Icon Key"
            value={iconKey}
            onChange={(e) => setIconKey(e.target.value)}
            helperText="e.g. faBrain, faReact, faPython"
            fullWidth
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
          />
          <TextField
            type="number"
            label="Display Order"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Save Card
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #ef4444' } }}
      >
        <DialogTitle sx={{ color: '#fca5a5' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Remove this service card from expertise?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
