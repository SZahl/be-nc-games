
exports.handleErrorCodes = (error, request, response, next) => {
    if (error.code === '22P02') {
        response.status(400).send({ message: 'Invalid input'})
    } else if (error.code === '23502') {
        response.status(400).send({ message: 'Missing input'})
    } else {
        next(error);
    }
}


exports.handleCustomError = (error, request, response, next) => {
    const { status, message } = error;
    if (status && message) {
        response.status(status).send({ message })
    } else {
        next(error);
    }
}


exports.handleServerError = (error, request, response, next) => {
    response.status(500).send({ message: 'There was a server error'})
}