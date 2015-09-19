/*
 *************************************************************
 * 															 *
 * Project 5 - Neighborhood Map Application 				 *
 * Author: Mark Hoffman										 *
 * Date 8/8/2015											 *
 * 															 *
 *************************************************************
 */

/*
 * **********************************************
 * List of lobal variables to be accessed at 	*
 * various places within the code below.		*
 * 												*
 * **********************************************
 */

var map;
var var_location = {lat: 42.0102, lng: -87.6755};  //Center of map on load.
var streetViewImage;
var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=180x90&location=';

google.maps.event.addDomListener(window, 'load', initialize);// Load the map on load and call the initialize function.

/* 
 ************************************************
 * 												*
 * The Model - 									*
 * An array of object literals containing the	*
 * attributes of each of the markers.			* 
 * 												*
 ************************************************
 */

var markers = [

		{
			name: "rogersParkSocial",
			latitude: "42.007407",
			longitude: "-87.6660",
			streetAddress: "6922 N. Glenwood Ave",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.rogersparksocial.com",
			id: "nav0",
			visible: ko.observable(true),
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
			id: "nav1",
			visible: ko.observable(true),
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
			id: "nav2",
			visible: ko.observable(true),
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
			id: "nav3",
			visible: ko.observable(true),
			venueId: "4a91eac3f964a520551c20e3",
			tips: "Waiting for Foursquare tips...",
			title:"Los Portales"
		},
		
		{
			name: "pub_626",
			latitude: "42.0080956",
			longitude: "-87.66632",
			streetAddress: "1406 West Morse Avenue",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.pub626.com",
			id: "nav4",
			visible: ko.observable(true),
			venueId: "5531bd01498ef49d4df540bb",
			tips: "Waiting for Foursquare tips...",
			title:"Pub 626"
		},
		
		{
			name: "morse_gyros",
			latitude: "42.00774",
			longitude: "-87.66542",
			streetAddress: "1335 West Morse Avenue",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.morsegyroschicken.com",
			id: "nav5",
			visible: ko.observable(true),
			venueId: "4c268489905a0f478a766360",
			tips: "Waiting for Foursquare tips...",
			title:"Morse Gyros"
		},
		
		{
			name: "sp_kebab",
			latitude: "42.00563",
			longitude: "-87.66095",
			streetAddress: "6808 North Sheridan Road",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.spkebab.com",
			id: "nav6",
			visible: ko.observable(true),
			venueId: "4d46054c1b62b1f7111203e3",
			tips: "Waiting for Foursquare tips...",
			title:"SP Kebab"
		},
		
		{
			name: "twisted_tapas",
			latitude: "42.00586",
			longitude: "-87.66031",
			streetAddress: "1146 West Pratt Boulevard",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "plus.google.com/113326649920571028301/about?hl=en-US",
			id: "nav7",
			visible: ko.observable(true),
			venueId: "524e032011d2486d302806a0",
			tips: "Waiting for Foursquare tips...",
			title:"Twisted Tapas"
		},
		
		{
			name: "la_cazuela",
			latitude: "42.00730",
			longitude: "-87.67376",
			streetAddress: "6922 North Clark Street",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.la-cazuela.com",
			id: "nav8",
			visible: ko.observable(true),
			venueId: "4b400ac2f964a520b7b425e3",
			tips: "Waiting for Foursquare tips...",
			title:"La Cazuela"
		},
		
		{
			name: "fungs",
			latitude: "42.00777",
			longitude: "-87.66557",
			streetAddress: "1343 West Morse Avenue,",
			cityAddress:  "Chicago, Illinois, 60626",
			url: "www.fungsmandarin.com",
			id: "nav9",
			visible: ko.observable(true),
			venueId: "51bbbac3498e47af474f9641",
			tips: "Waiting for Foursquare tips...",
			title:"Fung's Mandarin"
		}
		
];

/* 
 * ******************************************************************************
 * 																				*
 * Search for Foursquare for a user tip for each location; if no tip available	*
 * or unable to access Foursquare API, the default message 						*
 * 'No tips available for this location yet...' will display.					*
 * 																				*
 * ******************************************************************************
 */  

function connectFourSquare() {
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
				splitTips(tips);	
				
			})
			.fail(function(jqXHR, textStatus, errorThrown) {
				alert('Error connecting to Foursquare: ' + textStatus);
			});	
	}
	
}

