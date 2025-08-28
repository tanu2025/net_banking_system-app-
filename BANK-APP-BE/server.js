// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

// const app = express();
// const port = process.env.PORT || 3007;

// app.use(cors(
//     {
//     origin: 'http://localhost:3006',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }
// ));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/users', userRoutes);
// app.use('/api/transactions', transactionRoutes);

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


//correct
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const userRoutes = require('./routes/userRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

// const app = express();
// const port = process.env.PORT || 3007;

// // ✅ Fix: Allow requests from frontend running on localhost:3000
// app.use(cors({
//     origin: 'http://localhost:3000', // ← change this to match your frontend port
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//     .then(() => console.log('MongoDB connected successfully'))
//     .catch(err => console.error('MongoDB connection error:', err));

// app.use('/api/users', userRoutes);
// app.use('/api/transactions', transactionRoutes);

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
const port = process.env.PORT || 3007;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);

// ✅ Add this route
app.get('/', (req, res) => {
  res.send('Backend server is running.');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

