import ThemeToggle from "@/components/theme-toggle";
import { Link } from "react-router-dom";

const UcodiaHeaderImg = () => {
  return (
    <picture>
      <source
        srcSet="/dark-ucodia-header.png"
        media="(prefers-color-scheme: dark)"
      />
      <img
        src="/light-ucodia-header.png"
        alt="website header"
        className="h-16 w-auto"
      />
    </picture>
  );
};

export default function MDXLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Mobile Layout */}
            <div className="flex items-center md:hidden">
              {/* <Navigation routes={routes} /> */}
              <Link to="/" aria-label="Go to homepage">
                <UcodiaHeaderImg />
              </Link>
            </div>

            {/* Desktop Layout */}
            <Link
              to="/"
              aria-label="Go to homepage"
              className="hidden md:block"
            >
              <UcodiaHeaderImg />
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              {/* <Navigation routes={routes} /> */}
              <ThemeToggle />
            </div>

            {/* Theme Toggle for Mobile */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 px-8 md:p-8 max-w-2xl mx-auto">
        <article className="prose dark:prose-invert md:prose-lg lg:prose-xl">
          {children}
        </article>
      </main>

      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <span>Built by Ucodia - 2024</span>
            <img
              src="/diamond.svg"
              alt="Diamond"
              className="ml-2 inline-block h-6 w-6"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
