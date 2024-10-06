import connectDB from './dbconfig/db';
const cors = require('cors');
import {verifyToken} from './middlewares/jwtMiddleware';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
require('dotenv').config();

const express = require('express');
const app = express();  
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

connectDB();

app.use('/user', verifyToken, userRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});