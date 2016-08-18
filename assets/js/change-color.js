$(document).ready(function(){
    $(window).scroll(function() {
        if ($(document).scrollTop() > 50) {
            $(".navbar-fixed-top").css("padding", "0px 15px");
            $(".navbar-fixed-top").css("box-shadow", "0px 3px 6px -3px #ddd");
        } 
        else {
            $(".navbar-fixed-top").css("padding", "15px");
            $(".navbar-fixed-top").css("box-shadow", "none");
        }
    });
});