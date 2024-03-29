const express = require('express');
const cors = require('cors');
const { getCategories, getAllReviews, getReviewByID, getCommentsByReviewID, postComment, updateVoteCount, deleteCommentByID, getAllUsers } = require('./app.controllers.js');
const { handleErrorCodes, handleCustomError, handleServerError } = require('./error.controllers.js')

const app = express();

app.use(cors());

app.use(express.json());

app.get('/api/categories', getCategories);

app.get('/api/reviews', getAllReviews)

app.get('/api/reviews/:review_id', getReviewByID);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewID);

app.post('/api/reviews/:review_id/comments', postComment);

app.patch('/api/reviews/:review_id', updateVoteCount);

app.delete('/api/comments/:comment_id', deleteCommentByID);

app.get('/api/users', getAllUsers);

app.all('*', (request, response, next) => {
    response.status(404).send({ message: 'Path not found'})
})

app.use(handleErrorCodes);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;