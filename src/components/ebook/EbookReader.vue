<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="onMaskClick"
    @touchmove="move"
    @touchend="moveEnd"
    @mousedown.left="onMouseEnter"
    @mousemove.left="onMouseMove"
    @mouseup.left="onMouseEnd"></div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import Epub from 'epubjs'
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from '../../utils/localStorage'
import { flatten } from '../../utils/book'
// import func from '../../../vue-temp/vue-editor-bridge'
global.ePub = Epub
export default {
  // 组件复用
  // 把mixins中的组件和这里的进行混合
  mixins: [ebookMixin],
  methods: {
    // 1-鼠标进入
    // 2-鼠标进入后的移动
    // 3-鼠标从移动状态移出（松手
    // 4-鼠标还原
    onMouseEnter(e) {
      this.mouseState = 1
      this.mouseStarTime = e.timeStamp
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseMove(e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd(e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      // 因为轻微的移动（用户只是想点击）会导致菜单栏无法响应，
      // 所以要对时间进行判断，时间很短就会认为是点击
      const time = e.timeStamp - this.mouseStarTime
      if (time < 200) {
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    move(e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    moveEnd(e) {
      // console.log('moveEnd', e)
      // 归位
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    // 点击蒙板
    onMaskClick(e) {
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return
      }
      const offsetX = e.offsetX
      // console.log(offsetX)
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prePage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    prePage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      // this.$store.dispatch('setMenuVisible', !this.menuVisible)
      this.setMenuVisible(!this.menuVisible)
    },
    initFontFamily() {
      // 提取保持在本地的字体
      const font = getFontFamily(this.fileName)
      if (!font) {
        // 没有的话就设置
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        // 有的话就提取
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initFontSize() {
      const fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        // 没有的话就设置
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        // 有的话就提取
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initTheme() {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        // 没有的话就设置
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      // 注册所有样式
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      // 设置默认
      this.rendition.themes.select(defaultTheme)
    },
    initRendition() {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'defalut'
      })
      const location = getLocation(this.fileName)
      console.log(this.display(null))

      this.display(location, () => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
      })
      // 但阅读器渲染完，获取资源函数的时候调用这个函数
      this.rendition.hooks.content.register(contents => {
        // 手动添加样式文件
        contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`)
        contents.addStylesheet(
          `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
        )
        contents.addStylesheet(
          `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
        )
        contents.addStylesheet(
          `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
        )
      })
    },
    // 初始化手势
    initGesture() {
      // 动态绑定事件
      this.rendition.on('touchstart', event => {
        this.touchStartX = event.changedTouches[0].clientX
        this.touchStartTime = event.timeStamp
      })
      this.rendition.on('touchend', event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX
        const time = event.timeStamp - this.touchStartTime
        if (time < 500 && offsetX > 40) {
          this.prePage()
        } else if (time < 500 && offsetX < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
        event.preventDefault()
        event.stopPropagation()
      })
      this.rendition.on('touchmoved', event => {})
    },
    parseBook() {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        // console.log(metadata)
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(navigation => {
        // 拍屏多级数组，给每个项排上等级
        const navItem = flatten(navigation.toc)
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(navigation.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })
    },
    initEpub() {
      const url =
        `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
      // const url = '/api/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.parseBook()
      this.book.ready
        .then(() => {
          // 计算分页，分一页的字数，因为比较粗糙，所以只能用来显示百分比
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
        })
        .then(location => {
          this.setBookAvailable(true)
          this.refreshLocation()
        })
    }
  },
  mounted() {
    // Statistics|2013_Book_ShipAndOffshoreStructureDesign
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
