const userModel = require('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(

    {usernameField: 'email', session: false}
	
    , function(email, password, done) {
	  userModel.findOne({email:email}, function (error, user) {
		if (error) {
          return done(error);
        };
		if (!user) {
          return done(null, false, 'Нет такого пользователя');
        };
		user.checkPassword(password).then(function (result) {
          return result ? done(null, user) : done(null, false, 'Неверный пароль');
        });
	  });	  
    }
	
);
