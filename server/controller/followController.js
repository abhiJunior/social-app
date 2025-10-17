import { pool } from "../config/Dbconfig.js";

export const follow = async (req, res) => {
  const followerId = req.params.id;
  const { followeeId } = req.body;
  try {
    // Avoid self-follow
    if (followerId === String(followeeId)) {
      return res.status(400).json({ message: "Cannot follow yourself." });
    }
    // Insert if not exists
    await pool.query(
      'INSERT IGNORE INTO followers (follower_id, followee_id) VALUES (?, ?)',
      [followerId, followeeId]
    );
    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const unfollow = async (req, res) => {
  const followerId = req.params.id;
  const { followeeId } = req.body;
  try {
    await pool.query(
      'DELETE FROM followers WHERE follower_id = ? AND followee_id = ?',
      [followerId, followeeId]
    );
    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getFollowers = async (req, res) => {
  const userId = req.params.id;
  try {
    const [followers] = await pool.query(`
      SELECT u.id, u.name, u.email FROM users u
      JOIN followers f ON u.id = f.follower_id
      WHERE f.followee_id = ?
    `, [userId]);
    res.json(followers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

}

export const getFollowing = async (req, res) => {
  const userId = req.params.id;
  try {
    const [following] = await pool.query(`
      SELECT u.id, u.name, u.email FROM users u
      JOIN followers f ON u.id = f.followee_id
      WHERE f.follower_id = ?
    `, [userId]);
    res.json(following);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}