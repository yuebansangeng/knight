
const gulp = require('gulp')
const babel = require('gulp-babel')
const del = require('del')

gulp.task('default', function () {
  del.sync('lib')

  gulp.src([ 'src/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/'))

  gulp.src([ 'src/run/**/*.js' ])
    .pipe(babel())
    .pipe(gulp.dest('lib/run'))

  gulp.src([ 'src/run/build/stories.ejs' ])
    .pipe(gulp.dest('lib/run/build'))

  gulp.src([ 'src/run/docgen/template.handlebars' ])
    .pipe(gulp.dest('lib/run/docgen'))

  gulp.src([
    'src/run/clone/index.js',
    'src/run/clone/git-clone.js'
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib/run/clone'))  

  gulp.src([ 'src/create/index.js', ])
    .pipe(babel())
    .pipe(gulp.dest('lib/create'))

  gulp.src([
    'src/create/component/index.js',
    'src/create/component/git-clone.js'
  ])
    .pipe(babel())
    .pipe(gulp.dest('lib/create/component'))

  gulp.src([
      'src/create/project/index.js',
      'src/create/project/git-clone.js'
    ])
      .pipe(babel())
      .pipe(gulp.dest('lib/create/project'))
      
  gulp.src([ 'src/create/component/templates/*' ])
    .pipe(gulp.dest('lib/create/component/templates/'))

  gulp.src([ 'src/create/project/templates/*' ])
    .pipe(gulp.dest('lib/create/project/templates/'))  

  gulp.src([
    'src/create/component/templates/.babelrc',
    'src/create/component/templates/.bscpmrc', ])
    .pipe(gulp.dest('lib/create/component/templates/'))

    gulp.src([
      'src/create/project/templates/.bscpmrc'
    ])
      .pipe(gulp.dest('lib/create/project/templates/'))
})

gulp.task('watch', function () {
  gulp.watch([
    'src/*.js',
    'src/run/**/*.js',
    'src/create/index.js',
    'src/create/project/index.js',
    'src/create/project/templates/*',
    'src/create/project/git-clone.js',
    'src/create/component/index.js',
    'src/create/component/git-clone.js',
    'src/create/component/templates/*',
    'src/create/component/templates/.babelrc',
    'src/create/component/templates/.bscpmrc'
  ],
  [ 'default' ])
})
