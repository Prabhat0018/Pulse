
import pool from "../db";
import { Request, Response } from "express";
import {
    createComment,
    getComments,
    deleteComment
} from "../services/commentservice";

export const createCommentController = async (
    req: Request,
    res: Response
) => {
    const postId = Number(req.params.id);
    const { content } = req.body;

    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            message: "Invalid post ID"
        });
    }

    if (typeof content !== "string" || !content.trim()) {
        return res.status(400).json({
            message: "Comment content is required"
        });
    }

    try {
        const postExists = await pool.query(
            `SELECT id FROM posts WHERE id = $1`,
            [postId]
        );

        if (postExists.rows.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const comment = await createComment(
            content.trim(),
            req.user!.userId,
            postId
        );

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });
    } catch (error) {
        console.error("Create comment error:", error);

        return res.status(500).json({
            message: "Failed to create comment"
        });
    }
};

export const getCommentsController = async (
    req: Request,
    res: Response
) => {
    const postId = Number(req.params.id);

    if (!Number.isInteger(postId) || postId <= 0) {
        return res.status(400).json({
            message: "Invalid post ID"
        });
    }

    try {
        const comments = await getComments(postId);

        return res.json({ comments });
    } catch (error) {
        console.error("Get comments error:", error);

        return res.status(500).json({
            message: "Failed to fetch comments"
        });
    }
};

export const deleteCommentController = async (
    req: Request,
    res: Response
) => {
    const commentId = Number(req.params.id);

    if (!Number.isInteger(commentId) || commentId <= 0) {
        return res.status(400).json({
            message: "Invalid comment ID"
        });
    }

    try {
        const comment = await deleteComment(
            commentId,
            req.user!.userId
        );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        return res.json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Delete comment error:", error);

        return res.status(500).json({
            message: "Failed to delete comment"
        });
    }
};