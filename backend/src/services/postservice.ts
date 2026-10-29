import pool from "../db";

export const updatePost = async (
    postId: number,
    userId: number,
    content: string
) => {
    const result = await pool.query(
        `UPDATE posts
         SET content = $1
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [content, postId, userId]
    );

    return result.rows[0] ?? null;
};

export const deletePost = async (
    postId: number,
    userId: number
) => {
    const result = await pool.query(
        `DELETE FROM posts
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [postId, userId]
    );

    return result.rows[0] ?? null;
};
export const createPost = async (content: string, userId: number) => {
    const result = await pool.query(
        `INSERT INTO posts (content, user_id)
         VALUES ($1, $2)
         RETURNING *`,
        [content, userId]
    );

    return result.rows[0];
};

export const getPosts = async () => {
    const result = await pool.query(
        "SELECT * FROM posts ORDER BY created_at DESC"
    );

    return result.rows;
};