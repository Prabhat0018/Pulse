import pool from "../db";
import { createNotification } from "./notificationservice";

export const likePost = async (
    postId: number,
    userId: number
) => {
    const result = await pool.query(
        `INSERT INTO likes (user_id, post_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, post_id) DO NOTHING
         RETURNING *`,
        [userId, postId]
    );
    const like = result.rows[0];

if (!like) {
    return null;
}

const postOwner = await pool.query(
    "SELECT user_id FROM posts WHERE id = $1",
    [postId]
);

await createNotification(
    postOwner.rows[0].user_id,
    userId,
    "like",
    postId
);

return like;

};

export const unlikePost = async (
    postId: number,
    userId: number
) => {
    const result = await pool.query(
        `DELETE FROM likes
         WHERE post_id = $1 AND user_id = $2
         RETURNING id`,
        [postId, userId]
    );

    return result.rows[0] ?? null;
};

export const getPostLikes = async (postId: number) => {
    const result = await pool.query(
        `SELECT
            COUNT(*)::int AS like_count
         FROM likes
         WHERE post_id = $1`,
        [postId]
    );

    return result.rows[0];
};