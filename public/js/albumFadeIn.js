function albumFadeIn() {
	$("div[class^='frame']").hide();

	var numFrames = $("div[class^='frame']").length;

	for(let i=0; i < numFrames; i++) {
		var className = '.frame' + i;
		$(className).fadeIn(400*(i+1));
	}
}

$(document).ready(albumFadeIn);