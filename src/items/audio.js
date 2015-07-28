(function(StoryShow){
	'use strict';

	var invisible = StoryShow.items.invisible;

	StoryShow.items.audio = StoryShow.createItem(invisible, {
		src: '',
		loop: false
	}, {
		init: function(properties, stage){
			var audio = document.createElement('audio');
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
			return audio;
		},
		frame: function(audio, properties, stage){
			if(!audio.stageStarted) audio.play();
			else if(!properties.loop && audio.ended) return false;
		}
	});

})( (this.exports || this).StoryShow );
