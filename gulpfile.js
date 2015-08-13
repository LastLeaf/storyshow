'use strict';

var fs = require('fs');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
	scripts: [
		'src/init.js',
		'src/event.js',
		'src/stage.js',
		'src/item.js',
		'src/items/visible.js',
		'src/items/invisible.js',
		'src/items/text.js',
		'src/items/image.js',
		'src/items/audio.js',
		'src/items/webaudio.js',
	]
};

gulp.task('clean', function(cb){
	cb();
});

gulp.task('scripts', ['clean'], function(){
	return gulp.src(paths.scripts, {base: 'src'})
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.pipe(concat('storyshow.min.js'))
		.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: 'src'}))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', ['scripts'], function(){
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts']);
