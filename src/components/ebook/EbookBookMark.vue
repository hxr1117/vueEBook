<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :height="100" :width="40"></bookmark>
    </div>
  </div>
</template>

<script>
// 书签重点：
// 通过绝对定位作出下拉的效果，
// 通过filter删除书签
import { realPx } from '../../utils/utils'
import { ebookMixin } from '../../utils/mixin'
import Bookmark from '../common/BookMark'
import { getBookmark, saveBookmark } from '../../utils/localStorage'
const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  computed: {
    height() {
      return realPx(35)
    },
    threshold() {
      return realPx(50)
    },
    fixedStyle() {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY(v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        this.afterThreshold(v)
      } else if (v > 0 && v < this.height) {
        this.boforeHeight()
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookmark(isBookmark) {
      this.isFixed = this.isBookmark
      if (isBookmark) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  data() {
    return {
      text: '',
      color: WHITE,
      isFixed: false
    }
  },
  methods: {
    addBookmark() {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi
        .replace(/.*!/, '')
        .replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi
        .replace(/.*!/, '')
        .replace(/\)$/, '')
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      console.log(this.bookmark)
      if (this.bookmark) {
        saveBookmark(this.fileName, this.bookmark.filter(item => item.cfi !== cfi))
        this.setIsBookmark(false)
      }
    },
    restore() {
      // 状态4，归位
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookmark(true)
        this.addBookmark()
      } else {
        this.setIsBookmark(false)
        this.removeBookmark()
      }
    },
    boforeHeight() {
      // 状态1, 未超过书签高度
      if (this.isBookmark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    },
    beforeThreshold(v) {
      // 状态2
      // 未到达临界状态
      this.$refs.bookmark.style.top = `${-v}px`
      // 判断当前页是否是书签
      this.boforeHeight()
      // 下拉箭头返回原样
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    afterThreshold(v) {
      // 状态3
      // 添加书签，固定书签
      if (this.isBookmark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      // 超越临界状态
      // console.log('third')
      this.$refs.bookmark.style.top = `${-v}px`
      this.text = this.$t('book.releaseAddMark')
      this.color = BLUE
      const iconDown = this.$refs.iconDown
      if (
        iconDown.style.transform === '' ||
        iconDown.style.transform === 'rotate(0deg)'
      ) {
        iconDown.style.transform = 'rotate(180deg)'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-bookmark {
  position: absolute;
  top: px2rem(-50);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(50);
  background-color: slategrey;
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(100);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(40);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(40);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>
