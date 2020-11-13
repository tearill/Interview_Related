// URL 解析函数
// 得出 query 参数
function parseURL(url) {
  url = decodeURI(url); // 解码，例如空格 %20 等
  let res = {}; // 保存解析出来的键值对
  // url.indexOf('?') + 1 => 从 ? 的后一位开始截取
  let params = url.slice(url.indexOf('?') + 1).split('&'); // id=1&code=2 再 split 成为数组
  // console.log(params);
  for (const item of params) {
    let group = item.split('='); // 键值对组合
    // group[0] 为 name group[1] 为 value
    // console.log(group);
    res[group[0]] = group[1];
  }
  return res;
}

console.log(parseURL('https://www.baidu.com?id=1&code=2'));

function splitURL(url) {
  url = decodeURI(url);
  
}