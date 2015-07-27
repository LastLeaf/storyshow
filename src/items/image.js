(function(StoryShow){
	'use strict';

	var empty = StoryShow.items.empty;

	StoryShow.items.image = StoryShow.createItem(empty, {
		img: null
	}, {
		init: function(properties, stage){
			var div = empty.handlers.init(properties, stage);
			var img = properties.img;
			img.style.position = 'absolute';
			img.style.width = '100%';
			img.style.height = '100%';
			div.appendChild(img);
			console.info(div);
			return div;
		}
	});

})( (this.exports || this).StoryShow );
