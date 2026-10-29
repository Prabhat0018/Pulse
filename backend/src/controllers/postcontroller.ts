import { Request, Response } from "express";
import {
    createPost,
    getPosts,
    updatePost,
    deletePost
} from "../services/postservice";

export const getPostsController = async (
    req: Request,
    res: Response
) => {
    try {
        const posts = await getPosts();

        res.json({
            posts
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch posts"
        });
    }
};

export const createPostController = async (
    req: Request,
    res: Response
) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    try {
      const post = await createPost(content, req.user!.userId);

        res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create post"
        });
    }
};

export const updatePostController = async (
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
            message: "Content is required"
        });
    }

    try {
        const post = await updatePost(
            postId,
            req.user!.userId,
            content.trim()
        );

        if (!post) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.json({
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to update post"
        });
    }
};

export const deletePostController = async (
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
        const deletedPost = await deletePost(
            postId,
            req.user!.userId
        );

        if (!deletedPost) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.json({
            message: "Post deleted successfully",
            id: deletedPost.id
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Failed to delete post"
        });
    }
};