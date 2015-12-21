// Include gulp
var gulp = require('gulp');
// Include plugins
var gutil         = require('gulp-util'),
    concat        = require('gulp-concat'),
    uglify        = require('gulp-uglify'),
    rename        = require('gulp-rename'),
    sass          = require('gulp-sass'),
    sourcemaps    = require('gulp-sourcemaps'),
    autoprefixer  = require('gulp-autoprefixer'),
    imagemin      = require('gulp-imagemin'),
    cache         = require('gulp-cache');
// Variables
var jsInput       = './src/scripts/*.js',
    jsVendorInput = './src/scripts/**/*.js',
    jsOutput      = './build/js',
    sassInput     = './src/sass/**/*.scss',
    cssOutput     = './build/css',
    cssMapsOutput = './maps',
    imgInput      = './src/images/**/*',
    imgOutput     = './build/img';
// Plugin options
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};
// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(jsInput)
      .pipe(concat('main.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutput))
      .on('error', gutil.log);
    // create 1 vendor.js file from all vendor plugin code
    return gulp.src(jsVendorInput)
      .pipe(concat('vendor.js'))
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify())
      .pipe(gulp.dest(jsOutput))
      .on('error', gutil.log);           
});
// Compile SASS & Create Sourcemaps
gulp.task('styles', function() {
    return gulp.src(sassInput)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(cssMapsOutput))
        .pipe(gulp.dest(cssOutput))
        .on('error', gutil.log);
});
// Optimize images
gulp.task('images', function() {
  return gulp.src(imgInput)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(imgOutput))
    .on('error', gutil.log);
});
// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(jsInput, ['scripts']).on('error', gutil.log);
  gulp.watch(sassInput, ['styles']).on('error', gutil.log);
  gulp.watch(imgInput, ['images']).on('error', gutil.log);
});
 // Default Task
gulp.task('default', ['scripts', 'styles', 'images', 'watch']);