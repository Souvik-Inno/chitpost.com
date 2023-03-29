$(document).ready(function() {
  // Change toggle icon and type on click.
  $("#togglePasswordLogin").on("click", function() {
    $(this).toggleClass("bi-eye");
    var password = $('#inputPassword3');
    var type = password.attr('type') === "password" ? "text" : "password";
    $('#inputPassword3').attr('type', type);
  });
});