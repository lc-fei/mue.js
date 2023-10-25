import Viewer from "./Viewer.js";
// 模板编译者
class Compiler {
  constructor(mue) {
    this.mue = mue;
    this.el = mue.el;
    this.compile(this.el);
  }
  // 开始编译
  compile(el) {
    const childNodes = el.childNodes; // 真实DOM伪数组
    // console.log(childNodes)
    const childNodesList = Array.from(childNodes); // 转为真数组，进而可以用数组的api
    
    // 前序遍历整个DOM树
    childNodesList.forEach((node) => {
      // 判断是什么类型的DOM, 扔给不同的处理方法
      if (node.nodeType === 1) { // 元素类型
        this.compileForElement(node);
      } else if (node.nodeType === 3) { // 文本类型
        this.compileForText(node);
      }
      // 如果还有子节点，递归获取下一层
      if (node.childNodes.length) {
        this.compile(node);
      }
    });
  }
  // TODO: 主要就是实现这俩函数：
  // 处理元素类型DOM
  compileForElement(node) {
    const reg = /\{(.+?)\}/; // 正则表达式，匹配形如 {xxx} 的字符串
    const allAttributes = Array.from(node.attributes); // 将节点的所有属性，处理为数组
    
    // 遍历数组，处理每个属性
    allAttributes.forEach((attribute) => {
      // 比如 data="{msg}", attribute.name就是"data", attribute.value就是"{msg}"
      const text = attribute.value;
      const matchRes = text.match(reg);
      // console.log('text')
      // console.log(text)
      // console.log('matchRes')
      // console.log(matchRes)
      if (matchRes) { // 如果包含形如 {xxx} 的部分

        const dataKey = matchRes[1];    // 比如匹配的是"{msg}", matchRes[1]就是"msg"
        
        // 创建观察者，触发相关逻辑
        new Viewer(this.mue, dataKey, (newValue) => {
          node.textContent = newValue;
        });

        const newValue = this.mue.data[dataKey];
        node.value = text.replace(reg, newValue); // 将 {xxx} 替换为具体的值
        // 监听键盘输入，完成双向绑定，M=F2(V)
        node.addEventListener('input', () => { 
          this.mue.data[dataKey] = node.value;
        });
      }
    });
  }

  // 处理文本类型DOM
  compileForText(node) {
    const reg = /\{(.+?)\}/;
    const text = node.textContent;
    const matchRes = text.match(reg);
    if (matchRes) {  // 与上面的方法基本上一样的逻辑
      const dataKey = matchRes[1]; 
      const newText = this.mue.data[dataKey];
      node.textContent = text.replace(reg, newText); 

      new Viewer(this.mue, dataKey, (newText) => {
        node.textContent = newText;
      });
    }
  }
}

export default Compiler;