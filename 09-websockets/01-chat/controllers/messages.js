const modelMessage = require('../models/Message');
const mapMessage = require('../mappers/message');

module.exports.messageList = async function messages(ctx, next) {
  const userId = ctx.user.id;
  const messagesForUser = await modelMessage.find({chat: userId}).sort({date: 1}).limit(20);
    
  ctx.body = {messages: messagesForUser.map(mapMessage)};
};
