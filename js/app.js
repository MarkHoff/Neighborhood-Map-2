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
			title:"Rogers Park"
		},
		
		{
			name: "giardanos",
			latitude: "42.0065706",
			longitude: "-87.6614",
			title:"Giardano's Pizza"
		},
		
		{
			name: "mayne_stage",
			latitude: "42.008259",
			longitude: "-87.665028",
			title:"Mayne Stage"
		},
		
		{
			name: "los_portales",
			latitude: "42.0080956",
			longitude: "-87.6667577",
			title:"Los Portales"
		}
		
];


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