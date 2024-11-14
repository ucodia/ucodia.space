import { optimize } from "svgo";

export default (svgElement, filename) => {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const optimizedSvg = optimize(svgData, {
    js2svg: {
      indent: 2,
      pretty: true,
    },
  });
  const blob = new Blob([optimizedSvg.data], {
    type: "image/svg+xml;charset=utf-8",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};
