const connectDB = require('./dbconfig/db');
const cors = require('cors');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');
const adminRouter = require('./routes/adminRouter');
require('dotenv').config();

const express = require('express');
const app = express();  
const port = process.env.PORT || 3000;

const corsOptions = {
  origin: function (origin, callback) {
    if (origin) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  }, 
  credentials: true, 
};

app.use(express.json());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

connectDB();

app.use('/auth', authRouter);
app.use('/user', jwtMiddleware.verifyUser, userRouter);
app.use('/admin',  jwtMiddleware.verifyAdmin, adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});