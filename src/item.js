(function(StoryShow){
	'use strict';

	StoryShow.createItem = function(protoItem, properties, handlers){
		var prop = Object.create(protoItem ? protoItem.properties : Object.prototype);
		if(properties) {
			for(var k in properties) {
				prop[k] = properties[k];
			}
		}
		var hndl = Object.create(protoItem ? protoItem.handlers : Object.prototype);
		if(handlers) {
			for(var k in handlers) {
				hndl[k] = handlers[k];
			}
		}
		return {
			protoItem: protoItem || null,
			properties: prop,
			handlers: hndl,
			stage: null,
			domElem: null,
			loading: false
		};
	};

	StoryShow.items = {};

})( (this.exports || this).StoryShow );
