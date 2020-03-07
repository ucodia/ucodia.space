import cyclicIterator from "./cyclicIterator";

const items = [0, 1, 2, 3, 4, 5, 6, 7];

describe("cyclicIterator", () => {
  it("should return first item", () => {
    const iterator = cyclicIterator(items);
    expect(iterator.peek()).toEqual(0);
  });

  it("should cycle items by 1 and return the first item", () => {
    const iterator = cyclicIterator(items);
    expect(iterator.next()).toEqual(1);
    expect(iterator.items).toEqual([1, 2, 3, 4, 5, 6, 7, 0]);
  });

  it("should cycle items forward", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(3);
    expect(iterator.items).toEqual([3, 4, 5, 6, 7, 0, 1, 2]);
  });

  it("should cycle items forward and wrap around", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(items.length + 3);
    expect(iterator.items).toEqual([3, 4, 5, 6, 7, 0, 1, 2]);
  });

  it("should cycle items backward", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(-3);
    expect(iterator.items).toEqual([5, 6, 7, 0, 1, 2, 3, 4]);
  });

  it("should cycle items backward and wrap around", () => {
    const iterator = cyclicIterator(items);
    iterator.cycle(-items.length - 3);
    expect(iterator.items).toEqual([5, 6, 7, 0, 1, 2, 3, 4]);
  });
});
