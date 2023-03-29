
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
                })})
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

describe('GET /api/reviews/:review_id', () => {
    test('200: should return an object containing the properties of the requested review id', () => {
        return request(app)
        .get('/api/reviews/6')
        .expect(200)
        .then(({ body }) => {
            const { review } = body;
            review.forEach((review) => {
                expect(review).toMatchObject({
                    review_id: 6,
                    title: 'Occaecat consequat officia in quis commodo.',
                    category: 'social deduction',
                    designer: 'Ollie Tabooger',
                    owner: 'mallionaire',
                    review_body: 'Fugiat fugiat enim officia laborum quis. Aliquip laboris non nulla nostrud magna exercitation in ullamco aute laborum cillum nisi sint. Culpa excepteur aute cillum minim magna fugiat culpa adipisicing eiusmod laborum ipsum fugiat quis. Mollit consectetur amet sunt ex amet tempor magna consequat dolore cillum adipisicing. Proident est sunt amet ipsum magna proident fugiat deserunt mollit officia magna ea pariatur. Ullamco proident in nostrud pariatur. Minim consequat pariatur id pariatur adipisicing.',
                    review_img_url: 'https://images.pexels.com/photos/207924/pexels-photo-207924.jpeg?w=700&h=700',
                    created_at: '2020-09-13T14:19:28.077Z',
                    votes: 8
                })
            })
        })
    })
    test('400: should return an error message when review_id does not exist', () => {
        return request(app)
        .get('/api/reviews/20')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Review not found');
        })
    })
    test('400: should return an error message when review_id is invalid', () => {
        return request(app)
        .get('/api/reviews/banana')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid ID');
        })
    })
})

describe('GET /api/reviews', () => {
    test('200: should return a reviews array containing all available review objects, each containing the following properties', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toHaveLength(13);
            reviews.forEach((review) => {
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_body: expect.any(String),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(String)
                })
            })
        })
    })
    test('200: should return reviews sorted by date in descending order', () => {
        return request(app)
        .get('/api/reviews')
        .expect(200)
        .then(({ body }) => {
            const { reviews } = body;
            expect(reviews).toBeSortedBy("created_at", { descending: true})
        })
    })
})
