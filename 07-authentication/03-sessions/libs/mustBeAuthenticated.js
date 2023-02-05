module.exports = function mustBeAuthenticated(ctx, next) {
	
  if (!ctx.user) {
	  ctx.body = {error: "Пользователь не залогинен"};
	  ctx.status = 401;
	  return;
  }
	
  return next();
};
