<template>
  <div id="app">
    <div class="test">fdsafds</div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
const getters = {
  a: () => 1,
  b: () => 2
}
function fn(keys) {
  const data = {}
  keys.forEach(key => {
    if (getters.hasOwnProperty(key)) {
      data[key] = getters[key]
    }
  })
  return data
}
export default {
  computed: {
    // 把mapGetters对象和computed对象合并
    ...mapGetters(['test']),
    ...fn(['a', 'b'])
  },
  mounted() {
    // 调用action的setTest方法
    // this.$store.dispatch('setTest', 2).then(() => {
    //   console.log(this.$store.state.book.test)
    // })
    console.log(this.a, this.b)
  }
}
</script>
<style lang="scss" scoped>
@import './assets/styles/global';
.test {
  font-family: 'Days One';
  font-size: px2rem(20);
}
</style>
