
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
        });
    }
});

var triggerAnimate = function (callback) {
    /* ------------------------------------------------------------------------
          LOADER 
          ------------------------------------------------------------------------  */
    jQuery('#loader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
    jQuery('body').delay(350).css({ 'overflow': 'visible' });

    jQuery('.animated').removeClass('animated');
    jQuery('.animate-it').css({ 'opacity': '0' });
    jQuery('.animate-it').delay(350).each(function () {
        if (jQuery(this).data("delay")) {
            fadeDelayAttr = jQuery(this).data("delay")
            fadeDelay = parseInt(fadeDelayAttr);
        } else {
            fadeDelay = 0;
        }
        jQuery(this).delay(fadeDelay).queue(function () {

            console.log(fadeDelay);
            jQuery(this).addClass('animated fadeIn').clearQueue();

        });
    });
    callback();
};

var onLoad = function () {

    triggerAnimate(function () { });

    window.setTimeout(function () {
        $(".alert").fadeTo(500, 0).slideUp(500, function () {
            $(this).remove();
        });
    }, 4000);
	
    $('.collapse').collapse();
    $('[data-toggle="tooltip"]').tooltip();
    
    /* $('.date').mask('00/00/0000'); */
    $('.time').mask('00:00:00');
    $('.date_time').mask('00/00/0000 00:00:00');
    $('.cep').mask('00000-000');
    $('.phone').mask('0000-0000');
    $('.phone_with_ddd').mask('(00) 0000-0000');
    $('.phone_us').mask('(000) 000-0000');
    $('.mixed').mask('AAA 000-S0S');
    $('.cpf').mask('000.000.000-00', { reverse: true });
    $('.cnpj').mask('00.000.000/0000-00', { reverse: true });
    $('.money').mask("#.##0,00", { reverse: true });
    $('.money2').mask("#.##0,00", { reverse: true });
};

var ShowMessage = function ($scope, msg, msgtype) {

    $scope.msg = msg;
    $scope.msgtype = msgtype;

    setTimeout(function () {

        $scope.$apply(function () {
            $scope.msg = null;
            $scope.msgtype = null;
        });

    }, 10000);
};

$(document).ready(function () {

    onLoad();

    /* ------------------------------------------------------------------------ 
		   SMALL HEADER 
    ------------------------------------------------------------------------ */
    jQuery(window).scroll(function () {

        var scroll = jQuery(window).scrollTop();
        
        if (scroll >= 250) {
            if (!jQuery('nav').hasClass("navbar-fixed-top")) {
                jQuery('nav').animateCss("fadeInDownBig");
                jQuery("nav").addClass("navbar-fixed-top");
            }
        }
        else {
            jQuery("nav").removeClass("navbar-fixed-top smallHeader active");
        }
    });


    /* ------------------------------------------------------------------------ 
		   MOBILE MENU
		------------------------------------------------------------------------ */
    jQuery(".main-nav li a").on("click", function () {
        jQuery(this).parent("li").find(".dropdown-menu").slideToggle();
        jQuery(this).find("i").toggleClass("fa-caret-down fa-caret-up");
    });
    jQuery("#review-form-close").on("click", function () {
        jQuery("#add-review-form").slideUp();
    });

});