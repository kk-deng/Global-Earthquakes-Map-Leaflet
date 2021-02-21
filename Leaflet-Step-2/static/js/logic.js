// Setting center point of map and zoom level
var usaCenter = [44.58, -103.46];
var mapZoomLevel = 3;

// Create the createMap function
function createMap(earthquakes, tectonicPlates) {
    // Create the tile layer that will be the background of our map
    function addTileLayer(mode) {
        return L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
            attribution: "Developed by Kelvin Deng © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            tileSize: 512,
            maxZoom: 18,
            zoomOffset: -1,
            id: mode,
            accessToken: API_KEY
        });
    }
    
    // Initialize with multiple tiles
    var lightLayer = addTileLayer("mapbox/light-v10"),
        darkLayer = addTileLayer("mapbox/dark-v10"),
        sateliteLayer = addTileLayer("mapbox/satellite-v9"),
        outdoorsLayer = addTileLayer("mapbox/outdoors-v11"),
        streetLayer = addTileLayer("mapbox/satellite-streets-v11")

    // Create a baseMaps object to hold the multiple layers
    var baseMaps = {
        Dark: darkLayer,
        Light: lightLayer,
        Satelite: sateliteLayer,
        Outdoors: outdoorsLayer,
        Street: streetLayer
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };
    // Create the map object with options
    var map = L.map("mapid", {
        center: usaCenter,
        zoom: mapZoomLevel,
        layers: [darkLayer, tectonicPlates, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(map);

    L.control.scale().addTo(map);

    // Set up the legend for depth
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        // A list of all values for the legend
        var div = L.DomUtil.create("div", "info legend"),
            categoris = [-10, 10, 30, 50, 70, 90];
        
        // Append each line HTML of color block and range to the div
        for (var i = 0; i < categoris.length; i++) {
            if (i == 0) {
                div.innerHTML += '<p>Depth (m)</p><hr>';
            }
            div.innerHTML +=
                '<i style="background:' + circleColor(categoris[i] + 1) + '"></i> ' + 
            + categoris[i] + (categoris[i + 1] ? ' - ' + categoris[i + 1] + '<br>' : ' + ');
        }

        return div;
    }

    legend.addTo(map);
};

// A function to return circle radius by its magnitude
function circleRadius(feature) {
    // If magnitude is less than 0, return 0, otherwise return 3x values
    return feature.properties.mag <= 0 ? 0: feature.properties.mag * 3;
    
}

// Use conditional (Ternary) operators to replace boring IF conditions ;)
function circleColor(depth) {
    // Meaning if the depth condition is true, then return value after "?"
    // if false, then move to next line after ":"
    return depth <= 10 ? "#6dfa4d":
            depth <= 30 ? "#cffa4d":
            depth <= 50 ? "#ffd54a":
            depth <= 70 ? "#ffb14a":
            depth <= 90 ? "#ff804a":
                            "#ff564a";
}

// Create the createMarkers function
function createLayers(earthquakeData, dataTectonic) {
    
    // A function to return pointToLayer groups with dynamic radius and color
    function pointToCircle(feature, latlng) {
        
        var geojsonMarkerOptions = {
            radius: circleRadius(feature),
            fillColor: circleColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 0.5,
            fillOpacity: 0.8
        };

        // Return a group of circle layers
        return L.circleMarker(latlng, geojsonMarkerOptions);
        
    }

    // Define a function run for each feature in the features array
    function onEachFeature(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
            // When a user's mouse touches a map feature, the mouseover event calls this function, 
            // that feature's opacity changes to 100% so that it stands out
            mouseover: function (event) {
                layer = event.target;
                layer.setStyle({
                    color: "#fff",
                    weight: 3,
                    fillOpacity: 1.0
                });
            },
            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - 
            // the feature's opacity reverts back to 40%
            mouseout: function (event) {
                layer = event.target;
                layer.setStyle({
                    color: "#000",
                    weight: 1,
                    fillOpacity: 0.3
                });
            }
        });
        
        // Bind popups for all earthquakes
        layer.bindPopup(
            "<h3>Location: " + feature.properties.place + "<br> Magnitude: " + 
            feature.properties.mag +"<br>Depth: " + feature.geometry.coordinates[2] + 
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
    }
    
    // Layer for earthquakes with circles and style
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: pointToCircle,
        onEachFeature: onEachFeature
    });

    // Layer for Tectionic Plates with style
    var tectonicPlates = L.geoJson(dataTectonic, {
        style: function (feature) {
            return {
                color: "#ffc252",
                opacity: 0.8
            };
        }
    });

    createMap(earthquakes, tectonicPlates);
    
}

// Referencing two geojson file urls
var geoURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson",
    tectonicURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Use d3 queue to load both files asynchronously
d3.queue()
    .defer(d3.json, geoURL)
    .defer(d3.json, tectonicURL)
    .await(function(error, dataEarthquakes, dataTectonic) {
        if (error) throw error;

        // Parse two sets of geoJSON data into layer function
        createLayers(dataEarthquakes.features, dataTectonic)
    });
