import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role avatar')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};