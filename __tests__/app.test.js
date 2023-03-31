
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
            expect(body.message).toBe('Invalid input');
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
                    comment_count: expect.any(Number)
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

describe('GET /api/reviews/:review_id/comments', () => {
    test('200: should return an array of comment objects, each containing these properties', () => {
        return request(app)
        .get('/api/reviews/2/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body;
            expect(comments).toHaveLength(3);
            comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    review_id: 2

                })
            })
        })
    })
    test('200: should return comments ordered by most recent first', () => {
        return request(app)
        .get('/api/reviews/3/comments')
        .expect(200)
        .then(({ body }) => {
            const { comments } = body;
            expect(comments).toBeSortedBy("created_at", { descending: true})
        })
    })
    test('200: should return message when searched review has no comments', () => {
        return request(app)
        .get('/api/reviews/1/comments')
        .expect(200)
        .then(({ body }) => {
            const { message } = body;
            expect(message).toBe('This review has no comments yet!');
        })
    })
    test('404: should return an error message when review_id does not exist', () => {
        return request(app)
        .get('/api/reviews/26/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Review not found');
        })
    })
    test('400: should return an error message when review_id is invalid', () => {
        return request(app)
        .get('/api/reviews/onion')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input');
        })
    })
})

describe('POST /api/reviews/:review_id/comments', () => {
    test('201: should return the posted comment with these added properties', () => {
        const comment = {
            username: "mallionaire",
            body: "More of this!"
        }
        return request(app)
        .post('/api/reviews/1/comments')
        .send(comment)
        .expect(201)
        .then(({ body }) => {
            const { comment } = body;
            expect(comment).toMatchObject({
                comment_id: 7,
                body: 'More of this!',
                votes: 0,
                author: 'mallionaire',
                review_id: 1,
                created_at: expect.any(String)
            })
        })
    })
    test('400: responds with an error message when missing input', () => {
        const comment = {
            username: "mallionaire"
        }
        return request(app)
        .post('/api/reviews/1/comments')
        .send(comment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Missing input')
        })
    })
    test('404: should respond with an error message when username is not found', () => {
        const comment = {
            username: 'nayad',
            body: 'I totally agree!'
        }
        return request(app)
        .post('/api/reviews/1/comments')
        .send(comment)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Username not found')
        })
    })
    test('400: should respond with an error message when review_id is invalid', () => {
        const comment = {
            username: "mallionaire",
            body: "More of this!"
        }
        return request(app)
        .post('/api/reviews/chair/comments')
        .send(comment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input')
        })
    })
    test('404: should respond with an error when review_id does not exist', () => {
        const comment = {
            username: "mallionaire",
            body: "More of this!"
        }
        return request(app)
        .post('/api/reviews/1000/comments')
        .send(comment)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Review not found')
        })
    })
})

describe('PATCH /api/reviews/:review_id', () => {
    test('201: should return the review with the updated amount of positive votes', () => {
        const vote = { inc_votes: 10 };
        return request(app)
        .patch('/api/reviews/2')
        .send(vote)
        .expect(201)
        .then(({ body }) => {
            const { review } = body;
            expect(review).toMatchObject({
                review_id: 2,
                title: 'Jenga',
                category: 'dexterity',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_body: 'Fiddly fun for all the family',
                review_img_url: 'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 15
            });
        })
    })
    test('201: should return the review with the updated amount of negative votes', () => {
        const vote = { inc_votes: -10 };
        return request(app)
        .patch('/api/reviews/2')
        .send(vote)
        .expect(201)
        .then(({ body }) => {
            const { review } = body;
            expect(review).toMatchObject({
                review_id: 2,
                title: 'Jenga',
                category: 'dexterity',
                designer: 'Leslie Scott',
                owner: 'philippaclaire9',
                review_body: 'Fiddly fun for all the family',
                review_img_url: 'https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: -5
            });
        })
    })
    test('400: responds with an error message when passed incorrect input', () => {
        const vote = { inc_votes: 'candle' };
        return request(app)
        .patch('/api/reviews/2')
        .send(vote)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input')
        })
    })
    test('400: responds with an error message when passed missing input', () => {
        const vote = {};
        return request(app)
        .patch('/api/reviews/2')
        .send(vote)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input')
        })
    })
    test('400: responds with an error message when review_id is invalid', () => {
        const vote = { inc_votes: 10 };
        return request(app)
        .patch('/api/reviews/banana')
        .send(vote)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input')
        })
    })
    test('404: responds with an error message when review_id does not exist', () => {
        const vote = { inc_votes: 10 };
        return request(app)
        .patch('/api/reviews/200')
        .send(vote)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Review not found')
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('204: should delete the given comment by comment_id', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('400: responds with an error message when comment_id is invalid', () => {
        return request(app)
        .delete('/api/comments/cushion')
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe('Invalid input')
        })
    })
    test('404: responds with an error message when review_id does not exist', () => {
        return request(app)
        .delete('/api/comments/100')
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe('Comment not found')
        })
    })
})
