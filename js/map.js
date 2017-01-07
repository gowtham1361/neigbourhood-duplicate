//TODO:
//https://api.foursquare.com/v2/venues/search?ll=12.955155,77.585466&client_id=JEKKICPOXJXLKTOYHA535NWKZK35SI31G2ILXD42IU0ETRPM&client_secret=5UKJWXIY44IKDUVU43WK4VYXBKXNRHKNVTMLYQAB0IDOD3DP&v=20131016
// These are some of the locations of bangalore that will be shown to the user.
//declaring a global object to store the instance of ViewModel
var appvm;

var locations = [{
        title: 'The Forum',
        location: {
            lat:  12.934545,
            lng: 77.611308
        },
        phone: 'nill'
    },
    {
        title: 'MTR Hotel',
        location: {
            lat: 12.955155,
            lng: 77.585466
        },
        phone: 'nill'
    },
    {
        title: ' Truffles',
        location: {
            lat: 12.971856,
            lng: 77.60095
        },
        phone: 'nill'
    },
    {
        title: 'Orion Mall',
        location: {
            lat: 13.010788,
            lng: 77.554902
        },
        phone: 'nill'
    },
    {
        title: 'Mantri Square Mall',
        location: {
            lat: 12.991723,
            lng: 77.570553
        },
        phone:'nill'
    },
    {
        title: 'Phoenix Marketcity',
        location: {
            lat: 12.997128,
            lng: 77.696323
        },
        phone:'nill'
    },
    {
        title: 'M Chinnaswamy Stadium',
        location: {
            lat: 12.97883,
            lng: 77.599615
        },
        phone:'nill'
    },
    {
        title: ' UB city',
        location: {
            lat: 12.971508,
            lng: 77.596409
        },
        phone:''
    },
];

//foursquare api credentials
var four_squareApi= {
    ID : 'JEKKICPOXJXLKTOYHA535NWKZK35SI31G2ILXD42IU0ETRPM',
    SECRET:'5UKJWXIY44IKDUVU43WK4VYXBKXNRHKNVTMLYQAB0IDOD3DP'
};


var map;
// Create a new blank array for all the listing markers.
var markers = [];

//Here i have used the code from GOOGLE MAPS APIS/Window shopping part 1 for displaying the map and the markers and infowindow.

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.7413549,
            lng: -73.9980244
        },
        zoom: 13
    });


    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();


    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {

         //retrieving contact no of the place via foursquare api.
        //how to add the phone no to the infowindow .
        var url ='https://api.foursquare.com/v2/venues/search?' + 'll='+ locations[i].location.lat + ',' + locations[i].location.lng +'&client_id=' + four_squareApi.ID + '&client_secret=' +  four_squareApi.SECRET +  '&v=20131016';
        $.getJSON(url , function(data) {
            console.log(data);
            //storing the  phone number in phoneNo variable
              var phoneNo = data.response.venues[0].contact.phone;
              locations[i].phone = phoneNo;
              console.log('location phone', locations[i].phone)
            console.log('phone :', phoneNo);//'location phone: ',locations[i]
        }).fail(function() {
            console.log('fail');
            });

        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        marker.addListener('click', function() {
            toggleBounce(this);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    for (var i = 0; i < locations.length; i++){

    }
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        // infowindow.addListener('closeclick', function() {
        // infowindow.setMarker(null);
        //});
    }
}
//multiple markers are bouncing when selected.
//adding bounce functionality to the marker when clicked.
// code obtained from https://developers.google.com/maps/documentation/javascript/examples/marker-animations
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //to make the bouncing stop after a few ms
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2000);
    }
}

//Location constructor similar to Cat constructor
var Location = function(locationData, id) {
    this.title = locationData.title;
    this.lat = locationData.location.lat;
    this.lng = locationData.location.lng;
    this.phone = locationData.location.phone;
    this.id = id;
};


// Constructor
// Function expression
var ViewModel = function() {

    var self = this;
    this.locationsList = ko.observableArray([]);
    //using the Location constructor similar to the Cat constructor  in adding more cats video and pushing to the locationList array
    //using the i value to give id's to the locations
    locations.forEach(function(item, i) {
        self.locationsList.push(new Location(item, i));
    });

    // setting up a observable to  be notified by the  input search box.
    this.inputItem = ko.observable('');
    //used live search code from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
    this.searchFilter = function(value) {
      //  console.log('searchFilter running');
        //remove all the location from the list
        self.locationsList.removeAll();
        //now we need to add the filtering
        //here the locations is the hardcoded list on top of map.js
        for (var y in locations) {
            //add the logic finding whether the indexof() returns a matching value in the looplist array.
            if (locations[y].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                //pushing the matching locations to the self.locationsList ko.observableArray.
                self.locationsList.push(locations[y]);
            }
        }

    };

    //add marker filtering here
    //similar to the searchFilter function
    this.markerFilterfn = function(value) {
        for (var x in markers) {
            //set map for markers as null
            if (markers[x].setMap(map) !== null) {
                markers[x].setMap(null);
            }
            if (markers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                //setMap to map for the markers filtered
                markers[x].setMap(map);
            }
        }
    };

    //adding the displayInfoBounce function when the list is clicked
    //use the id of the clickedItem to access the corresponding marker and trigger the click event for the corresponding marker
    this.displayInfoBounce = function(clickedItem) {
        var index = clickedItem.id;
        var marker = markers[index];
        google.maps.event.trigger(marker, 'click');
        // google.maps.trigger(markers[clickedItem.id], 'click');
    };
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// Instantiate the ViewModel
appvm = new ViewModel();

// Activate Knockout
ko.applyBindings(appvm);
//moved to the map init function
//using subscribe method of ko to the observalble appvm.inputItem
appvm.inputItem.subscribe(appvm.searchFilter);
appvm.inputItem.subscribe(appvm.markerFilterfn);

