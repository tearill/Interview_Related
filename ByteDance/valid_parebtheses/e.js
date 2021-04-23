function longestValidParentheses(s) {
    if (!s || s.length < 1) return 0; // 为空的时候
    var left = right = max = 0; // 用两个变量代替模拟栈的意义
    // left是当前遍历中的左括号的数量，right是当前遍历中右括号的数量
    for (var i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            left++; // 入栈，有多少个入栈
        } else {
            right++; // 右边入栈
        }
        if (left === right) {
            max = Math.max(max, 2 * right)
        } else if (right > left) { // 后面就无效了
            left = right = 0; // 重新开始
        }
    }
    left = right = 0;
    for (var i = s.length - 1; i >= 0; i--) { // 倒着循环一遍
        if (s[i] === '(') {
            left++; // 入栈，有多少个入栈
        } else {
            right++; // 右边入栈
        }
        if (left === right) {
            max = Math.max(max, 2 * left)
        } else if (left > right) { // 后面就无效了
            left = right = 0; // 重新开始
        }
    }
    return max;
}
console.log(longestValidParentheses("((())(())"))