# Webpack 中常用的 loader 和 plugin  
## Webpack 中 loader 和 plugin 的不同  
- loader  
  Webpack 把所有文件视为模块，但是 Webpack 原生只能解析 JS 文件，如果想要把其他文件打包的话，就需要使用 loader，**loader 使得 Webpack 拥有了加载和解析非 JS 文件的能力**  

  loader 在 module.rules 中配置，作为模块解析的规则存在

- plugin  
  plugin 插件可以扩展 Webpack 的能力，让 Webpack 具有更多的灵活性，plugin 可以监听 Webpack 运行的生命周期中广播出的事件，可以在合适的时机通过 Webpack 提供的 API 改变输出结果  

  通常是用于打包输出的 JS 文件的优化，资源的管理，和环境变量的注入，作用于整个构建过程  

  plugin 在 plugins 中单独配置，类型是数组，每一项是一个 plugin 的实例，参数都通过构造函数传入  

## loader  
1. file-loader：把文件输出到一个文件夹，在代码中通过对应的 URL 去引用输出的文件  
2. url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去  
3. image-loader：加载并压缩图片文件  
4. babel-loader：转换 ES6+ 等 JS 新特性语法  
5. css-loader：加载解析 CSS  
6. style-loader：把 CSS 代码注入到 JavaScript 中，形成静态资源内联，通过 DOM 操作去加载 CSS  
7. esint-loader：通过 Eslint 检查代码  
8. postcss-loader：补全前缀，兼容性，css 界的 babel  
9. stylus-loader：stylus 文件编译成 css 文件  
10. source-map-loader：加载额外的 Source Map，以方便断点调试  

## plugin  
1. html-webpack-plugin：当使用 webpack 打包时，创建一个 html 文件，并把 Webpack 打包后的静态文件自动插入到这个 html 文件中  
2. define-plugin：定义环境变量  
3. mini-css-extract-plugin：抽离 CSS 单独形成一个文件，支持按需加载  
4. optimize-css-assets-webpack-plugin：对 CSS 代码进行压缩，不仅压缩了代码、删掉了代码中无用的注释、还去除了冗余的 css、优化了 css 的书写顺序  
5. uglifyjs-webpack-plugin：压缩 JS 文件  
6. webpack-bundle-analyzer：可视化 Webpack 输出文件的体积  
7. split-chunks-plugin：公共模块抽取  
