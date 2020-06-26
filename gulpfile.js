'use strict';
const gulp         = require('gulp');
const pug          = require('gulp-pug');
const sass         = require('gulp-sass');
const browserSync  = require('browser-sync').create();
const plumber      = require('gulp-plumber');
const notify       = require('gulp-notify');
const autoPrefixer = require('gulp-autoprefixer');
const rename       = require('gulp-rename');
const sourcemaps   = require('gulp-sourcemaps');

// compile pug to html
gulp.task('pug', function () {
   return gulp.src('./src/pug/pages/*.pug')
       .pipe(pug({
           pretty: true
       }))
       .pipe(gulp.dest('build'));
});

// compile scss to css
gulp.task('sass', function () {
  return gulp.src('./src/scss/style.scss')
  .pipe(sourcemaps.init())
  .pipe(plumber({
    errorHandler: notify.onError(function(err) {
      return {
        title: 'Styles',
        message: err.message
      }
    })
  }))
  .pipe(sass({
    errorLogConsole: true,
    outputStyle: 'compressed'
  }))
  .pipe(autoPrefixer({
    browsers: ['last 6 versions'],
    cascade: false
  }))
  .pipe(rename({ suffix: '.min' }))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./build/css'))
  .pipe(browserSync.stream());
});

gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './build',
    }
  });
  gulp.watch('./src/scss/*.scss', gulp.series('sass'));
  gulp.watch('./src/pug/pages/*.pug', gulp.series('pug'));
  gulp.watch('./src/pug/**/*.pug').on('change', browserSync.reload);
  gulp.watch('./src/js/*.js').on('change', browserSync.reload);
});

gulp.task('default', gulp.series(
    gulp.parallel('pug', 'sass'),
    'browserSync'
));

exports.style = sass;
exports.watch = browserSync;