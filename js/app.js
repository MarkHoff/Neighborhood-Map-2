var var_location = {lat: 42.0102, lng: -87.6755};

google.maps.event.addDomListener(window, 'load', initialize);

/* The Model - 
 * An array of object literals containing the attributes of the markers. 
 * */
var markers = [

		{
			name: "rogersPark",
			latitude: "42.0102",
			longitude: "-87.6755",
			venueId: '49bfffd0f964a5203c551fe3',
			title:"Rogers Park"
		},
		
		{
			name: "giardanos",
			latitude: "42.0065706",
			longitude: "-87.6614",
			venueId: '4b9d3afcf964a520969b36e3',
			title:"Giardano's Pizza"
		},
		
		{
			name: "mayne_stage",
			latitude: "42.008259",
			longitude: "-87.665028",
			venueId: '50e61588e4b0e433727bbc2f',
			title:"Mayne Stage"
		},
		
		{
			name: "los_portales",
			latitude: "42.0080956",
			longitude: "-87.6667577",
			venueId: '4af75357f964a5205e0822e3',
			title:"Los Portales"
		}
		
];

// Search for Foursquare for a user tip for each location; if no tip available
//  or unable to access Foursquare API, error msg "Listening for latest buzz..." will display.
function getTips() {
	for (i=0; i < markers.length; i++) {
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + 
		markers[i].venueId + 
		'?client_id=YRN5IUY2UOMHO3UYB2FKJYRH4AHJVGBP1SVAPPPGGT31FB2E' + 
		'&client_secret=VHSZ2R1SLQ0I0QB1KZFWU0K2VMBGJIGIDL4P1TYWTDX4OXRM&v=20150504';
		//console.log(foursquareUrl);
				$.getJSON(foursquareUrl)
			.done(function(response){
				var tipText,
					tipId,
					tips;
				tipId = response.response.venue.id;
				console.log(tipId);
				if( response.response.venue.tips.count > 0) {
					tipText = response.response.venue.tips.groups[0].items[0].text;
				} else {
					tipText = "No tips available for this location yet...";
				}
				tips = tipId + '%' + tipText;
				console.log(tips);
				getTipsCallback(tips);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				alert('Error connecting to Foursquare: ' + textStatus);
			});
		}
	}

// Update data model (markers array) with tip from Foursquare by matching venue ids
function getTipsCallback(tip) {
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
	 
	 getTips();
	 setMarkers(markers, map);
}
           

/*Function that receives attributes from the markers array. */
var setMarkers = function(markers, map) {
	var self = this;
	
	self.name = ko.observable(markers.name);
	self.latitude = ko.observable(markers.latitude);
	self.longitude = ko.observable(markers.longitude);
	self.map = ko.observable(markers.map);
	self.title = ko.observable(markers.title);
	self.position = ko.computed(function() {
		return this.latitude() + "," + this.longitude();
	}, this);
	
	/*This for loop will initialize each of the markers as defined in the 
	 * markers model.  The setMap() function places the markers on the map
	 * as defined by the latitude and longitude properties.  
	 * */
	for (i=0; i<markers.length; i++) {
		
		markers[i] = new google.maps.Marker({
			position: new google.maps.LatLng(markers[i].latitude,
			markers[i].longitude), 
			title: markers[i].title   
   	});
	markers[i].setMap(map);
	
	// added this line.
	var infowindow = new google.maps.InfoWindow({
			maxWidth: 200});
			
	infowindow.open(map, markers[i]);

	};
};


var myViewModel = function(myMap) {
	var self = this;
	//console.log(self);
	this.markerList = ko.observableArray([]);
	//this.marker = ko.observableArray([]);
	
	markers.forEach(function(markerItem){
		self.markerList.push(new setMarkers(markerItem) );
		//self.markerList
		//self.markerList.setMap(myMap);
	});
	
	return self.markerList;
		
}; 

ko.applyBindings(myViewModel); 