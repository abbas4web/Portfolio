import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { api } from './api';

interface NavigationManagerProps {
  navItems: any[];
  onRefresh: () => void;
}

export default function NavigationManager({ navItems, onRefresh }: NavigationManagerProps) {
  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [label, setLabel] = useState('');
  const [href, setHref] = useState('');
  const [visible, setVisible] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(1);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setLabel('');
    setHref('');
    setVisible(true);
    setDisplayOrder(navItems.length + 1);
    setOpenModal(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setLabel(item.label);
    setHref(item.href);
    setVisible(item.visible);
    setDisplayOrder(item.displayOrder || 1);
    setOpenModal(true);
  };

  const handleSave = async () => {
    if (!label || !href) return;
    const payload = { label, href, visible, displayOrder: Number(displayOrder) };
    try {
      if (editingItem) {
        await api.updateNavigation(editingItem.id, payload);
        setFeedback({ message: 'Navigation updated', severity: 'success' });
      } else {
        await api.createNavigation(payload);
        setFeedback({ message: 'Navigation link added', severity: 'success' });
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
      await api.deleteNavigation(deleteId);
      setFeedback({ message: 'Navigation item removed', severity: 'success' });
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
          Navigation Links Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{ bgcolor: '#5000ca', '&:hover': { bgcolor: '#6915e8' } }}
        >
          Add Nav Item
        </Button>
      </Box>

      <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#0f1420' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8' }}>Order</TableCell>
                <TableCell sx={{ color: '#94a3b8' }}>Label</TableCell>
                <TableCell sx={{ color: '#94a3b8' }}>Section / Anchor</TableCell>
                <TableCell sx={{ color: '#94a3b8' }}>Visible</TableCell>
                <TableCell sx={{ color: '#94a3b8' }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {navItems.map((item) => (
                <TableRow key={item.id} sx={{ borderBottom: '1px solid #1f293d' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{item.displayOrder}</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{item.label}</TableCell>
                  <TableCell sx={{ color: '#38bdf8' }}>#{item.href}</TableCell>
                  <TableCell sx={{ color: item.visible ? '#4ade80' : '#94a3b8' }}>
                    {item.visible ? 'Visible' : 'Hidden'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleOpenEdit(item)} sx={{ color: '#94a3b8' }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => setDeleteId(item.id)} sx={{ color: '#ef4444' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff' } }}
      >
        <DialogTitle>{editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: 320 }}>
          <TextField label="Label (e.g. Projects)" value={label} onChange={(e) => setLabel(e.target.value)} fullWidth />
          <TextField
            label="Section ID / href (e.g. projects)"
            value={href}
            onChange={(e) => setHref(e.target.value)}
            fullWidth
          />
          <TextField
            type="number"
            label="Display Order"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            fullWidth
          />
          <FormControlLabel
            control={<Switch checked={visible} onChange={(e) => setVisible(e.target.checked)} />}
            label="Visible in Navbar"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenModal(false)} sx={{ color: '#94a3b8' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#5000ca' }}>
            Save
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
          <Typography>Remove this navigation link?</Typography>
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
