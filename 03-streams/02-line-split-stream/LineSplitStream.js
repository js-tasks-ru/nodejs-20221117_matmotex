const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.mainLine = '';
  }

  _transform(chunk, encoding, callback) {    
  
    this.mainLine += chunk.toString();
    
    while (this.mainLine.indexOf(os.EOL) > -1) {
      var line = this.mainLine.split(os.EOL)[0];
      this.push(line);
      this.mainLine = this.mainLine.replace(line + os.EOL, '');
    }
    
    callback(); 
  }

  _flush(callback) {
    callback(null, this.mainLine.length > 0 ? this.mainLine : null);
  }
}

module.exports = LineSplitStream;
