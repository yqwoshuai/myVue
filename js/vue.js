class MyVue {
  constructor(options) {
    // 通过属性保存options的数据
    this.$options = options || {};
    this.$data = options.data || {};
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el;

    // 把data中的成员转化成getter和setter注入到vue实例中
    this._proxyData(this.$data);

    // 调用observer对象，监听数据变化
    new Observer(this.$data);
    
    // 调用compiler对象，解析指令和差值表达式
    new Complier(this)
  }

  // 在vue实例上代理data中的属性
  _proxyData(data) {
    // 遍历data中的所有属性注入到vue实例中
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return data[key];
        },
        set(newValue) {
          if (newValue === data[key]) {
            return;
          }
          data[key] = newValue;
        },
      });
    });
  }
}
