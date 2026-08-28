import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const formatUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar || '',
  preferences: user.preferences || {
    theme: 'system',
  },
});

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('name email role avatar')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('GET USERS ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/users/profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('GET USER PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (name) {
      if (name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty',
        });
      }
      user.name = name.trim();
    }

    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists && emailExists._id.toString() !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use by another account',
        });
      }
      user.email = email.toLowerCase().trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/users/preferences
export const updatePreferences = async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.preferences) {
      user.preferences = {
        theme: 'system',
      };
    }

    if (theme !== undefined) {
      if (!['light', 'dark', 'system'].includes(theme)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid theme value. Allowed: light, dark, system',
        });
      }
      user.preferences.theme = theme;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: formatUserResponse(user),
    });
  } catch (error) {
    console.error('UPDATE PREFERENCES ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/users/change-password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long',
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect current password',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};