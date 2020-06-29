const book = {
  state: {
    test: 1
  },
  mutations: {
    setTest: (state, newTest) => {
      state.test = newTest
    }
  },
  actions: {
    setTest: ({ commit, state }, newTest) => {
      // 返回promise对象
      return commit('setTest', newTest)
    }
  },
  modules: {}
}

export default book
