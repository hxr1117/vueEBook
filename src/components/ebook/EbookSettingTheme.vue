<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item, index) in themeList"
          :key="index"
          @click="setTheme(index)"
        >
          <div
            class="preview"
            :style="{ background: item.style.body.background }"
            :class="{
              'no-border': item.style.body.background !== '#fff',
              selected: item.name === defaultTheme
            }"
          ></div>
          <div class="text" :class="{ selected: item.name === defaultTheme }">
            {{ item.alias }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from '../../utils/mixin'
import { saveTheme } from '../../utils/localStorage'
export default {
  mixins: [ebookMixin],
  methods: {
    setTheme(index) {
      const theme = this.themeList[index]
      this.setDefaultTheme(theme.name).then(() => {
        this.currentBook.rendition.themes.select(theme.name)
        this.initGlobalStyle()
      })
      saveTheme(this.fileName, theme.name)
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
  height: px2rem(130);
  background-color: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: 0.15);
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      z-index: 101;
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: px2rem(10);
      box-sizing: border-box;
      .preview {
        flex: 1;
        // border: px2rem(1) solid #ccc;
        box-sizing: border-box;
        &.selected {
          border: px2rem(1) solid #333;
          box-shadow: 0 px2rem(4) px2rem(6) 0 rgba($color: #000000, $alpha: 0.1);
        }
      }
      .text {
        flex: 0 0 px2rem(20);
        font-size: px2rem(30);
        color: #ccc;
        @include center;
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>
