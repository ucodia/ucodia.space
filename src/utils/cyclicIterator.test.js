import cyclicIterator from "./cyclicIterator";

const items = [0, 1, 2, 3, 4, 5, 6, 7];

describe("cyclicIterator", () => {
  it("should return the length", () => {
    const iterator = cyclicIterator(items);
    expect(iterator.length()).toEqual(8);
  });

  it("should return the first item", () => {
    const iterator = cyclicIterator(items);
    expect(iterator.peek()).toEqual(0);
  });

  it("should return the next item", () => {
    const iterator = cyclicIterator(items);
    expect(iterator.next()).toEqual(1);
  });

  it("should cycle iterator forward", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(3);
    expect(iterator.peek()).toEqual(3);
  });

  it("should cycle iterator forward and wrap around", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(items.length + 3);
    expect(iterator.peek()).toEqual(3);
  });

  it("should cycle iterator backward", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(-3);
    expect(iterator.peek()).toEqual(5);
  });

  it("should cycle iterator backward and wrap around", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(-items.length - 3);
    expect(iterator.peek()).toEqual(5);
  });

  it("should take n items (no wrap around)", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(3);
    expect(iterator.take(5)).toEqual([3, 4, 5, 6, 7]);
  });

  it("should take n items (with wrap around)", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(3);
    expect(iterator.take(items.length)).toEqual([3, 4, 5, 6, 7, 0, 1, 2]);
  });
});
