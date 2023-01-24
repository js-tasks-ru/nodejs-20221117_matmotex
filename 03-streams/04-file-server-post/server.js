const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  
    switch (req.method) {
      case 'POST':
        saveFile(pathname, req, res);
        break;

      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  
});


function saveFile(pathname, req, res) {
    
  console.log('---------------------------------');
  
  if (pathname.indexOf('/') > -1){
    res.writeHead(400);
    res.end('Denied');
    return;
  }
  
  const filepath = path.join(__dirname, 'files', pathname);
  console.log(filepath);
  
  if (fs.existsSync(filepath)) {
    res.statusCode = 409;
    res.end('File already exists');
    return;
  }
  
  const limitedStream = new LimitSizeStream({limit: 100000, readableObjectMode: false}); // 1000000 байт
  
  var file = fs.createWriteStream(filepath);
  req.pipe(limitedStream).pipe(file);
  
  limitedStream.on('error', function (error) {
    console.log('---------------------errorsize');
    res.statusCode = 413;
    file.destroy();
    fs.unlinkSync(filepath);
    //deleteFile(file, filepath);
    req.resume();
  });
  
  req.on('end', function () {
   //res.writeHead(201);
   if (res.statusCode != 413)
     res.statusCode = 201;
   res.end();
   console.log('-----------------------END');
  });
  
  req.on('aborted', () => {
    file.destroy();
    if (fs.existsSync(filepath)){
      fs.rmSync(filepath);
    }
    console.log('-----------------------ABORTED');
  });
  
  req.on('error', function (error) {
    console.log('-----------------------ERROR');
    console.dir(error.code);
    if (res.statusCode == 200)
      res.statusCode = 500;
    res.end(); 
  });
  
  file.on('error', function(error) {
    console.log('-----------------------ERRORFILE');
  });
  
}





module.exports = server;
