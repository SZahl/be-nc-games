const express = require('express');
const { getCategories } = require('./app.controllers.js');

const app = express();

app.get('/api/categories', getCategories);

app.all('*', (request, response, next) => {
    response.status(404).send({ message: 'Path not found'})
})

module.exports = app;