import { Request, Response } from "express";
import pool from "../db";
import {
    likePost,
    unlikePost,
    getPostLikes
} from "../services/likeservice";

export const likePostController = async (
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
        const post = await pool.query(
            "SELECT id FROM posts WHERE id = $1",
            [postId]
        );

        if (post.rows.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const like = await likePost(postId, req.user!.userId);

        return res.status(like ? 201 : 200).json({
            message: like ? "Post liked" : "Post already liked",
            like
        });
    } catch (error) {
        console.error("Like post error:", error);

        return res.status(500).json({
            message: "Failed to like post"
        });
    }
};

export const unlikePostController = async (
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
        const like = await unlikePost(postId, req.user!.userId);

        if (!like) {
            return res.status(404).json({
                message: "Like not found"
            });
        }

        return res.json({
            message: "Post unliked"
        });
    } catch (error) {
        console.error("Unlike post error:", error);

        return res.status(500).json({
            message: "Failed to unlike post"
        });
    }
};

export const getPostLikesController = async (
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
        const post = await pool.query(
            "SELECT id FROM posts WHERE id = $1",
            [postId]
        );

        if (post.rows.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const likes = await getPostLikes(postId);

        return res.json({
            postId,
            likeCount: likes.like_count
        });
    } catch (error) {
        console.error("Get likes error:", error);

        return res.status(500).json({
            message: "Failed to fetch likes"
        });
    }
};