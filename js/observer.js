/**
 * Observer 功能
 * 1、负责把data选项中的属性转换成响应式数据
 * 2、data中某个数据也是对象，把该属性转换成响应式数据
 * 3、数据变化发送通知
 */

class Observer {
  constructor(data) {
    this.walk(data)
  }

  walk(data) {
    // 判断data是否为对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 遍历data中所有属性
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive(obj, key, value) {
    const that = this
    // 收集依赖并发送通知
    let dep = new Dep()
    // data嵌套对象处理，会把嵌套的对象属性也转换为响应式属性
    this.walk(value)

    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      // 不能使用 obj[key] 返回数据，会出现无限递归的情况
      get() {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newValue) {
        if (newValue === value) {
          return
        }
        value = newValue
        // 新赋值的属性为对象时，将其转为响应式数据
        // set函数中this指向data，需要提前保存一份this防止this指向错误
        that.walk(newValue)
        // 发送通知
        dep.notify()
      },
    })
  }
}
