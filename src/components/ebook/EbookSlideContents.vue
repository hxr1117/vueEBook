<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          v-model="searchText"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage()"
          @keyup.enter.exact="search()"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideSearchPage()"
      >
        {{ $t('book.cancel') }}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt="" class="slide-contents-book-img" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">{{ metadata.title }}</div>
        <div class="slide-contents-book-author">{{ metadata.creator }}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{ $t('book.haveRead2') }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <scroll
      class="slide-contents-list"
      :top="156"
      :bottom="48"
      ref="scroll"
      v-show="!searchVisible"
    >
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
      >
        <span
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{ selected: section === index }"
          @click="displayContent(item.href)"
          >{{ item.label }}</span
        >
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>
    <scroll
      class="slide-search-list"
      :top="60"
      :bottom="48"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayContent(item.cfi, true)"
      ></div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../common/Scroll'
import { ebookMixin } from '../../utils/mixin'
import { px2rem } from '../../utils/utils'
export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },

  methods: {
    search() {
      if (this.searchText && this.searchText.trim().length > 0) {
        this.doSearch(this.searchText).then(result => {
          this.searchList = result
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            )
            return item
          })
        })
      }
    },
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    // 通过回掉函数解决使用差异
    displayContent(href, highlight = false) {
      this.display(href, () => {
        this.hideTitleAndMenu()
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(href)
        }
      })
    },
    hideSearchPage() {
      this.searchVisible = false
      this.searchList = null
      this.searchText = ''
    },
    showSearchPage() {
      this.searchVisible = true
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(80);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      padding: 0 px2rem(15);
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        padding: 0 px2rem(15);
        flex: 0 0 px2rem(28);
        font-size: px2rem(20);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(80);
        font-size: px2rem(20);
        border: none;
        background: transparent;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      margin: 0 px2rem(20);
      flex: 0 0 px2rem(100);
      font-size: px2rem(35);
      float: right;
      line-height: px2rem(80);
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(150);
    padding: px2rem(10) px2rem(20) px2rem(20) px2rem(20);
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(80);
      .slide-contents-book-img {
        width: px2rem(70);
        height: px2rem(100);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: px2rem(0) px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        // 375 * 0.85 = 318.75 - 30 = 288.75 - 10 * 2 = 268.75 - 45 - 70
        font-size: px2rem(20);
        // 为什么我这里的尺寸总是不一样
        width: px2rem(400);
        line-height: px2rem(22);
        // 文字的缩略要制定外层组件的宽度
        // @include ellipsis;
        // 两行显示
        @include ellipsis2(2);
      }
      .slide-contents-book-author {
        font-size: px2rem(18);
        @include ellipsis;
        margin-top: px2rem(10);
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(250);
      padding: px2rem(0) px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(20);
        }
        .progress-text {
          font-size: px2rem(18);
        }
      }
      .slide-contents-book-time {
        margin-top: px2rem(10);
        font-size: px2rem(18);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(20);
    box-sizing: border-box;
    .slide-contents-item {
      padding: px2rem(20) 0;
      display: flex;
      .slide-contents-item-label {
        font-size: px2rem(34);
        line-height: px2rem(36);
        flex: 1;
        @include ellipsis;
      }
      .slide-contents-item-page {
      }
    }
  }
  .slide-search-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    width: 100%;
    .slide-search-item {
      font-size: px2rem(30);
      line-height: px2rem(36);
      padding: px2rem(20) 0;
      box-sizing: border-box;
      // @include ellipsis2(1);
    }
  }
}
</style>
