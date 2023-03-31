const { fetchCategories, fetchReviewByID, fetchAllReviews, fetchCommentsByReviewID, checkReviewExists, insertComment, checkUserExists, amendVoteCount, removeCommentByID, checkCommentExists } = require('./app.models.js');

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

exports.updateVoteCount = (request, response, next) => {
    const { review_id } = request.params;
    const voteReviewPromises = [checkReviewExists(review_id), amendVoteCount(request.body, review_id)]
    
    Promise.all(voteReviewPromises)
    .then((result) => {
        const review = result[1].rows[0];
        response.status(201).send({ review: review})
    })
    .catch((error) => {
        next(error)
    })
}

exports.deleteCommentByID = (request, response, next) => {
    const { comment_id } = request.params;

    const deleteCommentPromises = [checkCommentExists(comment_id), removeCommentByID(comment_id)]

    Promise.all(deleteCommentPromises)
    .then(() => {
        response.status(204).send({ message: 'No content'});
    })
    .catch((error) => {
        next(error)
    })
}