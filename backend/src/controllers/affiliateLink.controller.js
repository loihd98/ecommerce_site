import prisma from "../config/database.js";
import { ApiResponse, NotFoundError } from "../utils/response.js";
import { asyncHandler } from "../middleware/error.middleware.js";
import { calculatePagination } from "../utils/helpers.js";

// Get all affiliate links (public)
export const getAffiliateLinks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, active } = req.query;

  const where = {};
  if (active !== undefined) {
    where.isActive = active === "true";
  }

  const totalCount = await prisma.affiliateLink.count({ where });
  const pagination = calculatePagination(page, limit, totalCount);

  const affiliateLinks = await prisma.affiliateLink.findMany({
    where,
    orderBy: { name: "asc" },
    skip: pagination.skip,
    take: pagination.pageSize,
  });

  res.json(
    ApiResponse.success({
      affiliateLinks,
      pagination,
    })
  );
});

// Get single affiliate link
export const getAffiliateLink = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const affiliateLink = await prisma.affiliateLink.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  if (!affiliateLink) {
    throw new NotFoundError("Affiliate link not found");
  }

  res.json(ApiResponse.success(affiliateLink));
});

// Admin: Create affiliate link
export const createAffiliateLink = asyncHandler(async (req, res) => {
  const { name, url, description, icon, isActive } = req.body;

  const affiliateLink = await prisma.affiliateLink.create({
    data: {
      name,
      url,
      description,
      icon,
      isActive: isActive !== false,
    },
  });

  res
    .status(201)
    .json(
      ApiResponse.created(affiliateLink, "Affiliate link created successfully")
    );
});

// Admin: Update affiliate link
export const updateAffiliateLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, url, description, icon, isActive } = req.body;

  const affiliateLink = await prisma.affiliateLink.findUnique({
    where: { id },
  });

  if (!affiliateLink) {
    throw new NotFoundError("Affiliate link not found");
  }

  const updatedAffiliateLink = await prisma.affiliateLink.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(url !== undefined && { url }),
      ...(description !== undefined && { description }),
      ...(icon !== undefined && { icon }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  res.json(
    ApiResponse.success(
      updatedAffiliateLink,
      "Affiliate link updated successfully"
    )
  );
});

// Admin: Delete affiliate link
export const deleteAffiliateLink = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if any products are using this affiliate link
  const productCount = await prisma.product.count({
    where: { affiliateLinkId: id },
  });

  if (productCount > 0) {
    return res
      .status(400)
      .json(
        ApiResponse.badRequest(
          `Cannot delete affiliate link with ${productCount} associated products`
        )
      );
  }

  await prisma.affiliateLink.delete({
    where: { id },
  });

  res.json(ApiResponse.success(null, "Affiliate link deleted successfully"));
});
