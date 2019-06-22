const request = require('supertest');
const app = require('../src/app');
const { testUser, setupUsers } = require('./fixtures/dbConn');

beforeAll(async () => {
    await setupUsers();
});

test("POST /users", (done) => {
    request(app).post('/users')
        .send({
            name: "testName",
            email: "test@example2.com",
            password: "testPass"
        })
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

test("POST /users/logout", (done) => {
    request(app).post('/users/logout')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("POST /users/logoutAll", async (done) => {
    await setupUsers();

    request(app).post('/users/logoutAll')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});

test("DELETE /users/me success", async (done) => {
    await setupUsers();

    request(app).delete('/users/me')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send()
        .expect(200, done);
});