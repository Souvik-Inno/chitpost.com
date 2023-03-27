$(document).ready(function() {
  // Change toggle icon and type on click.
  $("#togglePassword").on("click", function() {
    $(this).toggleClass("bi-eye");
    var password = $('.password-field');
    var type = password.attr('type') === "password" ? "text" : "password";
    $('.password-field').attr('type', type);
  });
  // Check strength of password entered.
  $("input[name='signUpPass']").on("input", function() {
    var password = $("input[name='signUpPass']").val();
    if (password.length < 8) {
      $(".passWrong").css("display","flex");
      $(":submit").attr("disabled", TRUE);
    }
    else {
      $(".passWrong").css("display","none");
      $(":submit").attr("disabled", FALSE);
    }
  });
  // Checks entered password and validates.
  $("input[name='signUpPass']").on("input", function() {
    var password = $("input[name='signUpPass']").val();
    var reEnterPassword = $("input[name='reEnterPassword']").val();
    if (password.length == 0) {
      $(".passWrong").css("display","none");
      $(".correct").css("display","none");
    }
    else if (password == reEnterPassword) {
      $(".correct").css("display","flex");
      $(".wrong").css("display","none");
      $(":submit").attr("disabled", FALSE);
    }
    else if (reEnterPassword.length > 0 && password.length > 0) {
      $(".correct").css("display","none");
      $(".wrong").css("display","flex");
      $(":submit").attr("disabled", TRUE);
    }
    else {
      $(".correct").css("display","none");
      $(".wrong").css("display","none");
      $(":submit").attr("disabled", TRUE);
    }
  });
  // Checks re-entered password and validates.
  $("input[name='reEnterPassword']").on("input", function() {
    var password = $("input[name='signUpPass']").val();
    var reEnterPassword = $("input[name='reEnterPassword']").val();
    if (reEnterPassword.length == 0 && password.length == 0) {
      $(".wrong").css("display","none");
      $(".correct").css("display","none");
      $(".passWrong").css("display","none");
    }
    else if (password == reEnterPassword) {
      $(".correct").css("display","flex");
      $(".wrong").css("display","none");
      $(":submit").attr("disabled", FALSE);
    }
    else if (password.length >= 0 && reEnterPassword.length > 0) {
      $(".correct").css("display","none");
      $(".wrong").css("display","flex");
      $(":submit").attr("disabled", TRUE);
    }
    else {
      $(".correct").css("display","none");
      $(".wrong").css("display","none");
      $(":submit").attr("disabled", TRUE);
    }
  });
});