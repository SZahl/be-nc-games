const { fetchCategories } = require('./app.models.js');

exports.getCategories = (request, response) => {
    fetchCategories().then((categories) => {
        response.status(200).send({ categories: categories})
    })
    .catch((error) => {
        next(error)
    }) 
}