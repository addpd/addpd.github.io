import gulp from 'gulp';
import cleanCSS from 'gulp-clean-css';
import htmlmin from 'gulp-htmlmin';
import htmlclean from 'gulp-htmlclean';
import babel from 'gulp-babel'; /* 转换为es2015 */
import uglify from 'gulp-uglify';


// 设置根目录
const root = './public'

// 匹配模式， **/*代表匹配所有目录下的所有文件
const pattern = '**/*'

// 压缩html
gulp.task('minify-html', function () {
  return gulp
    // 匹配所有 .html结尾的文件
    .src(`${root}/${pattern}.html`)
    .pipe(htmlclean())
    .pipe(
      htmlmin({
        removeComments: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      })
    )
    .pipe(gulp.dest('./public'))
})

// 压缩css
gulp.task('minify-css', function () {
  return gulp
    // 匹配所有 .css结尾的文件
    .src(`${root}/${pattern}.css`)
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(gulp.dest('./public'))
})

// 压缩js
gulp.task('minify-js', function () {
  return gulp
    // 匹配所有 .js结尾的文件
    .src(`${root}/${pattern}.js`)
    .pipe(
      babel({
        // presets: ['env']
        presets: ['@babel/preset-env']
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./public'))
})


gulp.task('default', gulp.parallel('minify-html', 'minify-css', 'minify-js'))