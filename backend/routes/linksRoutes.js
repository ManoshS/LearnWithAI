const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');
const { authenticate } = require('../middleware/auth');

router.get('/getAllLikes/:id', likesController.findAllLikes);
router.delete('/delete/:id',likesController.delete)
router.post('/addLike',  likesController.create);

module.exports = router;