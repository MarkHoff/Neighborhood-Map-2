var var_location = {lat: 42.0102, lng: -87.6755};  //Center of map on load.
var tips = []; // An array to hold tips from Foursquare API.
//var tipSplit = [];

google.maps.event.addDomListener(window, 'load', initialize);

/* The Model - 
 * An array of object literals containing the attributes of the markers. 
 * */
var markers = [

		{
			name: "rogersPark",
			latitude: "42.0102",
			longitude: "-87.6755",
			venueId: "49bfffd0f964a5203c551fe3",
			title:"Rogers Park"
		},
		
		{
			name: "giardanos",
			latitude: "42.0065706",
			longitude: "-87.6614",
			venueId: "4b9d3afcf964a520969b36e3",
			title:"Giardano's Pizza"
		},
		
		{
			name: "mayne_stage",
			latitude: "42.008259",
			longitude: "-87.665028",
			venueId: "50e61588e4b0e433727bbc2f",
			title:"Mayne Stage"
		},
		
		{
			name: "los_portales",
			latitude: "42.0080956",
			longitude: "-87.6667577",
			venueId: "4af75357f964a5205e0822e3",
			title:"Los Portales"
		}
		
];

// Search for Foursquare for a user tip for each location; if no tip available
//  or unable to access Foursquare API, error msg "Listening for latest buzz..." will display.
function getTips(markers) {
	for (i=0; i < markers.length; i++) {
		//console.log("getTips " + markers[i].venueId);
		var tipSplit;
		var foursquareUrl = 'https://api.foursquare.com/v2/venues/' + 
		markers[i].venueId + 
		'?client_id=YRN5IUY2UOMHO3UYB2FKJYRH4AHJVGBP1SVAPPPGGT31FB2E' + 
		'&client_secret=VHSZ2R1SLQ0I0QB1KZFWU0K2VMBGJIGIDL4P1TYWTDX4OXRM&v=20150504';
				$.getJSON(foursquareUrl)
			.done(function(response){
				var tipText,
					tipId,
					tips,
					tipSplit;
				tipId = response.response.venue.id;
				
				if( response.response.venue.tips.count > 0) {
					tipText = response.response.venue.tips.groups[0].items[0].text;
				} else {
					tipText = "No tips available for this location yet...";
				}
				tips = tipId + '%' + tipText;
				
				getTipsCallback(tips);
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				alert('Error connecting to Foursquare: ' + textStatus);
			});	
				
	
				//console.log("tipSplit = " + tipSplit);	
	}
	
	
	}

// Update data model (markers array) with tip from Foursquare by matching venue ids
function getTipsCallback(tip) {
	
	var tipSplit = tip.split('%');
	for (i=0; i<markers.length; i++) {
		//console.log(markers[i]);
		console.log("tipSplit[i].tipSplit " + tipSplit[0]);
		console.log("markers[i].name " + markers[i].name);
		console.log("markers[i].latitude " + markers[i].latitude);
		console.log("markers[i].longitude " + markers[i].longitude);
		console.log("markers[i].venueId " + markers[i].venueId);
		console.log("markers[i].title " + markers[i].title);
		if (markers[i].venueId === tipSplit[0]) {
			console.log("True");
			markers[i].tips = tipSplit[1];
			return;
		} else {
			console.log("False");
		}
	}
	
	return;
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
	 
	 getTips(markers);
	 //console.log(markers[1].tips);
	 setMarkers(markers, map);
}
           

/*Function that receives attributes from the markers array. */
var setMarkers = function(location, map) {
	var self = this;
	var markerlocation = [];
	self.name = ko.observable(location.name);
	self.latitude = ko.observable(location.latitude);
	self.longitude = ko.observable(location.longitude);
	self.map = ko.observable(location.map);
	self.title = ko.observable(location.title);
	self.venueId = ko.observable(location.venueId);
	self.position = ko.computed(function() {
		return this.latitude() + "," + this.longitude();
	}, this);
	
	/*This for loop will initialize each of the markers as defined in the 
	 * markers model.  The setMap() function places the markers on the map
	 * as defined by the latitude and longitude properties.  
	 * */
	for (i=0; i<location.length; i++) {
		//console.log(location[i].title);
		//console.log(location[i].latitude);
		//console.log(location[i].venueId);
		markerlocation[i] = new google.maps.Marker({
			position: new google.maps.LatLng(location[i].latitude,
			location[i].longitude), 
			title: location[i].title,  
			tips: location[i].venueId
   	});
	
	// added this line.
	//console.log(markers[i].tips);
	var infowindow = new google.maps.InfoWindow({
			content: "Hello there, " + location[i].venueId,
			maxWidth: 200});
	
	
	markerlocation[i].setMap(map);		
	infowindow.open(map, markerlocation[i]);

	};
};


var myViewModel = function(myMap) {
	var self = this;
	this.markerList = ko.observableArray([]);
	
	markers.forEach(function(markerItem){
		self.markerList.push(new setMarkers(markerItem) );
	});
	
	return self.markerList;
		
}; 

ko.applyBindings(myViewModel); 