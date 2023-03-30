const { fetchCategories, fetchReviewByID, fetchAllReviews, fetchCommentsByReviewID, checkReviewExists } = require('./app.models.js');

exports.getCategories = (request, response) => {
    fetchCategories().then((categories) => {
        response.status(200).send({ categories: categories})
    })
    .catch((error) => {
        next(error)
    }) 
}

exports.getReviewByID = (request, response, next) => {
    const { review_id } = request.params;
    fetchReviewByID(review_id).then((review) => {
        response.status(200).send({ review: review})
    })
    .catch((error) => {
        next(error);
    })
}

exports.getAllReviews = (request, response, next) => {
    fetchAllReviews().then((reviews) => {
        response.status(200).send({ reviews: reviews})
    })
    .catch((error) => {
        next(error)
    })
}

exports.getCommentsByReviewID = (request, response, next) => {
    const { review_id } = request.params;

    const reviewCommentsPromises = [checkReviewExists(review_id), fetchCommentsByReviewID(review_id)];

    Promise.all(reviewCommentsPromises)
    .then((comments) => {
        response.status(200).send({ comments: comments[1]})
    })
    .catch((error) => {
        next(error);
    })
}