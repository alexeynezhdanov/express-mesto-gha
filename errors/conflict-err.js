class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'conflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
