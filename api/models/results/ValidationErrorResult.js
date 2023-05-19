const Result = require('./Result');

class ValidationErrorResult extends Result {
   constructor(errors, message) {
      super(false, message)
      this.errors = errors
   }
}

module.exports = ValidationErrorResult;
