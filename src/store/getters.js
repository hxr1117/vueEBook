const book = {
  // 使this.test能调用this.$store.state.book.test
  test: state => state.book.test
}

export default book
