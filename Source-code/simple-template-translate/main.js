const year = '2017';
const month = '09';
const day = '21';

// function render(format) {
//   return ({ year, month, day }) => eval('`' + format + '`')
// }

function render(str) {
  return function(args) {
    // console.log(args); // { year: '2017', month: '09', day: '21' }
    Object.keys(args).forEach((item) => {
      str = str.replace(new RegExp('\\${' + item + '}', "g"), args[item]);
    });
    return str;
  }
}

const str = render('${year}-${month}-${day}')({ year, month, day });
console.log(str); // 输出2017-09-21