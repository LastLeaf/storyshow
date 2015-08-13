(function(StoryShow){
	'use strict';

	var invisible = StoryShow.items.invisible;

	StoryShow.items.webaudio = StoryShow.createItem(invisible, {
		src: '',
		loop: false
	}, {
		init: function(item){
			var properties = item.properties;
			var AudioContext = window.AudioContext || window.webkitAudioContext;
			var context = new AudioContext();
			// media type detect
			var src = properties.src;
			if(typeof(src) === 'object') {
				var audio = document.createElement('audio');
				for(var i=0; i<src.length; i++) {
					var type = '';
					var ext = src[i].slice( src[i].lastIndexOf('.')+1 );
					if(ext === 'mp3') type = 'audio/mp4';
					else if(ext === 'ogg') type = 'audio/ogg';
					if(audio.canPlayType(type)) break;
				}
				src = src[i] || src[0];
			}
			// loading
			item.stage.loadStart(item);
			var req = new XMLHttpRequest();
			req.open('GET', src, true);
			req.responseType = 'arraybuffer';
			req.onload = function(){
				context.decodeAudioData(req.response, function(buffer){
					item.buffer = buffer;
					item.source = null;
					item.started = false;
					item.ended = false;
					item.currentTime = 0;
					item.stage.loadEnd(item);
				});
			};
			req.onerror = function(){
				item.context = null;
			};
			item.context = context;
			req.send();
			return null;
		},
		frame: function(item){
			if(!item.context || item.ended) return false;
			if(item.started) return;
			item.started = true;
			var source = item.context.createBufferSource();
			source.buffer = item.buffer;
			source.connect(item.context.destination);
			source.loop = item.properties.loop;
			source.onended = function(){
				if(!source.loop && source == item.source) item.ended = true;
			};
			item.source = source;
			source.start(0, 0);
		},
		pause: function(item){
			if(!item.started) return;
			var source = item.source;
			item.source = null;
			source.stop();
		},
		play: function(item){
			if(!item.started) return;
			var source = item.context.createBufferSource();
			source.buffer = item.buffer;
			source.connect(item.context.destination);
			source.loop = item.properties.loop;
			source.onended = function(){
				if(!source.loop && source == item.source) item.ended = true;
			};
			item.source = source;
			source.start(0, item.time.current/1000);
		}
	});

})( (this.exports || this).StoryShow );
