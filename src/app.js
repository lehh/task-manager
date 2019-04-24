require('./db/mongoose');

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

//Routes
const usersRoute = require('./routes/users');
const tasksRoute = require('./routes/tasks');

app.use(express.json());
app.use('/users', usersRoute);
app.use('/tasks', tasksRoute);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});