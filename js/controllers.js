app.controller('HeaderCtrl', ['$scope', '$rootScope', '$location', 'lotsModel',
  function($scope, $rootScope, $location, lotsModel) {

    var routes = {
          'map': 'AIR PARK',
          'lot': 'LOT',
          'account': 'ACCOUNT'
        };

    function getMainPath() {
      
      if (_.size($location.path().split('/')) < 1) {
        return '';
      }

      return _.compact($location.path().split('/'))[0];
    }

    function toggleBackButton(pathParts) {
      if (_.size(pathParts) < 2) {
        $scope.showBackButton = false;
      }
      else {
        $scope.showBackButton = true;
      }
    }

    function getId() {

      if (_.size(_.compact($location.path().split('/'))) < 2) {
        return '';
      }

      return _.compact($location.path().split('/'))[1];

    }

    function setHeader() {
      var mainPath = getMainPath(),
          lot = {};

      if (mainPath === 'lot') { 
        lot = lotsModel.get(getId());
        routes.lot = lot.name;
      }

      $scope.header = routes[mainPath] || 'Air Play';
    }

    setHeader();

    $scope.showBackButton = false;

    $scope.$on('$routeChangeStart', function(next, current) {
      setHeader();
    });

    $rootScope.$on('$locationChangeStart', function(event, newUrl){
      newUrl = _.compact(newUrl.substr(newUrl.indexOf('#') + 1).split('/'));
      toggleBackButton(newUrl);
    });
  }
]);


app.controller('navCtrl', ['$scope', '$location', 
  function($scope, $location){

    $scope.goTo = function(path) {
      $location.path(path);
    };

  }
]);


app.controller('MapCtrl', ['$scope', '$location', 'lotsModel', 
  function($scope, $location, lotsModel) {

    $scope.geolocation = {
      'lat': 47.571868,
      'lng': -52.733356
    };

    if ($location.search() && $location.search().centerOn) {
      var lot = lotsModel.get($location.search().centerOn);
      $scope.geolocation = lot.geolocation;
    }
    else
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        $scope.geolocation.lat = position.coords.latitude;
        $scope.geolocation.lng = position.coords.longitude;
      });
    }
  }
]);

app.controller('LotCtrl', ['$scope', '$routeParams', '$location', 'lotsModel', 'userModel', '$http', '$timeout',
  function($scope, $routeParams, $location, lotsModel, userModel, $http, $timeout) {
    
    $scope.showConfirm = false;
    $scope.lot = lotsModel.get($routeParams.id);
    $scope.userIsPaid = false;


    $scope.getDirections = function() {
      window.location.href = 'https://www.google.com/maps/dir/Current+Location/' + $scope.lot.address;
    };

    $scope.toggleConfirm = function() {
      $scope.showConfirm = !$scope.showConfirm;
    };

    $scope.attemptToPark = function() {

      if (!userModel.hasCreditCardData()) {
        $scope.showCreditForm = true;
        return;
      }

      $scope.toggleConfirm();
    };

    $scope.park = function() {

      if (!userModel.hasCreditCardData()) {
        $scope.showCreditForm = true;
        return;
      }

      $scope.toggleConfirm();

      $scope.showPaid = true;
      $scope.userIsPaid = true;
    };

    $scope.saveCreditCard = function() {
      var data = {
        stripe: {
          customerId: 1
        }
      };

      userModel.save(data);

      $scope.showCreditForm = false;
      $scope.pay();
    };

    $scope.pay = function() {
      $scope.showPaid = true;
      $scope.userIsPaid = true;
    };

    $timeout(function(){
// $http.get('https://maps.googleapis.com/maps/api/streetview?size=400x400&location='+$scope.lot.geolocation.lat+','+$scope.lot.geolocation.lng+'&key=AIzaSyCo8J1zD3vIW9UK_Y7xW8pwguICxOX1Dic')
// .then(function(res){
//   console.log(0,res);
//   if (res.data) {
//     $scope.lotImage = res.data;
//   }
// });
    if ($scope.lot.name.indexOf('Basil') >= 0)
    $scope.lotImage = 'https://maps.googleapis.com/maps/api/streetview?size=1000x400&heading=0&pitch=-25&location='+$scope.lot.geolocation.lat+','+$scope.lot.geolocation.lng+'&key=AIzaSyCo8J1zD3vIW9UK_Y7xW8pwguICxOX1Dic';
    }, 1000);
  }
]);