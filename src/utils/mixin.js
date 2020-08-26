import { mapGetters, mapActions } from 'vuex'
import {
  themeList,
  addCss,
  removeAllCss,
  getReadTimeByMinute
} from '../utils/book'
import { saveLocation, getBookmark } from '../utils/localStorage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this)
    },
    getSectionName() {
      // 无法定位二级目录
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
      //     // 获取章节名称
      //     return this.currentBook.navigation.get(sectionInfo.href).label
      //     // console.log(this.currentBook.navigation.get(sectionInfo.href))
      //   }
      // }
      // return ''
      // 因为现在的目录就是一个数组，所以直接从数组里读取section位置
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const progress = currentLocation.start.percentage
        this.setProgress(Math.floor(progress * 100))
        // 设置章节
        this.setSection(currentLocation.start.index)
        // 保存进度到本地
        const startCfi = currentLocation.start.cfi
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        console.log(bookmark)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
    },
    display(target, cb) {
      // 复用，如果有回调函数就调用
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      } else {
        this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (cb) cb()
        })
      }
    },
    hideTitleAndMenu() {
      this.setFontFamilyVisible(false)
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace(
        '$1',
        getReadTimeByMinute(this.fileName)
      )
    }
  }
}
// 减少重复代码
// 可以包含变量方法等内容
