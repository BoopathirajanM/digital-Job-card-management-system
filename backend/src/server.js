require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobcard');
const userRoutes = require('./routes/userRoutes');
const billingRoutes = require('./routes/billing');
const notificationRoutes = require('./routes/notifications');

const app = express();
app.use(
  cors({
    origin: "https://autoserve-frontend.onrender.com",
    credentials: true,
  })
);
app.use(express.json());

// debug: show loaded env (remove later)
console.log('PORT from .env:', process.env.PORT);
console.log('MONGO_URI from .env:', !!process.env.MONGO_URI ? '[SET]' : '[NOT SET]');

app.use('/api/auth', authRoutes);
app.use('/api/jobcards', jobRoutes);
app.use('/api/jobcards', billingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI is not set. Please create a .env file with MONGO_URI.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log('Server running on', PORT));
  })
  .catch(err => { console.error('Mongo connect error', err); process.exit(1); });
