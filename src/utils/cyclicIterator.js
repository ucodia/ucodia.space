export default items => {
  return {
    index: 0,
    peek: function() {
      return items[this.index];
    },
    random: function() {
      this.index = Math.floor(Math.random() * items.length);
      return this.peek();
    },
    next: function() {
      this.index++;
      if (this.index >= items.length) {
        this.index = 0;
      }
      return this.peek();
    }
  };
};
