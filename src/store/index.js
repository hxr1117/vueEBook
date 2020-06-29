import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  // 模块化：把vuex里面原本的state/mutations……单独放
  // 到store/modules目录下的js文件里面，通过export导出
  // 再在index.js中import进来
  modules: {
    book
  },
  getters
})
