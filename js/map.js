var appvm;
//TODO:
//use textinput binding for dynamic searching
// use Prepopulating an observableArray for the locations observable array
//USE KNOCKOUT.JS
// Normally we'd have these in a database instead.
//Here i have used the code from GOOGLE MAPS APIS/Window shopping part 1 for displaying the map and the markers.
// These are some of the locations of bangalore that will be shown to the user.
// Better would be to research your own locations
var locations = [{
        title: 'ISKCON bangalore',
        location: {
            lat: 13.009466,
            lng: 77.55064
        }
    },
    {
        title: 'Lalbagh Botanical Garden',
        location: {
            lat: 12.950747,
            lng: 77.584773
        }
    },
    {
        title: ' Indian Institute of Science',
        location: {
            lat: 13.02186,
            lng: 77.567142
        }
    },
    {
        title: 'Amrita Vishwa Vidyapeetham University,',
        location: {
            lat: 12.89527,
            lng: 77.675362
        }
    },
    {
        title: 'Christ University',
        location: {
            lat: 12.934887,
            lng: 77.605791
        }
    },
    {
        title: 'Mantri Square Mall',
        location: {
            lat: 12.991723,
            lng: 77.570553
        }
    },
    {
        title: 'Kempegowda International Airport',
        location: {
            lat: 13.198635,
            lng: 77.706593
        }
    },
    {
        title: 'M Chinnaswamy Stadium',
        location: {
            lat: 12.97883,
            lng: 77.599615
        }
    },
    {
        title: ' International Tech Park Bangalore',
        location: {
            lat: 12.986483,
            lng: 77.737184
        }
    },
];

var map;
// Create a new blank array for all the listing markers.
var markers = [];

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
    marker.addListener('click', function () {
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
        }
      }


// Constructor
// Function expression
var ViewModel = function() {
  var self = this;
  this.locationsList = ko.observableArray(locations);
  this.inputItem = ko.observable('');
  console.log(this.inputItem);
//used live search code from http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
  this.searchFilter= function (value){
    console.log('searchFilter running ');
    //remove all the location from the list
    self.locationsList.removeAll();
    console.log(value);
    //value is the input from the textInput
    //now we need to add the filtering
    var loopList = self.locationsList;
    for(var y in loopList) {
      console.log('for loop working');
      //add the logic
      //if(beers[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
      //  viewModel.beers.push(beers[x]);
      //}
      if(loopList[y].title.toLowerCase().indexOf(value.toLowercase()) >= 0) {
              console.log('if loop working');
        self.loopList.push(loopList[y]);
      }
    }

  };
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new
// Instantiate the ViewModel
appvm = new ViewModel();

// Activate Knockout
ko.applyBindings(appvm);
appvm.inputItem.subscribe(appvm.searchFilter);

//styling the list  use http://www.w3schools.com/bootstrap/bootstrap_list_groups.asp
