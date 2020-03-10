export default items => {
  return {
    index: 0,
    length: function() {
      return items.length;
    },
    peek: function() {
      return items[this.index];
    },
    next: function() {
      this.cycle(1);
      return this.peek();
    },
    cycle: function(offset) {
      // compute the signed index (could be negative)
      const signedIndex = (this.index + offset) % items.length;

      if (signedIndex < 0) {
        // normalize negative index
        this.index = items.length - Math.abs(signedIndex);
      } else {
        this.index = signedIndex;
      }

      return this;
    },
    take: function(n) {
      if (n < 0) throw new Error("n must be positive.");
      if (n > items.length)
        throw new Error("n must be lesser than items length");
      if (n === 0) return [];
      if (n === 1) return [this.peek()];

      const indexToEnd = items.length - this.index;
      if (indexToEnd >= n) {
        return items.slice(this.index, this.index + n);
      }

      return [...items.slice(this.index), ...items.slice(0, n - indexToEnd)];
    },
    random: function() {
      const index = Math.floor(Math.random() * items.length);
      return items[index];
    }
  };
};
