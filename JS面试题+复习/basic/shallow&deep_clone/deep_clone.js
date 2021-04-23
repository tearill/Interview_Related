const deepClone = (obj)  => {
  if (typeof obj !== 'object') return; // 如果不是对象，直接返回
  const cloneObj = Array.isArray(obj) ? [] : {}; // 判断赋值的目标是数组还是对象
  for (let key in source) {
    if (obj.hasOwnProperty(key)) {
      // 如果值是对象，就递归深拷贝，如果不是，就直接赋值
      cloneObj[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return cloneObj;
}