/*
 ************************************************************************************
 * 																					*
 * This function is called by the .getJason function when							* 
 * a response is received from Foursquare.  It splits the tips from the venue id's	*
 * and matches the correct tip to the venue id in the markers array. 				*
 * 																					*
 * **********************************************************************************
 */

function splitTips(tip) {
	var tipSplit = tip.split('%');
	for (i=0; i<markers.length; i++) {
		if (markers[i].venueId === tipSplit[0]) {
			markers[i].tips = tipSplit[1];
			
			return; 
		} 
	}
	
}

/* 
 ************************************************************************
 * 																		*
 * The intialize function is called after the map loads and 			*
 * will create the map based on the global variable						*
 * var_location, which contains the original latitude and longitude.	*
 * The initial map specifications are listed in the MapOptions variable	*
 * This function then calls the FourSquare function and					* 
 * passes the markers and map variables to the 							*
 * setMarkers function to create the markers on the map. 				*
 * The resetMap function will reset the zoom of the map when the		* 
 *  window is resized or on mouse click									*
 * **********************************************************************
 */

function initialize() {
	var mapOptions = {
		center: new google.maps.LatLng(var_location.lat, var_location.lng), 
		zoom: 16,
        mapTypeControl: false,
        disableDefaultUI: true
		};	
    if($(window).width() <= 1080) {
        mapOptions.zoom = 14;
    }
    if ($(window).width() < 850 || $(window).height() < 595) {
        hideNav();
    }
		
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	 /*
	  * *****************************************
	  * Call connectFourSquare and setMarkers 	*
	  * functions after the map is loaded.		*
	  * 										*
	  * *****************************************
	  */
	 
	 connectFourSquare();
	 setMarkers(markers);	 
	 
    /*
     * ******************************************
     * Reset map on click handler and			*
     * when window resize conditionals are met	*
     * 											*
     * ******************************************
     */
    
    function resetMap() {
        var windowWidth = $(window).width();
        if(windowWidth <= 1080) {
            map.setZoom(14);
            map.setCenter(mapOptions.center);
        } else if(windowWidth > 1080) {
            map.setZoom(16);
            map.setCenter(mapOptions.center);   
        }
    }
    $("#reset").click(function() {
        resetMap();
    });
    
   $(window).resize(function() {
        resetMap();
    }); 
};

/*
 ************************************************ 	
 * Determines if markers should be visible		*
 * This function is passed in the knockout 		*
 * viewModel function							*
 * 												*
 * **********************************************
 */

function setAllMap() {
  for (var i = 0; i < markers.length; i++) {
    if(markers[i].boolTest === true) {
    markers[i].holdMarker.setMap(map);
    } else {
    markers[i].holdMarker.setMap(null);
    }
  }
}
           
/*
 * ******************************************************************
 * The setMarkers function is called by the initialize function,	* 
 * which passes in the atrributes of the markers array. 			*
 * The markers are positioned according to the lat and long			*
 * attributes of each marker.  										*
 * 																	*
 * ******************************************************************
 */

 var setMarkers = function(location) {
	var position = [];
	
	/* 
	 * **********************************************************************
	 * This for loop will initialize each of the markers as defined in the 	*
	 * markers model and places the markers on the map						*
	 * as defined by the latitude and longitude properties.  				*
	 * 																		*
	 * **********************************************************************
	 */
	
	for (i=0; i<location.length; i++) {
		position[i] = new google.maps.LatLng(location[i].latitude,location[i].longitude);
		
		location[i].holdMarker = new google.maps.Marker({
			position: position[i],
			map: map,
			title: location[i].title,  
   	});
   	 	  	
  var infowindow = new google.maps.InfoWindow({
            //content: location[i].contentString
            
        });        
   /*
    * ***********************************************************************************************
    * The addListener method of the Google Maps object is activated by clicking the mouse on one	*
    * of the markers.  It will open the infoWindow object containing the address and other info		*
    * passed in from the markers array, as well as a Street View image of the object.				*
    * 																								*
    * ***********************************************************************************************
    */         
   
   new google.maps.event.addListener(location[i].holdMarker, 'click', (function(marker, i) {
      return function() {
      infowindow.setContent('<img src="' + streetViewUrl + location[i].streetAddress + location[i].cityAddress +
             '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' + 
             location[i].title + '</strong><br><p>' + 
             '<p><strong>Foursquare Tip:</strong><br></p>' + location[i].tips + '<br><br>' + 
             location[i].streetAddress + '<br>' + 
             location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url + 
             '" target="_blank">' + location[i].url + '</a>');
             infowindow.setOptions({maxWidth:200}); 
             map.setZoom(20);
      		 infowindow.open(map,this);
         	 map.setCenter(marker.getPosition());
         	 location[i].picBoolTest = true;  
          }; 
        })(location[i].holdMarker, i));
                
        var searchNav = $('#nav' + i);
             
        /*
         * **********************************************************
         * This function zooms in on the marker and displays the	* 
         * infoWindow when an item in the search list is clicked.	*
         * 															*
         * **********************************************************
         */
        searchNav.click((function(marker, i) {
          return function() {
            infowindow.setContent('<img src="' + streetViewUrl + location[i].streetAddress + location[i].cityAddress +
             '" alt="Street View Image of ' + location[i].title + '"><br><hr style="margin-bottom: 5px"><strong>' + 
             location[i].title + '</strong><br><p>' + 
             '<p><strong>Foursquare Tip:</strong><br></p>' + location[i].tips + '<br><br>' + 
             location[i].streetAddress + '<br>' + 
             location[i].cityAddress + '<br></p><a class="web-links" href="http://' + location[i].url + 
             '" target="_blank">' + location[i].url + '</a>');
             infowindow.setOptions({maxWidth:200}); 
             map.setZoom(20);
             infowindow.open(map,marker);
         	 map.setCenter(marker.getPosition());
         	 location[i].picBoolTest = true;
          };           
        })(location[i].holdMarker, i));   
  };  	
};
	
