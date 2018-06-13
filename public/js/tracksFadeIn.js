function tracksFadeIn() {
	$('.track-headers').hide();
	$("div[class^='track']").animate({width: 'toggle'});
	$('.toptracks').show();
	$('.bottom-content').hide();
	$('.albums').fadeOut(300);
	$('.track-headers').delay(300).fadeIn(300);
	
	var numTracks = $("div[class^='track']").length;

	for(let i=0; i < numTracks; i++) {
		var className = '.track' + i;

		$(className).delay(200*(i+1)).animate({width: 'toggle'});
	}
	$('.bottom-content').delay(3000).fadeIn(300);
}
