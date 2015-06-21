'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/savory.js',
    debug: false
  });

  return b.bundle()
    .pipe(source('savory.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['src/*.js', 'src/config/*.js', 'src/models/*.js', 'src/controllers/*.js'], ['build']);
});

// Default Task
gulp.task('default', ['build', 'watch']);