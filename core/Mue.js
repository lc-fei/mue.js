import Hijacker from './Hijacker.js';
import Compiler from './Compiler.js';
class Mue {
  constructor(options) {
    // element的简写。作为项目挂载的根节点。
    this.el = document.querySelector(options.el);
    this.data = options.data;
    // new Hijacker(this.data);                            //为什么这样key
    new Hijacker(this, 'data')                             //这样也可以
    new Compiler(this); // 把整个mue都传给Compiler
  }
}

export default Mue;