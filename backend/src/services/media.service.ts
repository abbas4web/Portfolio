import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary if credentials exist
if (config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
}

export interface UploadResult {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

export class CloudMediaService {
  /**
   * Upload buffer directly to Cloudinary or fallback to server static uploads
   */
  static async uploadImage(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder = 'portfolio'
  ): Promise<UploadResult> {
    const isCloudinaryConfigured = Boolean(
      config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
    );

    if (isCloudinaryConfigured) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
            transformation: [{ quality: 'auto', fetch_format: 'auto' }],
          },
          (error, result) => {
            if (error || !result) {
              return reject(new Error(error?.message || 'Cloudinary upload failed'));
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              filename: originalName,
              mimeType,
              sizeBytes: result.bytes,
            });
          }
        );
        uploadStream.end(buffer);
      });
    }

    // Fallback: If on Vercel or cloud storage not configured, return base64 Data URI
    const isVercel = Boolean(process.env.VERCEL);
    if (isVercel) {
      const base64 = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64}`;
      return {
        url: dataUri,
        publicId: `upload-${Date.now()}`,
        filename: originalName,
        mimeType,
        sizeBytes: buffer.length,
      };
    }

    // Local development disk storage
    const backendUploads = path.resolve(__dirname, '../../uploads');
    const rootUploads = path.resolve(__dirname, '../../../uploads');
    [backendUploads, rootUploads].forEach((dir) => {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
      } catch (_) {}
    });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(originalName) || '.png';
    const rawBase = path.basename(originalName, ext);
    const sanitizedBase = rawBase.replace(/[^a-zA-Z0-9_-]/g, '_') || 'image';
    const cleanFilename = `${sanitizedBase}-${uniqueSuffix}${ext}`;

    // Write to both paths to ensure Express static resolution never misses
    try {
      fs.writeFileSync(path.join(backendUploads, cleanFilename), buffer);
      fs.writeFileSync(path.join(rootUploads, cleanFilename), buffer);
    } catch (_) {}

    const fallbackUrl = `http://localhost:${config.port}/uploads/${cleanFilename}`;
    return {
      url: fallbackUrl,
      publicId: cleanFilename,
      filename: originalName,
      mimeType,
      sizeBytes: buffer.length,
    };
  }

  /**
   * Delete image from Cloudinary or local disk
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    const isCloudinaryConfigured = Boolean(
      config.cloudinary.cloudName && config.cloudinary.apiKey && config.cloudinary.apiSecret
    );

    if (isCloudinaryConfigured) {
      const res = await cloudinary.uploader.destroy(publicId);
      return res.result === 'ok';
    }

    const paths = [
      path.resolve(__dirname, '../../uploads', publicId),
      path.resolve(__dirname, '../../../uploads', publicId),
    ];
    let deleted = false;
    for (const p of paths) {
      if (fs.existsSync(p)) {
        try {
          fs.unlinkSync(p);
          deleted = true;
        } catch (_) {}
      }
    }
    return deleted;
  }
}
