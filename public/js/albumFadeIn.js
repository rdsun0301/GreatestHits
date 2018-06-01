function albumFadeIn() {
	$('.toptracks').hide();
	$('.albums').show();
	$("div[class^='frame']").hide();

	var numFrames = $("div[class^='frame']").length;
	
	for(let i=0; i < numFrames; i++) {
		var className = '.frame' + i;

		//How fast should the albums appear?
		var speedFunction = 3000 - 1500*Math.pow(0.5, i);
		
		$(className).fadeIn(speedFunction);
	}
}

$(document).ready(albumFadeIn);