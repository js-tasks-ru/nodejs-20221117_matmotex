const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    
    if (token == null) {
      next(new Error("anonymous sessions are not allowed"));
      return;
    }
    
    const session = await Session.findOne({token}).populate('user');
    if (session == null) {
      next(new Error("wrong or expired session token"));
      return;
    }
    
    socket.user = session.user;
    
    next();
  });

  io.on('connection', function(socket) {
    const user = socket.user;
    
    socket.on('message', async function(msg){
      
      const nickname = user.displayName;
      const currentDate = new Date();
      
      await Message.create({
        user: user.displayName
        , text: msg
        , chat: user
        , date: currentDate
      });
    });
  });

  return io;
}

module.exports = socket;
