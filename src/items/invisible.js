(function(StoryShow){
	'use strict';

	StoryShow.items.empty = StoryShow.createItem(null, {
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		width: 0,
		height: 0,
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
			return null;
		},
		frame: function(div, properties, stage){
			return;
		}
	});

})( (this.exports || this).StoryShow );
