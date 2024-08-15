import React from "react";
import { Link } from "react-router-dom";
import { singleDiamond } from "./sketches/diamonds";
import U5Wrapper from "@/components/u5-wrapper";
import routes from "@/routes";

const links = routes
  .map(({ name, path, override }) => ({
    name,
    to: override ? override : path,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const Home = () => {
  return (
    <div className="py-12 sm:py-[50px]">
      <div className="flex flex-row items-center justify-center">
        <div className="mr-6 h-[100px] w-[100px] sm:mr-[50px] sm:h-[200px] sm:w-[200px]">
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
            className="h-[50px] sm:h-[100px]"
          />
        </picture>
      </div>
      <div className="my-12 sm:my-[50px] flex flex-col items-center justify-center">
        {links.map(({ name, to }, index, items) => {
          const inc = Math.round(360 / items.length);
          const color = `hsl(${index * inc},80%,60%)`;
          return (
            <Link
              key={name}
              className="text-center text-4xl sm:text-6xl p-2 sm:p-4 no-underline"
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
