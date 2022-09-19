const fs = require('fs');
const multer = require('multer');
const Post = require('../models/post');
const { PostNotFound, BadRequest } = require('../middleware/errorHandler');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file);
  if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') || (req.body.description)) {
    cb(null, true);
  } else {
    cb(new Error('Not valid file type'), false);
  }
};

const upload = multer({
  storage,
  limits: {
  // 5 mb
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

function deleteFiles(files, callback) {
  let i = files.length;
  files.forEach((filepath) => {
    fs.unlink(`./uploads/${filepath.replace()}`, (err) => {
      i -= 1;
      if (err) {
        callback(err);
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

// Create new Post
const createNewPost = (req, res, next) => {
  const images = [];
  upload.array('selectedFile')(req, res, (error) => {
    if (error) {
      next(error);
    } else if (req.file) {
      images.push(req.file.filename);
    } else if (req.files && req.files.length) {
      req.files.forEach((image) => {
        images.push(image.filename);
      });
    } else if ((!req.body) || (!req.body.description)) {
      next(new BadRequest('No containt to post.'));
    }
    const { description } = req.body;
    const post = new Post({
      description,
      images,
      author: req.user.id,
    });
    post.save().then((savedPost) => res.status(201).json(savedPost))
      .catch((newError) => {
        next(newError);
      });
  });
};

// Get all post
const getAllPost = (_req, res, next) => {
  Post.find()
    .populate('author', 'name _id')
    .then((allPost) => res.json(allPost))
    .catch((error) => {
      next(error);
    });
};

// Get a post of given id
const getPostById = (req, res, next) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post) => {
    if (!post) {
      throw new PostNotFound();
    } else {
      return res.json(post);
    }
  }).catch((error) => {
    next(error);
  });
};

// Update Post
const updatePost = (req, res, next) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post) => {
    if (!post) {
      throw new PostNotFound();
    }

    deleteFiles(post.images, (error) => {
      if (error) {
        next(error);
      } else {
        console.log('all files removed');
      }
    });
    const images = [];
    upload.array('selectedFile')(req, res, (error) => {
      if (error) {
        next(error);
      } else {
        if (req.file) {
          images.push(req.file.path);
        } else {
          req.files.forEach((image) => {
            images.push(image.filename);
          });
        }
        const { description } = req.body;
        Post.updateOne({ _id: id }, {
          description,
          images,
        }).then((_newPost) => res.status(200).json({ _id: id, ...req.body, images }))
          .catch((newError) => {
            next(newError);
          });
      }
    });
  }).catch((error) => {
    next(error);
  });
};

// delete
const deletePost = (req, res, next) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post) => {
    if (!post) {
      throw new PostNotFound();
    }
    deleteFiles(post.images, (error) => {
      if (error) {
        return next(error);
      }
      console.log('all files removed');
    });
    Post.deleteOne({ _id: id }).then((stats) => {
      if (stats.deletedCount === 0) {
        throw new PostNotFound();
      } else {
        res.json({ deleted: id });
      }
    }).catch((error) => {
      next(error);
    });
  }).catch((error) => {
    next(error);
  });
};

module.exports = {
  createNewPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
};
