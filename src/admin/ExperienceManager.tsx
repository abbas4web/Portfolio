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
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from './api';

interface ExperienceManagerProps {
  experienceList: any[];
  onRefresh: () => void;
}

export default function ExperienceManager({ experienceList, onRefresh }: ExperienceManagerProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [displayOrder, setDisplayOrder] = useState(1);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingExp(null);
    setCompany('');
    setRole('');
    setLocation('Hyderabad, India');
    setStartDate('2023-04-01');
    setEndDate('');
    setCurrent(true);
    setDescription('');
    setTechnologies('React.js, React Native, Node.js');
    setDisplayOrder(experienceList.length + 1);
    setOpenModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingExp(item);
    setCompany(item.company);
    setRole(item.role);
    setLocation(item.location || '');
    setStartDate(item.startDate ? item.startDate.split('T')[0] : '');
    setEndDate(item.endDate ? item.endDate.split('T')[0] : '');
    setCurrent(item.current);
    setDescription(item.description);
    setTechnologies(Array.isArray(item.technologies) ? item.technologies.join(', ') : '');
    setDisplayOrder(item.displayOrder || 1);
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role || !description) return;

    const payload = {
      company,
      role,
      location,
      startDate,
      endDate: current ? null : endDate,
      current,
      description,
      technologies: technologies.split(',').map((t) => t.trim()).filter(Boolean),
      displayOrder: Number(displayOrder),
      published: true,
    };

    try {
      if (editingExp) {
        await api.updateExperience(editingExp.id, payload);
        setFeedback({ message: 'Experience updated!', severity: 'success' });
      } else {
        await api.createExperience(payload);
        setFeedback({ message: 'Experience added!', severity: 'success' });
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
      await api.deleteExperience(deleteId);
      setFeedback({ message: 'Experience entry deleted', severity: 'success' });
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
          Career Experience ({experienceList.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add Experience
        </Button>
      </Box>

      <Grid container spacing={3}>
        {experienceList.map((exp) => (
          <Grid item xs={12} key={exp.id}>
            <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {exp.role} @ {exp.company}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#38bdf8', mt: 0.5 }}>
                      {exp.location} • {exp.current ? 'Current Position' : 'Past Position'}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenEdit(exp)} sx={{ color: '#94a3b8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteId(exp.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 2, whiteSpace: 'pre-wrap' }}>
                  {exp.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit / Add Modal */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>{editingExp ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Role / Title" value={role} onChange={(e) => setRole(e.target.value)} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                disabled={current}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <FormControlLabel
                control={<Switch checked={current} onChange={(e) => setCurrent(e.target.checked)} />}
                label="Current"
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Job Responsibilities & Impact"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Technologies Used (comma separated)"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Save Experience
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #ef4444' } }}
      >
        <DialogTitle sx={{ color: '#fca5a5' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Delete this career experience entry permanently?</Typography>
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
