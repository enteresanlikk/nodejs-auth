const DataResult = require('./DataResult');

class ErrorDataResult extends DataResult {
   constructor(data, message) {
      super(false, message, data)
   }
}

module.exports = ErrorDataResult;
