const DataResult = require('./DataResult');

class SuccessDataResult extends DataResult {
   constructor(data, message) {
      super(true, message, data)
   }
}

module.exports = SuccessDataResult;
