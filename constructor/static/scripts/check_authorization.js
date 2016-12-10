$(document).on('click', '#submit-button', function(e) {
    e.preventDefault();
    $.ajax({
        type: "POST",
        url: $("form").attr('action'),
        data: $("form").serialize(),
        success: function(response) {
             errorMessage = $("#incorrect-message")
						 if (response == "error") {
									 errorMessage.css('display', 'block');
                   errorMessage.animate({
                   color: 'red'
                   }, 600);
                   errorMessage.animate({
                   color: 'rgb(80, 80, 80)'
                   }, 600);
             }
						 else {
                  errorMessage.css('display', 'none');
							    location.reload(true)
						 }
        }
    });
});
