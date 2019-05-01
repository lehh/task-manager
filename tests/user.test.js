const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');

const testUserId = new mongoose.Types.ObjectId();
const testUser = {
    _id: testUserId,
    name: "test",
    email: "test@example.com",
    password: "somepass",
    tokens: [jwt.sign({ _id: testUserId }, process.env.JWT_SECRET)]
}

beforeAll(async () => {
    await User.deleteMany({});
    //await new User(testUser).save();
});

test("POST /users", (done) => {
    request(app).post('/users')
        .send(testUser)
        .expect(201, done);
});

test("POST /users/login success", (done) => {
    request(app).post('/users/login')
        .send(testUser)
        .expect(200, done);
});

test("POST /users/login failure", (done) => {
    request(app).post('/users/login')
        .send({
            email: "email@notfound.com",
            password: "somepass"
        })
        .expect(401, done);
});

test("GET /users/me success", (done) => {
    request(app).get('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("GET /users/me failure", (done) => {
    request(app).get('/users/me')
        .send()
        .expect(401, done);
});

test("PATCH /users/me success", (done) => {
    request(app).patch('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send(testUser)
        .expect(200, done);
});

test("PATCH /users/me failure", (done) => {
    request(app).patch('/users/me')
        .send(testUser)
        .expect(401, done);
});

test("POST /users/logout", (done) => {
    request(app).post('/users/logout')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("POST /users/logoutAll", async (done) => {
    await User.deleteMany({});
    await new User(testUser).save();

    request(app).post('/users/logoutAll')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("DELETE /users/me success", async (done) => {
    await User.deleteMany({});
    await new User(testUser).save();

    request(app).delete('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("DELETE /users/me failure", (done) => {
    request(app).delete('/users/me')
        .send()
        .expect(401, done);
});