(function(StoryShow){
	'use strict';

	var visible = StoryShow.items.visible;

	StoryShow.items.image = StoryShow.createItem(visible, {
		src: ''
	}, {
		init: function(item){
			var div = visible.handlers.init(item);
			var img = new Image();
			img.onerror = img.onabort = img.onload = function(){
				div.appendChild(img);
				item.stage.loadEnd(item);
			};
			img.setAttribute('alt', '');
			img.style.position = 'absolute';
			img.style.width = '100%';
			img.style.height = '100%';
			item.stage.loadStart(item);
			img.src = item.properties.src;
			return div;
		}
	});

})( (this.exports || this).StoryShow );
