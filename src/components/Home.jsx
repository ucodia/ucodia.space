import React from "react";
import { Link } from "react-router-dom";
import { singleDiamond } from "../pages/sketches/diamonds";
import U5Wrapper from "./U5Wrapper";
import routes from "@/routes";

const links = routes
  .map(({ name, path, override }) => ({
    name,
    to: override ? override : path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const Home = () => {
  return (
    <div className="py-[50px]">
      <div className="flex flex-row items-center justify-center">
        <div className="mr-[50px] h-[200px] w-[200px] max-[425px]:mr-[25px] max-[425px]:h-[100px] max-[425px]:w-[100px]">
          <U5Wrapper sketch={singleDiamond} />
        </div>
        <picture>
          <source
            srcSet="/dark-ucodia-logo.svg"
            media="(prefers-color-scheme: dark)"
          />
          <img
            src="/light-ucodia-logo.svg"
            alt="website logo"
            className="h-[100px] max-[425px]:h-[50px]"
          />
        </picture>
      </div>
      <div className="my-[50px] flex flex-col items-center justify-center text-5xl max-[425px]:text-4xl leading-normal">
        {links.map(({ name, to }, index, items) => {
          const inc = Math.round(360 / items.length);
          const color = `hsl(${index * inc},80%,60%)`;
          return (
            <Link
              key={name}
              className="no-underline"
              style={{ color: color }}
              to={to}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
