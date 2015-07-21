var var_location = {lat: 42.0102, lng: -87.6755};  //Center of map on load.

google.maps.event.addDomListener(window, 'load', initialize);// Load the map on load and call the initialize function.

/* The Model - 
 * An array of object literals containing the attributes of each of the markers. 
 * */
var markers = [

		{
			name: "rogersParkSocial",
			latitude: "42.0102",
			longitude: "-87.6755",
			venueId: "536300da498ee44e63dcbc1d",
			tips: "Waiting for Foursquare tips...",
			title:"Rogers Park Social"
		},
		
		{
			name: "giordanos",
			latitude: "42.0065706",
			longitude: "-87.6614",
			venueId: "4a189b92f964a520d0791fe3",
			tips: "Waiting for Foursquare tips...",
			title:"Giordano's Pizza"
		},
		
		{
			name: "mayne_stage",
			latitude: "42.008259",
			longitude: "-87.665028",
			venueId: "4b7acc0cf964a520403d2fe3",
			tips: "Waiting for Foursquare tips...",
			title:"Mayne Stage"
		},
		
		{
			name: "los_portales",
			latitude: "42.0080956",
			longitude: "-87.6667577",
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
		zoom: 16
		};	
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	 // Call the ViewModel function and pass in the google.maps.Map object
	 connectFourSquare();
	 setMarkers(markers, map);
}
           
/*Function that receives attributes from the markers array. */
var setMarkers = function(location, map) {
	var self = this;
	var markerlocation = [];
	/* Temporary ko.observables to check the marker object attributes outside of map */
	self.name = ko.observable(location.name);
	self.latitude = ko.observable(location.latitude);
	self.longitude = ko.observable(location.longitude);
	self.map = ko.observable(location.map);
	self.title = ko.observable(location.title);
	self.venueId = ko.observable(location.venueId);
	self.tips = ko.observable(location.tips);
	self.position = ko.computed(function() {
		return this.latitude() + "," + this.longitude();
	}, this);
	
	/*This for loop will initialize each of the markers as defined in the 
	 * markers model.  The setMap() function places the markers on the map
	 * as defined by the latitude and longitude properties.  
	 * */
	for (i=0; i<location.length; i++) {
		markerlocation[i] = new google.maps.Marker({
			position: new google.maps.LatLng(location[i].latitude,
			location[i].longitude), 
			title: location[i].title,  
			venueId: location[i].venueId,
			tips: location[i].tips
   	});
	var infowindow = new google.maps.InfoWindow({
			content: location[i].title + "<br>" + location[i].tips + "<br>" + location[i].latitude + " " + location[i].longitude,
			maxWidth: 200});
	markerlocation[i].setMap(map);		
	//If marker is clicked, open info window corresponding to the marker.
		google.maps.event.addDomListener(markerlocation[i], 'click', (function() {
				infowindow.open(map, markerlocation[i]);
				})
		);
	};	
};

/* The ViewModel */
var myViewModel = function(myMap) {
	var self = this;
	this.markerList = ko.observableArray([]);
	
	markers.forEach(function(markerItem){
		self.markerList.push(new setMarkers(markerItem) );
	});	
	return self.markerList;
}; 
ko.applyBindings(myViewModel); 