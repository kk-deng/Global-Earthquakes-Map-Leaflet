# Leaflet-Challenge
Building a new set of tools that will allow users to visualize the earthquake data from USGS.

The geoJSON dataset of **earthquakes** comes from USGS open data: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php

The geoJSON dataset of **Tectonic Plates** comes from this json file: https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json

The one in this project is about **All Earthquakes in the past 7 days**.

<img src="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Screenshots/USGS.png">

The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

## Files Index

Following files are attached:

1. <a href="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Leaflet-Step-2/index.html">index.html</a>: Main page with an interactive Leaflet Map

2. <a href="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Leaflet-Step-2/static/js/logic.js">logic.js</a>: Main JavaScript file for visualization of earthquakes

## Summary of features

The USGS is interested in building a new set of tools that will allow them visualize their earthquake data. They collect a massive amount of data from all over the world each day, but they lack a meaningful way of displaying it. Their hope is that being able to visualize their data will allow them to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

### Level 1: Basic Visualization

* Create a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

* Data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color.

* Has tooltips to the circles and display each tooltip with the data that the user has selected. 

<img src="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Screenshots/level-1.png">

### Level 2: More Data

* A second data set on your map to illustrate the relationship between `tectonic plates` and `seismic activity`.

* Tectonic Plates boundaries geoJSON was provided by https://github.com/fraxen/tectonicplates.

* Has a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

* Add layer controls to our map.

<img src="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Screenshots/dark.png">

* Switching different tile layers: 

<img src="https://github.com/kk-deng/Leaflet-Challenge/blob/main/Screenshots/sat.png">

