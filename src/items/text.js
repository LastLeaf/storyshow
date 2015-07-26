(function(StoryShow){
	'use strict';

	var text = StoryShow.createItem(null, {
		content: '',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: 0,
		height: 0,
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 16,
		lineHeight: -1,
		fontFamily: 'sans',
		textAlign: 'center',
		color: '',
		backgroundColor: 'transparent',
		paddingLeft: 0,
		paddingRight: 0,
		paddingTop: 0,
		paddingBottom: 0,
		fadeInTime: 0,
		fadeOutTime: 0,
		time: 0,
	}, {
		init: function(properties, stage){
			var div = document.createElement('div');
			div.style.position = 'absolute';
			div.style.margin = 'auto';
			div.style.left = properties.left + 'px';
			div.style.right = properties.right + 'px';
			div.style.top = properties.top + 'px';
			div.style.bottom = properties.bottom + 'px';
			div.style.width = properties.width + 'px';
			div.style.height = properties.height + 'px';
			div.style.fontStyle = properties.fontStyle;
			div.style.fontWeight = properties.fontWeight;
			div.style.fontSize = properties.fontSize + 'px';
			div.style.lineHeight = properties.lineHeight + 'px';
			div.style.fontFamily = properties.fontFamily;
			div.style.textAlign = properties.textAlign;
			div.style.color = properties.color;
			div.style.backgroundColor = properties.backgroundColor;
			div.style.paddingLeft = properties.paddingLeft + 'px';
			div.style.paddingRight = properties.paddingRight + 'px';
			div.style.paddingTop = properties.paddingTop + 'px';
			div.style.paddingBottom = properties.paddingBottom + 'px';
			div.style.opacity = 0;
			div.initTime = stage.getStartedTime();
			div.appendChild( document.createTextNode(properties.content) );
			return div;
		},
		frame: function(div, properties, stage){
			var aniTime = stage.getStartedTime() - div.initTime;
			if(aniTime > properties.time) {
				return false;
			} else if(aniTime < properties.fadeInTime) {
				div.style.opacity = aniTime / properties.fadeInTime;
			} else if(aniTime > properties.time - properties.fadeOutTime) {
				div.style.opacity = (properties.time - aniTime) / properties.fadeOutTime;
			} else {
				div.style.opacity = 1;
			}
		}
	});

	StoryShow.items.text = text;

})( (this.exports || this).StoryShow );
