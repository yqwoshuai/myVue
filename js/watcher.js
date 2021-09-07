class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    // 回调函数更新视图
    this.cb = cb

    // 记录当前Watcher对象记录到Dep类的target属性中
    // 触发get方法，调用addSub
    Dep.target = this
    // 访问vm[key]就会触发get方法
    this.oldValue = vm[key]
    // 收集完成后清空target属性
    Dep.target = null
  }

  // 当数据变化时更新视图
  update() {
    let newValue = this.vm[this.key]
    // 数据未变化时不做操作
    if (this.oldValue === newValue) {
      return
    }
    this.cb(newValue)
  }
}
