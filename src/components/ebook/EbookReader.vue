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
  saveTheme
} from '../../utils/localStorage'
global.ePub = Epub
export default {
  // 组件复用
  // 把mixins中的组件和这里的进行混合
  mixins: [ebookMixin],
  methods: {
    prePage() {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next()
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
    hideTitleAndMenu() {
      this.setFontFamilyVisible(false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
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
    initEpub() {
      const url =
        `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
      // const url = '/api/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'defalut'
      })
      this.rendition.display().then(() => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
      })
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
