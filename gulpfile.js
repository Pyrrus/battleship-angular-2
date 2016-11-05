////////////////////// DEPENDENCIES AND VARIABLES //////////////////////
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

// used for concatenating/minifying bower files and other js/css
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// used for pulling in bower files.
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "less/glyphicons.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js",
      ]
    },
    "components-font-awesome" : {
      "main": [
        "css/font-awesome.css",
        "less/font-awesome.less"
      ]
    }
  }
});

// used for build and clean tasks.
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');

// set up server with watchers and run typescript compiler in the shell.
var browserSync = require('browser-sync').create();
var shell = require('gulp-shell');

// sass dependencies.
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

////////////////////// TYPESCRIPT //////////////////////
// clean task
gulp.task('tsClean', function(){
  return del(['app/*.js', 'app/*.js.map']);
});

// clean and then compile once. To be called from server and global build.
gulp.task('ts', ['tsClean'], shell.task([
  'tsc'
]));

////////////////////// BOWER //////////////////////
// when adding a new bower depndency:
// stop the server
// always use the `bower install --save` flag.
// run `gulp bower` to build vendor files
// restart server.

gulp.task('jsBowerClean', function(){
  return del(['./build/js/vendor.min.js']);
});

gulp.task('jsBower', ['jsBowerClean'], function() {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('cssBowerClean', function(){
  return del(['./build/css/vendor.css']);
});

gulp.task('cssBower', ['cssBowerClean'], function() {
  return gulp.src(lib.ext('css').files)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('./build/css'));
});

// gulp.task('bower', ['jsBower', 'cssBower']);

////////////////////// SASS //////////////////////

gulp.task('sassBuild', function() {
  return gulp.src(['resources/styles/*'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build/css'));
});

////////////////////// SERVER //////////////////////
// gulp.task('serve', ['build'], function() {
//   browserSync.init({
//     server: {
//       baseDir: "./",
//       index: "index.html"
//     }
//   });
//   gulp.watch(['resources/js/*.js'], ['jsBuild']); // vanilla js changes, reload.
//   gulp.watch(['*.html'], ['htmlBuild']); // html changes, reload.
//   gulp.watch(['resources/styles/*.css', 'resources/styles/*.scss'], ['cssBuild']); // css or sass changes, concatenate all css/sass, build, reload.
//   gulp.watch(['app/*.ts'], ['tsBuild']); // typescript files change, compile then reload.
// });

gulp.task('jsBuild', function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function(){
  browserSync.reload();
});

gulp.task('cssBuild', ['sassBuild'], function(){
  browserSync.reload();
});

gulp.task('tsBuild', ['ts'], function(){
  browserSync.reload();
});

////////////////////// GLOBAL BUILD TASK //////////////////////
// global build task with individual clean tasks as dependencies.
gulp.task('build', ['ts'], function(){
  // we can use the buildProduction environment variable here later.
  gulp.start('bower');
  gulp.start('sassBuild');
});


/////// my edit /////////////////////////////////////////////////
gulp.task('serve', ['develop'], function() {
   browserSync.init(null, {
        proxy: "http://localhost:30000",
        port: 30000,
    }); 
  // ::to reset type in rs then enter
  gulp.watch(['resources/js/*.js'], ['jsBuild']); // vanilla js changes, reload.
  gulp.watch(['*.html'], ['htmlBuild']); // html changes, reload.
  gulp.watch(['resources/styles/*.css', 'resources/styles/*.scss'], ['cssBuild']); // css or sass changes, concatenate all css/sass, build, reload.
  gulp.watch(['app/*.ts'], ['tsBuild']); // typescript files change, compile then reload.
});

gulp.task('develop', function (cb) {
  var started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        } 
    });
});

gulp.task('bootFontsBower', function () {
  return gulp.src('./bower_components/bootstrap/fonts/**/*')
    .pipe(gulp.dest('./build/fonts'))
});

gulp.task('awesomeFontsBower', function () {
  return gulp.src('./bower_components/components-font-awesome/fonts/**/*')
    .pipe(gulp.dest('./build/fonts'))
});


gulp.task('bower', ['jsBower', 'cssBower', 'bootFontsBower', 'awesomeFontsBower']);