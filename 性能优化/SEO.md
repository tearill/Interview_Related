# 在 HTML 中如何做 SEO 优化？  
https://juejin.im/post/5cb5427ff265da03b4460751  
## SEO 的概念  
SEO (Search Engine Optimization)：搜索引擎优化  
页面不止是给人看的，机器也要看爬虫也要看  

## HTML 中如何做 SEO 优化   
1. `h` 标签的使用，`h1` 标签只能出现一次，它是当前页面的主标题，对蜘蛛的吸引力是最强的，正文要用 `h1` 标签

2. `strong` `标签的使用，strong` 标签对关键词的强调作用仅次于 `h` 标签，用于加粗段落标题或是重点关键词

3. `<title>网站SEO标题</title>`、`<meta name="descriptiion" content="网站描述"/>` 和 `<meta name="keywords" content="网站关键词"/>`，这是 SEO 的重点，要合理设计

4. `<a href="链接地址" title="链接说明">链接关键词</a>`，超链接要添加 title，站内丰富的超链接会方便蜘蛛爬行，体现网站的深度和广度，这点在 SEO 中至关重要，外部链接，链接到其他网站的，则需要加上 el="nofollow"，告诉蜘蛛不要爬，因为一旦蜘蛛爬了外部链接之后，就不会再回来了

5. `<img src="图片链接地址" alt="图片说明" />`，这是针对网页中图片的，当然也可以写成 `<img src="图片链接地址" title="图片说明" />`

6. `<div id="copyright">` 版权部分加上网站名称和链接</div>

7. HTML 优化要富于逻辑，重点明确，层次分明，语义化