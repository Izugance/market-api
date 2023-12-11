class BaseError {
  constructor(msg) {
    this.msg = msg;
    this.statusCode = 500;
  }
}

export { BaseError };
