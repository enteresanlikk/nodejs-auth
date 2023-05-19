const Result = require('./Result');

class SuccessResult extends Result {
   constructor(message) {
      super(true, message)
   }
}

module.exports = SuccessResult;
