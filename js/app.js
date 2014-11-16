var app = angular.module('airPark', 
    [
      'ngRoute',
      'ngAnimate',
      'LocalStorageModule'
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

// If this is the root, redirect to the map
if (_.size(_.compact(window.location.hash.split('/'))) < 2) {
  window.location.hash = '#/map/';
}