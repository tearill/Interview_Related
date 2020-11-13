// 千分位函数
// 1000 => 1,000
// 1000000 => 1,000,000
// 每千位（3位）加一个 ','

//! 未处理小数部分
function format(nums) {
  nums = nums + ''; // 转换字符串
  let res = [], // format 结果
    position = 0; // 标记位数
  for (let i = nums.length - 1; i >= 0; i--) {
    res.unshift(nums[i]); // 从头部添加
    position++;
    position % 3 === 0 && i != 0 && res.unshift(',');
  }
  return res.join(''); // 数组 join 成字符串
}

console.log(format(1));
console.log(format(10));
console.log(format(100));
console.log(format(1000));
console.log(format(1000000));
console.log(format(1000.12));

//! 考虑小数部分
function thousandsFilter(num) {

  // 添加 ,
  function addComma(integer, position, res) {
    for (let i = integer.length - 1; i >= 0; i--) {
      res.unshift(integer[i]); // 从数组头部插入
      position++;
      position % 3 === 0 && i !== 0 && res.unshift(','); // 逢三位加一个 ,
    }
  }

  if (!isNaN(num)) {
    if (num > 999 || num < -999) {
      num = num.toString();
      let integer, decimals;
      let res = [], position = 0;
      // if (num.indexOf('.') !== -1) { // 有小数
        integer = num.split('.')[0] // 整数部分
        decimals = num.split('.')[1] // 小数部分
        // console.log(integer, decimals);
        addComma(integer, position, res);
        decimals && res.push('.', decimals);
      //   res.push('.', decimals); // 把小数部分补回去
      // } else {
      //   integer = num
      //   addComma(integer, position, res);
      // }
      return res.join(''); // 返回字符串
    } else { // 不满三位数
      return num;
    }
  } else { // 非数字
    return num;
  }
}

console.log(thousandsFilter(1));
console.log(thousandsFilter(10));
console.log(thousandsFilter(100));
console.log(thousandsFilter(1000));
console.log(thousandsFilter(-1000000));
console.log(thousandsFilter(1000.12));