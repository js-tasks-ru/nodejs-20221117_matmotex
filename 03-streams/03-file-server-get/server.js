const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  switch (req.method) {
    case 'GET':
      getFile(pathname, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});


function getFile(pathname, res) {
    
  if (pathname.indexOf('/') > -1){
    res.statusCode = 400;
    res.end('Denied');
    return;
  } 
  
  var filepath = path.join(__dirname, 'files', pathname);
  
  if (!fs.existsSync(filepath)) {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }
  
  var file = fs.createReadStream(filepath);
  res.writeHead(200);
  //file.pipe(res);
  
  file.on('data', function(part) {
    if (!res.write(part)) {
      file.pause();
      res.once('drain', function() {file.resume();});
    }
  });
  file.on('end', () => res.end());
  
}





module.exports = server;
