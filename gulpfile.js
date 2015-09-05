'use strict';

var fs = require('fs');
var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var zip = require('gulp-zip');
var rename = require('gulp-rename');
var del = require('del');
var connect = require('gulp-connect');

var version = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;

gulp.task('build', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './src/savory.js',
    debug: false
  });

  // delete all files in build folder
  del([
    './build/*'
  ]);

  return b.bundle()
    .pipe(source('savory.js'))
    .pipe(rename(function (path) {
      path.basename += '-'+version;
    }))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build/'));
});

// Pack files to archive
gulp.task('zip', ['build'], function() {
    return gulp.src('./build/*')
      .pipe(zip('savory.zip'))
      .pipe(gulp.dest('./build/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['src/*.js', 'src/config/*.js', 'src/models/*.js', 'src/controllers/*.js'], ['build', 'zip']);
});

gulp.task('server', function(){
    connect.server({
      port : 8800
    });
});

gulp.task('test', ['server'], function (done) {
    var Server = require('karma').Server;

    new Server({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, function(){
      connect.serverClose();
      done();
    }).start();
});

// Default Task
gulp.task('default', ['build', 'test', 'zip']);