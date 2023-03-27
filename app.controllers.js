const { fetchCategories, fetchReviewByID } = require('./app.models.js');

exports.getCategories = (request, response) => {
    fetchCategories().then((categories) => {
        response.status(200).send({ categories: categories})
    })
    .catch((error) => {
        next(error)
    }) 
}

exports.getReviewByID = (request, response) => {
    const { review_id } = request.params;
    fetchReviewByID(review_id).then((review) => {
        response.status(200).send({ review: review})
    })
    .catch((error) => {
        response.status(error.status).send({ message: error.message })
    })
}