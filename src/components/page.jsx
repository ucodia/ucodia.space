import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    document.title = `${props.title} - Ucodia's space 🛸` || "";
  }, [props.title]);
  return props.children;
};

export default Page;
