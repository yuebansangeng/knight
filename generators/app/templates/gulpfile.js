var gulp = require('gulp'),
    //文件合并
    concat =require('gulp-concat'),
    //文件重命名
    rename = require('gulp-rename'),
    //sass转换
    sass = require('gulp-sass'),
    //内容替换
    replace = require('gulp-replace'),

    insert = require('gulp-insert')

//处理css文件
gulp.task('css',function(){
    //定义文件路径
return gulp.src(['src/*.scss','src/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    //合并
    .pipe(concat('index.css'))
    //输出
    .pipe(gulp.dest('lib'))
})
//删除引用
gulp.task('replace', function(){
  gulp.src(['lib/*.js','lib/**/*.js'])
     //正则匹配
    .pipe(replace(/(require)(.+)\/(.+)([\.\w]+\.scss)(.+)\);/g,'//index.css'))
    .pipe(gulp.dest('lib/'))
});
//修复引用
gulp.task('fix', function(){
    gulp.src('lib/index.js')
     //正则匹配
        .pipe(replace(/\/\/(index.css)/g,"require('./index.css')"))
        .pipe(gulp.dest('lib/'))
});

gulp.task('default', ['css', 'replace']);