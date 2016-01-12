$(document).ready( function (){ 

  //check to see who's online
  function checkAuth() {
   $.ajax({
    url:'/current_user',
    type: 'GET'
   })
   .done(function (data){

    if(data.user){
      $('.not-logged-in').hide();
      $('.logged-in').show();
      $('#greeting').text("Hello " + data.user.username + "!");
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


  //Delete Marks!
  $(document).on('click',".delete-mark" ,function(e) { 
    e.preventDefault();
    console.log("clicked");
    var markId = $(this).attr('data-id');
    console.log("From client side!", markId);

    $.ajax({
      url: '/profile/' + markId,
      method: 'DELETE'
    })
    .done( function (data) {
      $('#' + markId).remove();
    })
    .fail( function (data) {
      console.log(data);
    });
  });

});