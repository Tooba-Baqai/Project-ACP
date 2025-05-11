const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const contactRoutes = require('./routes/contacts');

dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/art-heaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/', (req, res) => {
  res.send('Art Heaven API is running...');
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
const ALTERNATIVE_PORTS = [5001, 5002, 5003, 3000, 8080];

const startServer = (port) => {
  const server = app.listen(port)
    .on('listening', () => {
      console.log(`Server running on port ${port}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying another port...`);
        if (ALTERNATIVE_PORTS.length > 0) {
          startServer(ALTERNATIVE_PORTS.shift());
        } else {
          console.error('All ports are in use. Please free up a port or specify a different one.');
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
      }
    });
};

startServer(PORT); 