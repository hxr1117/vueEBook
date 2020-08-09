<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div
        class="ebook-loading-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="ebook-loading-line-wrapper"
          v-for="(subItem, subIndex) in item"
          :key="subIndex"
        >
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from '../../utils/utils'
export default {
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}]
      ],
      maskWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      lineWidth: [
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 },
        { value: 50 }
      ],
      // 添加mask长度的标记
      add: true,
      // mask结束标志
      end: false
    }
  },
  mounted() {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        const mask = this.$refs.mask[index]
        const line = this.$refs.line[index]
        const maskWidth = this.maskWidth[index]
        const lineWidth = this.lineWidth[index]
        if (index === 0) {
          if (this.add && maskWidth.value < 60) {
            maskWidth.value++
            lineWidth.value--
          } else if (!this.add && lineWidth.value < 60) {
            maskWidth.value--
            lineWidth.value++
          }
        } else {
          if (this.add && maskWidth.value < 60) {
            const preMaskWidth = this.maskWidth[index - 1]
            if (preMaskWidth.value >= 30) {
              maskWidth.value++
              lineWidth.value--
            }
          } else if (!this.add && lineWidth.value < 60) {
            const preLineWidth = this.lineWidth[index - 1]
            if (preLineWidth.value >= 30) {
              maskWidth.value--
              lineWidth.value++
            }
          }
        }
        mask.style.width = `${px2rem(maskWidth.value)}rem`
        mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`
        line.style.width = `${px2rem(lineWidth.value)}rem`
        line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`
        if (index === this.maskWidth.length - 1) {
          if (this.add) {
            if (maskWidth.value === 16) {
              this.end = true
            }
          } else {
            if (maskWidth.value === 0) {
              this.end = true
            }
          }
        }
        if (this.end) {
          this.add = !this.add
          this.end = false
        }
      })
    }, 20)
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-loading {
  position: relative;
  z-index: 400;
  width: px2rem(150);
  height: px2rem(90);
  background: transparent;
  border: px2rem(5) solid #d7d7d7;
  border-radius: px2rem(5);
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        padding: 0 px2rem(7);
        box-sizing: border-box;
        flex: 1;
        @include center;
        .ebook-loading-line {
          flex: 0 0 px2rem(60);
          width: px2rem(60);
          height: px2rem(5);
          background: #d7d7d7;
        }
        .ebook-loading-mask {
          width: 0;
          flex: 0 0 0;
          height: px2rem(5);
        }
      }
    }
    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      width: px2rem(4);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>
