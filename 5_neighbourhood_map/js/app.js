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

var model = {
    wikiURL: 'https://en.wikipedia.org/w/api.php?action=opensearch&search=',
    wikiURLFormat: '&format=json&callback=wikiCallback',
    pointsOfInterest: [
        {title: 'The Porch of the Caryatids', location: {lat: 37.972020, lng: 23.726464}},
        {title: 'Parthenon', location: {lat: 37.971546, lng: 23.726718}},
        {title: 'Syntagma Square', location: {lat: 37.975592, lng: 23.734901}},
        {title: 'Acropolis Museum', location: {lat: 37.968507, lng: 23.728523}},
        {title: 'Attiko Alsos', location: {lat: 38.0049804, lng: 23.76069}},
        {title: 'Academy of Athens', location: {lat: 37.979897, lng: 23.732562}}
    ]
};

var Location = function(poi, id){
    var self = this;

    self.id = id;
    self.title = ko.observable(poi.title);
    self.lat = poi.lat;
    self.lng = poi.lng;
    self.location = poi.location;
    self.visible = ko.observable(true);
    self.instagramPics = ko.observableArray([]);

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

    self.infoWindow = new google.maps.InfoWindow();

    self.locations = ko.observableArray([]);
    self.keyword = ko.observable('');

    self.selectLocation = function (clickedLocation) {
        populateInfoWindow(clickedLocation.marker);
    };

    model.pointsOfInterest.forEach(function(locItem){
        var l = new Location(locItem, i);
        // Create an onclick event to open the large infowindow at each marker.
        l.marker.addListener('click', function() {
            populateInfoWindow(this);
        });
        self.locations.push(l);
        i++;
    });

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

    var accessToken = '7926454.f90bbad.467ffd88eff0449e938e87b4afb51980';
    var instagrams = [];
    self.populateInfoWindow = function(marker){
        var wikiUrlLocation = model.wikiURL;
        wikiUrlLocation += marker.title;
        wikiUrlLocation += model.wikiURLFormat;

        var wikiArticle;

        self.infoWindow.setContent('<div id="infoWindow">' + marker.title + '</div>');

        var wikiRequestTimeout = setTimeout(function(){
            self.infoWindow.setContent('<div>failed to get wikipedia resources</div>');
        }, 8000);

        $.ajax({
            url: wikiUrlLocation,
            dataType: "jsonp",
            // jsonp: "callback",
            success: function(response) {
                var info = '';
                var articleList = response[1];
                for (var i=0; i<articleList.length; i++) {
                    wikiArticle = articleList[i];
                    var url = 'http://en.wikipedia.org/wiki/' + wikiArticle;
                    // $wikiElem.append(
                    //     '<li><a href="' + url + '">' + wikiArticle + '</a>'
                    // );
                    info += '<li><a href="' + url + '">' + wikiArticle + '</a>';
                }

                self.infoWindow.setContent('<div id="infoWindow">' + marker.title + info + '</div>');
                clearTimeout(wikiRequestTimeout);
            }
        });
        //accesstoken: 7926454.f90bbad.467ffd88eff0449e938e87b4afb51980
        var locationUrl = 'https://api.instagram.com/v1/locations/search?lat=' +
            37.971546 + '&lng=' +
            23.726718 + '&distance=50&access_token=' +
            accessToken;
        $.ajax({
            url: locationUrl,
            type: "GET",
            dataType: "jsonp",
            cache: false,
            success: function(response) {
                console.log(response);
                response.data.forEach(function(item){
                    var mediaUrl = 'https://api.instagram.com/v1/locations/' + item.id +
                    '/media/recent?access_token=' + accessToken;
                    console.log(mediaUrl);
                    var def = $.Deferred();
                    $.ajax({
                        type: "GET",
                        dataType: "jsonp",
                        cache: false,
                        url: mediaUrl,
                        success: function (results) {
                            console.log(results);
                            results.data.forEach(function (result) {
                                instagrams.push(result);

                            });
                            def.resolve();
                            //console.log(instagrams);
                        }
                    });
                });
            }
        });
        self.infoWindow.open(map, marker);
    }

    self.resetApp = function(){
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