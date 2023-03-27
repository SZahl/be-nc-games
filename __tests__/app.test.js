
const app = require('../app.js');
const db = require('../db/connection.js');
const request = require('supertest');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js')

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/categories', () => {
    test('200: should return an array of objects of currently available categories', () => {
        return request(app)
        .get('/api/categories')
        .expect(200)
        .then(({ body }) => {
            const { categories } = body;
            expect(categories).toHaveLength(4);
            categories.forEach((category) => {
            expect(category).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                })
        })
    })})
})

describe('GET /*', () => {
    test('404: responds with error message when given a path that has a typo', () => {
        return request(app)
        .get('/api/catagories')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Path not found');
        })
    })
})
