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
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ArchiveIcon from '@mui/icons-material/Archive';
import { api } from './api';

interface MessagesManagerProps {
  messages: any[];
  onRefresh: () => void;
}

export default function MessagesManager({ messages, onRefresh }: MessagesManagerProps) {
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateMessageStatus(id, status);
      setFeedback({ message: `Message marked as ${status.toLowerCase()}`, severity: 'success' });
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Status update failed', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteMessage(deleteId);
      setFeedback({ message: 'Message permanently deleted', severity: 'success' });
      setDeleteId(null);
      if (selectedMessage?.id === deleteId) setSelectedMessage(null);
      onRefresh();
    } catch (err: any) {
      setFeedback({ message: err.message || 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff', mb: 3 }}>
        Contact Inquiries & Messages ({messages.length})
      </Typography>

      <Card sx={{ bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#0f1420' }}>
              <TableRow>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Sender</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Contact Info</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Message</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Received</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#94a3b8', py: 4 }}>
                    No messages received yet.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((m) => (
                  <TableRow
                    key={m.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#1a2233 !important' },
                      borderBottom: '1px solid #1f293d',
                    }}
                    onClick={() => setSelectedMessage(m)}
                  >
                    <TableCell>
                      <Chip
                        size="small"
                        label={m.status}
                        sx={{
                          fontWeight: 600,
                          bgcolor:
                            m.status === 'UNREAD'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : m.status === 'READ'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'rgba(148, 163, 184, 0.2)',
                          color:
                            m.status === 'UNREAD' ? '#fca5a5' : m.status === 'READ' ? '#4ade80' : '#94a3b8',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{m.name}</TableCell>
                    <TableCell sx={{ color: '#38bdf8' }}>{m.contact}</TableCell>
                    <TableCell sx={{ color: '#94a3b8', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {m.message}
                    </TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>
                      {new Date(m.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      {m.status === 'UNREAD' && (
                        <IconButton
                          size="small"
                          title="Mark as Read"
                          onClick={() => handleUpdateStatus(m.id, 'READ')}
                          sx={{ color: '#4ade80' }}
                        >
                          <MarkEmailReadIcon fontSize="small" />
                        </IconButton>
                      )}
                      {m.status !== 'ARCHIVED' && (
                        <IconButton
                          size="small"
                          title="Archive"
                          onClick={() => handleUpdateStatus(m.id, 'ARCHIVED')}
                          sx={{ color: '#94a3b8' }}
                        >
                          <ArchiveIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        title="Delete"
                        onClick={() => setDeleteId(m.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Message Inspection Dialog */}
      <Dialog
        open={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #1f293d' } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Inquiry Details</DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#1f293d' }}>
          {selectedMessage && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  From
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedMessage.name} ({selectedMessage.contact})
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Received At
                </Typography>
                <Typography variant="body2">{new Date(selectedMessage.createdAt).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Message Content
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    p: 2,
                    bgcolor: '#0a0d14',
                    borderRadius: 1,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'inherit',
                  }}
                >
                  {selectedMessage.message}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSelectedMessage(null)} sx={{ color: '#94a3b8' }}>
            Close
          </Button>
          {selectedMessage?.status === 'UNREAD' && (
            <Button
              variant="contained"
              onClick={() => {
                handleUpdateStatus(selectedMessage.id, 'READ');
                setSelectedMessage(null);
              }}
              sx={{ bgcolor: '#5000ca' }}
            >
              Mark Read
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { bgcolor: '#131823', color: '#fff', border: '1px solid #ef4444' } }}
      >
        <DialogTitle sx={{ color: '#fca5a5' }}>Delete Inquiry</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this message? This action is permanent.</Typography>
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
