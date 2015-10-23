console.log("HEY HEY HEY");

var map;

$(document).ready(function(){

  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.78, lng: -122.44},
    zoom: 13
  });






  	$('#myModal').on('shown.bs.modal', function () {
    	$('#myInput').focus();
  	}); 
});