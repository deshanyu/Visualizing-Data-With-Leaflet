// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
    // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  
  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  
  // Sending our earthquakes layer to the createMap function
  // Two arrays
 
  var features = data.features;
  // Load the arrays with markers
 function getColor(mag)
      { 
          switch(parseInt( mag)){
              case 0: return '#b7f34d';
              case 1: return '#e1f34d';
              case 2: return '#f3db4d';
              case 3: return '#f3ba4d';
              case 4: return '#f0a76b';
              default: return '#f06b6b';
          }
      }
  var earthquakes = L.geoJSON(features, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
      stroke: false,
      fillOpacity: 0.75,
      color: "white",
      //fillColor: "purple",
      fillColor: getColor(feature.properties.mag),
      radius: feature.properties.mag*3
      })
    }
  })
  .bindPopup(function(layer){
                            return("<h3>" + layer.feature.properties.place +
                              "</h3><hr><p>" + layer.feature.properties.mag + "</p><hr>" +
                              "</h3><p>" + new Date(layer.feature.properties.time) + "</p>"
                              );
                          });
    
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2pnMzEwIiwiYSI6ImNpdGRjbWhxdjAwNG0yb3A5b21jOXluZTUifQ." +
    "T6YbdDixkOBWH_k9GbS8JQ");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // var earthquakes = L.geoJSON(earthquakeMarkers[0]);
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
});




