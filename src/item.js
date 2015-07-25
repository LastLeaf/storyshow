(function(StoryShow){
	'use strict';

	StoryShow.createItem = function(protoItem, properties, handlers){
		var prop = Object.create(protoItem ? protoItem.properties : Object.prototype);
		if(properties) {
			for(var k in properties) {
				prop[k] = properties[k];
			}
		}
		return {
			protoItem: protoItem || null,
			handlers: handlers || {},
			properties: prop
		};
	};

	StoryShow.items = {};

})( (this.exports || this).StoryShow );
