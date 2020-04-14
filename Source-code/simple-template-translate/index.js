let template = '我是{{ name }}, 年龄:{{ age }}, 性别:{{ sex }}';

let data = {
  name: "Horace",
  age: 20,
  sex: "male"
}

function render(template, data) {
  const reg = /\{\{(.+?)\}\}/;
  // console.log(reg.test(template));
  if (reg.test(template)) { // 提前预判是否能匹配到
    const key = reg.exec(template)[1].trim();
    console.log(key.trim()); // 每一个要替换的位置上 {{ }} 中间的内容
    template = template.replace(reg, data[key]); // 把 {{}} 中间的内容替换成真实数据
    return render(template, data); // 递归执行去编译下一个 {{}}
  }
  return template;
}

console.log(render(template, data));