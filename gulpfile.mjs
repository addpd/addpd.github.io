import gulp from 'gulp';
import ttf2woff2 from 'gulp-ttf2woff2';

gulp.task('ttf2woff2', () => {
  return gulp // 确保返回流
    .src(['source/fonts/LXGWWenKaiGBScreen.ttf'], {
      encoding: false, // Important!
      removeBOM: false,
    })
    .pipe(ttf2woff2())
    .on('error', function(err) {
      console.error('Error in ttf2woff2 plugin:', err);
    })
    .pipe(gulp.dest('source/fonts/'));
});

// 默认任务
gulp.task('default', gulp.series('ttf2woff2'));
