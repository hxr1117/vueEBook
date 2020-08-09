<template>
  <div class="ebook-reader">
    <div id="read"></div>
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
</style>