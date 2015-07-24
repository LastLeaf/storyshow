(function(StoryShow){
	'use strict';

	StoryShow.createItem = function(protoItem, properties, handlers){
		if(!protoItem) protoItem = {};
		return {
			handlers: handlers,
			properties: {value: Object.create(protoItem.properties || Object.prototype, properties)}
		};
	};

	StoryShow.items = {};

})( (this.exports || this).StoryShow );
