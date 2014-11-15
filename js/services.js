app.service('userModel', function(){

  var user = null;

  function isLoggedIn() {
    return !_.isEmpty(user) && moment.isBefore(user.expiry);
  }

  function login(email) {
    user = {
      email: email,
      expiry: moment().add(30, 'days')
    };
  }

  return {
    isLoggedIn: isLoggedIn,
    login: login
  };

});


app.service('lotsModel', ['$http', '$q', function($http, $q) {

  var lots = [
    {
      id: '1',
      name: 'Basilica',
      address: '200 Miliary Rd. St. John\'s, NL',
      cost: 4.00,
      spacesAvailable: 10,
      spacesTaken: 2
    },
    {
      id: '2',
      name: 'Common Ground',
      address: '30 Harvey Road, St. John\'s, NL',
      cost: 4.00,
      spacesAvailable: 4,
      spacesTaken: 4
    }
  ];

  function getLatLong(address) {
    var googleGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address='+escape(address)+'&key=AIzaSyCo8J1zD3vIW9UK_Y7xW8pwguICxOX1Dic';
    return $http.get(googleGeocodeUrl).then(function(response){
        return response.data.results[0].geometry.location;
      });
  }

  function hasLatLong() {
    return lots && !_.isEmpty(lots[0]) && !_.isEmpty(lots[0].geolocation);
  }

  // Get the Lat Long
  if (!hasLatLong()) {
    _.forEach(lots, function(lot){
      getLatLong(lot.address)
        .then(function(location){
          lot.geolocation = {
            lat: location.lat,
            lng: location.lng
          };
        });
       
    }, lots);
  }

  return {
    get: function(id) {
      if (!id) {
        return lots;
      }

      var lot = _.find(lots, function(lot) { return lot.id === id; });

      if (!lot) {
        return null;
      }

      return lot;
    }
  };

}]);