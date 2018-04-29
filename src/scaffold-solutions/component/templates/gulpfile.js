
const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const cssbeautify = require('gulp-cssbeautify')
const replace = require('gulp-replace')
const del = require('del')

gulp.task('default', function() {

  del.sync(['lib/**'])

  // 解析scss文件到css
  gulp.src([ './src/**/*.scss', './src/**/*.css' ])
    .pipe(sass.sync().on('error', sass.logError))
    // 缩进2个空格
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(gulp.dest('lib'))

  // es6代码转义es5
  gulp.src('src/**/*.js')
    .pipe(babel())
    // 替换 js 文件中引用的 .scss 后缀为 .css
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    .pipe(gulp.dest('lib'))
})
