hexo.extend.filter.register('before_generate', function () {
    hexo.locals.get('posts').data = hexo.locals.get('posts').filter(post => post.published !== false);
  });
  