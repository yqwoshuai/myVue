/**
 * Dep类使用观察者收集依赖
 */
class Dep {
  constructor() {
    this.subs = []
  }

  // 添加观察者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }

  // 发送通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
