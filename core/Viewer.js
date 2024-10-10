import Publisher from './Publisher.js'
// 观察者
class Viewer {
  constructor(mue, dataKey, updateHandler) {
    console.log(updateHandler)
    this.mue = mue // 传说中的vm层，即mue实例
    this.dataKey = dataKey // 数据的键
    this.updateHandler = updateHandler // 用来更新视图层(V层)的方法

    // 这里是反向通知的关键操作：
    // 绑定一个静态属性。相当于在Publisher内部创建一个“全局”变量，记录是哪个观察者触发的反向通知
    Publisher.target = this
    // 这里使用了 mue.data[dataKey]，将触发劫持者设置的 get方法：
    // 反向通知 publisher邀请当前这个viewer成为观察者（也可以理解为viewer主动成为观察者）
    this.oldValue = mue.data[dataKey]
    // 结束，标记为空，释放内存
    Publisher.target = null
  }

  update() {
    const newValue = this.mue.data[this.dataKey]
    if (this.oldValue === newValue) {
      // 同样地，没有更新就啥也不干
      return
    }
    // 更新视图，实现 V = F1(M)
    this.updateHandler(newValue)
  }
}

export default Viewer
