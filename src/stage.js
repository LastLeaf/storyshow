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
						if(loading) eventObj.emit('loadProgress');
						else if(started) eventObj.emit('frame');
					}
					window.requestAnimationFrame(ticker);
				};
				ticker(ts);
			});
		} else {
			setTimeout(function(){
				var ticker = function(){
					if(loading) eventObj.emit('loadProgress');
					else if(started) eventObj.emit('frame');
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
			eventObj.emit('play');
		};
		var stopPlay = function(){
			playingTime += Date.now() - prevStartTime;
			prevStartTime = 0;
			triggerItemHandlers('pause');
			eventObj.emit('pause');
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
		var isStarted = function(){
			return started;
		};

		// item system
		var items = [];
		var createItem = function(protoItem, properties, handlers){
			var item = StoryShow.createItem(protoItem, properties, handlers);
			item.stage = stage;
			items.push(item);
			var domElem = item.handlers.init(item);
			item.domElem = domElem || null;
			return item;
		};
		var appendItem = function(item){
			item.running = true;
			if(item.domElem) {
				stageDiv.appendChild(item.domElem);
			}
			item.handlers.start(item, item.domElem);
		};
		var removeItem = function(item){
			for(var i=0; i<items.length; i++) {
				if(item === items[i]) break;
			}
			items.splice(i, 1);
			stageDiv.removeChild(item.domElem);
			item.running = false;
			item.handlers.destroy(item);
		};
		eventObj.on('frame', function(){
			triggerItemHandlers('frame', function(item, r){
				if(r === false) removeItem(item);
			});
		});
		var triggerItemHandlers = function(e, cb){
			var arr = items.slice(0);
			for(var i=0; i<arr.length; i++) {
				var item = arr[i];
				if(!item.running) continue;
				var r = item.handlers[e](item, item.domElem);
				if(cb) cb(item, r);
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
		var countLoadingItems = function(){
			var count = 0;
			for(var i=0; i<items.length; i++) {
				if(items.loading) count++;
			}
			return count;
		};

		// proxy mouse events
		var buildMouseEventData = function(e){
			var rect = stageDiv.getBoundingClientRect();
			return {
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				dx: 0,
				dy: 0,
				button: e.button,
				alt: e.altKey,
				ctrl: e.ctrlKey,
				meta: e.metaKey,
				shift: e.shiftKey
			};
		};
		stageDiv.addEventListener('click', function(e){
			e.preventDefault();
			var data = buildMouseEventData(e);
			stage.emit('click', data);
		});
		stageDiv.addEventListener('wheel', function(e){
			e.preventDefault();
			var data = buildMouseEventData(e);
			data.dx = e.deltaX;
			data.dy = e.deltaY;
			stage.emit('wheel', data);
		});
		stageDiv.addEventListener('contextmenu', function(e){
			e.preventDefault();
		});

		var stage = Object.create(eventObj, {
			resize: { value: resize },
			background: { value: background },
			start: { value: start },
			stop: { value: stop },
			isPlaying: { value: isPlaying },
			isStarted: { value: isStarted },
			countLoadingItems: { value: countLoadingItems },
			getPlayingTime: { value: getPlayingTime },
			createItem: { value: createItem },
			appendItem: { value: appendItem },
			removeItem: { value: removeItem },
			loadStart: { value: loadStart },
			loadEnd: { value: loadEnd }
		});
		return stage;
	};

})( (this.exports || this).StoryShow );
