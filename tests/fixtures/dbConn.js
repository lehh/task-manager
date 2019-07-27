const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Task = require('../../src/models/task');

var testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "test",
    email: "test@example.com",
    password: "somepass",
    tokens: [jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)]
}

testUserId = new mongoose.Types.ObjectId();
const testUser2 = {
    _id: testUserId,
    name: "test",
    email: "test@example.com",
    password: "somepass",
    tokens: [jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)]
}

testTaskId = new mongoose.Types.ObjectId();
const testTask = {
    _id: testTaskId,
    title: "test",
    description: "test description",
    isNote: true,
    completed: false,
    owner: testUser._id
}

testTaskId = new mongoose.Types.ObjectId();
const testTask2 = {
    _id: testTaskId,
    title: "test",
    description: "test description",
    isNote: true,
    completed: false,
    owner: testUser2._id
}

setupUsers = async () => {
    await User.deleteMany({});
    await new User(testUser).save();
    await new User(testUser2).save();
}

setupTasks = async () => {
    await Task.deleteMany({});
    await new Task(testTask).save();
    await new Task(testTask2).save();
}

module.exports = {
    testUser,
    testTask,
    testTask2,
    setupUsers,
    setupTasks
}