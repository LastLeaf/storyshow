(function(StoryShow){
	'use strict';

	StoryShow.createEventObj = function(protoEvent){
		var idInc = 0;
		var eventMap = {};

		var on = function(e, func){
			if(!eventMap[e]) eventMap[e] = [];
			var id = idInc++;
			eventMap[e].push({
				id: id,
				func: func,
				once: false
			});
		};
		var once = function(e, func){
			if(!eventMap[e]) eventMap[e] = [];
			var id = idInc++;
			eventMap[e].push({
				id: id,
				func: func,
				once: true
			});
		};
		var off = function(e, func){
			if(!eventMap[e]) return;
			var events = eventMap[e];
			for(var i=0; i<events.length; i++) {
				if(events[i].id === func || events[i].func === func) {
					events.splice(i, 1);
					break;
				}
			}
		};
		var emit = function(e){
			if(protoEvent) protoEvent.emit(e);
			if(!eventMap[e]) return;
			var events = eventMap[e];
			var args = [];
			for(var i=0; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
			for(i=0; i<events.length; i++) {
				try {
					events[i].func.apply(StoryShow, args);
				} catch(e) {
					setTimeout(function(){
						throw(e);
					});
				}
				if(events[i].once) {
					events.splice(i--, 1);
				}
			}
		};

		return Object.create(Object.prototype, {
			on: { value: on },
			once: { value: once },
			off: { value: off },
			emit: { value: emit }
		});
	};

})( (this.exports || this).StoryShow );
