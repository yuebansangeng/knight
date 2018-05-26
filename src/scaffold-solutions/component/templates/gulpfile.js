
const gulp = require('gulp')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const cssbeautify = require('gulp-cssbeautify')
const replace = require('gulp-replace')
const del = require('del')
const shelljs = require('shelljs')

gulp.task('default', [ 'clear', 'scripts', 'style', 'images', 'fonts' ])

// 监控
// npm run demo 会地调用到这里的watch任务
gulp.task('watch', function () {
  gulp.watch([ 'src/**/*.js' ], [ 'scripts' ])
  gulp.watch([ './src/**/*.scss', './src/**/*.css' ], [ 'style' ])
  gulp.watch([ 'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg' ], [ 'images'])
  gulp.watch([ 'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf' ], [ 'fonts' ])
})

// 清理lib文件夹内的文件
gulp.task('clear', function () {
  del.sync('lib')
})

// es6代码转义es5
gulp.task('style', function () {
  return gulp.src('src/**/*.js')
    .pipe(babel())
    // 替换 js 文件中引用的 .scss 后缀为 .css
    .pipe(replace(/require\((['"])(.+?)(\.scss)['"]\)/g, 'require($1$2.css$1)'))
    .pipe(gulp.dest('lib'))
})

// 解析scss文件到css
gulp.task('scripts', function () {
  return gulp.src([ './src/**/*.scss', './src/**/*.css' ])
    .pipe(sass.sync().on('error', sass.logError))
    // 缩进2个空格
    .pipe(cssbeautify({ indent: '  ' }))
    .pipe(gulp.dest('lib'))
})

// 复制图片文件到lib文件夹
gulp.task('images', function () {
  // (png|jpe?g|gif|svg)
  return gulp.src([ 'src/**/*.jpeg', 'src/**/*.png', 'src/**/*.jpg', 'src/**/*.gif', 'src/**/*.svg' ])
    .pipe(gulp.dest('lib'))
})

// 复制字体文件到lib文件夹
gulp.task('fonts', function () {
  // (woff2?|eot|ttf|otf)
  return gulp.src([ 'src/**/*.woff2', 'src/**/*.woff', 'src/**/*.eot', 'src/**/*.ttf', 'src/**/*.otf' ])
    .pipe(gulp.dest('lib'))
})
