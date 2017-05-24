var map;
var athensCenter = {lat: 37.9715323, lng: 23.7235605};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage;
}
// Style the markers a bit. This will be our listing marker icon.
var defaultIcon;

// Create a "highlighted location" marker color for when the user
// mouses over the marker.
var highlightedIcon;

var pointsOfInterest = [
    {title: 'The Porch of the Caryatids', location: {lat: 37.972020, lng: 23.726464}},
    {title: 'Parthenon', location: {lat: 37.971546, lng: 23.726718}},
    {title: 'Syntagma Square', location: {lat: 37.975592, lng: 23.734901}},
    {title: 'Acropolis Museum', location: {lat: 37.968507, lng: 23.728523}},
    {title: 'Attiko Alsos', location: {lat: 38.0049804, lng: 23.76069}},
    {title: 'Academy of Athens', location: {lat: 37.979897, lng: 23.732562}}
];

var Location = function(poi, id){
    var self = this;

    self.id = id;
    self.title = ko.observable(poi.title);
    self.lat = poi.lat;
    self.lng = poi.lng;
    self.location = poi.location;
    self.visible = ko.observable(true);

    // Get the position from the location array.
    var position = self.location;
    var title = poi.title;

    // Create a marker per location, and put into markers array.
    self.marker = new google.maps.Marker({
        position: position,
        title: title,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon,
        id: id
    });

    map.bounds.extend(self.marker.position);

    // Push the marker to our array of markers.
    // ViewModel.markers.push(self.marker);
    // Create an onclick event to open the large infowindow at each marker.
    self.marker.addListener('click', function() {
        ViewModel.populateInfoWindow(self);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    self.marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    self.marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });
};

function initMapVariables() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: athensCenter,
        zoom: 13,
        // styles: styles,
        mapTypeControl: true
    });

    // initialize bounds variable
    map.bounds = new google.maps.LatLngBounds();

    // ViewModel.infoWindow = new google.maps.InfoWindow();

    highlightedIcon = makeMarkerIcon('FFFF24');
    defaultIcon = makeMarkerIcon('0091ff');

}

var ViewModel = function() {
    var self = this;
    var i = 0;
    var bounds = new google.maps.LatLngBounds();

    this.infoWindow = new google.maps.InfoWindow();

    this.locations = ko.observableArray([]);
    this.keyword = ko.observable('');

    this.populateInfoWindow = function(marker) {
        this.infoWindow.setContent('<div>' + marker.title + '</div>');
        this.infoWindow.open(map, marker);
    }

    this.selectLocation = function (clickedLocation) {
        populateInfoWindow(clickedLocation.marker);
    };


    pointsOfInterest.forEach(function(locItem){
        self.locations.push(new Location(locItem, i));
        i++;
    });

    // compute the list of locations filtered by the searchTerm
    this.filteredLocations = ko.computed(function() {
        // return a list of locations filtered by the searchTerm
        return self.locations().filter(function (location) {
            var display = true;
            if (self.keyword() !== ''){
                // check if the location name contains the searchTerm
                if (location.title().toLowerCase().indexOf(self.keyword().toLowerCase()) !== -1){
                    display = true;
                }else {
                    display = false;
                }
            }
            // toggle map marker based on the filter
            location.marker.setVisible(display);

            return display;
        });
    });

    this.resetApp = function(){
        self.keyword('');
        self.infoWindow.close();
        resetMap();
    };

};

function resetMap(){
    map.setZoom(13);
    map.setCenter(athensCenter);
}

// This is called by the maps api as a callback
function initApp() {
    initMapVariables();

    ko.applyBindings(ViewModel);
}