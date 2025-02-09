import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import opineomi from "../assets/opineomi.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);

      // Update active section based on scroll position
      const sections = [
        '.survey-steps-container',
        '.rewards-section',
        '.hero-section'
      ];

      const currentSection = sections.find(section => {
        const element = document.querySelector(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      setActiveSection(currentSection || "");
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToSection = (sectionClass) => {
    const section = document.querySelector(sectionClass);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setMenuOpen(false);
    }
  };

  const NavLink = ({ href, onClick, children }) => {
    const isActive = activeSection === href;
    return (
      <a 
        href={href}
        className={`relative group px-4 py-2 text-sm font-medium transition-colors
          ${isActive 
            ? 'text-green-600' 
            : 'text-gray-700 hover:text-green-600'
          }`}
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {children}
        <span 
          className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 
            ${isActive 
              ? 'bg-green-600 scale-x-100' 
              : 'bg-green-600 scale-x-0 group-hover:scale-x-100'
            }`}
        />
      </a>
    );
  };

  const NavLinks = () => (
    <>
      <NavLink 
        href=".survey-steps-container" 
        onClick={() => scrollToSection('.survey-steps-container')}
      >
        How it works
      </NavLink>
      <NavLink 
        href=".rewards-section" 
        onClick={() => scrollToSection('.rewards-section')}
      >
        Rewards
      </NavLink>
      <div className="relative group">
        <button 
          className="text-gray-700 hover:text-green-600 transition-colors px-4 py-2 text-sm font-medium flex items-center"
        >
          English (India)
          <svg 
            className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {!user ? (
        <button 
          onClick={() => scrollToSection('.hero-section')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold
            hover:bg-green-700 transform hover:scale-105 transition-all duration-200
            shadow-md hover:shadow-lg ml-4"
        >
          Log in or Sign up
        </button>
      ) : (
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-semibold
            hover:bg-green-700 transform hover:scale-105 transition-all duration-200
            shadow-md hover:shadow-lg ml-4"
        >
          Dashboard
        </button>
      )}
    </>
  );

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-white/80 backdrop-blur-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
            <img 
              src={opineomi} 
              alt="Opiniomea Logo" 
              className="h-8 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 
              hover:bg-gray-100 focus:outline-none transition-colors duration-200"
            onClick={toggleMenu}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-16 left-0 right-0 bg-white border-t transform transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <div className="px-4 py-3 space-y-3">
            <div className="flex flex-col space-y-2">
              <NavLinks />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;