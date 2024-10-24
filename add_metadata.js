const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cliProgress = require('cli-progress');

// 指定要处理的目录
const targetDirectory = './source/_posts/obsidian_data';

// 要忽略的目录
const ignoredDirectories = ['template通用模板'];

// 记录改动的文件数量
let modifiedFilesCount = 0;

// 获取文件的创建日期，格式为 'YYYY-MM-DD HH:mm'
function getFormattedDate(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const date = new Date(stats.birthtime);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (error) {
    console.error(`获取文件创建日期失败: ${filePath}`, error);
    return null;
  }
}

// 递归遍历目录，获取所有 Markdown 文件
function getMdFiles(directory) {
  let mdFiles = [];
  try {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        if (!ignoredDirectories.includes(file)) {
          mdFiles = mdFiles.concat(getMdFiles(fullPath));
        }
      } else if (file.endsWith('.md')) {
        mdFiles.push(fullPath);
      }
    });
  } catch (error) {
    console.error(`读取目录失败: ${directory}`, error);
  }
  return mdFiles;
}

// 删除元数据后的多余换行符
function cleanBodyContent(bodyContent) {
  return bodyContent.replace(/^\s*\n/g, ''); // 删除开头的多余空行
}

// 确保 title 在元数据的第一行
function ensureTitleFirst(metadata) {
  const orderedMetadata = {};
  if (metadata.title) {
    orderedMetadata.title = metadata.title.replace(/\s+/g, '_');
  }
  for (const key in metadata) {
    if (key !== 'title') {
      orderedMetadata[key] = metadata[key];
    }
  }
  return orderedMetadata;
}

// 处理 Markdown 文件，添加元数据并清理多余换行符
function addMetadataToFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    let frontMatter = '';
    let bodyContent = content;

    if (content.startsWith('---')) {
      const parts = content.split('---');
      frontMatter = parts[1];
      bodyContent = parts.slice(2).join('---');
      let metadata = yaml.load(frontMatter);

      let updatedMetadata = false;
      if (!metadata.title || metadata.title !== path.basename(filePath, '.md')) {
        metadata.title = path.basename(filePath, '.md');
        updatedMetadata = true;
      }
      if (!metadata.date) {
        const date = getFormattedDate(filePath);
        if (date) {
          metadata.date = date;
          updatedMetadata = true;
        }
      }
      if (metadata.published === undefined || metadata.published === '') {
        metadata.published = false;
        updatedMetadata = true;
      }
      if (!metadata.top_img) {
        metadata.top_img = '';
        updatedMetadata = true;
      }
      if (!metadata.cover_img) {
        metadata.cover_img = '';
        updatedMetadata = true;
      }
      if (!metadata.index_img) {
        metadata.index_img = '';
        updatedMetadata = true;
      }
      if (!metadata.banner_img) {
        metadata.banner_img = '';
        updatedMetadata = true;
      }
      if (!metadata.tags) {
        metadata.tags = [];
        updatedMetadata = true;
      }
      if (!metadata.categories) {
        metadata.categories = [];
        updatedMetadata = true;
      }

      // 确保 title 在第一行
      metadata = ensureTitleFirst(metadata);
      
      // 清理多余的空行
      bodyContent = cleanBodyContent(bodyContent);

      if (updatedMetadata) {
        frontMatter = `---\n${yaml.dump(metadata)}---\n`;
        const updatedContent = frontMatter + bodyContent;
        if (updatedContent !== content) {
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          modifiedFilesCount++; // 记录改动的文件数量
        }
      }
    } else {
      const fileName = path.basename(filePath, '.md');
      const formattedDate = getFormattedDate(filePath);

      if (formattedDate) {
        let metadata = {
          title: fileName,
          date: formattedDate,
          published: false,
          top_img: '',
          cover_img: '',
          index_img: '',
          banner_img: '',
          tags: [],
          categories: [],
        };

        // 确保 title 在第一行
        metadata = ensureTitleFirst(metadata);

        // 清理多余的空行
        bodyContent = cleanBodyContent(bodyContent);

        frontMatter = `---\n${yaml.dump(metadata)}---`;
        const updatedContent = frontMatter + bodyContent;
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        modifiedFilesCount++; // 记录改动的文件数量
      }
    }
  } catch (error) {
    console.error(`处理文件失败: ${filePath}`, error);
  }
}

// 主程序
function main() {
  try {
    const mdFiles = getMdFiles(targetDirectory);
    const totalFiles = mdFiles.length;

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    progressBar.start(totalFiles, 0);

    mdFiles.forEach((filePath, index) => {
      addMetadataToFile(filePath);
      progressBar.update(index + 1);
    });

    progressBar.stop();
    console.log(`元数据添加完成！共修改了 ${modifiedFilesCount} 个文件。`);
  } catch (error) {
    console.error('程序执行失败', error);
  }
}

main();
