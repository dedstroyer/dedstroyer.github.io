/*
* Fix sidebar at some point and remove
* fixed position at content bottom
*/
$(window).scroll(function () {
	var fixSidebar = $('.site-header').innerHeight();
	var contentHeight = $('.site-main').innerHeight();
	var sidebarHeight = $('.side-navigation').height();
  var sidebarBottomPos = contentHeight - sidebarHeight; 
  var trigger = $(window).scrollTop() - fixSidebar;

      	if ($(window).scrollTop() >= fixSidebar) {
          	$('.side-navigation').addClass('fixed');
      	} else {
          	$('.side-navigation').removeClass('fixed');
      	}

      	if (trigger >= sidebarBottomPos) {
          	$('.side-navigation').addClass('bottom');
      	} else {
          	$('.side-navigation').removeClass('bottom');
      	}
});