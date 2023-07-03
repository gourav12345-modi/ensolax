import fs from 'fs';
import multer, { Multer } from 'multer';
import { NextFunction, Request, Response, Router } from 'express';
import Post from '../models/post';
import { PostNotFound, BadRequest } from '../middleware/errorHandler';
import { AuthRequest, IPost, IUser } from 'type';


const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback ) => {
  console.log(file);
  if ((file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') || (req.body.description)) {
    cb(null, true);
  } else {
    cb(new Error('Not valid file type'));
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

function deleteFiles(files: string[], callback: (err: Error | null) => void) {
  let i = files.length;
  files.forEach((filepath) => {
    fs.unlink(`./uploads/${filepath}`, (err) => {
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
const createNewPost = (req: AuthRequest, res: Response, next: NextFunction) => {
  const images: string[] = [];
  upload.array('selectedFile')(req, res, (error) => {
    if (error) {
      next(error);
    } else if (req.file) {
      images.push(req.file.filename);
    } else if (req.files && req.files.length) {
      (req.files as Express.Multer.File[]).forEach((image) => {
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
    post.save().then((savedPost: IUser) => res.status(201).json(savedPost))
      .catch((newError: Error) => {
        next(newError);
      });
  });
};

// Get all post
const getAllPost = (_req: Request, res: Response, next: NextFunction) => {
  Post.find()
    .populate('author', 'name _id')
    .then((allPost: IPost[]) => res.json(allPost))
    .catch((error: Error) => {
      next(error);
    });
};

// Get a post of given id
const getPostById = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post: IPost) => {
    if (!post) {
      throw new PostNotFound("Post doesn't exist.");
    } else {
      return res.json(post);
    }
  }).catch((error: Error) => {
    next(error);
  });
};

// Update Post
const updatePost = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post: IPost) => {
    if (!post) {
      throw new PostNotFound("Post doesn't exist.");
    }

    deleteFiles(post.images, (error) => {
      if (error) {
        next(error);
      } else {
        console.log('all files removed');
      }
    });
    const images: string[] = [];
    upload.array('selectedFile')(req, res, (error) => {
      if (error) {
        next(error);
      } else {
        if (req.file) {
          images.push(req.file.path);
        } else if(req.files){
          (req.files as Express.Multer.File[]).forEach((image: Express.Multer.File) => {
            images.push(image.filename);
          });
        }
        const { description } = req.body;
        Post.updateOne({ _id: id }, {
          description,
          images,
        }).then((_newPost: IPost) => res.status(200).json({ _id: id, ...req.body, images }))
          .catch((newError: Error) => {
            next(newError);
          });
      }
    });
  }).catch((error: Error) => {
    next(error);
  });
};

// delete
const deletePost = (req: AuthRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  Post.findOne({ _id: id }).then((post: IPost) => {
    if (!post) {
      throw new PostNotFound("Post doesn't exist.");
    }
    deleteFiles(post.images, (error) => {
      if (error) {
        return next(error);
      }
    });
    Post.deleteOne({ _id: id }).then((stats: any) => {
      if (stats.deletedCount === 0) {
        throw new PostNotFound("Post doesn't exist.");
      } else {
        res.json({ deleted: id });
      }
    }).catch((error: Error) => {
      next(error);
    });
  }).catch((error: Error) => {
    next(error);
  });
};

export {
  createNewPost,
  getAllPost,
  getPostById,
  updatePost,
  deletePost,
};
