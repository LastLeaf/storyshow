(function(StoryShow){
	'use strict';

	var invisible = StoryShow.items.invisible;

	StoryShow.items.audio = StoryShow.createItem(invisible, {
		src: '',
		preload: '', // one of 'none', 'loadedmetadata', 'canplay', 'canplaythrough', 'loadeddata'
		loop: false
	}, {
		init: function(item){
			var properties = item.properties;
			var audio = document.createElement('audio');
			audio.setAttribute('preload', 'auto');
			if(typeof(properties.src) !== 'object') {
				audio.src = properties.src;
			} else {
				for(var i=0; i<properties.src.length; i++) {
					var source = document.createElement('source');
					source.src = properties.src[i];
					audio.appendChild(source);
				}
			}
			audio.loop = properties.loop;
			audio.volume = 1;
			audio.stageStarted = false;
			// loading status management
			audio.onwaiting = function(){
				audio.waitLoading = true;
				item.stage.loadStart(item);
			};
			audio.onplaying = function(){
				if(!audio.waitLoading) return;
				audio.pause();
				audio.waitLoading = false;
				item.stage.loadEnd(item);
			};
			if(properties.preload === 'loadedmetadata' || properties.preload === 'canplay' || properties.preload === 'canplaythrough' || properties.preload === 'loadeddata') {
				item.stage.loadStart(item);
				var eventName = 'on' + properties.preload;
				audio[eventName] = function(){
					audio[eventName] = null;
					item.stage.loadEnd(item);
				};
			}
			return audio;
		},
		frame: function(item, audio){
			if(!audio.stageStarted) {
				audio.play();
				audio.stageStarted = true;
			} else if(!audio.loop && audio.ended) {
				return false;
			}
		},
		pause: function(item, audio){
			if(audio.waitLoading) return;
			audio.pause();
		},
		play: function(item, audio){
			audio.play();
		}
	});

})( (this.exports || this).StoryShow );
