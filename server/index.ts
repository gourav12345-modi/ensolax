import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import postRouter from './router/post';
import userRouter from './router/user';
import { errorHandler } from './middleware/errorHandler';

dotenv.config()

if (!process.env.JWT_TOKEN_SECRET) {
  console.error('JWT_TOKEN_SECRET environment variable is missing.');
  process.exit(1);
}

if (process.env.NODE_ENV=='production') {
  if(!process.env.DBURL) {
    console.error('DBURL environment variable is missing.');
    process.exit(1);
  }
}

const app = express();
const DBURL = process.env.DBURL || 'mongodb://localhost:27017/ensolax';
const PORT = process.env.PORT || 1300;



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.disable('x-powered-by');
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));

mongoose.connect(DBURL, {
  useCreateIndex: true,
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { connection } = mongoose;

connection.once('open', () => {
  console.log('connected to database');
})

connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.log(err);
});

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

app.use('/api/post', postRouter);
app.use('/api/user', userRouter);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`listing on http://localhost:${PORT}`);
});
