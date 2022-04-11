import JAuditModel from './JAuditModel.vue'
import Vue from 'vue'

const JAuditModelConstructor = Vue.extend(JAuditModel) // 直接将Vue组件作为Vue.extend的参数
let nId = 1

const openJAuditModel = (parameter) => {
  let id = 'JAuditModel-' + nId++
  const JAuditModelInstance = new JAuditModelConstructor({
    data: parameter
  }) // 实例化一个接收参数的model
  JAuditModelInstance.id = id
  JAuditModelInstance.vm = JAuditModelInstance.$mount() // 挂载但是并未插入dom，是一个完整的Vue实例
  JAuditModelInstance.vm.showModal();
  JAuditModelInstance.dom = JAuditModelInstance.vm.$el;
  document.body.appendChild(JAuditModelInstance.dom) // 将dom插入body
  // JAuditModelInstance.dom.style.zIndex = nId + 1001 // 后插入的Notice组件z-index加1，保证能盖在之前的上面
  return JAuditModelInstance.vm;
}

export default {
  install: Vue => {
    Vue.prototype.$openJAuditModel = openJAuditModel // 将组件暴露出去，并挂载在Vue的prototype上
  }
}