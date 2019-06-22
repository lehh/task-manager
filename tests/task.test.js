const request = require('supertest');
const app = require('../src/app');
const { testTask, testUser, testTask2, setupTasks, setupUsers } = require('./fixtures/dbConn');

const token = `Bearer ${testUser.tokens[0]}`;
const taskId = testTask._id.toString();
const task2Id = testTask2._id.toString();

beforeAll(async () => {
    await setupUsers();
    await setupTasks();
});

test('POST /tasks success', (done) => {
    request(app).post('/tasks')
        .set("Authorization", token)
        .send({
            title: "test2",
            description: "test description2",
            isNote: false,
            completed: false
        })
        .expect(201, done);
});

test('GET /tasks success', (done) => {
    request(app).get('/tasks')
        .set("Authorization", token)
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body.length).toEqual(2); //Check if it returns only the testUser tasks.
            done();
        });
});

test('GET /tasks/id success', (done) => {
    request(app).get(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send()
        .expect(200)
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body._id).toEqual(taskId);
            done();
        });
});

test('GET /tasks/id not found', (done) => {
    request(app).get(`/tasks/${task2Id}`)
        .set("Authorization", token)
        .send()
        .expect(404, done);
});

test('PATCH /tasks/id success', (done) => {
    request(app).patch(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send(testTask)
        .expect(200, done);
});

test('PATCH /tasks/id not found', (done) => {
    request(app).patch(`/tasks/${task2Id}`)
        .set("Authorization", token)
        .send(testTask)
        .expect(404, done);
});

test('DELETE /tasks/id success', (done) => {
    request(app).delete(`/tasks/${taskId}`)
        .set("Authorization", token)
        .send()
        .expect(200, done);
});

test('DELETE /tasks/id not found', (done) => {
    request(app).delete(`/tasks/${task2Id}`)
        .set("Authorization", token)
        .send()
        .expect(404, done);
});