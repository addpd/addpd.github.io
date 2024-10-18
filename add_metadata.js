const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cliProgress = require('cli-progress');

// 指定要处理的目录
const targetDirectory = './source/_posts/obsidian_data';

// 获取文件的创建日期，格式为 'YYYY-MM-DD HH:mm'
function getFormattedDate(filePath) {
  // 获取文件的元数据（如创建时间）
  const stats = fs.statSync(filePath);
  const date = new Date(stats.birthtime);
  // 格式化日期为 'YYYY-MM-DD HH:mm' 格式
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 递归遍历目录，获取所有 Markdown 文件
function getMdFiles(directory) {
  let mdFiles = [];
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);

    // 如果是目录，则递归获取其中的 Markdown 文件
    if (stats.isDirectory()) {
      mdFiles = mdFiles.concat(getMdFiles(fullPath));
    } else if (file.endsWith('.md')) { // 如果是 .md 文件，则添加到列表中
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

  // 检查文件是否已有元数据（以 '---' 开头）
  if (content.startsWith('---')) {
    const parts = content.split('---');
    frontMatter = parts[1];
    bodyContent = parts.slice(2).join('---');
    const metadata = yaml.load(frontMatter);

    // 检查并添加缺失的属性
    if (!metadata.title) {
      metadata.title = path.basename(filePath, '.md'); // 如果没有标题，则使用文件名作为标题
    }
    if (!metadata.date) {
      metadata.date = getFormattedDate(filePath); // 如果没有日期，则使用文件的创建日期
    }
    if (metadata.published === undefined) {
      metadata.published = false; // 如果没有发布状态，则设置为 false
    }
    if (!metadata.top_img) {
      metadata.top_img = ''; // 如果没有 top_img，则添加一个空值
    }
    if (!metadata.cover_img) {
      metadata.cover_img = ''; // 如果没有 cover_img，则添加一个空值
    }
    if (!metadata.tags) {
      metadata.tags = []; // 如果没有 tags，则添加一个空数组
    }
    if (!metadata.categories) {
      metadata.categories = []; // 如果没有 categories，则添加一个空数组
    }

    // 重新生成前置元数据块
    frontMatter = `---\n${yaml.dump(metadata)}---\n`;
  } else {
    // 如果文件没有元数据，则创建新的元数据
    const fileName = path.basename(filePath, '.md');
    const formattedDate = getFormattedDate(filePath);

    // 构建元数据对象
    const metadata = {
      title: fileName,
      date: formattedDate,
      published: false,
      top_img: '',
      cover_img: '',
      tags: [],
      categories: [],
    };

    // 生成前置元数据块
    frontMatter = `---\n${yaml.dump(metadata)}---\n`;
  }

  // 将元数据添加到文件内容的顶部
  const updatedContent = frontMatter + bodyContent;

  // 写回文件
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

// 主程序
function main() {
  const mdFiles = getMdFiles(targetDirectory); // 获取所有 Markdown 文件
  const totalFiles = mdFiles.length;

  // 初始化进度条
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  progressBar.start(totalFiles, 0);

  // 遍历每个 Markdown 文件并添加元数据
  mdFiles.forEach((filePath, index) => {
    addMetadataToFile(filePath);
    progressBar.update(index + 1); // 更新进度条
  });

  progressBar.stop(); // 停止进度条
  console.log('元数据添加完成！');
}

main();
