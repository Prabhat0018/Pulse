import pool from "../db";
import { createNotification } from "./notificationservice";
export const createComment = async (
    content: string,
    userId: number,
    postId: number
) => {
    const result = await pool.query(
        `INSERT INTO comments (content, user_id, post_id)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [content, userId, postId]
    );

    const postOwner = await pool.query(
    "SELECT user_id FROM posts WHERE id = $1",
    [postId]
);

await createNotification(
    postOwner.rows[0].user_id,
    userId,
    "comment",
    postId,
    result.rows[0].id
);

    return result.rows[0];
};

export const getComments = async (postId: number) => {
    const result = await pool.query(
        `SELECT
            comments.id,
            comments.content,
            comments.created_at,
            users.id AS user_id,
            users.name AS username
         FROM comments
         JOIN users ON comments.user_id = users.id
         WHERE comments.post_id = $1
         ORDER BY comments.created_at DESC`,
        [postId]
    );

    return result.rows;
};

export const deleteComment = async (
    commentId: number,
    userId: number
) => {
    const result = await pool.query(
        `DELETE FROM comments
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [commentId, userId]
    );

    return result.rows[0] ?? null;
};