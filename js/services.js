app.service('userModel', ['localStorageService', function(localStorageService){

  var user = {},
      defaultUser = null;

  if (localStorageService.get('user')) {
    user = localStorageService.get('user');
  }

  function getuser() {
    return user;
  }

  function saveUserData(data) {
    _.forEach(data, function(value, key) {
      console.log(key, value, user);
      user[key] = value;
    }, user);
    localStorageService.set('user', user);
  }

  function hasCreditCardData() {
console.log(3, user);
    return !!user && !!user.stripe && user.stripe.customerId;
  }

  return {
    get: getuser,
    save: saveUserData,
    hasCreditCardData: hasCreditCardData
  };
}]);


app.service('lotsModel', ['$http', '$q', function($http, $q) {

  var lots = [
    {
      id: '1',
      name: 'Basilica',
      address: '200 Miliary Rd. St. John\'s, NL',
      cost: 4.00,
      capacity: 10,
      message: 'This lot is only available during the week when there is no special service that day. Check the lot before attempting to park to make sure there are spaces.'
    },
    {
      id: '2',
      name: 'Common Ground',
      address: '30 Harvey Road, St. John\'s, NL',
      cost: 4.00,
      capacity: 4,
      closed: true
    },
    {
      id: '3',
      name: 'Bruneau Centre for Innovation and Research',
      address: 'Bruneau Centre for Innovation and Research, Memorial Univerity, St. John\'s NL',
      cost: 4.00,
      capacity: 120,
      closed: false
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