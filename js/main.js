
$(document).ready(function() {


  $('.colors li a').click(function(e){
    e.preventDefault();
    $(this).parent().parent().find('a').removeClass('active');
    $(this).addClass('active');
  });

  // ==================== SCROLL TO TOP ====================== //
  var hiddenHero = false, clickedBrowse = false;
  $(window).scroll(function(){

        if ($(this).scrollTop() > 100) {
            $('.scrollup').fadeIn();
        } else {
            $('.scrollup').fadeOut();
        }

        if( $(this).scrollTop() > 200 && !hiddenHero && !clickedBrowse ){
          $('#hero').css('overflow', 'hidden');
          $('#hero').animate({ height: 0, padding:0 }, 500);
          $("html, body").animate({ scrollTop: 0 }, 500);
          hiddenHero = true;
        }
    });

    $('.scrollup').click(function(){
      $("html, body").animate({ scrollTop: 0 }, 600);
      return false;
    });


  // ==================== CSS ANIMATIONS (DISABLES ON MOBILE DEVICES) ==================== //
  userAgent = window.navigator.userAgent;

  if(/iP(hone|od|ad)/.test(userAgent)==false) {

    $('.slide-up').bind('inview', function (event, visible) {
      if (visible == true) {
        // element is now visible in the viewport
        $(this).addClass('animated fadeInUp');
      } else {
        // element has gone out of viewport
        $(this).removeClass('animated fadeInUp');
      }
    });

    $('.slide-down').bind('inview', function (event, visible) {
      if (visible == true) {
        // element is now visible in the viewport
        $(this).addClass('animated fadeInDown');
      } else {
        // element has gone out of viewport
        $(this).removeClass('animated fadeInDown');
      }
    });

    $('.slide-right').bind('inview', function (event, visible) {
      if (visible == true) {
        // element is now visible in the viewport
        $(this).addClass('animated fadeInRight');
      } else {
        // element has gone out of viewport
        $(this).removeClass('animated fadeInRight');
      }
    });

    $('.slide-left').bind('inview', function (event, visible) {
      if (visible == true) {
        // element is now visible in the viewport
        $(this).addClass('animated fadeInLeft');
      } else {
        // element has gone out of viewport
        $(this).removeClass('animated fadeInLeft');
      }
    });

  }

  // ==================== BOOTSTRAP SCROLLSPY ==================== //
  $('#main-nav').scrollspy();

  // ==================== SMOOTH SCROLLING BETWEEN SECTIONS ==================== //
  $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
          || location.hostname == this.hostname) {

        var target = $(this.hash);

        if(target.attr('id') === 'features'){
          clickedBrowse = true;
        }

        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          if ($(".navbar").css("position") == "fixed" ) {
             $('html,body').animate({
                 scrollTop: target.offset().top-83
            }, 800, 'linear', function(){
              if(target.attr('id') === 'features'){
                $("html, body").animate({ scrollTop: 0 }, 0);
                $('#hero').remove();
              }
            });
          } else {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 800);
          }
          return false;
        }
      }
  });

  // ==================== NEWSLETTER SIGNUP ==================== //
    $("#newsletter-signup").submit(function() {
    var str = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "assets/newsletter.php",
      data: str,
      success: function(msg) {
        if(msg == 'OK') {
          result = '<div class="alert alert-success">Yeeha, you are signed up!"</div>';
          $(".input-group").hide();
          setTimeout("location.reload(true);",7000);
          } else {
          result = msg;
          }
          $('#error-info').html(result);
        }
    });
    return false;
  });

  // ==================== CONTACT FORM ==================== //
    $("#contact-form").submit(function() {
    var str = $(this).serialize();
    $.ajax({
      type: "POST",
      url: "assets/contact.php",
      data: str,
      success: function(msg) {
        if(msg == 'OK') {
          result = '<div class="alert alert-success">All good, message sent!"</div>';
          $(".input-group").hide();
          setTimeout("location.reload(true);",7000);
          } else {
          result = msg;
          }
          $('#contact-error').html(result);
        }
    });
    return false;
  });

});