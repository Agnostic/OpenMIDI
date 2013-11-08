var openMidi = angular.module('openmidi', []);

openMidi.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  console.log($routeProvider);
}]);

openMidi.apply = function(s){
  if(!s.$$phase){
    s.$apply();
  }
};

var timeFormatting = function(n) {
  var minutes = n / 60 >> 0;
  var seconds = String(n - (minutes * 60) >> 0);
  if (seconds.length == 1) seconds = "0" + seconds;
  return minutes + ":" + seconds;
};

var loadRemoteFile = function(path, callback) {
  var fetch = new XMLHttpRequest();
  fetch.open('GET', path);
  fetch.overrideMimeType("text/plain; charset=x-user-defined");
  fetch.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      /* munge response into a binary string */
      var t = this.responseText || "" ;
      var ff = [];
      var mx = t.length;
      var scc= String.fromCharCode;
      for (var z = 0; z < mx; z++) {
              ff[z] = scc(t.charCodeAt(z) & 255);
      }
      callback(ff.join(""));
    }
  };
  fetch.send();
};

openMidi.controller('midiList', ['$scope', function($scope){
  $scope.loading = true;

  $scope.midis = [
    {
      id: 1,
      name: "El exorcista",
      description: "Melodía inspirada en algo muy interesante.",
      add_date: "Oct 31th 2013",
      autor: "Gilberto Avalos",
      file: "exorcist.mid"
    },
    {
      id: 2,
      name: "Faithless - Insomnia",
      description: "Insomnia is the title of a song recorded by British dance group Faithless.",
      add_date: "Oct 31th 2013",
      autor: "Gilberto Avalos",
      file: "insomnia.mid"
    },
    {
      id: 3,
      name: "El exorcista",
      description: "Melodía inspirada en algo muy interesante.",
      add_date: "Oct 31th 2013",
      autor: "Gilberto Avalos",
      file: "exorcist.mid"
    }
  ];

  window.player = '';
  MIDI.loader = new widgets.Loader();
  MIDI.loadPlugin(function () {
    // this sets up the MIDI.Player and gets things going...
    player = MIDI.Player;
    player.timeWarp = 1; // speed the song is played back
    // player.addListener(function(data) {
    //   var pianoKey = data.note - MIDI.pianoKeyOffset;
    //   var colorMap = MusicTheory.Synesthesia.map();
    //   var map = colorMap[data.note - 27];
    //   if(map && map.hex){
    //     $('.logo h1').css({ color: map.hex, opacity: data.velocity/100, 'text-shadow': '1px 1px '+parseInt(data.velocity/10, 10)+'px '+map.hex });
    //   } else {
    //     $('.logo h1').css({ color: '#777', opacity: 1, 'text-shadow': 'none' });
    //   }
    //   openMidi.apply($scope);
    // });

    player.setAnimation(function(data, element) {
      var percent = data.now / data.end;
      var now = data.now >> 0; // where we are now
      var end = data.end >> 0; // end of song
      //timeCursor.style.width = (percent * 100) + "%";
      $scope.actualMidi.actual_time = timeFormatting(now);
      $scope.actualMidi.total_time = timeFormatting(end);
      openMidi.apply($scope);
    });

    MIDI.loader.stop();
    $scope.loading = false;
    openMidi.apply($scope);
  });

  window.scope = $scope;

  $scope.$watch('playing', function(playing){
    if(!playing){
      $('.logo h1').css({ color: '#777', opacity: 1, 'text-shadow': 'none' });
    }
  });

  $scope.toggleMidi = function(songId){

    $scope.actualMidi = _.find($scope.midis, function(midi){
      return midi.id === songId;
    });

    if($scope.actualMidi && $scope.actualMidi.playing){
      if(player.playing){
        $scope.actualMidi.playing = false;
        $scope.playing = false;
        player.pause();
      } else {
        $scope.actualMidi.playing = true;
        $scope.playing = true;
        player.start();
      }
    } else {
      if($scope.actualMidi){
        _.each($scope.midis, function(mid){
          mid.playing = false;
          mid.loading = false;
        });
        $scope.actualMidi.loading = true;
        player.stop();
        player.loadFile('/midis/'+$scope.actualMidi.file, function(data){
          $scope.actualMidi.loading = false;
          $scope.actualMidi.playing = true;
          $scope.playing = true;
          player.start();
          openMidi.apply($scope);
        });
      }
    }

  };
}]);

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
          // $('#hero').css('overflow', 'hidden');
          // $('#hero').animate({ height: 0, padding:0 }, 500);
          // $("html, body").animate({ scrollTop: 0 }, 500);
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
                // $("html, body").animate({ scrollTop: 0 }, 0);
                // $('#hero').remove();
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