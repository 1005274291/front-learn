export const compose = function (...fns) {//函数组合 将很多函数合并成一个函数，让参数调用一个函数就可以依次经过这所有函数的处理
    if (fns.length === 0) {
        return arg => arg
    }
    return fns.reduce((fn1, fn2) => {
        return (...arg) => fn1(fn2(...arg))
    })
}


//函数柯里化 将接受多参数的函数变为接受单一参数的函数，逐层处理
export const currying = function (fn, args) {

    var _this = this
    var len = fn.length;
    var args = args || [];

    return function () {
        var _args = Array.prototype.slice.call(arguments);
        if (Array.isArray(args)) {
            Array.prototype.push.apply(args, _args);
        } else {
            args = [args]
            Array.prototype.push.apply(args, _args);
        }
        // 如果参数个数小于最初的fn.length，则递归调用，继续收集参数
        if (args.length < len) {
            return currying.call(_this, fn, args);
        }

        // 参数收集完毕，则执行fn
        console.log(args)
        return fn.apply(_this, args);
    }
}
currying((a, b) => a + b)(1)(2)