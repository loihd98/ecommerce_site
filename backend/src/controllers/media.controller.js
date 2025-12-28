import prisma from '../config/database.js';
import { ApiResponse } from '../utils/response.js';
import { asyncHandler } from '../middleware/error.middleware.js';
import { uploadImage, getFileUrl } from '../middleware/upload.middleware.js';
import sharp from 'sharp';
import path from 'path';
import { unlink } from 'fs/promises';

// Upload image
export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json(
      ApiResponse.badRequest('No file uploaded')
    );
  }
  
  const file = req.file;
  let processedPath = file.path;
  let width, height;
  
  // Process image with sharp
  if (file.mimetype.startsWith('image/')) {
    const outputPath = path.join(
      path.dirname(file.path),
      `optimized-${file.filename}`
    );
    
    const metadata = await sharp(file.path)
      .resize(1920, 1920, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
    
    width = metadata.width;
    height = metadata.height;
    
    // Delete original
    await unlink(file.path);
    processedPath = outputPath;
  }
  
  // Save to database
  const media = await prisma.media.create({
    data: {
      filename: path.basename(processedPath),
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: getFileUrl(req, path.basename(processedPath), file.mimetype.startsWith('video/') ? 'video' : 'image'),
      type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      width,
      height,
    },
  });
  
  res.status(201).json(
    ApiResponse.created(media, 'File uploaded successfully')
  );
});

// Get all media
export const getAllMedia = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, type } = req.query;
  
  const where = type ? { type } : {};
  const totalCount = await prisma.media.count({ where });
  
  const currentPage = Math.max(1, parseInt(page));
  const pageSize = Math.min(parseInt(limit), 100);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(totalCount / pageSize);
  
  const media = await prisma.media.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize,
  });
  
  res.json(
    ApiResponse.success({
      media,
      pagination: {
        page: currentPage,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
    })
  );
});

// Delete media
export const deleteMedia = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const media = await prisma.media.findUnique({
    where: { id },
  });
  
  if (!media) {
    return res.status(404).json(
      ApiResponse.notFound('Media not found')
    );
  }
  
  // Delete file from disk
  const filePath = path.join(
    process.cwd(),
    media.type === 'video' ? '/uploads/videos' : '/uploads/images',
    media.filename
  );
  
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  
  // Delete from database
  await prisma.media.delete({
    where: { id },
  });
  
  res.json(
    ApiResponse.success(null, 'Media deleted successfully')
  );
});
