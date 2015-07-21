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
		'src/stage.js'
	]
};

gulp.task('clean', function(cb){
	del(['bin'], cb);
});

gulp.task('scripts', ['clean'], function(){
	return gulp.src(paths.scripts)
		.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat('storyshow.min.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('bin'));
});

gulp.task('watch', ['scripts'], function(){
	gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['scripts']);
