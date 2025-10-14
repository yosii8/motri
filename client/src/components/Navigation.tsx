import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileText, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleReportClick = () => {
    navigate("/report");
  };

  const navBgColor = isActive("/") ? "bg-white" : "bg-[#0D4D4D] text-white";

  return (
    <nav
      className={`sticky top-0 z-50 shadow-lg transition-colors duration-300 ${navBgColor}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex flex-wrap justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src="/minstriy_logo.png"
              alt="Ministry Logo"
              className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow-md"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-wide">
              E-Report
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-wrap items-center space-x-2 lg:space-x-4">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 rounded-lg transition-all duration-300 ${
                  isActive("/")
                    ? "bg-indigo-600 text-white shadow-md hover:scale-105"
                    : "hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>{t("home")}</span>
              </Button>
            </Link>

            <Button
              onClick={handleReportClick}
              size="sm"
              className={`flex items-center space-x-2 rounded-lg transition-all duration-300 ${
                isActive("/report")
                  ? "bg-indigo-600 text-white shadow-md hover:scale-105"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>{t("Report")}</span>
            </Button>

            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-2 rounded-lg transition-all duration-300 ${
                  isActive("/dashboard")
                    ? "bg-indigo-600 text-white shadow-md hover:scale-105"
                    : "hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{t("Login")}</span>
              </Button>
            </Link>

            {/* Language Switcher */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="ml-2 sm:ml-4 bg-white text-gray-700 rounded-md px-2 py-1 text-sm sm:text-base shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Afaan Oromoo</option>
            </select>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex flex-wrap items-center space-x-1 sm:space-x-2">
            <Link to="/">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                size="icon"
                className={`rounded-full transition-transform duration-300 ${
                  isActive("/")
                    ? "bg-indigo-600 text-white shadow-md hover:scale-110"
                    : "hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4" />
              </Button>
            </Link>

            <Button
              onClick={handleReportClick}
              size="icon"
              className={`rounded-full transition-transform duration-300 ${
                isActive("/report")
                  ? "bg-indigo-600 text-white shadow-md hover:scale-110"
                  : "hover:bg-gray-100"
              }`}
            >
              <FileText className="h-4 w-4" />
            </Button>

            <Link to="/dashboard">
              <Button
                variant={isActive("/dashboard") ? "default" : "ghost"}
                size="icon"
                className={`rounded-full transition-transform duration-300 ${
                  isActive("/dashboard")
                    ? "bg-indigo-600 text-white shadow-md hover:scale-110"
                    : "hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>

            {/* Mobile Language Switcher */}
            <select
              onChange={(e) => changeLanguage(e.target.value)}
              defaultValue={i18n.language}
              className="bg-white text-gray-700 rounded-md px-1.5 py-0.5 text-xs shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
              <option value="om">Afaan Oromoo</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
