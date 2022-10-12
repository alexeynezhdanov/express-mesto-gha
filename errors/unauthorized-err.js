class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'unauthorizedError';
    this.statusCode = 401;
  }
}

module.exports = UnauthorizedError;
