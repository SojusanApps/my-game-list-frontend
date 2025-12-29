import * as React from "react";
import { Link } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo";

const Footer = (): React.JSX.Element => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-background-200 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <Link to="/home" className="hover:opacity-80 transition-opacity scale-75 origin-left">
            <AppLogo classNameSojusan="text-primary-600 text-xl" classNameGameList="text-text-900 text-2xl" />
          </Link>
          <p className="text-text-400 text-xs hidden sm:block">© {currentYear} Sojusan GameList</p>
        </div>

        <nav>
          <ul className="flex items-center gap-8">
            <li>
              <Link
                to="/home"
                className="text-text-500 hover:text-primary-600 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="text-text-500 hover:text-primary-600 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="text-text-500 hover:text-primary-600 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Privacy
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
