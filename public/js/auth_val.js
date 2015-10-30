$(document).ready(function(){

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


  $('#sign-up-form').validate({
      rules: {
        username:{
          required:true,
          minlength:6
        },
        email:{
          required:true,
          email:true
        },
          password:{
            required:true,
              minlength : 8
          },
          confirmPassword : {
            required:true,
              minlength : 8,
              equalTo : "#password"
          }
      },
      messages:{
        username:{
          required:"Please enter a username",
          minlength:"your user username must consit of 6 characters or more"
        },
          password:{
            required:"you must enter a password",
            minlength:"Your password must be more than 8 characters"
          },
          confirmPassword:{
              required: "You must confirm your password",
              minlength: "Your password must contain more than 8 characters",
              equalTo: "Your Passwords Must Match" 
          }
      }
  });

  $('#login-form').validate({
    rules: {
      email:{
        required:true,
        email:true
      },
      password:{
        required:true,
        minlength:8
      }
    },
    messages: {
      email:{
        required:"Enter your account's email"
      },
      password:{
        required: "You must enter your password",
        minlength: "Your password must be more than 8 characters"
      }
    }
  });


  //Sign Up Post

  $('#sign-up-form').on('submit', function(e) {
    e.preventDefault();

          var password = $('#password').val();
          var confirmPassword = $('#confirmPassword').val();
        if(password === confirmPassword) {

      var signUpForm = $(this).serialize();

      $.ajax({
          url: "/api/users",
          type: "POST",
          data: signUpForm
      })
      .done(function (data) { 
        console.log(data);
        $('#sign-up-form').trigger("reset");
        $('#sign-up-modal').modal('hide');
        $('#greeting').text("Hello " + data.username + "!");
        $('.not-logged-in').hide();
        $('.logged-in').show();
      })
      .fail(function (data) { 
        console.log(data);
      });
    } else {
      alert("PASSWORDS NOT MATCHING!");
    }
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
      if(data.msg) {
        alert(data.msg);

      } else {
        console.log(data.username + " LOGGED IN!");
        $('#login-form').trigger("reset");
        $('#login-modal').modal('hide');
        $('.not-logged-in').hide();
        $('.logged-in').show();
        $('#greeting').text("Hello " + data.username + "!");
      }
    })
    .fail( function (data) {
      console.log(data);
    });
  });


  //BOOTSTRAP MODAL
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').focus();
  }); 
});  