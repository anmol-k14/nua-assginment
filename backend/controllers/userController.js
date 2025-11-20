const axios = require('axios');
const userService = require('../services/userService');

// Fetch users from RandomUser API and store in DB
const fetchAndStoreUsers = async (req, res) => {
  try {
    let totalInserted = 0;
    const batchSize = 50; // Fetch 50 users per request
    const totalRecords = 1000;
    const batches = Math.ceil(totalRecords / batchSize);

    console.log(`🔄 Starting to fetch ${totalRecords} users...`);

    for (let i = 0; i < batches; i++) {
      const page = i + 1;
      const results = (i === batches - 1) ? (totalRecords % batchSize || batchSize) : batchSize;
      
      const response = await axios.get(
        `https://randomuser.me/api/?results=${results}&page=${page}`
      );

      const users = response.data.results.map(user => ({
        uuid: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        email: user.email,
        city: user.location.city
      }));

      // Insert users via service (service will skip duplicates and return count)
      const inserted = await userService.bulkInsertUsers(users);
      totalInserted += inserted;

      console.log(`Batch ${page}/${batches} completed`);
    }

    res.status(200).json({
      success: true,
      message: `Successfully inserted ${totalInserted} users`,
      totalInserted
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching users from API',
      error: error.message
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching users from database',
      error: error.message
    });
  }
};

// Update user by UUID
const updateUser = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { name, email, city } = req.body;

    const updated = await userService.updateUser(uuid, { name, email, city });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

module.exports = {
  fetchAndStoreUsers,
  getAllUsers,
  updateUser
};