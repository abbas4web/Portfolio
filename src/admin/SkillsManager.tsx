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
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from './api';

interface SkillsManagerProps {
  categories: any[];
  onRefresh: () => void;
}

export default function SkillsManager({ categories, onRefresh }: SkillsManagerProps) {
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openSkillModal, setOpenSkillModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const [categoryName, setCategoryName] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [skillName, setSkillName] = useState('');

  const [deleteConfirmSkillId, setDeleteConfirmSkillId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleCreateCategory = async () => {
    if (!categoryName || !categorySlug) return;
    try {
      await api.createSkillCategory({
        name: categoryName,
        slug: categorySlug,
        displayOrder: categories.length + 1,
        published: true,
      });
      setFeedback({ message: 'Skill Category created!', severity: 'success' });
      setCategoryName('');
      setCategorySlug('');
      setOpenCategoryModal(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Creation failed', severity: 'error' });
    }
  };

  const handleCreateSkill = async () => {
    if (!skillName || !selectedCategoryId) return;
    try {
      await api.createSkill({
        categoryId: selectedCategoryId,
        name: skillName,
        displayOrder: 1,
        published: true,
      });
      setFeedback({ message: 'Skill added!', severity: 'success' });
      setSkillName('');
      setOpenSkillModal(false);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Creation failed', severity: 'error' });
    }
  };

  const handleDeleteSkill = async () => {
    if (!deleteConfirmSkillId) return;
    try {
      await api.deleteSkill(deleteConfirmSkillId);
      setFeedback({ message: 'Skill deleted', severity: 'success' });
      setDeleteConfirmSkillId(null);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
          Skills & Categories Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCategoryModal(true)}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add Skill Category
        </Button>
      </Box>

      <Grid container spacing={3}>
        {categories.map((cat) => (
          <Grid item xs={12} md={6} lg={4} key={cat.id}>
            <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {cat.name}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setOpenSkillModal(true);
                    }}
                    sx={{ color: '#38bdf8', textTransform: 'none' }}
                  >
                    Add Chip
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {cat.skills?.map((skill: any) => (
                    <Chip
                      key={skill.id}
                      label={skill.name}
                      onDelete={() => setDeleteConfirmSkillId(skill.id)}
                      deleteIcon={<DeleteIcon sx={{ color: '#fca5a5 !important' }} />}
                      sx={{ bgcolor: '#0f1420', color: '#fff', border: '1px solid #1f293d' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Category Modal */}
      <Dialog
        open={openCategoryModal}
        onClose={() => setOpenCategoryModal(false)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>New Skill Category</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 320 }}>
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => {
              setCategoryName(e.target.value);
              setCategorySlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
            }}
            fullWidth
            required
          />
          <TextField label="Slug" value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)} fullWidth required />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCategoryModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateCategory} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Create Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Skill Modal */}
      <Dialog
        open={openSkillModal}
        onClose={() => setOpenSkillModal(false)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>Add Skill Chip</DialogTitle>
        <DialogContent sx={{ pt: 1, minWidth: 320 }}>
          <TextField
            label="Skill Name"
            placeholder="e.g. Next.js"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenSkillModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateSkill} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Add Skill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Skill Confirmation */}
      <Dialog
        open={Boolean(deleteConfirmSkillId)}
        onClose={() => setDeleteConfirmSkillId(null)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #ef4444' } }}
      >
        <DialogTitle sx={{ color: '#fca5a5' }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Remove this skill from category?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmSkillId(null)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleDeleteSkill} variant="contained" color="error">
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
