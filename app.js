const express = require('express');
const { getCategories, getAllReviews, getReviewByID, getCommentsByReviewID } = require('./app.controllers.js');
const { handleErrorCodes, handleCustomError, handleServerError } = require('./error.controllers.js')

const app = express();

app.get('/api/categories', getCategories);

app.get('/api/reviews', getAllReviews)

app.get('/api/reviews/:review_id', getReviewByID);

app.get('/api/reviews/:review_id/comments', getCommentsByReviewID)

app.all('*', (request, response, next) => {
    response.status(404).send({ message: 'Path not found'})
})

app.use(handleErrorCodes);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;