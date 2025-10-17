
import { pool } from "../config/Dbconfig.js";
export const getUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.*, 
        TIMESTAMPDIFF(YEAR, u.dob, CURDATE()) AS age,
        COALESCE(follower_counts.count, 0) AS follower_count,
        COALESCE(following_counts.count, 0) AS following_count
      FROM users u
      LEFT JOIN (
        SELECT followee_id, COUNT(*) AS count
        FROM followers
        GROUP BY followee_id
      ) AS follower_counts ON u.id = follower_counts.followee_id
      LEFT JOIN (
        SELECT follower_id, COUNT(*) AS count
        FROM followers
        GROUP BY follower_id
      ) AS following_counts ON u.id = following_counts.follower_id;
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getUser = async(req,res)=>{
  const userId = req.params.id 
  try{
      const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      res.status(200).json(user);
  }catch(e){
    res.status(500).json({ error: error.message });
  }
}


export const createUser = async(req,res)=>{
    const { name, email, phone, dob, avatar_url } = req.body;
    try{
        const [result] = await pool.query(
            'INSERT INTO users (name, email, phone, dob, avatar_url) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, dob, avatar_url]
        );
        res.status(201).send(result)
    }catch(e){
        console.log(e.message)
        res.status(500).send(e.message)
    }
}

export const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, dob, avatar_url } = req.body;

  try {
    // Get the existing user record first
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingUser = existingUsers[0];

    // Use the new value if provided, else keep the old one
    const updatedName = name ?? existingUser.name;
    const updatedEmail = email ?? existingUser.email;
    const updatedPhone = phone ?? existingUser.phone;
    const updatedDob = dob ?? existingUser.dob;
    const updatedAvatar = avatar_url ?? existingUser.avatar_url;

    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, dob = ?, avatar_url = ? WHERE id = ?',
      [updatedName, updatedEmail, updatedPhone, updatedDob, updatedAvatar, userId]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      id: userId,
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
      dob: updatedDob,
      avatar_url: updatedAvatar,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteUser = async(req,res)=>{
    const userId = req.params.id
    console.log(userId)
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}