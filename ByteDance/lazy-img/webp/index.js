// 转换 webp 格式(在图片比较大的情况下)
// const webp = require('webp-converter')
// webp.cwebp('test.jpg', 'test.webp', '-q 80', 
//   function(status, error) {
//     console.log(status, error)
//   }
// )

// 先显示原图 10% 左右的轮廓，lazyload 加载完成后替换原来的 src 放上去
const lqip = require('lqip') // 生成轮廓图
const file = './in.png'
lqip
  .base64(file) // 生成 base64(轮廓的 base64)
  .then(res => {
    console.log(res)
  })