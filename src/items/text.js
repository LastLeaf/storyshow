(function(StoryShow){
	'use strict';

	var empty = StoryShow.items.empty;

	StoryShow.items.text = StoryShow.createItem(empty, {
		content: '',
		fontStyle: 'normal',
		fontWeight: 'normal',
		fontSize: 16,
		lineHeight: -1,
		fontFamily: 'sans',
		textAlign: 'center',
		color: ''
	}, {
		init: function(properties, stage){
			var div = empty.handlers.init(properties, stage);
			div.style.fontStyle = properties.fontStyle;
			div.style.fontWeight = properties.fontWeight;
			div.style.fontSize = properties.fontSize + 'px';
			div.style.lineHeight = properties.lineHeight + 'px';
			div.style.fontFamily = properties.fontFamily;
			div.style.textAlign = properties.textAlign;
			div.style.color = properties.color;
			div.appendChild( document.createTextNode(properties.content) );
			return div;
		}
	});

})( (this.exports || this).StoryShow );
