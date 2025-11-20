const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

// POST /api/users/fetch - Fetch from RandomUser API and insert into DB
router.post('/fetch', userController.fetchAndStoreUsers);

// GET /api/users - List all users
router.get('/', userController.getAllUsers);

// PUT /api/users/:uuid - Update a user
router.put('/:uuid', userController.updateUser);

module.exports = router;
