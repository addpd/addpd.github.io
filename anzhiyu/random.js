var posts=["2024/10/15/hello-world/","2024/10/16/obsidian_data/👨‍💻开发记录和电子产品相关/【hexo】建立个人blog/","2024/10/16/obsidian_data/💪人体/10个动作，在家练爆全身肌肉!(无器械)/","2024/10/19/obsidian_data/👨‍💻开发记录和电子产品相关/【hexo】使用 lighthouse 优化/","2024/10/16/obsidian_data/👨‍💻开发记录和电子产品相关/obsidian相关/使用腾讯云cos存储作为图床/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };