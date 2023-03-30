const { fetchCategories, fetchReviewByID, fetchAllReviews, fetchCommentsByReviewID, checkReviewExists, insertComment, checkUserExists } = require('./app.models.js');

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

exports.postComment = (request, response, next) => {
    const { review_id } = request.params;
    const commentUserPromises = [checkReviewExists(review_id), checkUserExists(request.body.username), insertComment(request.body, review_id)];

    Promise.all(commentUserPromises)
    .then((newComment) => {
        response.status(201).send({ comment: newComment[2]})
    })
    .catch((error) => {
        next(error);
    })
}