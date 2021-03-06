var findit = require('findit'), 
    path   = require('path'),
    hl     = require('../../vendor/highlight/lib/highlight').Highlight,
    markdown = require('markdown'),
    mkdirp = require('mkdirp'),
    fs     = require('fs'),
    docs   = require('../docs'),
    weld   = require('weld').weld,
    helpers = require('../helpers');

var article = exports;

article.weld = function(dom, articles) {
  
    
    // load all articles 
    var _articles = findit.sync('./articles');

    //
    // Filter out all non-markdown files
    //
    _articles = _articles.filter(function(a){
      a = a.replace('./articles', '');
      if(a.match(/\./)){
        return false;
      } else {
        return true;
      }
    });
  
  var toc = helpers.filesToTree(_articles);
  
  Object.keys(articles).forEach(function(i){
    var content;
    try {
      content = markdown.parse(articles[i].content.toString());
    } catch (err) {
      content = err.message;
    }
    var metadata = articles[i].metadata;
    dom.innerHTML = docs.content.theme['./theme/article.html'].toString();

    var data = { 
      metadata: metadata, 
      content: content,
      toc: toc
    };

    toc: toc,
    
    weld(dom, data, {
      map: function(parent, element, key, val) {
        element.innerHTML = val;
        return false;
      }
    });

    // perform code highlighting
    // convert only inside <code/>
    dom.innerHTML = hl(dom.innerHTML, false, true);
    articles[i].content = dom.innerHTML;

  });
  return dom;
};

article.generate = function(output, articles) {

  //
  // Generate all articles
  //
  Object.keys(articles).forEach(function(file){
    var newPath = file.replace('./articles', '/../../public/articles');
    newPath =  path.dirname(newPath);
    newPath =  path.normalize(__dirname + newPath + '/index.html');
    helpers.writeFile(newPath, articles[file].content, function(){});
  });

  return articles;
};


article.load = function (resolve) {
  
  // load all articles 
  var articles = findit.sync('./articles');

  //
  // Filter out all non-markdown files
  //
  articles = articles.filter(function(a){
    a = a.replace('./articles', '');
    if(a.match(/\.md/)){
      return true;
    } else {
      return false;
    }
  });
    
  return helpers.articlesArrayToObject(articles, resolve);
  
};
