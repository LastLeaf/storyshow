(function(StoryShow){
	'use strict';

	var text = StoryShow.createItem(null, {
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 16,
		lineHeight: -1,
		fontFamily: 'sans',
		fadeInTime: 0,
		fadeOutTime: 0,
		time: 0,
	});

	text.on('init', function(item, impl){
		var div = document.createElement('div');
		div.style.fontStyle = item.fontStyle;
		div.style.fontWeight = item.fontWeight;
		div.style.fontSize = item.fontSize;
		div.style.lineHeight = item.lineHeight;
		div.style.fontFamily = item.fontFamily;
		div.style.opacity = 0;
		impl.elem = div;
		impl.aniTime = 0;
	});

	text.on('frame', function(item, impl){
		impl.aniTime += impl.frameInterval;
		if(impl.aniTime > item.time) {
			impl.elem = null;
		} else if(impl.aniTime < item.fadeInTime) {
			impl.elem.style.opacity += impl.aniTime / item.fadeInTime;
		} else if(impl.aniTime > item.time - item.fadeOutTime) {
			impl.elem.style.opacity += (item.time - impl.aniTime) / item.fadeOutTime;
		} else {
			impl.elem.style.opacity = 1;
		}
	});

	StoryShow.items.text = text;

})( (this.exports || this).StoryShow );
