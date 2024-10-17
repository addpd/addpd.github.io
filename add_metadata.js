const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cliProgress = require('cli-progress');

// 指定要处理的目录
const targetDirectory = './source/_posts/obsidian_data';

// 获取文件的创建日期，格式为 'YYYY-MM-DD HH:mm'
function getFormattedDate(filePath) {
  const stats = fs.statSync(filePath);
  const date = new Date(stats.birthtime);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 递归遍历目录
function getMdFiles(directory) {
  let mdFiles = [];
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      mdFiles = mdFiles.concat(getMdFiles(fullPath));
    } else if (file.endsWith('.md')) {
      mdFiles.push(fullPath);
    }
  });

  return mdFiles;
}

// 处理 Markdown 文件，添加元数据
function addMetadataToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  let frontMatter = '';
  let bodyContent = content;

  // 检查文件是否已有元数据
  if (content.startsWith('---')) {
    const parts = content.split('---');
    frontMatter = parts[1];
    bodyContent = parts.slice(2).join('---');
    const metadata = yaml.load(frontMatter);

    // 检查并添加缺失的属性
    if (!metadata.title) {
      metadata.title = path.basename(filePath, '.md');
    }
    if (!metadata.date) {
      metadata.date = getFormattedDate(filePath);
    }
    if (metadata.published === undefined) {
      metadata.published = false;
    }

    frontMatter = `---\n${yaml.dump(metadata)}---\n`;
  } else {
    const fileName = path.basename(filePath, '.md');
    const formattedDate = getFormattedDate(filePath);

    // 构建元数据对象
    const metadata = {
      title: fileName,
      date: formattedDate,
      published: false,
    };

    frontMatter = `---\n${yaml.dump(metadata)}---\n`;
  }

  // 将元数据添加到文件内容的顶部
  const updatedContent = frontMatter + bodyContent;

  // 写回文件
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// 主程序
function main() {
  const mdFiles = getMdFiles(targetDirectory);
  const totalFiles = mdFiles.length;

  // 初始化进度条
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalFiles, 0);

  // 遍历每个 Markdown 文件并添加元数据
  mdFiles.forEach((filePath, index) => {
    addMetadataToFile(filePath);
    progressBar.update(index + 1);
  });

  progressBar.stop();
  console.log('元数据添加完成！');
}

main();
