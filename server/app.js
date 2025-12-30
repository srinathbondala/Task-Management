const connectDB = require('./dbconfig/db');
const cors = require('cors');
const jwtMiddleware = require('./middlewares/jwtMiddleware');
const { createRateLimiter } = require('./middlewares/rateLimiter');
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

app.use(
  createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 500,
  })
);

connectDB();

app.use(
  '/auth',
  createRateLimiter({max: 20}),
  authRouter
);

app.use(
  '/user',
  createRateLimiter({ max: 300 }),
  jwtMiddleware.verifyUser,
  userRouter
);

// router.get(
//   '/projects/:projectId/tasks',
//   jwtMiddleware.verifyUser,
//   checkProjectAccess,
//   taskController.getTasks
// );


app.use('/admin',  jwtMiddleware.verifyAdmin, adminRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});