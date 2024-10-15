var posts=["2024/10/15/hello-world/","2024/10/15/☁云服务器/使用七牛云结论：不用/","2024/10/15/☁云服务器/安装开源1panel/","2024/10/15/☁云服务器/安装宝塔提示/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };