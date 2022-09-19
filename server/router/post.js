const router = require('express').Router();
const auth = require('../middleware/auth');
const postController = require('../controllers/postController');

// Create new Post
router.post('/', auth, postController.createNewPost);
// Get all post
router.get('/', postController.getAllPost);
// Get a post of given id
router.get('/:id', postController.getPostById);
// Update Post
router.patch('/:id', auth, postController.updatePost);
// delete
router.delete('/:id', auth, postController.deletePost);
module.exports = router;
