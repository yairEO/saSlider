var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    cmq             = require('gulp-combine-media-queries'),
    autoprefixer    = require('gulp-autoprefixer');


//////////////////////
// CSS

gulp.task('scss', function () {

    gulp.src('css/dist/*.scss')
        .pipe(sass({ errLogToConsole: true })) // { style:'expanded' }
        .pipe(cmq())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./css'));
});


gulp.task('default', ['scss', 'watch']);

gulp.task('watch', function() {
    gulp.watch('./css/dist/*.scss', ['scss']);
});