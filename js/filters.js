app.filter('shorten', function(){
  return function(string, limit) {
    if (!limit) {
      limit = 100;
    }
console.log(string.length < limit, string.length, limit);
    if (string.length < limit) {
      return string;
    }

    return string.substr(0, limit) + '...';
  };
});