$(function () {

  //ページ内スクロール
 

  $('header a').click(function(){
    var id = $(this).attr('href');
    var position = $(id).offset().top -65;     //上に被さってるヘッダー部分の影響でかぶってる部分-65してる
    $("body,html").animate({ scrollTop: position, }, 800);
    return false;
  });

  
  //ページトップ
  $("#js-page-top").on("click", function () {
    $("body,html").animate({ scrollTop: 0, }, 800);
    return false;
  });

  $('.header-logo').on("click", function () {
    $("body,html").animate({ scrollTop: 0, }, 800);
    return false;
  });

  

  $(window).scroll(function() {
    // fadeinクラスに対して順に処理を行う
    $('.section').each(function() {
      // スクロールした距離
      let scroll = $(window).scrollTop();
      // fadeinクラスの要素までの距離
      let target = $(this).offset().top;
      // 画面の高さ
      let windowHeight = $(window).height();
      // fadeinクラスの要素が画面下にきてから50px通過した
      // したタイミングで要素を表示
      if (scroll > target - windowHeight + 50) {
        $(this).css('opacity','1');
        $(this).css('transform','translateY(0)');
      }
    });
  });

   // トップボタンスクロール
  $('.button').click(function(){
    $('html, body').animate({
      'scrollTop':0
    },700);
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

  $('.works-list').slick({
    arrows: false,//左右の矢印はなし
    autoplay: true,//自動的に動き出すか。初期値はfalse。
    autoplaySpeed: 0,//自動的に動き出す待ち時間。初期値は3000ですが今回の見せ方では0
    speed: 6900,//スライドのスピード。初期値は300。
    infinite: true,//スライドをループさせるかどうか。初期値はtrue。
    pauseOnHover: false,//オンマウスでスライドを一時停止させるかどうか。初期値はtrue。
    pauseOnFocus: false,//フォーカスした際にスライドを一時停止させるかどうか。初期値はtrue。
    cssEase: 'linear',//動き方。初期値はeaseですが、スムースな動きで見せたいのでlinear
    slidesToShow: 4,//スライドを画面に4枚見せる
    slidesToScroll: 1,//1回のスライドで動かす要素数
    responsive: [

      {
      breakpoint: 769,//モニターの横幅が769px以下の見せ方
      settings: {
        slidesToShow: 2.8,//スライドを画面に2枚見せる
      }
    },
    {
      breakpoint: 426,//モニターの横幅が426px以下の見せ方
      settings: {
        slidesToShow: 1.5,//スライドを画面に1.5枚見せる
      }
    }
  ]
  });

  element.style.style = null;

});

