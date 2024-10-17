var posts=["2024/10/15/hello-world/","2024/10/16/obsidian_data/💪人体/10个动作，在家练爆全身肌肉!(无器械)/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };