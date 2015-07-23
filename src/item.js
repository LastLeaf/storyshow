(function(StoryShow){
	'use strict';

	StoryShow.createItem = function(protoItem, properties){
		if(!protoItem) protoItem = {};
		var eventObj = StoryShow.createEventObj(protoItem.eventObj);
		return Object.create(eventObj, {
			eventObj: {value: eventObj},
			properties: {value: Object.create(protoItem.properties || Object.prototype, properties)}
		});
	};

	StoryShow.items = {};

})( (this.exports || this).StoryShow );
