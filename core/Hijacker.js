import Publisher from "./Publisher.js";
// 数据劫持者
// 数据劫持者
// 这里劫持的是data里面的数据
// 目的就是给data的每一层都加上defineProperty
// 这里只实现了劫持简单变量的情况（只有data一个对象）
class Hijacker {
  constructor(mue, data) {
    this.hijack(mue, data);
  }

  // Object.defineProperty劫持数据需要拿到 该数据节点 及 其父级对象
  hijack(object, key) {      //整个对象和‘data’
    // 创建发布者
    // 因为defineProperty不会进行深度监听，每一层都会创建一个新的publisher和新的defineProperty
    const publisher = new Publisher();
    let value = object[key];              //把对象中的属性称取出来


    if (!value) {    
      return;
    } else if (typeof value === 'object') { // 当前节点是树，递归;
      Object.keys(value).forEach((key) => {
        this.hijack(value, key);              //再次传入整个对象和对象的key
      });
    } else { // 当前节点是叶子节点；object则是其父级节点
      // 上文提到的知识点：JS的this指向
      const that = this;  
      // 开始劫持数据
      Object.defineProperty(object, value, {     //监视value属性
        // 记住这个get, 这个很重要
        get() {  // 实现反向通知的核心步骤，具体怎么回事在实现Viewer时进一步说明
          if (Publisher.target) { 
            publisher.addViewer(Publisher.target);
          }
          return value;
        },
        set(newValue) {
          if (value === newValue) { // 防止死循环: 更新->触发publish->更新->...
            return
          }
          value = newValue;
          that.hijack(object, newValue); // 提防一手新的数据是树形结构，递归一下
          publisher.publish();
        }
      });

    }
  }
}

export default Hijacker