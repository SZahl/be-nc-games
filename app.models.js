const db = require('./db/connection.js');

exports.fetchCategories = () => {
    return db.query("SELECT * FROM categories;").then(({ rows }) => {
        if (!rows.length) {
            return Promise.reject({ message: 'Error', status: 404 })
        }
        return rows;
    })
}