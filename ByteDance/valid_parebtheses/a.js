/**
 * @param {String} s
 * @return {Boolean}
 */

var isValid = function (s) {
    if (!s || s.length < 1) return true; // 字符串为空
    var n = s.length; // 字符串的长度
    var stack = []; // 数组栈
    // push pop 只在数组的尾部插入或删除元素 --- 栈s FILO
    // 在数组的尾部位置插入 push 数组的头部移除 shift --- 队列 FIFO
    for (var i = 0; i < n; i++) { // 时间复杂度O(n)
        var c = s[i];
        // console.log(c);
        if (c === '(') { // 如果是左括号 压栈 等着右括号来匹配出栈
            stack.push(c); // 入栈，数组的最后一个元素，栈顶元素
        } else {
            // 右括号 将栈里的栈顶元素出栈
            if(stack.length < 1) { // 第一个符号就是右括号
                return false; // 无效
            }
            stack.pop(); // 出栈
        }
    }
    return stack.length > 0 ? false : true;
}

console.log(isValid('))((')); // true