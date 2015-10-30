console.log("HEY HEY HEY");


$(document).ready(function(){



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
      "<h4 class='mark-title'>" + data[i].businessName + "</h4>" +
      "<h6 class='mark-address'>" + data[i].address + "</h6>" +
      "<li class='mark-li'> Crowd Level: " + data[i].crowdLevel + "</li>" +
      "<li class='mark-li'> Music: " + data[i].lastSong + "</li>" +
      "<li class='mark-li'> Happy Hour: " + data[i].happyHour + "</li>" +
      "<li class='mark-li'> Review: " + data[i].review + "</li>";

    
      // Create a marker for each place.
        Marker =  new google.maps.Marker({
        map: map,
        icon: icon,
        title: data.businessName,
        position: position
      });

      infowindow = new google.maps.InfoWindow({maxWidth: 350}); 
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

      if (places.length === 0) {
        return;
         
      }
    });
  };
    
  initAutocomplete();



	//Mark Form Post

	$('#new-mark-form').on('submit', function (e) {
		e.preventDefault();

    //adding value to hidden inputs in form 
		$('#mark-name').val(place.name);
		$('#mark-address').val(place.formatted_address);
		$('#mark-lat').val(place.geometry.location.lat);
		$('#mark-lng').val(place.geometry.location.lng);

		var newMarkForm = $('#new-mark-form').serialize();

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
        "<h4 class='mark-title'>" + data.businessName + "</h4>" +
        "<h6 class='mark-address'>" + data.address + "</h6>" +
        "<li class='mark-li'> Crowd Level: " + data.crowdLevel + "</li>" +
        "<li class='mark-li'> Music: " + data.lastSong + "</li>" +
        "<li class='mark-li'> Happy Hour: " + data.happyHour + "</li>" +
        "<li class='mark-li'> Review: " + data.review + "</li>";

  
        // Create a marker for each place.
        newMarker =  new google.maps.Marker({
          map: map,
          icon: icon,
          title: data.businessName,
          position: position
        });

        infowindow = new google.maps.InfoWindow({maxWidth: 350});
        
      }
      addMarker(place);
      listenMarker(newMarker, contentString);

      $('#new-mark-form').trigger("reset");
      $('#map-search').val("");

      })
      .fail(function (data){
  	   console.log(data);
    });
	});

  $('#delete-mark').on('click', function(e) { 
    e.preventDefault();

    $.ajax({
      url: '/delete-mark'
      
    });
  });
}); //end of getready function




