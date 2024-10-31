import gulp from 'gulp';
import purgecss from 'gulp-purgecss';

// 定义一个名为 'purgecss' 的任务
gulp.task('purgecss', () => {
    // 选择 public/css 目录下所有的 CSS 文件
    return gulp.src('./public/css/**/*.css')
        // 使用 gulp-purgecss 插件来移除未使用的 CSS 样式
        .pipe(purgecss({
            // 指定内容文件，这里选择 public 目录下所有的 HTML 文件
            content: ['./public/**/*.html']
            ,safelist:['custom.css']
        }))
        // 将处理后的 CSS 文件保存回 public/css 目录
        .pipe(gulp.dest('./public/css'))
})

// 定义默认任务，执行 'purgecss' 任务
gulp.task('default', gulp.series(['purgecss']))