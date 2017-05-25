// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
    'https://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage;
}

/**
 * App Model with basic variables to use:
 *
 * Wikipedia and 500px URLs
 * Points Of Interest for Google Maps
 * Google Maps Map variable
 */
var model = {
    wikiURL: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=',
    wikiURLFormat: '&format=json&callback=wikiCallback',
    fiveHundredURL: 'https://api.500px.com/v1/photos/search?image_size=2&geo=',
    fiveHundredURL2: '&consumer_key=NS30nYHSifLg8tBHr00GbuZGvnr4iqX44lqB17Nn',
    fiveHunderedPXURL: 'https://500px.com',
    pointsOfInterest: [
        {title: 'The Porch of the Caryatids', location: {lat: 37.972020, lng: 23.726464}},
        {title: 'Parthenon', location: {lat: 37.971546, lng: 23.726718}},
        {title: 'Syntagma Square', location: {lat: 37.975592, lng: 23.734901}},
        {title: 'Acropolis Museum', location: {lat: 37.968507, lng: 23.728523}},
        {title: 'Attiko Alsos', location: {lat: 38.0049804, lng: 23.76069}},
        {title: 'Academy of Athens', location: {lat: 37.979897, lng: 23.732562}}
    ],
    map: '',
    athensCenter: {lat: 37.9715323, lng: 23.7235605}
};

/**
 * Location class
 * Contains all the information related to a concrete location
 *
 * @param {array} poi - Point Of Interest from the model, containing title and location
 * @param {number} id - Location id
 */
var Location = function(poi, id){
    var self = this;

    self.id = id;
    self.title = ko.observable(poi.title);
    self.geolocation = poi.location;
    self.visible = ko.observable(true);

    var position = self.geolocation;
    var title = poi.title;

    // Create a marker per location
    self.marker = new google.maps.Marker({
        position: position,
        title: title,
        map: model.map,
        animation: google.maps.Animation.DROP,
        icon: controller.defaultIcon,
        id: id
    });

    // Event listener to show the information when the user clicks on a marker
    self.marker.addListener('click', function() {
        controller.populateInfoWindow(self);
    });

    model.map.bounds.extend(self.marker.position);

    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    self.marker.addListener('mouseover', function() {
        this.setIcon(controller.highlightedIcon);
    });
    self.marker.addListener('mouseout', function() {
        this.setIcon(controller.defaultIcon);
    });
};

/**
 * App Controller with basic functions used by View and Location class
 */
