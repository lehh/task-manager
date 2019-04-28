require('./db/mongoose');

const express = require('express');

const app = express();

//Routes
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

app.use(express.json());
app.use('/users', usersRoute);
app.use('/tasks', tasksRoute);

module.exports = app;