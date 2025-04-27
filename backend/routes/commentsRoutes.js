const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');
const { authenticate } = require('../middleware/auth');

router.get('/getAllComments/:id', commentsController.findAllCommentsById);
router.delete('/delete/:id',commentsController.delete)
router.post('/addComment',  commentsController.create);


module.exports = router;