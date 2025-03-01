import ThemeToggle from "@/components/theme-toggle";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

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

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.document.documentElement.scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`${
        isVisible ? "opacity-100" : "opacity-0"
      } fixed bottom-8 right-8 bg-primary text-primary-foreground p-3 rounded-full shadow-lg transition-opacity duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary`}
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
};

export default function MDXLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b sticky top-0 z-10">
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

      <main className="p-4 px-8 md:p-8 max-w-4xl mx-auto">
        <article className="prose dark:prose-invert md:prose-lg lg:prose-xl">
          {children}
        </article>
      </main>

      <footer className="bg-background border-t py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <span>Built by Ucodia - 2025</span>
            <img
              src="/diamond.svg"
              alt="Diamond"
              className="ml-2 inline-block h-6 w-6"
            />
          </div>
        </div>
      </footer>

      <ScrollToTopButton />
    </div>
  );
}
