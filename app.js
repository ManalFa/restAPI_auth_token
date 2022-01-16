const express = require('express');
const app = express();
const dotenv=require('dotenv');
const mongoose = require('mongoose');
const authRoute = require('./routes/auth');

dotenv.config();
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true,useUnifiedTopology: true }, () => console.log("connected to DB"));

app.use(express.json());
app.use('/api/user', authRoute);

app.listen(8000, () => console.log("Server is up and running"));