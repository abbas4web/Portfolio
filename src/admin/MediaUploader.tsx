import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { api } from './api';

interface MediaUploaderProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  previewHeight?: number;
}

export default function MediaUploader({
  currentUrl,
  onUploaded,
  label = 'Upload Image',
  previewHeight = 120,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [imgLoadError, setImgLoadError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setPreview(currentUrl);
    setImgLoadError(false);
  }, [currentUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate client-side
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or SVG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const res = await api.uploadMedia(file);
      if (res.success && res.data?.url) {
        setPreview(res.data.url);
        onUploaded(res.data.url);
      } else {
        setError(res.error || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.message || 'Image upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: '#0f172a',
        border: '1px dashed #334155',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#f8fafc' }}>
          {label}
        </Typography>
        {preview && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#4ade80' }}>
            <CheckCircleOutlineIcon fontSize="small" />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Image Attached
            </Typography>
          </Box>
        )}
      </Box>

      {/* Preview Box */}
      {preview && (
        <Box
          sx={{
            height: previewHeight,
            bgcolor: '#020617',
            borderRadius: 1.5,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #1e293b',
          }}
        >
          {imgLoadError ? (
            <Box sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="caption" sx={{ color: '#ef4444', display: 'block', fontWeight: 600 }}>
                Image preview unavailable
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem', wordBreak: 'break-all' }}>
                {preview}
              </Typography>
            </Box>
          ) : (
            <img
              src={preview}
              alt="Preview"
              onError={() => setImgLoadError(true)}
              style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            />
          )}
        </Box>
      )}

      {preview && (
        <Typography
          variant="caption"
          sx={{
            color: '#64748b',
            fontSize: '0.72rem',
            wordBreak: 'break-all',
            fontFamily: 'monospace',
            bgcolor: '#020617',
            p: 0.75,
            borderRadius: 1,
            border: '1px solid #1e293b',
          }}
        >
          {preview}
        </Typography>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ py: 0.5, fontSize: '0.8rem' }}>
          {error}
        </Alert>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
      />

      <Button
        variant="outlined"
        startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          color: '#cbd5e1',
          borderColor: '#334155',
          textTransform: 'none',
          fontSize: '0.85rem',
          '&:hover': { borderColor: '#8b5cf6', bgcolor: 'rgba(139, 92, 246, 0.08)' },
        }}
      >
        {uploading ? 'Uploading to Cloud...' : preview ? 'Replace Image' : 'Select & Upload Image (Max 5MB)'}
      </Button>
    </Box>
  );
}
