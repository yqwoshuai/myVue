/**
 * Compiler 功能
 * 1、负责编译模板，解析指令/差值表达式
 * 2、负责页面的首次渲染
 * 3、数据变化后重新渲染视图
 */

class Compiler {
  constructor(vm) {
    this.el = vm.$el;
    this.vm = vm;
    this.compile(this.el);
  }

  // 编译模板，处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes;
    Array.from(childNodes).forEach((node) => {
      // 处理文本节点
      if (this.isTextNode(node)) {
        this.compileText(node);
      } else if (this.isElementNode(node)) {
        // 处理元素节点
        this.compileElement(node);
      }

      // 当前node节点有子节点的情况，递归调用compiler
      if (node.childNodes && node.childNodes.length) {
        this.compile(node);
      }
    });
  }

  // 编译元素节点，处理指令
  compileElement(node) {
    // 遍历属性节点，判断是否为vue指令
    Array.from(node.attributes).forEach((attr) => {
      let attrName = attr.name;
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2);
        let key = attr.value;
        this.update(node, key, attrName);
      }
    });
  }

  // 调用指令
  update(node, key, attrName) {
    let updateFn = this[attrName + "Updater"];
    updateFn && updateFn(node, this.vm[key]);
  }

  // 处理v-text指令
  textUpdater(node, value) {
    node.textContent = value;
  }

  // 处理v-model指令
  modelUpdater(node, value) {
    node.value = value;
  }

  // 编译文本节点，处理差值表达式
  compileText(node) {
    // 使用正则匹配差值表达式
    let reg = /\{\{(.+?)\}\}/;
    let value = node.textContent;
    if (reg.test(value)) {
      // 替换匹配的值
      let key = RegExp.$1.trim();
      node.textContent = value.replace(reg, this.vm[key]);
    }
  }

  // 判断元素属性是否时指令
  isDirective(attrName) {
    return attrName.startsWith("v-");
  }

  // 判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3;
  }

  // 判断节点是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1;
  }
}
