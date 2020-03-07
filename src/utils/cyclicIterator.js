export default items => {
  return {
    items,
    peek: function() {
      return this.items[0];
    },
    next: function() {
      this.cycle(1);
      return this.peek();
    },
    cycle: function(n) {
      let offset = n % this.items.length;

      // normalize negative offsets
      if (offset < 0) {
        offset = this.items.length - Math.abs(offset);
      }

      this.items = [
        ...this.items.slice(offset),
        ...this.items.slice(0, offset)
      ];
    },
    random: function() {
      const index = Math.floor(Math.random() * items.length);
      return this.items[index];
    }
  };
};
