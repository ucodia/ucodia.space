const base = {
  colors: {
    cyan: "rgb(0, 174, 239)",
    yellow: "rgb(255, 242, 0)",
    magenta: "rgb(236, 0, 140)"
  }
};

export const light = {
  ...base,
  bg: "#ffffff",
  fg: "#000000"
};

export const dark = {
  ...base,
  bg: "#121212",
  fg: "#ffffff"
};
