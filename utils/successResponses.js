class SuccessResponse {
    constructor(message, code = 200) {
        this.message = message;
        this.statusCode = code;
    }
}

module.exports = SuccessResponse