/*
 ********************************************************************************
 * The View Model, using Knockout.js. This is the interface between the View	*
 * (index.html) and the Model. 													*
 * 																				*
 * ****************************************************************************** 
 */

var viewModel = {
    query: ko.observable(''),
};

viewModel.markers = ko.dependentObservable(function() {
    var self = this;
    var search = self.query().toLowerCase();
    return ko.utils.arrayFilter(markers, function(marker) {
    if (marker.title.toLowerCase().indexOf(search) >= 0) {
            marker.boolTest = true;
            return marker.visible(true);
        } else {
            marker.boolTest = false;
            setAllMap();
            return marker.visible(false);
        }
    });       
}, viewModel);

/* 
 ************************
 * Activate Knockout	*
 * 						*
 ************************
 */

ko.applyBindings(viewModel);

/*
 ********************************************
 * show / hide markers in sync with nav		*
 * 											*
 ********************************************
 */

$("#input").keyup(function() {
setAllMap();
});

var isNavVisible = true;

/*
 * ******************
 * Hide nav bar		*
 * 					*
 * ******************
 */

function noNav() {
    $("#search-nav").animate({
                height: 0, 
            }, 500);
            setTimeout(function() {
                $("#search-nav").hide();
            }, 500);    
            $("#arrow").attr("src", "img/down-arrow.gif");
            isNavVisible = false;
}


/*
 * ******************
 * Show nav bar		*
 * 					*
 * ******************
 */

function yesNav() {
    $("#search-nav").show();
            var scrollerHeight = $("#scroller").height() + 55;
            if($(window).height() < 600) {
                $("#search-nav").animate({
                    height: scrollerHeight - 100,
                }, 500, function() {
                    $(this).css('height','auto').css("max-height", 439);
                });  
            } else {
            $("#search-nav").animate({
                height: scrollerHeight,
            }, 500, function() {
                $(this).css('height','auto').css("max-height", 549);
            });
            }
            $("#arrow").attr("src", "img/up-arrow.gif");
            isNavVisible = true;
}
	

function hideNav() {
    if(isNavVisible === true) {
            noNav();
            
    } else {
            yesNav();  
    }
}
$("#arrow").click(hideNav);


/*
 * **************************************************
 * Function to show or hide the nav bar depending	*
 * on the size of the window.						*
 * 													*
 * **************************************************
 */

$(window).resize(function() {
    var windowWidth = $(window).width();
    if ($(window).width() < 850 && isNavVisible === true) {
            noNav();
        } else if($(window).height() < 595 && isNavVisible === true) {
            noNav();
        }
    if ($(window).width() >= 850 && isNavVisible === false) {
            if($(window).height() > 595) {
                yesNav();
            }
        } else if($(window).height() >= 595 && isNavVisible === false) {
            if($(window).width() > 850) {
                yesNav();
            }     
        }    
});
