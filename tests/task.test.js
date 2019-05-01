const request = require('supertest');
const app = require('../src/app');
const { testTask, testUser, setupTasks } = require('./fixtures/dbConn');

beforeAll(async () => {
    await setupUsers();
    await setupTasks();
});

test('POST /tasks', async (done) => {
    var req = request(app).post('/tasks')
        .set("Authorization", `Bearer ${testUser.tokens[0]}`)
        .send({
            title: "test2",
            description: "test description2",
            isNote: false,
            completed: false
        })
        .expect(201, done);
})