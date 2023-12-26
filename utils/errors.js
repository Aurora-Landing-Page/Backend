class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "ResourceNotFoundError"
        this.statusCode = 404

        Error.captureStackTrace(this, NotFoundError);
    }
}

class UserError extends Error {
    constructor(message, code = 400) {
        super(message)
        this.name = "UserError"
        this.statusCode = code

        Error.captureStackTrace(this, UserError);
    }
}

class ServerError extends Error {
    constructor(message, code = 500) {
        super(message)
        this.name = "InternalServerError"
        this.statusCode = code

        Error.captureStackTrace(this, ServerError);
    }
}

module.exports = { NotFoundError, UserError, ServerError }