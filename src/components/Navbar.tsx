import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Moon, Sun, Menu, X, Globe, User, GraduationCap } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "zh", name: "中文" },
    { code: "hi", name: "हिन्दी" },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src="/logo-prepnepal.svg"
                alt="PrepNepal Logo"
                className="w-38 h-38 rounded-lg"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent"></span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/appointments"
              className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
            >
              Appointments
            </Link>
            <Link
              to="/preparation"
              className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
            >
              Visa Prep
            </Link>
            <Link
              to="/visa-experience"
              className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
            >
              Visa Experience
            </Link>
            <Link
              to="/mock-interviews"
              className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
            >
              Mock Interviews
            </Link>
            <Link
              to="/contact"
              className="text-foreground hover:text-primary px-4 py-2 rounded-md hover:bg-primary/5 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/5"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code} className="cursor-pointer">
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-primary/5"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* User menu / Auth buttons */}
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/5"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard" className="flex items-center">
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center">
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logOut}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" asChild className="hover:bg-primary/5">
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:bg-primary/5"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="hover:bg-primary/5"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-background/95 backdrop-blur-md border-b border-border`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/appointments"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Appointments
          </Link>
          <Link
            to="/preparation"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Visa Prep
          </Link>
          <Link
            to="/visa-experience"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Visa Experience
          </Link>
          <Link
            to="/mock-interviews"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Mock Interviews
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={toggleMobileMenu}
          >
            Contact
          </Link>

          {/* Language selector in mobile menu */}
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-foreground mb-2">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="text-left px-3 py-2 rounded-md text-sm hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auth buttons in mobile menu */}
          {!currentUser && (
            <div className="px-3 py-2 space-y-2">
              <Button variant="ghost" asChild className="w-full justify-center">
                <Link to="/signin" onClick={toggleMobileMenu}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                className="w-full justify-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              >
                <Link to="/signup" onClick={toggleMobileMenu}>
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
