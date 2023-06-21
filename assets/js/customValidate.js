$(document).ready(function() {
    $('#sign-up-form').validate({
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                isEmail: true
            },
            password: {
                minLength: 6,
                required: true
            },
            confirmation: {
                minLength: 6,
                equalTo: "#password"
            }
        },
        success: function(element) {
            element
            .text('OK!').addClass('valid')
        }
    });
});