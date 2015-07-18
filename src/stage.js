(function(StoryShow){
	'use strict';

	/*
		possible options
		wrapper: an div used for the content, default document.body
		width: standard width for content, default 1280
		height: standard height for content, default 720
		scale: decide how to scale, "none", "default", default "default"
		background: the color string for background of stage, default transparent
	*/

	StoryShow.createStage = function(options){
		if(options === undefined) options = {};
		var bodyMode = !options.div;
		var wrapper = bodyMode ? document.body : options.div;
		var width = options.width || 1280;
		var height = options.height || 720;

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
			stageDiv.style.webkitTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ')';
			stageDiv.style.MozTransformOrigin = 'left top';
			stageDiv.style.MozTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ')';
			stageDiv.style.msTransformOrigin = 'left top';
			stageDiv.style.msTransform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ')';
			stageDiv.style.transformOrigin = 'left top';
			stageDiv.style.transform = 'translate(' + scaleLeft + 'px, ' + scaleTop + 'px) scale(' + scale + ',' + scale + ')';
		};
		if(bodyMode) {
			window.addEventListener('resize', function(){
				resize();
			});
		}
		resize();

		// background
		var background = function(bg){
			stageDiv.style.backgroundColor = bg;
		};
		background(options.background);

		return Object.create(StoryShow.createEventObj(), {
			resize: { value: resize },
			background: { value: background }
		});
	};

})( (this.exports || this).StoryShow );
