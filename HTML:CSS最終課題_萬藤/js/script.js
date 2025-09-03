$(function () {
    // トップボタンスクロール
    $('.button').click(function(){
        $('html, body').animate({
          'scrollTop':0
        },700);
      });

      $('header a').click(function(){
        var id = $(this).attr('href');
        var position = $(id).offset().top;
        $('html , body').animate({
          'scrollTop':position
        },700);
      });

      // トップボタン表示位置
      $(".top_main").hide();
      $(window).on("scroll", function () {
        if (300 < $(this).scrollTop()) {
            $(".top_main").fadeIn(300);
        }
        else {
            $(".top_main").fadeOut(300);
        }
    });

      // トップボタン表示位置
      $(".top").hide();
      $(window).on("scroll", function () {
        if (300 < $(this).scrollTop()) {
            $(".top").fadeIn(300);
        }
        else {
            $(".top").fadeOut(300);
        }
    });


      // ナビメニュー
      $('.header_logo a').hover(function(){
        $('.header_logo a').css('opacity','0.7');
      },
      function(){
        $('.header_logo a').css('opacity','1.0');
      });

      // ナビメニュー
      $('nav li').hover(function(){
        $(this).css('opacity','0.7');
      },
      function(){
        $(this).css('opacity','1.0');
      });

      // ホテルメニュー
      $('.hotels p').hover(function(){
        $(this).css('opacity','0.7');
      },
      function(){
        $(this).css('opacity','1.0');
      });

      // グルメ詳細ボタン
      $('#food button').hover(function(){
        $('#food button').css('opacity','0.7');
      },
      function(){
        $('#food button').css('opacity','1.0');
      });

      // 観光地詳細ボタン
      $('#tour button').hover(function(){
        $('#tour button').css('opacity','0.7');
      },
      function(){
        $('#tour button').css('opacity','1.0');
      });

      // 私について詳細ボタン
      $('#about button').hover(function(){
        $('#about button').css('opacity','0.7');
      },
      function(){
        $('#about button').css('opacity','1.0');
      });

      // グルメ各メニュー
      $('.shop').hover(function(){
        $(this).css('opacity','0.7');
      },
      function(){
        $(this).css('opacity','1.0');
      });

      // 観光地各メニュー
      $('.tour').hover(function(){
        $(this).css('opacity','0.7');
      },
      function(){
        $(this).css('opacity','1.0');
      });

});