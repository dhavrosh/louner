const gulp = require('gulp'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    annotate = require('gulp-ng-annotate'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    pump = require('pump'),
    del = require('del');

gulp.task('build-teacher-app', done => {
    pump([
        gulp.src(['./app/client/teacher/**/*.js', '!./app/client/teacher/**/*.test.js']),
        concat('app.teacher.min.js'),
        annotate(),
        babel({ presets: ['es2015'] }),
        uglify({ mangle: true }),
        gulp.dest('./app/client/public/js'),
        browserSync.reload({ stream: true })
    ], done);
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: './app/server'
        }
    });
});

gulp.task('build', ['build-teacher-app']);

gulp.task('watch', () => {
    gulp.watch('./app/client/teacher/**/*.js', ['build-teacher-app']);
});

gulp.task('clean', () => {
    del.sync('./app/client/public/js');
});

gulp.task('default', done => {
    runSequence('build', 'watch', done);
});