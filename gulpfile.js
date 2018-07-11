
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

gulp.task('default', function () {
  del.sync('lib')

  gulp.src([ 'src/run/**/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/run'))

  gulp.src([ 'src/create/index.js', ])
    .pipe(babel())
    .pipe(gulp.dest('lib/create'))

   gulp.src([ 'src/create/component/index.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/create/component'))

  gulp.src([ 'src/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/'))

  gulp.src([ 'src/create/component/templates/*' ])
    .pipe(gulp.dest('lib/create/component/templates/'))
})
