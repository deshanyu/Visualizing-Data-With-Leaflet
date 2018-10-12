
//Load the arrays with markers
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
// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var earthquakes = L.geoJSON([], {
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
 
d3.json(queryUrl,function(data){
 // get the earthquake data from api
  // var features=data.features; 
  earthquakes.addData(data.features);
    });                          
  

// Add the fault line layer to the map
var faultLine_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
var faultLine = L.geoJSON([],{
                            style: function (feature) {
                                return {color: 'orange',fill:false,weight :2};
                            }
                        }).bindPopup(function (layer) {
                            return layer.feature.properties.description;
                        });
d3.json(faultLine_url,function(data){
          
          faultLine.addData(data.features);
    });


  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiZGVzaGFueXUiLCJhIjoiY2puMGpveTBrMXp5bzNrbm84YWdwbG9lZyJ9.nmp8PpvgZjsvect2mcN5Jg");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoiZGVzaGFueXUiLCJhIjoiY2puMGpveTBrMXp5bzNrbm84YWdwbG9lZyJ9.nmp8PpvgZjsvect2mcN5Jg");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // var earthquakes = L.geoJSON(earthquakeMarkers[0]);
  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
    Faultlines: faultLine
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes, faultLine]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  CreateLegend();
    

    function CreateLegend()
    {
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var labels = ["0-1","1-2","2-3","3-4","4-5","5+"];  
      var legends = [];
      //div.innerHTML = legendInfo;
  
      for(var i=0;i<labels.length;i++) {
        legends.push("<li style=\"list-style-type:none;\"><div style=\"background-color: " + getColor(i) + "\">&nbsp;</div> "+
                                                         "<div>"+ labels[i]+"</div></li>");
      }
  
      div.innerHTML += "<ul class='legend'>" + legends.join("") + "</ul>";
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
    }

 
