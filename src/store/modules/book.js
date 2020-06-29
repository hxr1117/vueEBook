const book = {
  state: {
    fileName: ''
  },
  mutations: {
    setFileName: (state, fileName) => {
      state.fileName = fileName
    }
  },
  actions: {
    setFileName: ({ commit }, fileName) => {
      // 返回promise对象
      return commit('setFileName', fileName)
    }
  },
  modules: {}
}

export default book
