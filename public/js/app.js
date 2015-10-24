console.log("HEY HEY HEY");



$(document).ready(function(){

	//MAP 
	var map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 37.78, lng: -122.44},
		zoom: 13
	});

	var place;

	var initAutocomplete = function() {
		//Searchbox
		var searchBox = new google.maps.places.SearchBox(document.getElementById("map-search"));

		//Need to set bias to current city and business type to bars only!!!
		// Bias the SearchBox results towards current map's viewport.
	  	map.addListener('bounds_changed', function() {
	    searchBox.setBounds(map.getBounds());
	  	});


	  	// Listen for the event fired when the user selects a prediction and retrieve
	  	searchBox.addListener('places_changed', function() {
	    	var places = searchBox.getPlaces();
	    	place = places[0];
	    	console.log(place);
	    	if (places.length === 0) {
	    		return;
	    	}
		});
	};
	
	initAutocomplete();
  	

  	//ROUTES

  	//Mark Form Post

  	$('#new-mark-form').on('submit', function(e) {
  		e.preventDefault();

  		$('#mark-name').val(place.name);
  		$('#mark-address').val(place.formatted_address);
  		$('#mark-location').val(place.geometry.location);
  		$('#mark-lat').val(place.geometry.location.lat);
  		$('#mark-lng').val(place.geometry.location.lng);

  		var newMarkForm = $('#new-mark-form').serialize();

  		console.log(newMarkForm);

  		$.ajax({
  			url: "/api/marks",
  			type: "POST",
  			data: newMarkForm
  		})
  		.done(function(data){

  			console.log("HELLOOOOOOOOOOOOOOOO" + data.location);
  			console.log("HELLOOOOOOOOOOOOOOOO" + data.name);
 

  			// For each place, get the icon, name and location.
  				    var bounds = new google.maps.LatLngBounds();
  				    function addMarker(place) {
  				      var icon = {
  				        url: place.icon,
  				        size: new google.maps.Size(71, 71),
  				        origin: new google.maps.Point(0, 0),
  				        anchor: new google.maps.Point(17, 34),
  				        scaledSize: new google.maps.Size(25, 25)
  				      };

  				      // Create a marker for each place.
  				     new google.maps.Marker({
  				        map: map,
  				        icon: icon,
  				        title: data.name,
  				        position: data.location
  				      });

  				      if (data.viewport) {
  				        // Only geocodes have viewport.
  				        bounds.union(data.viewport);
  				      } else {
  				        bounds.extend(data.location);
  				      }
  				    }
  				    addMarker(place);
  				    map.fitBounds(bounds);

  		}).fail(function(data){
  			console.log(data);
  		});
  	});

  	//Sign Up Post

  	$('#sign-up-form').on('submit', function(e) {
  		e.preventDefault();
  		var signUpForm = $(this).serialize();
  		console.log(signUpForm);
  	});

  	//Login Post

  	 	$('#login-form').on('submit', function(e) {
  		e.preventDefault();
  		var loginForm = $(this).serialize();
  		console.log(loginForm);
  	});






  	//BOOTSTRAP MODAL
  	$('#myModal').on('shown.bs.modal', function () {
    	$('#myInput').focus();
  	}); 


}); //end of getready function




/// MARKER CODE

// // For each place, get the icon, name and location.
	    // var bounds = new google.maps.LatLngBounds();
	    // function addMarker(place) {
	    //   var icon = {
	    //     url: place.icon,
	    //     size: new google.maps.Size(71, 71),
	    //     origin: new google.maps.Point(0, 0),
	    //     anchor: new google.maps.Point(17, 34),
	    //     scaledSize: new google.maps.Size(25, 25)
	    //   };

	    //   // Create a marker for each place.
	    //  new google.maps.Marker({
	    //     map: map,
	    //     icon: icon,
	    //     title: place.name,
	    //     position: place.geometry.location
	    //   });

	    //   if (place.geometry.viewport) {
	    //     // Only geocodes have viewport.
	    //     bounds.union(place.geometry.viewport);
	    //   } else {
	    //     bounds.extend(place.geometry.location);
	    //   }
	    // }
	    // addMarker(place);
	    // map.fitBounds(bounds);