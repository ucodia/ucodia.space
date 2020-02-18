export default items => {
  return {
    index: 0,
    peek: function() {
      return items[this.index];
    },
    next: function() {
      this.index++;
      if (this.index >= items.length) {
        this.index = 0;
      }
      return {
        value: this.peek(),
        done: false
      };
    }
  };
};
