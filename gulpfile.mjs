import gulp from 'gulp';
import purgecss from 'gulp-purgecss';
import { writeFileSync } from 'fs';
import { exec } from 'child_process';
import { deleteAsync } from 'del';

// 定义一个名为 'purgecss' 的任务（有用但会误删）
gulp.task('purgecss', () => {
    // 选择 public/css 目录下所有的 CSS 文件
    return gulp.src('./public/css/**/*.css')
        // 使用 gulp-purgecss 插件来移除未使用的 CSS 样式
        .pipe(purgecss({
            // 指定内容文件，这里选择 public 目录下所有的 HTML 文件
            content: ['./public/**/*.html']
            , safelist: ['custom.css']
        }))
        // 将处理后的 CSS 文件保存回 public/css 目录
        .pipe(gulp.dest('./public/css'))
})

// 提取博客中所有字符导出为 uniqueText.txt
gulp.task('uniqueText', () => {

    // 2024年10月31日 [19:31:17] Finished 'uniqueText' after 117 ms
    var buffers = [];

    return gulp
        .src('public/**/*.html')
        // 当读取到数据时，将文件内容推入 buffers 数组中
        .on('data', function (file) {
            buffers.push(file.contents);
        })
        .on('end', function () {
            var text = Buffer.concat(buffers).toString('utf-8');
            const uniqueText = [...new Set(text.replace(/\s/g, ''))].sort().join('');
            console.log(uniqueText);
            console.log('Length:', uniqueText.length);
            writeFileSync('./public/fonts/uniqueText.txt', uniqueText);
        });

    // 进一步优化：使用 ripgrep
    // TODO

});

// ttf字体文件根据字符集转为woff2
gulp.task("ttf2woff2", () => {
    // 命令行调用fonttools
    const command = 'pyftsubset public/fonts/LXGWWenKaiGBScreen.ttf --flavor=woff2 --output-file=public/fonts/LXGWWenKaiGBScreen.woff2 --text-file="public/fonts/uniqueText.txt"'
    // 执行命令
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error}`);
                reject(error); // 任务失败时拒绝 Promise
                return;
            }
            // 打印输出
            console.log(`stdout: ${stdout}`);
            console.error(`stderr: ${stderr}`);
            resolve(); // 任务成功时解决 Promise
        });
    });
})

// fonts除了woff2的都清除
gulp.task("clean-fonts", () => {
    return new Promise((resolve, reject) => {
        // 删除18MB原生字体减少deploy传输流量
        deleteAsync(["public/fonts/*", "!public/fonts/LXGWWenKaiGBScreen.woff2"])
        resolve()
    })
})

// 定义默认任务
gulp.task('default', gulp.series(['uniqueText', 'ttf2woff2', 'clean-fonts']))