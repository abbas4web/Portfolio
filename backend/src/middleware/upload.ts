import multer from 'multer';

// In-memory storage for validation and direct upload to cloud provider
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

// Max file size: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only JPEG, PNG, WebP, GIF, and SVG images are allowed.'));
    }
    cb(null, true);
  },
});
