var app = angular.module('airPark', 
    [
      'ngRoute',
      'ngAnimate',
      'LocalStorageModule',
      'angularParse'
    ],
    [
      '$routeProvider',
      function($routeProvider) {

        $routeProvider.when('/map/', {
          templateUrl: '/templates/map.html',
          controller: 'MapCtrl'
        });

        $routeProvider.when('/lot/:id', {
          templateUrl: '/templates/lot.html',
          controller: 'LotCtrl'
        });

      }
    ]
  );

app.run(function ($rootScope, $location) {

  var history = [];

  $location.url($location.path());

$rootScope.$on('$routeChangeSuccess', function() {
    history.push($location.$$path);
  });

  $rootScope.goBack = function () {
    var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/",
        currentPath = $location.path();

    if (prevUrl === '/') {
      prevUrl = '/map/';
    }

    $rootScope.$broadcast('$routeChangeStart', prevUrl);

    if (_.compact(currentPath.split('/'))[0] === 'lot') {
      return $location.path(prevUrl).search('centerOn', _.compact(currentPath.split('/'))[1]);
    }

    $location.url($location.path());

    $location.path(prevUrl);
  };

});

// https://lhDaUXCvvpnmkWFRuHO7eHg10qqPCwOLhrrvNtOG:javascript-key=IKc6u0AbLyh9j9bFG31xIa2GoaOzJuq86FaTRjiW@api.parse.com/1/classes/Lot
app.value('parse', {
  apiId: 'lhDaUXCvvpnmkWFRuHO7eHg10qqPCwOLhrrvNtOG',
  apiKey: 'IKc6u0AbLyh9j9bFG31xIa2GoaOzJuq86FaTRjiW',
  url: 'api.parse.com/1/classes/'
});

app.config(['$httpProvider',function ($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

// If this is the root, redirect to the map
if (_.size(_.compact(window.location.hash.split('/'))) < 2) {
  window.location.hash = '#/map/';
}

Parse.initialize("lhDaUXCvvpnmkWFRuHO7eHg10qqPCwOLhrrvNtOG", "IKc6u0AbLyh9j9bFG31xIa2GoaOzJuq86FaTRjiW");

// var TestObject = Parse.Object.extend("TestObject");
// var testObject = new TestObject();
// testObject.save({foo: "bar"}).then(function(object) {
//   alert("yay! it worked");
// });

// var query = new Parse.Query();
// query.find({
//   success: function(results) {
//     // results is an array of Parse.Object.
//   },

//   error: function(error) {
//     // error is an instance of Parse.Error.
//   }
// });