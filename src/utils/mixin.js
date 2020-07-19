import { mapGetters, mapActions } from 'vuex'

export const ebookMixin = {
  computed: {
    ...mapGetters(['menuVisible', 'fileName'])
  },
  methods: {
    ...mapActions([
      'setMenuVisible',
      'setFileName'
    ])
  }
}
// 减少重复代码
// 可以包含变量方法等内容
