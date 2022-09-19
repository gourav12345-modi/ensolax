require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const postRouter = require('./router/post');
const userRouter = require('./router/user');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const DBURL = 'mongodb://localhost:27017/ensolax';
const PORT = process.env.PORT || 1300;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(express.json());
app.use(helmet());
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
}).catch((err) => {
  console.log(err);
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
