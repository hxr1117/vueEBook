const book = {
  // 使this.test能调用this.$store.state.book.test
  fileName: state => state.book.fileName,
  menuVisible: state => state.book.menuVisible
}

export default book
