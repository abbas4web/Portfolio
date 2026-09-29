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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from './api';

interface EducationManagerProps {
  educationList: any[];
  onRefresh: () => void;
}

export default function EducationManager({ educationList, onRefresh }: EducationManagerProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setInstitution('');
    setDegree('Bachelor of Computer Applications (B.C.A.)');
    setFieldOfStudy('Computer Applications');
    setStartDate('2020-06-01');
    setEndDate('2023-05-30');
    setDescription('');
    setOpenModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingEdu(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setFieldOfStudy(item.fieldOfStudy || '');
    setStartDate(item.startDate ? item.startDate.split('T')[0] : '');
    setEndDate(item.endDate ? item.endDate.split('T')[0] : '');
    setDescription(item.description || '');
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree) return;

    const payload = {
      institution,
      degree,
      fieldOfStudy,
      startDate,
      endDate: endDate || null,
      description,
      published: true,
      displayOrder: 1,
    };

    try {
      if (editingEdu) {
        await api.updateEducation(editingEdu.id, payload);
        setFeedback({ message: 'Education updated!', severity: 'success' });
      } else {
        await api.createEducation(payload);
        setFeedback({ message: 'Education entry created!', severity: 'success' });
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
      await api.deleteEducation(deleteId);
      setFeedback({ message: 'Education deleted', severity: 'success' });
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
          Education & Certifications ({educationList.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add Education
        </Button>
      </Box>

      <Grid container spacing={3}>
        {educationList.map((edu) => (
          <Grid item xs={12} key={edu.id}>
            <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#38bdf8', mt: 0.5 }}>
                      {edu.institution}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenEdit(edu)} sx={{ color: '#94a3b8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteId(edu.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#94a3b8', mt: 2 }}>
                  {edu.description}
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
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>{editingEdu ? 'Edit Education' : 'Add Education'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            fullWidth
            label="Degree / Qualification"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Institution / University"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Field of Study"
            value={fieldOfStudy}
            onChange={(e) => setFieldOfStudy(e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Description / Coursework"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Save Education
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
          <Typography>Delete this education record?</Typography>
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