var controller = {
    /**
     * Function which initializes all variables related to the map and the map
     * itself
     */
    initMapVariables: function(){
        this.infoWindow = new google.maps.InfoWindow(),
        model.map = new google.maps.Map(document.getElementById('map'), {
            center: model.athensCenter,
            zoom: 13,
            mapTypeControl: true
        });

        // initialize bounds variable
        model.map.bounds = new google.maps.LatLngBounds();

        // Style the markers a bit. This will be our listing marker icon.
        this.highlightedIcon = makeMarkerIcon('FFFF24');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        this.defaultIcon = makeMarkerIcon('0091ff');
    },

    /**
     * Function which initializes the whole App
     */
    init: function(){
        this.initMapVariables();
        var i = 0;
    },

    /**
     * Function which makes a request to Wikipedia API for articles related to the
     * location selected
     *
     * @param {text} title - Location title to search articles related
     */
    wikipediaRequest: function(title){
        var wikiArticle;
        var data = '';
        var wikiUrlLocation = model.wikiURL + title + model.wikiURLFormat;

        var wikiRequestTimeout = setTimeout(function(){
            controller.infoWindow.setContent('<div>failed to get wikipedia resources</div>');
        }, 8000);

        var def = $.Deferred();
        $.ajax({
            url: wikiUrlLocation,
            dataType: "jsonp",
            success: function(response) {
                data += '<ul class="wikiLinks">';
                var articleList = response[1];
                if (articleList.length == 0){
                    data += '<li>No articles</li>';
                }
                else{
                    for (var i=0; i<articleList.length; i++) {
                        wikiArticle = articleList[i];
                        var url = 'http://en.wikipedia.org/wiki/' + wikiArticle;
                        data += '<li><a href="' + url + '">' + wikiArticle + '</a> | </li>';
                    }
                }
                data += '</ul>';
                def.resolve(data);
                clearTimeout(wikiRequestTimeout);
            }
        });
        return def.promise();
    },

    /**
     * Function which makes a request to 500px API to get pictures related to
     * the location selected
     *
     * @param {array} geolocation - Location latitud and longitude
     */
    fiveHundredPX: function(geolocation){
        var locationUrl = model.fiveHundredURL +
            geolocation.lat + ',' + geolocation.lng + ',0.5km'+
            model.fiveHundredURL2;//feature=popular&

        var data = '';
        var requestTimeout = setTimeout(function(){
            controller.infoWindow.setContent('<div>failed to get 500px resources</div>');
        }, 8000);
        var def = $.Deferred();
        var pictures = [];
        $.ajax({
            url: locationUrl,
            type: "GET",
            success: function(response) {
                data += '<ul class="pictures">';
                response.photos.forEach(function(pic){
                    data += '<li><a href="' + model.fiveHunderedPXURL + pic.url + '" alt="' + pic.name + '" >';
                    data += '<img class="thumbnails" src="' + pic.image_url + '" />';
                    data += '</a></li>';
                });
                data += '</ul>';
                def.resolve(data);
                clearTimeout(requestTimeout);
            }
        });
        return def.promise();
    },

    /**
     * Function which calls the two functions which call the APIs and set up the
     * content in the Info Window
     *
     * @param {obj} location - The Location selected
     */
    populateInfoWindow: function(location) {
        var infoWindowContent = '';
        $.when(controller.fiveHundredPX(location.geolocation), controller.wikipediaRequest(location.title())).done(function(a1, a2){
            infoWindowContent = '<div id="infoWindow"><h1 class="locationTitle">' + location.marker.title + '</h1>';
            infoWindowContent += '<h3>Wikipedia</h3>' + a2;
            infoWindowContent += '<h3>500px</h3>' + a1;
            infoWindowContent += '</div>';
            controller.infoWindow.setContent(infoWindowContent);
            controller.infoWindow.open(model.map, location.marker);
        });
    },

    /**
     * Function which resets the map to the center and closes the info window
     */
    resetMapAndVars(){
        controller.infoWindow.close();
        model.map.setZoom(13);
        model.map.setCenter(model.athensCenter);
    }
}

/**
 * App View which contains functions called by the UI components
 *
 */
var ViewModel = function(){
    var i = 0;
    self.keyword = ko.observable('');
    self.locations = ko.observableArray([]);

    self.locations = ko.observableArray([]);
    self.keyword = ko.observable('');

    model.pointsOfInterest.forEach(function(locItem){
        self.locations.push(new Location(locItem, i));
        i++;
    });

    /**
     * Function which shows the info window once the location is clicked on the
     * list of possible locations
     *
     * @param {obj} clickedLocation - The Location selected
     */
    self.selectLocation = function (clickedLocation) {
        controller.populateInfoWindow(clickedLocation);
    };

    // compute the list of locations filtered by the searchTerm
    self.filteredLocations = ko.computed(function() {
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

    resetApp = function(){
        this.keyword('');
        controller.resetMapAndVars();
    };

};

// This is called by the maps api as a callback
function initApp() {
    if($(window).width() <=1000) $('.options-box').removeClass('open');

    /*
     * Open the drawer when the menu ison is clicked.
     */
    var drawer = document.querySelector('#hamburger');
    var menu = document.querySelector('.options-box');

    drawer.addEventListener('click', function(e) {
        menu.classList.toggle('open');
        e.stopPropagation();
    });
    controller.init();
    ko.applyBindings(ViewModel);
}