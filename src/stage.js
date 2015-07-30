(function(StoryShow){
	'use strict';

	/*
		possible options
		wrapper: an div used for the content, default document.body
		width: standard width for content, default 1280
		height: standard height for content, default 720
		scale: decide how to scale, "none", "default", default "default"
		background: the color string for background of stage, default transparent
		fps: frame per second used, default 60
	*/

	StoryShow.createStage = function(options){
		if(options === undefined) options = {};
		var bodyMode = !options.div;
		var wrapper = bodyMode ? document.body : options.div;
		var width = options.width || 1280;
		var height = options.height || 720;
		var frameInterval = 1000 / (options.fps || 60);

		// create basic structure
		var stageDiv = document.createElement('div');
		wrapper.appendChild(stageDiv);

		// styles
		stageDiv.style.position = 'absolute';
		stageDiv.style.top = '0';
		stageDiv.style.left = '0';
		stageDiv.style.width = width + 'px';
		stageDiv.style.height = height + 'px';
		stageDiv.style.overflow = 'hidden';

		// resize
		var resize = function(outerWidth, outerHeight){
			if(bodyMode) {
				outerWidth = outerWidth || document.documentElement.clientWidth;
				outerHeight = outerHeight || document.documentElement.clientHeight;
			} else {
				outerWidth = outerWidth || wrapper.clientWidth;
				outerHeight = outerHeight || wrapper.clientHeight;
			}
			var scale = outerWidth / width;
			if(scale > outerHeight / height) scale = outerHeight / height;
			var scaleWidth = width * scale;
			var scaleHeight = height * scale;
			if(options.scale === 'none') {
				scale = 1;
				scaleWidth = width;
				scaleHeight = height;
			}
			var scaleTop = (outerHeight - scaleHeight) / 2;
			var scaleLeft = (outerWidth - scaleWidth) / 2;
			stageDiv.style.webkitTransformOrigin = 'left top';
			stageDiv.style.webkitTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ') translate3d(0,0,0)';
			stageDiv.style.MozTransformOrigin = 'left top';
			stageDiv.style.MozTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ') translate3d(0,0,0)';
			stageDiv.style.msTransformOrigin = 'left top';
			stageDiv.style.msTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ') translate3d(0,0,0)';
			stageDiv.style.transformOrigin = 'left top';
			stageDiv.style.transform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ') translate3d(0,0,0)';
		};
		if(bodyMode) {
			var ResizePrevTime = 0;
			window.addEventListener('resize', function(){
				var ts = Date.now();
				ResizePrevTime = ts;
				setTimeout(function(){
					if(ts !== ResizePrevTime) return;
					resize();
					resize(); // double resize to prevent scroll bar padding
				}, 250);
			});
		}
		resize();

		// background
		var background = function(bg){
			stageDiv.style.backgroundColor = bg;
		};
		background(options.background);

		// init data
		var eventObj = StoryShow.createEventObj();

		// ticker
		var started = false;
		if(window.requestAnimationFrame) {
			window.requestAnimationFrame(function(ts){
				var frameTimeLeft = 0;
				var framePrevTime = ts;
				var ticker = function(ts){
					frameTimeLeft += ts - framePrevTime;
					framePrevTime = ts;
					if(frameTimeLeft >= 0) {
						frameTimeLeft -= frameInterval;
						if(frameTimeLeft > 0) frameTimeLeft = 0;
						if(started) {
							if(loading) eventObj.emit('loadProgress');
							else eventObj.emit('frame');
						}
					}
					window.requestAnimationFrame(ticker);
				};
				ticker(ts);
			});
		} else {
			setTimeout(function(){
				var ticker = function(){
					if(started) {
						if(loading) eventObj.emit('loadProgress');
						else eventObj.emit('frame');
					}
					setTimeout(ticker, frameInterval);
				};
				ticker();
			}, 0);
		}

		// start stop
		var playingTime = 0;
		var prevStartTime = 0;
		var startPlay = function(){
			prevStartTime = Date.now();
			triggerItemHandlers('play');
		};
		var stopPlay = function(){
			playingTime += Date.now() - prevStartTime;
			prevStartTime = 0;
			triggerItemHandlers('pause');
		};
		var getPlayingTime = function(){
			return playingTime + (started ? Date.now() - prevStartTime : 0);
		};
		var isPlaying = function(){
			if(loading || !started) return false;
			return true;
		};
		var updatePlayingStatus = function(){
			if(loading || !started) {
				if(prevStartTime) stopPlay();
			} else {
				if(!prevStartTime) startPlay();
			}
		};
		var start = function(){
			started = true;
			updatePlayingStatus();
			eventObj.emit('start');
		};
		var stop = function(){
			started = false;
			updatePlayingStatus();
			eventObj.emit('stop');
		};

        // item system
		var items = [];
        var appendItem = function(protoItem, properties, handlers){
			var item = StoryShow.createItem(protoItem, properties, handlers);
			item.stage = stage;
			items.push(item);
			if(item.handlers.init) {
				var domElem = item.handlers.init(item);
				if(domElem) {
					item.domElem = domElem;
					stageDiv.appendChild(domElem);
				}
			}
		};
		eventObj.on('frame', function(){
			for(var i=0; i<items.length; i++) {
				var item = items[i];
				if( item.handlers.frame && item.handlers.frame(item, item.domElem) === false ) {
					items.splice(i--, 1);
					stageDiv.removeChild(item.domElem);
					if(item.handlers.destroy) item.handlers.destroy(item);
				}
			}
		});
		var triggerItemHandlers = function(e){
			for(var i=0; i<items.length; i++) {
				var item = items[i];
				if(item.handlers[e]) item.handlers[e](item, item.domElem);
			}
		};

		// loading management
		var loading = false;
		var updateLoadingStatus = function(){
			for(var i=0; i<items.length; i++) {
				var item = items[i];
				if(item.loading) {
					if(!loading) {
						loading = true;
						updatePlayingStatus();
						eventObj.emit('loadStart');
					}
					return;
				}
			}
			if(loading) {
				loading = false;
				updatePlayingStatus();
				eventObj.emit('loadEnd');
			}
		};
		var loadStart = function(item){
			item.loading = true;
			updateLoadingStatus();
		};
		var loadEnd = function(item){
			item.loading = false;
			updateLoadingStatus();
		};

		var stage = Object.create(eventObj, {
			resize: { value: resize },
			background: { value: background },
			start: { value: start },
			stop: { value: stop },
			isPlaying: { value: isPlaying },
			getPlayingTime: { value: getPlayingTime },
			appendItem: { value: appendItem },
			loadStart: { value: loadStart },
			loadEnd: { value: loadEnd }
		});
		return stage;
	};

})( (this.exports || this).StoryShow );
