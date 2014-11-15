app.directive('lotsMap', ['lotsModel', '$location', '$timeout', function(lotsModel, $location, $timeout){
  return {
    scope: {
      geolocation: '=',
      lot: '='
    },
    link: function(scope, element) {

      scope.$watch('lot', function(lot) {

        if (!lot) {
          return;
        }

        if (lot.geolocation) {
          scope.geolocation = scope.lot.geolocation;
        }

        drawMap();

      }, true);

      function drawMap() {
        
        if (!scope.geolocation) {
          return;
        }

        var mapOptions = {
            center: { lat: scope.geolocation.lat, lng: scope.geolocation.lng},
            zoom: 14
          },
          map = null,
          lots = [],
          markers = {};

        if (scope.lot) {
          mapOptions.panControl = false;
          mapOptions.zoomControl = false;
          mapOptions.scaleControl = false;
          mapOptions.streetViewControl = false;
          mapOptions.overviewMapControl = false;
          mapOptions.mapTypeControl = false;
        }

        map = new google.maps.Map(element[0], mapOptions);

        $timeout(function() {
          
          if (scope.lot) {
            lots = [scope.lot];
          }

          if (!scope.lot) {
            lots = lotsModel.get();
          }


          _.forEach(lots, function(lot, index) {

            parkingIcon  = '/images/parking.png';

            if ((lot.spacesAvailable - lot.spacesTaken) < 1) {
              parkingIcon = '/images/parking-closed.png';
            }

            markers[index] = new google.maps.Marker({
              position: lot.geolocation,
              map: map,
              title: lot.name,
              icon: parkingIcon
            });
          });

          _.forEach(markers, function(marker, index){
            google.maps.event.addListener(marker, 'click', function() {
              $timeout(function(){ 
                $location.path('/lot/'+lots[index].id);
              },1);
            });
          });
        }, 1000);
      }
      
      if (!scope.lot) {
        drawMap();
      }
    }
  };
}]);
