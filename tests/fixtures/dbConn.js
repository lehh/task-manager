const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "test",
    email: "test@example.com",
    password: "somepass",
    tokens: [jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)]
}

const testTaskId = new mongoose.Types.ObjectId();
const testTask = {
    _id: testTaskId,
    title: "test",
    description: "test description",
    isNote: true,
    completed: false
}

setupUsers = async () => {
    await User.deleteMany({});
    await new User(testUser).save();
}

setupTasks = async () => {
    await Task.deleteMany({});
    await new Task(testTask).save();
}

module.exports = {
    testUser,
    testTask,
    setupUsers,
    setupTasks
}