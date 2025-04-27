const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const { authenticate } = require('../middleware/auth');

router.put('/update', postsController.update);
router.get('/getAllPosts/:id', postsController.findAllPosts);
router.delete('/delete',postsController.delete)
router.post('/createPost',  postsController.create);

module.exports = router;