module.exports = function(artist) {
	var artistFormatted = '';
	for(let i = 0; i < artist.length; i++) {
		if (artist.charAt(i) == ' ') {
			artistFormatted += '+';
		} else {
			artistFormatted += artist.charAt(i);
		}
	}

	return artistFormatted;
}