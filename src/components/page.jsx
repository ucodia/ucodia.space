import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    document.title = `${props.title} - Ucodia's space 🛸` || "";
    window.scrollTo(0, 0);
  }, [props.title]);
  return props.children;
};

export default Page;
