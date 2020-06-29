<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.ePub = Epub
export default {
  computed: {
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub() {
      const url = 'http://192.168.31.126:8081/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
      console.log(this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'defalut'
      })
      this.rendition.display()
      this.rendition.on('touchstart', (event) => {
        console.log(event)
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', (event) => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        console.log(offsetX, time)
      })
    }
  },
  mounted() {
    // Statistics|2013_Book_ShipAndOffshoreStructureDesign
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
</style>
