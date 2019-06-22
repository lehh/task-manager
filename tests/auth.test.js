const request = require('supertest');
const app = require('../src/app');
const { testTask, testUser, setupTasks, setupUsers } = require('./fixtures/dbConn');

const token = "Bearer 123";
const taskId = testTask._id.toString();

beforeAll(async () => {
    await setupUsers();
    await setupTasks();
});

//Users
test("GET /users/me", (done) => {
    request(app).get('/users/me')
        .set("Authorization", token)
        .send()
        .expect(401, done);
});

test("PATCH /users/me", (done) => {
    request(app).patch('/users/me')
        .set("Authorization", token)
        .send(testUser)
        .expect(401, done);
});

test("DELETE /users/me failure", (done) => {
    request(app).delete('/users/me')
        .set("Authorization", token)
        .send()
        .expect(401, done);
});

//Tasks
test('POST /tasks', (done) => {
    request(app).post('/tasks')
        .set("Authorization", token)
        .send({
            title: "test2",
            description: "test description2",
            isNote: false,
            completed: false
        })
        .expect(401, done);
});

test('GET /tasks', (done) => {
    request(app).get('/tasks')
        .set("Authorization", token)
        .send()
        .expect(401, done);
});

test('GET /tasks/id', (done) => {
    request(app).get(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send()
        .expect(401, done);
});

test('PATCH /tasks/id', (done) => {
    request(app).patch(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send(testTask)
        .expect(401, done);
});

test('DELETE /tasks/id', (done) => {
    request(app).delete(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send()
        .expect(401, done);
});