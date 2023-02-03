const userModel = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) 
    return done(null, false, 'Не указан email');

  await userModel.findOne({email: email}, async function (error, user) {
    if (error)
      return done(error);
    
    if (user) {
      done(null, user);
    } else {
      try {
        done(null, await userModel.create({email: email, displayName: displayName}));
      } catch (ex) {
        done(ex, false, ex.errors.email.message);
      }
    }
  });
  
};