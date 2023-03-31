const db = require('./db/connection.js');

exports.fetchCategories = () => {
    return db.query("SELECT * FROM categories;").then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ message: 'Error', status: 404 })
        }
        return rows;
    })
}

exports.fetchReviewByID = (id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Review not found', status: 400});
        }
        return result.rows;
    })
}

exports.fetchAllReviews = () => {
    return db.query("SELECT reviews.*, COUNT(comments.comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id GROUP BY reviews.review_id ORDER BY created_at DESC;")
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Error', status: 404 })
        } 
        return result.rows;
    })
}

exports.fetchCommentsByReviewID = (id) => {
    return db.query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC" , [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'This review has no comments yet!', status: 200 })
        }
        return result.rows;
    })
}

exports.checkReviewExists = (id) => {
    return db.query("SELECT * FROM reviews WHERE review_id = $1", [id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Review not found', status: 404 })
        }
    })
}

exports.insertComment = (requestBody, reviewID) => {
    const { username, body } = requestBody;
    if(!username || !body) {
        return Promise.reject({ message: 'Missing username and/or comment', status: 400 })
    }
    return db.query("INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;", [body, username, reviewID])
    .then(({ rows }) => rows[0])
}

exports.checkUserExists = (id) => {
    return db.query("SELECT * FROM users WHERE username = $1", [id])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Username not found', status: 404 })
        }
    })
}