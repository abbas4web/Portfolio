import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { api } from './api';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0a0d14',
        p: 2,
      }}
    >
      <Container maxWidth="xs">
        <Card
          sx={{
            bgcolor: '#131823',
            color: '#fff',
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            border: '1px solid #1f293d',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  bgcolor: '#5000ca',
                  p: 1.5,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>
                Portfolio Admin
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                Sign in to manage portfolio content
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    bgcolor: '#0f1420',
                    '& fieldset': { borderColor: '#1f293d' },
                    '&:hover fieldset': { borderColor: '#5000ca' },
                    '&.Mui-focused fieldset': { borderColor: '#5000ca' },
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                autoComplete="current-password"
                sx={{
                  '& .MuiInputLabel-root': { color: '#94a3b8' },
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    bgcolor: '#0f1420',
                    '& fieldset': { borderColor: '#1f293d' },
                    '&:hover fieldset': { borderColor: '#5000ca' },
                    '&.Mui-focused fieldset': { borderColor: '#5000ca' },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  bgcolor: '#5000ca',
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#6915e8' },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="text"
                size="small"
                onClick={() => (window.location.hash = '')}
                sx={{ color: '#94a3b8', textTransform: 'none' }}
              >
                ← Back to public portfolio
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
