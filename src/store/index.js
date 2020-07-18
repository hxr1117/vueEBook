import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  // 模块化：把vuex里面原本的state/mutations……单独放
  // 到store/modules目录下的js文件里面，通过export导出
  // 再在index.js中import进来
  modules: {
    book
  },
  getters,
  actions
})

// 使用actions直接设定getter里面的数据
// this.$store.dispatch('setMenuVisible', false)避免使用这样长的代码来修改值
// this.setMenuVisible(false)来代替上面语句
