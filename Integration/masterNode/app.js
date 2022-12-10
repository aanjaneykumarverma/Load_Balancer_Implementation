const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const hostRouter = require('./routes/hostRoutes');
const vmRouter = require('./routes/vmRoutes');
const taskRouter = require('./routes/taskRoutes');
const Scheduler = require('./utils/scheduler');

const app = express();

app.enable('trust proxy');
app.set('views', path.join(__dirname, 'views'));

//1) middleware
//Implement CORS
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting of queries from a single IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body, with size at max 10KB
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Data sanitization against NoSQL query injection
app.use(mongoSanitize());
//Data sanitization  against XSS
app.use(xss());
//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['host', 'cpu', 'memory', 'task'],
  })
);

app.use(compression());
// Serving static files
//app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2)Routes

//app.use("/", hostRouter);
app.use('/api/v1/host', hostRouter);
app.use('/api/v1/vm', vmRouter);
app.use('/api/v1/task', taskRouter);

app.all('*', (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
});

// ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);
//3) Start Server
const scheduler = new Scheduler(2);
scheduler.setup();
scheduler.schedule();
scheduler.updateStats();
scheduler.checkResult();
module.exports = app;
