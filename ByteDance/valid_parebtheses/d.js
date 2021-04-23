function longestValidParentheses(s) {
    // 时间复杂度O(n)
    var max = 0;
    if(s.length === 0 || s.length === 1) return max;
    // 下标减法就是长度
    var stack = [-1]; // 栈来服务于有效果括号匹配 
    for(var i = 0; i < s.length; i++) { // 下标法
        if(s[i] === '(') { // 左括号，下标入栈
            stack.push(i);
        } else {
            stack.pop(); // 右括号，下标出栈，出栈一个相当于减去前一个下标(下标比实际长度小1)
            if(stack.length < 1) {
                stack.push(i); // 栈顶元素没了，前面的有效匹配结束了，后面的重新开始，就要减去当前下标，所以push当前下标
            } else {
                max = Math.max(max, i - stack[stack.length - 1])
            }
        }
    }
    return max;
}

console.log(longestValidParentheses("())()"))