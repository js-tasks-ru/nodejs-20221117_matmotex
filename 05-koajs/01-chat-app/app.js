const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

var clients = [];


function addClient(context) {
  clients.push(context);
  console.log('New client added');
}


function deleteClient(context) {
  clients.splice(clients.indexOf(context), 1);
  console.log('Client delete');
}


function broadcast(message) {
  clients.forEach(function(context) {
    context.body = message;
    context.state._resolve();
  });
}


async function addlog(context, next) {
  var start_time = Date.now();
  await next();
  console.log(context.method, context.url, 'time:', Date.now() - start_time);
}


router.get('/subscribe', addlog, async function(context, next) {
  
  await new Promise(function(resolve, reject){
    context.state._resolve = resolve;
    addClient(context);
    
    context.req.on('close', function() {
      deleteClient(context);
      context.body = 'Disconnected';
      reject();
    });
    
  });
  
});


router.post('/publish', addlog, async (context, next) => {
  var message = context.request.body.message;
  
  if (message == null) {
    context.body = 'Message is null';
    return next();
  }
  
  broadcast(message);
  context.body = 'Ok';
});

app.use(router.routes());

module.exports = app;
