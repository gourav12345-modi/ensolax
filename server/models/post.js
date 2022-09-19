const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new Schema({
  description: { type: String },
  images: [{ type: String }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
