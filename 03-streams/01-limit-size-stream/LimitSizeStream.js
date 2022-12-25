const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');


class LimitSizeStream extends stream.Transform {
  
  constructor(options) {
    super(options);
    this.dataLimitValue = options.limit;
    this.dataCurrentLength = 0;
  }

  _transform(chunk, encoding, callback) {
    this.dataCurrentLength += chunk.length;
    
    if (this.dataCurrentLength > this.dataLimitValue)  {
      callback(new LimitExceededError("По заданию столько незя :)"), null);
      return;
    }
    
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
