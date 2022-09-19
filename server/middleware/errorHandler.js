const mongoose = require('mongoose');
const multer = require('multer');

class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    } if (this instanceof NotFound
      || this instanceof mongoose.CastError
      || this instanceof PostNotFound) {
      return 404;
    } if (this instanceof TooLargeFileSize) {
      return 413;
    } if (this instanceof NotSupportedFile) {
      return 415;
    } if (this instanceof DuplicateData) {
      return 403;
    } if (this instanceof WrongCredentials) {
      return 401;
    }
    return 500;
  }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class TooLargeFileSize extends GeneralError { }
class NotSupportedFile extends GeneralError { }
class DuplicateData extends GeneralError { }
class WrongCredentials extends GeneralError { }
class PostNotFound extends GeneralError { }

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error instanceof PostNotFound) {
    return res.status(404).json({ message: 'Post not found.' });
  } if (error instanceof multer.MulterError) {
    return res.status(413).json({ message: 'Maximum file limit is 5mb.' });
  } if (error instanceof mongoose.CastError) {
    return res.status(400).json({ message: 'Invalid Id' });
  } if (error) {
    if (error.message === 'Not valid file type') {
      return res.status(415).json({ message: error.message });
    }
  }

  if (error instanceof GeneralError) {
    return res.status(error.getCode()).json({
      status: 'error',
      message: error.message,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: error.message,
  });
};

module.exports = {
  errorHandler,
  BadRequest,
  PostNotFound,
  WrongCredentials,
  DuplicateData,
};
