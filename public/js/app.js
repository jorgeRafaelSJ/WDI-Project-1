console.log("HEY HEY HEY");



$(document).ready(function(){

  function checkAuth() {
   $.ajax({
    url:'/current_user',
    type: 'GET'
   })
   .done(function (data){
    console.log(data);
    if(data.user){
      $('.not-logged-in').hide();
      $('.logged-in').show();
      $('#user-profile').text("Hello " + data.user.username + "!");
    } else {
      $('.not-logged-in').show();
      $('.logged-in').hide();
    }
   })
   .fail(function (data) {
    console.log(data);
   });
  }

  checkAuth();


	//GOOGLE MAPS API GLOBAL VARIABLES *NEEDED*
	var map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 37.78, lng: -122.45},
		zoom: 13
	});
  var Marker;
  var newMarker;
	var place;
  var infowindow;
  var contentString;

  //listener function for markers has to be here for it to bind correct marker to infoWindow
  var listenMarker = function(marker, contentString){

     marker.addListener('click', function() {
      infowindow.setContent(contentString);
      infowindow.open(map, marker);
     });
  };


   //GET REQUEST TO LOAD MARKERS FROM SERVER
   $.get('/api/marks', function (data) {

    for (var i = 0; i < data.length; i++) {
      
      var lat = data[i].latitude;
      var lng = data[i].longitude;
      var position = {lat: lat, lng: lng};
      var icon = "/js/Pin.png";

      contentString = 
      "<h3>" + data[i].businessName + "</h3>" +
      "<h5>" + data[i].address + "</h5>" +
      "<p> Crowd Level: " + data[i].crowdLevel + "</p>" +
      "<p> Last Song Played: " + data[i].lastSong + "</p>" +
      "<p> Happy Hour: " + data[i].happyHour + "</p>" +
      "<p> Review: " + data[i].review + "</p>";

    
      // Create a marker for each place.
        Marker =  new google.maps.Marker({
        map: map,
        icon: icon,
        title: data.businessName,
        position: position
      });

      infowindow = new google.maps.InfoWindow(); 
      listenMarker(Marker, contentString);   

    }

  }); 


  // GOOGLE search field autocomplete and gets result objects
	var initAutocomplete = function () {
		//Searchbox

    var searchBox = new google.maps.places.SearchBox(document.getElementById("map-search"));
		

		//Need to set bias to current city and business type to bars only!!!


		// Bias the SearchBox results towards current map's viewport.
	  	map.addListener('bounds_changed', function () {
	    searchBox.setBounds(map.getBounds());
	  	});


	  	// Listen for the event fired when the user selects a prediction and retrieve
	  	searchBox.addListener('places_changed', function () {
	    	var places = searchBox.getPlaces();
	    	place = places[0];
        console.log(place);
	    	if (places.length === 0) {
	    		return;
          //set alert for "NOT FOUND!"
	    	}
		});
	};
	
	initAutocomplete();

  	//ROUTE REQUESTS ON EVENTS

  	//Mark Form Post

  	$('#new-mark-form').on('submit', function (e) {
  		e.preventDefault();

      //adding value to hidden inputs in form 
  		$('#mark-name').val(place.name);
  		$('#mark-address').val(place.formatted_address);
  		$('#mark-lat').val(place.geometry.location.lat);
  		$('#mark-lng').val(place.geometry.location.lng);

  		var newMarkForm = $('#new-mark-form').serialize();
      console.log(newMarkForm);

  		$.ajax({
  			url: "/api/marks",
  			type: "POST",
  			data: newMarkForm
  		})
  		.done(function (data){

        var lat = data.latitude;
        var lng = data.longitude;
        var position = {lat: lat, lng: lng};


        // For each place, get the icon, name and location.
              var bounds = new google.maps.LatLngBounds();
              function addMarker(place) {
                var icon = "/js/Pin.png";

                contentString = 
                "<h3>" + data.businessName + "</h3>" +
                "<h5>" + data.address + "</h5>" +
                "<p> Crowd Level: " + data.crowdLevel + "</p>" +
                "<p> Last Song Played: " + data.lastSong + "</p>" +
                "<p> Happy Hour: " + data.happyHour + "</p>" +
                "<p> Review: " + data.review + "</p>"
                ;

          
                // Create a marker for each place.
                  newMarker =  new google.maps.Marker({
                  map: map,
                  icon: icon,
                  title: data.businessName,
                  position: position
                });

                infowindow = new google.maps.InfoWindow();    


                if (place.geometry.viewport) {
                  // Only geocodes have viewport.
                  bounds.union(place.geometry.viewport);
                } else {
                  bounds.extend(place.geometry.location);
                }
              }
              addMarker(place);
              listenMarker(newMarker, contentString);

              // map.fitBounds(bounds);
              $('#new-mark-form').trigger("reset");
              $('#map-search').val("");

  		}).fail(function (data){
  			console.log(data);
  		});
  	});



  	//Sign Up Post

  	$('#sign-up-form').on('submit', function(e) {
  		e.preventDefault();
  		  var signUpForm = $(this).serialize();

        $.ajax({
            url: "/api/users",
            type: "POST",
            data: signUpForm
        })
        .done(function (data) { 
          $('#sign-up-form').trigger("reset");
          $('#sign-up-modal').modal('hide');
          $('.not-logged-in').hide();
          $('.logged-in').show();
          $('#user-profile').text("Hello " + data.username + "!");
        })
        .fail(function (data) { 
          console.log(data);
        });
  	});

  	//Login Post

  	 	$('#login-form').on('submit', function(e) {
  		e.preventDefault();
  		var loginForm = $(this).serialize();

      $.ajax({
        url: "/login",
        type: "POST",
        data: loginForm
      })
      .done( function (data) {
        console.log(data.username + " LOGGED IN!");
        $('#login-form').trigger("reset");
        $('#login-modal').modal('hide');
        $('.not-logged-in').hide();
        $('.logged-in').show();
        $('#user-profile').text("Hello " + data.username + "!");
      })
      .fail( function (data) {
        console.log(data);
      });
  	});


    //Logout get

    $('#logout-btn').on('click', function (e) {
      e.preventDefault();


      $.ajax({
        url: "/logout",
        type: "GET"
      }).done(function (data) {
        console.log("LOGGED OUT!");
        $('.not-logged-in').show();
        $('.logged-in').hide();
      }).fail(function (data) {
        alert("Failed to log out!");
      });
    });

    

  	//BOOTSTRAP MODAL
  	$('#myModal').on('shown.bs.modal', function () {
    	$('#myInput').focus();
  	}); 


}); //end of getready function




