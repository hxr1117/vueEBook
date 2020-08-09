<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{ getReadTimeText() }}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection()">
            <span class="icon-back"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disabled="!bookAvailable"
            :style="{ 'background-size': `${progress}% 100% !important` }"
          />
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{ getSectionName }}</span>
          <span>{{ bookAvailable ? '(' + progress + '%)' : '加载中...' }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  computed: {
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
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        // this.updateProgressBg()
      })
    },
    onProgressInput(progress) {
      this.setProgress(progress)
    },
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection() {
      if (
        this.section < this.currentBook.spine.length - 1 &&
        this.bookAvailable
      ) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    },
    displaySection() {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href)
      }
    },
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.progress / 100
      )
      this.display(cfi)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/global';
.setting-wrapper {
  position: absolute;
  bottom: px2rem(100);
  left: 0;
  width: 100%;
  height: px2rem(150);
  background-color: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: 0.15);
  .setting-progress {
    width: 100%;
    height: 100%;
    position: relative;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(20);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 80%;
      @include center;
      padding: 0 px2rem(30);
      box-sizing: border-box;
      .progress {
        margin: 0 px2rem(20);
        z-index: 101;
        width: 100%;
        // 覆盖默认样式
        -webkit-appearance: none;
        height: px2rem(2);
        &.focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(40);
          width: px2rem(40);
          border-radius: 50%;
          background: white;
          box-shadow: 0 px2rem(8) px2rem(8) 0
            rgba($color: #000000, $alpha: 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
      .progress-icon-wrapper {
        font-size: px2rem(40);
      }
    }
    .text-wrapper {
      height: 20%;
      font-size: px2rem(20);
      color: #666;
      @include center;
      bottom: px2rem(10);
      left: 0;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-section-text {
        margin: 0 px2rem(15);
        // 省略的函数
        @include ellipsis;
      }
    }
  }
}
</style>
