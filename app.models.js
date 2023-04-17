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

exports.fetchAllReviews = (query) => {

    let reviewQueryString = `SELECT reviews.*, COUNT(comments.comment_id):: INT AS comment_count FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id`

    const queryParameters = [];

    if (query.category) {
        queryParameters.push(query.category);
        reviewQueryString += ` WHERE category = $1`;
    }

    reviewQueryString += ` GROUP BY reviews.review_id`;

    if (query.sort_by) {
        queryParameters.push(query.sort_by);
        reviewQueryString += ` ORDER BY $${queryParameters.length} ASC`;
    } else {
        reviewQueryString += ` ORDER BY created_at DESC`
    }

    // console.log(reviewQueryString);
    // console.log(queryParameters);

    return db.query(reviewQueryString, queryParameters)
    .then((result) => {
        console.log(result.rows);
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
        return Promise.reject({ message: 'Missing input', status: 400 })
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

exports.amendVoteCount = (requestBody, id) => {
    const { inc_votes } = requestBody;

    return db.query("SELECT votes FROM reviews WHERE review_id = $1", [id])
    .then(({ rows }) => {
        const updatedVoteCount = inc_votes + rows[0].votes;
        return db.query("UPDATE reviews SET votes = $1 WHERE review_id = $2 RETURNING *", [updatedVoteCount, id])

    })
}

exports.removeCommentByID = (id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [id])
}

exports.checkCommentExists = (id) => {
    return db.query("SELECT * FROM comments WHERE comment_id = $1", [id])
    .then((result) => {        
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Comment not found', status: 404 })
        }
    })
}

exports.fetchAllUsers = () => {
    return db.query("SELECT * FROM users")
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Error', status: 404})
        }
        return result.rows;
    })
}
