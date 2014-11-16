app.filter('shorten', function(){
  return function(string, limit) {
    if (!limit) {
      limit = 100;
    }

    if (string.length < limit) {
      return string;
    }

    return string.substr(0, limit) + '...';
  };
});

app.filter('money', function(){
  return function(price) {
    console.log(0, typeof price);
    return '$'+(+price).toFixed(2);
  };
});