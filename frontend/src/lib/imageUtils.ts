// Image utility functions

export const MEDIA_URL =
  process.env.NEXT_PUBLIC_MEDIA_URL || "http://localhost:5000";

/**
 * Validates if a string is a valid image URL path
 */
export const isValidImagePath = (
  path: string | null | undefined
): path is string => {
  return typeof path === "string" && path.trim().length > 0;
};

/**
 * Constructs a full image URL from a path, with validation
 * Returns null if the path is invalid
 */
export const getImageUrl = (path: string | null | undefined): string | null => {
  if (!isValidImagePath(path)) {
    return null;
  }
  return `${MEDIA_URL}${path}`;
};

/**
 * Filters an array of image paths to only valid ones
 */
export const filterValidImages = (images: any[]): string[] => {
  if (!Array.isArray(images)) {
    return [];
  }
  return images.filter(isValidImagePath);
};
