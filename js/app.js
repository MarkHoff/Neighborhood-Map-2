var map;
var var_location = {lat: 42.0102, lng: -87.6755};  //Center of map on load.
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

google.maps.event.addDomListener(window, 'load', initialize);// Load the map on load and call the initialize function.

/* The Model - 
 * An array of object literals containing the attributes of each of the markers. 
 * */
var markers = [

		{
			name: "rogersParkSocial",
			latitude: "42.0102",
			longitude: "-87.6755",
			streetAddress: "6922 N. Glenwood Ave",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.rogersparksocial.com",
			venueId: "536300da498ee44e63dcbc1d",
			tips: "Waiting for Foursquare tips...",
			title:"Rogers Park Social"
		},
		
		{
			name: "giordanos",
			latitude: "42.0065706",
			longitude: "-87.6614",
			streetAddress: "6836 North Sheridan Road",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.giordanos.com",
			venueId: "4a189b92f964a520d0791fe3",
			tips: "Waiting for Foursquare tips...",
			title:"Giordano's Pizza"
		},
		
		{
			name: "mayne_stage",
			latitude: "42.008259",
			longitude: "-87.665028",
			streetAddress: "1328 West Morse Avenue",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.maynestage.com",
			venueId: "4b7acc0cf964a520403d2fe3",
			tips: "Waiting for Foursquare tips...",
			title:"Mayne Stage"
		},
		
		{
			name: "los_portales",
			latitude: "42.0080956",
			longitude: "-87.6667577",
			streetAddress: "1418 W Morse Ave",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.losportalesmexicanrestaurantchicago.com",
			venueId: "4a91eac3f964a520551c20e3",
			tips: "Waiting for Foursquare tips...",
			title:"Los Portales"
		}
		
];

/* Search for Foursquare for a user tip for each location; if no tip available
 * or unable to access Foursquare API, the default message 'Waiting for Foursquare tips...' will display.
 */  
function connectFourSquare() {
	var responseTips = [];
	for (i=0; i < markers.length; i++) {
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + 
		markers[i].venueId + 
		'?client_id=YRN5IUY2UOMHO3UYB2FKJYRH4AHJVGBP1SVAPPPGGT31FB2E' + 
		'&client_secret=VHSZ2R1SLQ0I0QB1KZFWU0K2VMBGJIGIDL4P1TYWTDX4OXRM&v=20150504';
			$.getJSON(foursquareUrl)	
			.done(function(response){
				var tipText,
					tipId,
					tips;
				tipId = response.response.venue.id;
				if( response.response.venue.tips.count > 0) {
					tipText = response.response.venue.tips.groups[0].items[0].text;
				} else {
					tipText = "No tips available for this location yet...";
				}
				tips = tipId + '%' + tipText;		
				console.log(tips);	
				splitTips(tips);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				alert('Error connecting to Foursquare: ' + textStatus);
			});	
	}
	
}

// Update data model (markers array) with tip from Foursquare by matching venue ids
function splitTips(tip) {
	var tipSplit = tip.split('%');
	for (i=0; i<markers.length; i++) {
		if (markers[i].venueId === tipSplit[0]) {
			markers[i].tips = tipSplit[1];
			return;
		} 
	}
	
}

/* The intialize function will create the map based on the global variable
 * var_location, which contains the original latitude and longitude.
 * This function then passes the markers and map variables to the 
 * setMarkers function to create the markers on the map. */
function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(var_location.lat, var_location.lng), 
		zoom: 16,
        mapTypeControl: false,
        disableDefaultUI: true
		};	
    if($(window).width() <= 1080) {
        mapOptions.zoom = 13;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }
		
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	 // Call the ViewModel function and pass in the google.maps.Map object
	 connectFourSquare();
	 setMarkers(markers);
};
           
/*Function that receives attributes from the markers array. */
 var setMarkers = function(location) {
	var position = [];
	
	/*This for loop will initialize each of the markers as defined in the 
	 * markers model and places the markers on the map
	 * as defined by the latitude and longitude properties.  
	 * */
	for (i=0; i<location.length; i++) {
		position[i] = new google.maps.LatLng(location[i].latitude,location[i].longitude);
		
		location[i].holdMarker = new google.maps.Marker({
			position: position[i],
			map: map,
			title: location[i].title,  
			venueId: location[i].venueId,
			tips: location[i].tips
   	});
   	
   	
        //Binds infoWindow content to each marker
     location[i].contentString = '<img src="' + streetViewUrl + location[i].streetAddress + location[i].cityAddress +
             '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' + 
             location[i].title + '</strong><br><p>' + 
             location[i].streetAddress + '<br>' + 
             location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url + 
             '" target="_blank">' + location[i].url + '</a>';
   	 // location[i].contentString = "Welcome to " + location[i].title + "</br>" + location[i].tips;
   	   	
  var infowindow = new google.maps.InfoWindow({
            content: location[i].contentString
        });
            
   new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
      return function() {
      infowindow.setContent(location[i].contentString);
      infowindow.open(map,this);
      var windowWidth = $(window).width();
         if(windowWidth <= 1080) {
            map.setZoom(14);
         } else if(windowWidth > 1080) {
            map.setZoom(16);  
         }
         map.setCenter(marker.getPosition());
         location[i].picBoolTest = true;
          }; 
        })(location[i].holdMarker, i));
        
        
        var searchNav = $('#nav' + i);
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent(location[i].contentString);
            infowindow.open(map,marker);
            map.setZoom(20);
            map.setCenter(marker.getPosition());
            //location[i].picBoolTest = true;
          }; 
        })(location[i].holdMarker, i));
    
  };
   	
};	
	
 //The ViewModel 
var myViewModel = function(myMap) {
	var self = this;
	this.markerList = ko.observableArray([]);
	
	markers.forEach(function(markerItem){
		self.markerList.push(new setMarkers(markerItem) );
	});	
	return self.markerList;
}; 
ko.applyBindings(myViewModel); 