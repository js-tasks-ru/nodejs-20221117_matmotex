function isNumber(value) {
  if (typeof(value) != 'number')
    return false;
  
  return !isNaN(Number(value));
}

function sum(a, b) {
  if ( !isNumber(a) || !isNumber(b))
    throw new TypeError('Не ломай, мамкин хакер :)');
  
  return a + b;
}

module.exports = sum;
