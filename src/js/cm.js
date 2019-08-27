
// スムーススクロール
$(function(){
  $('a[href^="#"]').click(function(){
    var speed = 400;
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    var position = target.offset().top;
    $("html, body").animate({scrollTop:position}, speed, "swing");
    return false;
  });
});

//電話リンク
$(function(){
  var ua = navigator.userAgent;
  if(ua.indexOf('iPhone') > 0 || ua.indexOf('Android') > 0){
      $('.tel_link').each(function(){
       var str = $(this).text();
       $(this).html($('<a>').attr('href', 'tel:' + str.replace(/-/g, '')).append(str + '</a>'));
    });
   }
});

// 共通ブロック
function writeFooter(rootDir){
	$.ajax({
		url: rootDir + "inc/footer.html",
		cache: false,
		async: false,
		success: function(html){
			html = html.replace(/\{\$root\}/g, rootDir);
			document.write(html);
		}
	});
}

// アコーディオン
$(function(){
	// アコーディオン PC・SP両方
	$('.accordion_box').find('.accordion_block').hide();
	var no=0;
	$('.accordion_box').find('.accordion_btn').click(function () {
		$(this).toggleClass('active');
		$(this).next('.accordion_block').slideToggle();
	});
	$('.accordion_box').find('.accordion_btn').hover(function () {
		$(this).toggleClass('hovered');
	});
	// アコーディオン SP時のみ
  var w = $(window).width();
  var x = 736;
  if (w <= x) {
	$('.accordion_box_sp').find('.accordion_block').hide();
	var no=0;
		$('.accordion_box_sp').find('.accordion_btn').click(function () {
			$(this).toggleClass('active');
			$(this).next('.accordion_block').slideToggle();
		});
		$('.accordion_box_sp').find('.accordion_btn').hover(function () {
			$(this).toggleClass('hovered');
		});
  }
});

// タブ切り替え
$('.tab_list li').click(function() {
	var index = $('.tab_list li').index(this);
	$('.tab_content .block').css('display','none');
	$('.tab_content .block').eq(index).css('display','block');
	$('.tab_list li').removeClass('select');
	$(this).addClass('select')
});
