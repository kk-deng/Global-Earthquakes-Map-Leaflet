var usaCenter = [44.58, -103.46];
var mapZoomLevel = 3;

// Create the createMap function
function createMap(earthquakes) {
    // Create the tile layer that will be the background of our map
    var lightLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var darkLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the multiple layers
    var baseMaps = {
        Light: lightLayer,
        Dark: darkLayer
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    // Create the map object with options
    var map = L.map("mapid", {
        center: usaCenter,
        zoom: mapZoomLevel,
        layers: [lightLayer, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(map);
};

// Create the createMarkers function
function createMarkers(earthquakeData) {
    
    // function styleLayer(feature) {
    //     return {
    //         color: "#fff",
    //         fillOpacity: 1.0
    //     }
    // }

    function pointToCircle(feature, latlng) {
        circleRadius = function(feature) {
            return feature.properties.mag * 3
        }
        
        circleColor = function(feature) {
            depth = feature.geometry.coordinates[2];
            if (depth <= 10) {return "#6dfa4d"}
            else if (depth > 10 && depth <= 30) {return "#cffa4d"}
            else if (depth > 30 && depth <= 50) {return "#ffd54a"}
            else if (depth > 50 && depth <= 70) {return "#ffb14a"}
            else if (depth > 70 && depth <= 90) {return "#ff804a"}
            else {return "#ff564a"}
        }
        
        var geojsonMarkerOptions = {
            radius: circleRadius(feature),
            fillColor: circleColor(feature),
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };

        return L.circleMarker(latlng, geojsonMarkerOptions);
        
    }


    // Define a function run for each feature in the features array
    function onEachFeature(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
            mouseover: function (event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity: 0.9
                });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
            mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                    fillOpacity: 0.75
                });
            }
        });
            
        layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + 
        new Date(feature.properties.time) + "</p>")
    }


    var earthquakes = L.geoJson(earthquakeData, {
        // style: styleLayer,
        pointToLayer: pointToCircle,
        onEachFeature: onEachFeature
    })
    // earthquakes = []
    // earthquakeData.forEach(function (feature) {

    // })
    
    createMap(earthquakes)
}


var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(geoData, data => {
    console.log(data)
    createMarkers(data.features)
})