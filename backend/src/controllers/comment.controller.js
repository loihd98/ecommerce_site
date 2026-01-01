import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { ApiResponse } from "../utils/response.js";

// Get comments for a product
export const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, approved } = req.query;

    const where = {
      productId,
      ...(approved !== undefined && { isApproved: approved === "true" }),
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.comment.count({ where }),
    ]);

    return res.status(200).json(
      ApiResponse.success({
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Get comments error:", error);
    return res.status(500).json(ApiResponse.error("Failed to fetch comments"));
  }
};

// Create comment
export const createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content, authorName, authorEmail } = req.body;
    const userId = req.user?.userId;

    if (!content) {
      return res
        .status(400)
        .json(ApiResponse.badRequest("Content is required"));
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json(ApiResponse.notFound("Product not found"));
    }

    // Require guest info if not logged in
    if (!userId && (!authorName || !authorEmail)) {
      return res
        .status(400)
        .json(
          ApiResponse.badRequest(
            "Name and email are required for guest comments"
          )
        );
    }

    const comment = await prisma.comment.create({
      data: {
        productId,
        userId,
        content,
        authorName: !userId ? authorName : undefined,
        authorEmail: !userId ? authorEmail : undefined,
        isApproved: false, // Default to unapproved, admin will approve
      },
      include: {
        user: userId
          ? {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            }
          : undefined,
      },
    });

    return res
      .status(201)
      .json(
        ApiResponse.created(
          comment,
          "Comment submitted successfully. It will appear after admin approval."
        )
      );
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json(ApiResponse.error("Failed to create comment"));
  }
};

// Update comment (user can edit their own)
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json(ApiResponse.notFound("Comment not found"));
    }

    // Only allow user to edit their own comment
    if (comment.userId !== userId) {
      return res.status(403).json(ApiResponse.forbidden("Unauthorized"));
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        content,
        isApproved: false, // Reset approval after edit
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(updatedComment, "Comment updated successfully")
      );
  } catch (error) {
    console.error("Update comment error:", error);
    return res.status(500).json(ApiResponse.error("Failed to update comment"));
  }
};

// Delete comment (user can delete their own)
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json(ApiResponse.notFound("Comment not found"));
    }

    // Only allow user to delete their own comment
    if (comment.userId !== userId) {
      return res.status(403).json(ApiResponse.forbidden("Unauthorized"));
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res
      .status(200)
      .json(ApiResponse.success(null, "Comment deleted successfully"));
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json(ApiResponse.error("Failed to delete comment"));
  }
};

// Admin: Get all comments
export const getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20, approved, productId, search } = req.query;

    const where = {
      ...(approved !== undefined && { isApproved: approved === "true" }),
      ...(productId && { productId }),
      ...(search && {
        OR: [
          { content: { contains: search, mode: "insensitive" } },
          { authorName: { contains: search, mode: "insensitive" } },
          { authorEmail: { contains: search, mode: "insensitive" } },
          { user: { name: { contains: search, mode: "insensitive" } } },
        ],
      }),
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: parseInt(limit),
      }),
      prisma.comment.count({ where }),
    ]);

    return res.status(200).json(
      ApiResponse.success({
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Get all comments error:", error);
    return res.status(500).json(ApiResponse.error("Failed to fetch comments"));
  }
};

// Admin: Approve/unapprove comment
export const toggleApproveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { isApproved } = req.body;

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { isApproved },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(
        ApiResponse.success(
          comment,
          `Comment ${isApproved ? "approved" : "unapproved"} successfully`
        )
      );
  } catch (error) {
    console.error("Toggle approve comment error:", error);
    return res
      .status(500)
      .json(ApiResponse.error("Failed to update comment approval"));
  }
};

// Admin: Delete any comment
export const adminDeleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json(ApiResponse.notFound("Comment not found"));
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res
      .status(200)
      .json(ApiResponse.success(null, "Comment deleted successfully"));
  } catch (error) {
    console.error("Admin delete comment error:", error);
    return res.status(500).json(ApiResponse.error("Failed to delete comment"));
  }
};
