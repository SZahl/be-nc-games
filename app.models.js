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
    return db.query("SELECT * FROM reviews")
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ message: 'Error', status: 404 })
        } 
        return result.rows;
    })
}