const book = {
  state: {
    fileName: '',
    menuVisible: false
  },
  mutations: {
    setFileName: (state, fileName) => {
      state.fileName = fileName
    },
    setMenuVisible: (state, menuVisible) => {
      state.menuVisible = menuVisible
    }
  },
  actions: {
    setFileName: ({ commit }, fileName) => {
      // 返回promise对象
      return commit('setFileName', fileName)
    },
    setMenuVisible: ({ commit }, menuVisible) => {
      // 返回promise对象
      return commit('setMenuVisible', menuVisible)
    }
  },
  modules: {}
}

export default book
