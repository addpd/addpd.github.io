// const fs = require('fs');
// const yaml = require('js-yaml');
// const axios = require('axios');

// // 获取必应每日图片地址
// async function getBingDailyImageUrl() {
//   try {
//     const response = await axios.get('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1');
//     if (response.data && response.data.images && response.data.images.length > 0) {
//       return `https://www.bing.com${response.data.images[0].url}`;
//     }
//   } catch (error) {
//     console.error('获取必应每日图片失败:', error);
//   }
//   return '默认图片地址'; // 如果获取失败则使用默认图片地址
// }

// // 在 before_generate 钩子中修改配置文件
// hexo.extend.filter.register('before_generate', async function () {
//   const configFilePath = './_config.yml';

//   try {
//     // 读取 _config.yml 文件
//     const configContent = fs.readFileSync(configFilePath, 'utf8');
//     const config = yaml.load(configContent);

//     // 获取必应每日图片地址
//     const bingImageUrl = await getBingDailyImageUrl();

//     // 修改 index.banner_img 的值
//     if (config.index && config.index.banner_img) {
//       config.index.banner_img = bingImageUrl; // 这里替换为获取到的必应每日图片地址
//     }

//     // 将修改后的配置写回 _config.yml
//     const newConfigContent = yaml.dump(config);
//     fs.writeFileSync(configFilePath, newConfigContent, 'utf8');

//     console.log('配置文件已更新: index.banner_img');
//   } catch (error) {
//     console.error('修改配置文件时出错:', error);
//   }
// });
