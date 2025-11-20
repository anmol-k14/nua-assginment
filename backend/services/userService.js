const User = require('../models/User');

const bulkInsertUsers = async (users) => {
  let totalInserted = 0;

  for (const userData of users) {
    try {
      await User.create(userData);
      totalInserted++;
    } catch (error) {
      // Skip duplicates, log other errors
      if (error.name !== 'SequelizeUniqueConstraintError') {
        console.error('Error inserting user in service:', error.message);
      }
    }
  }

  return totalInserted;
};

const getAllUsers = async () => {
  return await User.findAll({ order: [['id', 'ASC']] });
};

const getUserByUuid = async (uuid) => {
  return await User.findOne({ where: { uuid } });
};

const updateUser = async (uuid, fields) => {
  const user = await getUserByUuid(uuid);
  if (!user) return null;

  const { name, email, city } = fields;
  if (name) user.name = name;
  if (email) user.email = email;
  if (city) user.city = city;

  await user.save();
  return user;
};

module.exports = {
  bulkInsertUsers,
  getAllUsers,
  getUserByUuid,
  updateUser,
};
