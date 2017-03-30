'use strict'
import uiModules from 'ui/modules'

import 'leaflet/dist/leaflet.css'
import 'leaflet'
import 'angular-simple-logger/dist/index.light'
import 'ui-leaflet'

// Need to require icons directly as webpack breaks paths on load
const icon = require('leaflet/dist/images/marker-icon.png')
const iconShadow = require('leaflet/dist/images/marker-shadow.png')
uiModules
  .get('app/siren-solution', ['nemLogging', 'ui-leaflet'])
  .controller('SirenController', function (createNotifier, $scope, $http) {
    // Initialize notifier
    const notify = createNotifier({
      location: 'Siren Solution'
    })

    $scope.setMarkers = function setMarkers (hits) {
      const markers = {}
      // Set response to marker objects for rendering on leaflet map
      for (let i = 0; i < hits.length; i++) {
        markers[`m${i}`] = {
          lat: hits[i]._source.geo.coordinates.lat,
          lng: hits[i]._source.geo.coordinates.lon,
          title: `timestamp: ${hits[i]._source['@timestamp']}
client IP: ${hits[i]._source['clientip']}
request: ${hits[i]._source['request']}`,
          draggable: false,
          focus: false,
          icon: {
            iconUrl: icon,
            shadowUrl: iconShadow,
            iconAnchor: [10, 30],
            iconSize: [25, 41],
            shadowSize: [41, 41],
            shadowAnchor: [12.5, 41],
            popupAnchor: [-3, -76]
          }
        }
      }
      $scope.vis.params.markers = markers
    }

    $scope.$watch('esResponse', response => {
      if (response) {
        if ($scope.vis.indexPattern.id) {
          $scope.vis.params.indexPattern = $scope.vis.indexPattern.id
        }

        if ($scope.vis.aggs.bySchemaName['geofield'] && $scope.vis.aggs.bySchemaName['geofield'].length !== 0) {
          $scope.vis.params.geofieldName = $scope.vis.aggs.bySchemaName['geofield'][0].params.field.displayName

          // Get logs from ES on selection of geofield and index
          $http.get(`../api/siren-solution/logs/${$scope.vis.params.indexPattern}/${$scope.vis.params.geofieldName}`)
            .then(response => $scope.setMarkers(response.data))
            .catch(notify.error)
        }
      }
    })
  })
