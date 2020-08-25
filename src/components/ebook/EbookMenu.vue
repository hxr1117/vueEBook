<template>
  <div>
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        :class="{ 'hide-box-shadow': !menuVisible || settingVisible >= 0 }"
        v-show="menuVisible"
      >
        <div class="icon-wrapper">
          <span class="icon-menu icon" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress icon" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright icon" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A icon" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import EbookSettingTheme from './EbookSettingTheme'
import EbookSettingFontPopup from './EbookSettingFontPopup'
import EbookSettingFont from './EbookSettingFont'
import EbookSettingProgress from './EbookSettingProgress'
import EbookSlide from './EbookSlide'
import { ebookMixin } from '../../utils/mixin'
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  methods: {
    showSetting(key) {
      this.setSettingVisible(key)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 200;
  height: px2rem(100);
  background-color: white;
  display: flex;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba($color: #000000, $alpha: 0.15);
  .icon-wrapper {
    color: #333;
    flex: 1;
    @include center;
  }
  .icon {
    font-size: px2rem(54);
  }
  &.hide-box-shadow {
    box-shadow: none;
  }
}
</style>
